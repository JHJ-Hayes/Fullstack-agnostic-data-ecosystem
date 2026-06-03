-- FAE MySQL schema — aligns with @fae/core UserEntityRaw (snake_case DTO)

CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(36)  NOT NULL PRIMARY KEY,
  user_name     VARCHAR(255) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_users_email (email_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data (matches @fae/core mock users)
INSERT INTO users (id, user_name, email_address) VALUES
  ('1', 'Alice Chen', 'alice@example.com'),
  ('2', 'Bob Lin',     'bob@example.com')
ON DUPLICATE KEY UPDATE
  user_name     = VALUES(user_name),
  email_address = VALUES(email_address);
