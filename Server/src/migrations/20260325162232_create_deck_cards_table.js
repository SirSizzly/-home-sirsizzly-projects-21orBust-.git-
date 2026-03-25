exports.up = function (knex) {
  return knex.schema.createTable("deck_cards", (table) => {
    table.increments("id").primary();
    table
      .integer("run_id")
      .references("id")
      .inTable("runs")
      .onDelete("CASCADE");
    table.integer("position").notNullable(); // 0–103
    table.integer("card_id").notNullable();
    table.string("suit").notNullable();
    table.string("rank").notNullable();
    table.integer("value").notNullable();
    table.string("image_key").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("deck_cards");
};
