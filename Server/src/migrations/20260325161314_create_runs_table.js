exports.up = function (knex) {
  return knex.schema.createTable("runs", (table) => {
    table.increments("id").primary();
    table.bigInteger("seed").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("runs");
};
