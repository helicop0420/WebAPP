const dotenv = require("dotenv");
const { parse } = require("pg-connection-string");

dotenv.config({ path: ".env.local" });

const { host, port, database, user, password } = parse(
  process.env.SUPABASE_DB_URL
);

process.env.PGHOST = host;
process.env.PGPORT = port;
process.env.PGDATABASE = database;
process.env.PGUSERNAME = user;
process.env.PGPASSWORD = password;
