exports.up = function (knex) {
  return knex.schema.createTable("active_hand_state", function (table) {
    table.integer("run_id").notNullable();
    table.integer("hand_index").notNullable().defaultTo(0);
    table.jsonb("cards").notNullable().defaultTo("[]");
    table.boolean("resolved").notNullable().defaultTo(false);
    table.boolean("stayed").notNullable().defaultTo(false);
    table.boolean("busted").notNullable().defaultTo(false);
    table.boolean("void_border_used").notNullable().defaultTo(false);

    table.primary(["run_id", "hand_index"]);
    table
      .foreign("run_id")
      .references("id")
      .inTable("runs")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("active_hand_state");
};
