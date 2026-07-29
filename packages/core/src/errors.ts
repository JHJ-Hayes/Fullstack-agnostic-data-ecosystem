import type { CoreDataError } from './types.js';

export function createError(code: string, message: string, cause?: unknown): CoreDataError {
  return { code, message, cause };
}

export function normalizeError(err: unknown): CoreDataError {
  if (isCoreDataError(err)) return err;
  if (err instanceof Error) {
    return createError('UNKNOWN', err.message, err);
  }
  return createError('UNKNOWN', 'An unexpected error occurred', err);
}

function isCoreDataError(err: unknown): err is CoreDataError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'message' in err &&
    typeof (err as CoreDataError).code === 'string' &&
    typeof (err as CoreDataError).message === 'string'
  );
}
