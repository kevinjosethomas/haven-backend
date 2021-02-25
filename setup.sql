
CREATE TABLE IF NOT EXISTS user_details (
  id                   SERIAL PRIMARY KEY,
  email                VARCHAR UNIQUE,
  vanity               VARCHAR,
  username             VARCHAR,
  avatar               VARCHAR,
  email_verified       BOOLEAN,
  publicity            SMALLINT,
  public_flags         INT,
  updated_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_login (
  id                   INT PRIMARY KEY REFERENCES user_details (id),
  email                VARCHAR REFERENCES user_details (email),
  username             VARCHAR,
  password             VARCHAR,
  last_login           TIMESTAMPTZ,
  login_ip             VARCHAR
);

CREATE TABLE IF NOT EXISTS user_identity (
  id                   INT PRIMARY KEY REFERENCES user_details (id),
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
  user_id              INT REFERENCES user_details (id),
  platform             VARCHAR,
  username             VARCHAR,
  access_token         VARCHAR,
  refresh_token        VARCHAR,
  expires_at           TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_followers (
  id                   SERIAL PRIMARY KEY,
  followed             INT REFERENCES user_details (id),
  follower             INT REFERENCES user_details (id),
  followed_at          TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_connections (
  id                   SERIAL PRIMARY KEY,
  user_one             INT REFERENCES user_details (id),
  user_two             INT REFERENCES user_details (id),
  connected_at         TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_bookmarks (
  id                   SERIAL PRIMARY KEY,
  bookmarked           INT REFERENCES user_details (id),
  bookmarker           INT REFERENCES user_details (id),
  bookmarked_at        TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_connection_requests (
  id                   SERIAL PRIMARY KEY,
  requested            INT REFERENCES user_details (id),
  requester            INT REFERENCES user_details (id),
  status               VARCHAR,
  requested_at         TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_reports (
  id                   SERIAL PRIMARY KEY,
  reported             INT REFERENCES user_details (id),
  reporter             INT REFERENCES user_details (id),
  reason               TEXT,
  proof                VARCHAR,
  reported_at          TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_links (
  id                   SERIAL PRIMARY KEY,
  slug                 VARCHAR,
  redirect             VARCHAR,
  owner                INT REFERENCES user_details (id),
  active               BOOLEAN,
  created_at           TIMESTAMPTZ,
  expires_at           TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS link_clicks (
  id                   SERIAL,
  link                 INT PRIMARY KEY REFERENCES user_links (id),
  ip_address           VARCHAR,
  timestamp            TIMESTAMPTZ
);
