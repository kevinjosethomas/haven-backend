
CREATE TABLE IF NOT EXISTS user_details (
  id                   SERIAL PRIMARY KEY,
  email                VARCHAR UNIQUE,
  username             VARCHAR UNIQUE,
  avatar               VARCHAR,
  email_verified       BOOLEAN,
  public               BOOLEAN,
  flags                INT,
  updated_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_login (
  id                   INT PRIMARY KEY REFERENCES user_details (id) ON DELETE CASCADE,
  email                VARCHAR REFERENCES user_details (email) ON DELETE CASCADE,
  username             VARCHAR UNIQUE,
  password             VARCHAR,
  last_login           TIMESTAMPTZ,
  login_ip             VARCHAR
);

CREATE TABLE IF NOT EXISTS user_identity (
  id                   INT PRIMARY KEY REFERENCES user_details (id) ON DELETE CASCADE,
  name                 VARCHAR,
  email                VARCHAR,
  description          TEXT,
  status               TEXT,
  website              VARCHAR,
  location             VARCHAR,
  education            VARCHAR,
  occupation           VARCHAR,
  birthday             TIMESTAMPTZ,
  gender               VARCHAR,
  interests            JSON
);

CREATE TABLE IF NOT EXISTS user_socials (
  id SERIAL            PRIMARY KEY,
  user_id              INT REFERENCES user_details (id) ON DELETE CASCADE,
  platform             VARCHAR,
  username             VARCHAR,
  access_token         VARCHAR,
  refresh_token        VARCHAR,
  expires_at           TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_followers (
  id                   SERIAL PRIMARY KEY,
  followed             INT REFERENCES user_details (id) ON DELETE CASCADE,
  follower             INT REFERENCES user_details (id) ON DELETE CASCADE,
  followed_at          TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_connections (
  id                   SERIAL PRIMARY KEY,
  user_one             INT REFERENCES user_details (id) ON DELETE CASCADE,
  user_two             INT REFERENCES user_details (id) ON DELETE CASCADE,
  connected_at         TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_bookmarks (
  id                   SERIAL PRIMARY KEY,
  bookmarked           INT REFERENCES user_details (id) ON DELETE CASCADE,
  bookmarker           INT REFERENCES user_details (id) ON DELETE CASCADE,
  bookmarked_at        TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_connection_requests (
  id                   SERIAL PRIMARY KEY,
  requested            INT REFERENCES user_details (id) ON DELETE CASCADE,
  requester            INT REFERENCES user_details (id) ON DELETE CASCADE,
  status               SMALLINT,
  requested_at         TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_reports (
  id                   SERIAL PRIMARY KEY,
  reported             INT REFERENCES user_details (id) ON DELETE CASCADE,
  reporter             INT REFERENCES user_details (id) ON DELETE CASCADE,
  reason               TEXT,
  proof                VARCHAR,
  reported_at          TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_email_verification (
  id                   SERIAL PRIMARY KEY,
  user_id              INT REFERENCES user_details (id) ON DELETE CASCADE,
  email                VARCHAR REFERENCES user_details (email) ON DELETE CASCADE,
  code                 VARCHAR UNIQUE,
  status               VARCHAR,
  created_at           TIMESTAMPTZ,
  expires_at           TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_referrals (
  id                   SERIAL PRIMARY KEY,
  user_id              INT REFERENCES user_details (id) ON DELETE CASCADE,
  used_by              JSON,
  status               VARCHAR,
  uses                 INT,
  max_uses             INT,
  created_at           TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_links (
  id                   SERIAL PRIMARY KEY,
  slug                 VARCHAR,
  redirect             VARCHAR,
  owner                INT REFERENCES user_details (id) ON DELETE CASCADE,
  active               BOOLEAN,
  created_at           TIMESTAMPTZ,
  expires_at           TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS link_clicks (
  id                   SERIAL,
  link                 INT PRIMARY KEY REFERENCES user_links (id) ON DELETE CASCADE,
  ip_address           VARCHAR,
  timestamp            TIMESTAMPTZ
);
