module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: "postgres",
      password: "james",
      database: "21orbust",
    },
    migrations: {
      directory: "./src/migrations",
    },
  },
};
