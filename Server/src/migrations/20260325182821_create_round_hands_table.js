exports.up = function (knex) {
  return knex.schema.createTable("round_hands", (table) => {
    table.increments("id").primary();

    table
      .integer("round_state_id")
      .references("id")
      .inTable("round_states")
      .onDelete("CASCADE");

    table.integer("hand_index").notNullable(); // 0, 1, 2...

    table.jsonb("cards").notNullable().defaultTo("[]");
    table.integer("total").notNullable().defaultTo(0);

    table.boolean("is_active").notNullable().defaultTo(false);
    table.boolean("is_finished").notNullable().defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("round_hands");
};
