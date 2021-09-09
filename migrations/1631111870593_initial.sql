-- Up Migration

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

CREATE TABLE users (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name      TEXT        NOT NULL,
  last_name      TEXT        NOT NULL,
  email          CITEXT      NOT NULL UNIQUE,
  password       TEXT        NOT NULL,      
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE check_ins (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Down Migration