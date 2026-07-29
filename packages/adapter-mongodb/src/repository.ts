import type {
  CoreDataError,
  UserDataProvider,
  UserEntityRaw,
  UserRepository,
} from '@fae/core';
import { MongoClient, type Collection } from 'mongodb';
import {
  documentToUserEntityRaw,
  userEntityRawToDocument,
} from './document-mapper.js';
import type {
  MongodbAdapterConfig,
  MongodbAdapterHandle,
  UserDocument,
} from './types.js';

function createNotFoundError(id: string): CoreDataError {
  return { code: 'USER_NOT_FOUND', message: `User "${id}" not found` };
}

interface MongodbResources {
  client: Pick<MongoClient, 'close'>;
  collection: Pick<
    Collection<UserDocument>,
    'findOne' | 'find' | 'insertOne' | 'findOneAndUpdate' | 'deleteOne'
  >;
}

async function connectResources(config: MongodbAdapterConfig): Promise<MongodbResources> {
  const client = new MongoClient(config.uri);
  await client.connect();
  const collectionName = config.collection ?? 'users';
  const collection = client.db(config.database).collection<UserDocument>(collectionName);
  return { client, collection };
}

/**
 * Create a MongoDB {@link UserRepository} with full CRUD.
 * Documents use Raw Entity field names (snake_case) at the storage boundary.
 *
 * @param options.resources - Optional client/collection (for tests); defaults to a real Mongo connection.
 */
export function createMongodbUserRepository(
  config: MongodbAdapterConfig,
  options?: { resources?: MongodbResources | Promise<MongodbResources> },
): UserRepository {
  let resourcesPromise: Promise<MongodbResources> | null = options?.resources
    ? Promise.resolve(options.resources)
    : connectResources(config);

  async function resources(): Promise<MongodbResources> {
    if (!resourcesPromise) {
      throw new Error('MongoDB repository has been disconnected');
    }
    return resourcesPromise;
  }

  return {
    async findById(id: string): Promise<UserEntityRaw | null> {
      const { collection } = await resources();
      const doc = await collection.findOne({ id });
      return doc ? documentToUserEntityRaw(doc) : null;
    },

    async findAll(): Promise<UserEntityRaw[]> {
      const { collection } = await resources();
      const docs = await collection.find({}).sort({ id: 1 }).toArray();
      return docs.map(documentToUserEntityRaw);
    },

    async create(data: UserEntityRaw): Promise<UserEntityRaw> {
      const { collection } = await resources();
      await collection.insertOne(userEntityRawToDocument(data));
      return data;
    },

    async update(
      id: string,
      data: Partial<Pick<UserEntityRaw, 'user_name' | 'email_address'>>,
    ): Promise<UserEntityRaw | null> {
      const { collection } = await resources();
      const $set: Partial<Pick<UserDocument, 'user_name' | 'email_address'>> = {};

      if (data.user_name !== undefined) $set.user_name = data.user_name;
      if (data.email_address !== undefined) $set.email_address = data.email_address;

      if (Object.keys($set).length === 0) {
        return this.findById(id);
      }

      const result = await collection.findOneAndUpdate(
        { id },
        { $set },
        { returnDocument: 'after' },
      );

      return result ? documentToUserEntityRaw(result) : null;
    },

    async delete(id: string): Promise<boolean> {
      const { collection } = await resources();
      const result = await collection.deleteOne({ id });
      return result.deletedCount > 0;
    },

    async disconnect(): Promise<void> {
      if (!resourcesPromise) return;
      const { client } = await resourcesPromise;
      resourcesPromise = null;
      await client.close();
    },
  };
}

/**
 * Create a {@link UserDataProvider} backed by MongoDB — plugs into Entity Service / CoreDataService.
 */
export function createMongodbUserProvider(config: MongodbAdapterConfig): UserDataProvider {
  const repository = createMongodbUserRepository(config);

  return {
    async fetchRawUser(id: string): Promise<UserEntityRaw> {
      const raw = await repository.findById(id);
      if (!raw) {
        throw createNotFoundError(id);
      }
      return raw;
    },
  };
}

/**
 * Create both repository and provider; call `disconnect()` when shutting down.
 */
export function createMongodbAdapter(config: MongodbAdapterConfig): MongodbAdapterHandle {
  const repository = createMongodbUserRepository(config);

  const provider: UserDataProvider = {
    async fetchRawUser(id: string): Promise<UserEntityRaw> {
      const raw = await repository.findById(id);
      if (!raw) {
        throw createNotFoundError(id);
      }
      return raw;
    },
  };

  return {
    repository,
    provider,
    disconnect: () => repository.disconnect(),
  };
}
