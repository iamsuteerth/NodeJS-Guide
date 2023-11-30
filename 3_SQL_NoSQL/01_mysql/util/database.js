// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: 'node-compete',
//   password: 'IAmSuteerth2021@',
// });

// module.exports = pool.promise();

const Sequalize = require("sequelize");
const sequelize = new Sequalize("node-complete", "root", "IAmSuteerth2021@", {
  dialect: "mysql",
  host: "localhost",
});
module.exports = sequelize;
