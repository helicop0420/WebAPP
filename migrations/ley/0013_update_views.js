const fs = require("fs");

function get_migration_file(operation) {
  const filename = __filename.slice(__dirname.length + 1, -3);
  const path = "migrations/" + operation + "/" + filename + ".sql";
  if (!fs.existsSync(path)) {
    throw Error("File " + path + " not found");
  }
  return path;
}

/** @param {import('postgres').Sql} sql */
exports.up = async (sql) => {
  await sql.file(get_migration_file("up"));
};

/** @param {import('postgres').Sql} sql */
exports.down = async (sql) => {
  throw Error("Down migration not supported");
  // await sql.file(get_migration_file("down"))
};
