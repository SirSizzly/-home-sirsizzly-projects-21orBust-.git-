// Engines/migrations/20260325182404_create_rounds_state_table.js

exports.up = function (knex) {
  return knex.schema.createTable("round_states", (table) => {
    table.increments("id").primary();

    table
      .integer("run_id")
      .references("id")
      .inTable("runs")
      .onDelete("CASCADE");

    table.integer("round_number").notNullable();

    // legacy single-hand fields (kept for now)
    table.jsonb("cards").notNullable().defaultTo("[]");
    table.integer("total").notNullable().defaultTo(0);

    table.boolean("is_active").notNullable().defaultTo(true);
    table.boolean("has_stayed").notNullable().defaultTo(false);
    table.boolean("is_finished").notNullable().defaultTo(false);

    // multi-hand support
    table.integer("active_hand_index").notNullable().defaultTo(0);
    table.integer("hand_count").notNullable().defaultTo(1);

    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("round_states");
};
