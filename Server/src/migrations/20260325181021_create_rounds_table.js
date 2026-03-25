exports.up = function (knex) {
  return knex.schema.createTable("rounds", (table) => {
    table.increments("id").primary();
    table
      .integer("run_id")
      .references("id")
      .inTable("runs")
      .onDelete("CASCADE");
    table.integer("round_number").notNullable();
    table.integer("total").notNullable();
    table.boolean("busted").notNullable().defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("rounds");
};
