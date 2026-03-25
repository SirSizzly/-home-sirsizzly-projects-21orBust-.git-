exports.up = function (knex) {
  return knex.schema.table("runs", (table) => {
    table.integer("next_position").notNullable().defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.table("runs", (table) => {
    table.dropColumn("next_position");
  });
};
