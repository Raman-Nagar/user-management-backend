import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "password",
    database: process.env.MYSQL_DB || "user_management",
    host: process.env.MYSQL_HOST || "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || null,
    database: process.env.MYSQL_DB || "database_test",
    host: process.env.MYSQL_HOST || "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: false,
  },
};
