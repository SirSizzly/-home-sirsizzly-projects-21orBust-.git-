exports.up = function (knex) {
  return knex.schema.createTable("deck_cards", (table) => {
    table.increments("id").primary();
    table
      .integer("run_id")
      .references("id")
      .inTable("runs")
      .onDelete("CASCADE");

    table.integer("position").notNullable(); // 0–103

    // MUST be string now
    table.string("card_id").notNullable();

    table.string("suit").notNullable(); // "club"
    table.string("rank").notNullable(); // "Q"
    table.integer("value").notNullable(); // 10
    table.string("image_key").notNullable(); // "q_club"
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("deck_cards");
};
