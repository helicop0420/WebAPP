const fs = require("fs");

function check_if_file_exists(filename) {
  try {
    if (fs.existsSync(filename)) {
      return true;
    }
  } catch (err) {
    return false;
  }
}

function get_filename_minus_extension() {
  return __filename.slice(__dirname.length + 1, -3);
}

/** @param {import('postgres').Sql} sql */
exports.up = async (sql) => {
  const upfile = "migrations/up/" + get_filename_minus_extension() + ".sql";
  if (check_if_file_exists(upfile)) {
    await sql.file(upfile);
  } else {
    throw Error("File " + upfile + " not found");
  }
};

/** @param {import('postgres').Sql} sql */
exports.down = async (sql) => {
  const downfile = "migrations/down/" + get_filename_minus_extension() + ".sql";
  if (check_if_file_exists(downfile)) {
    await sql.file(downfile);
  } else {
    throw Error("File " + downfile + " not found");
  }
};
