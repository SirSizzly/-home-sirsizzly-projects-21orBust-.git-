exports.up = async function (knex) {
  const hasGold = await knex.schema.hasColumn("runs", "gold");
  const hasPM = await knex.schema.hasColumn("runs", "permanent_multiplier");
  const hasFragile = await knex.schema.hasColumn("runs", "fragile_stacks");
  const hasAnte = await knex.schema.hasColumn("runs", "ante_index");
  const hasOver = await knex.schema.hasColumn("runs", "is_over");

  return knex.schema.table("runs", function (table) {
    if (!hasGold) table.integer("gold").notNullable().defaultTo(5);
    if (!hasPM)
      table.float("permanent_multiplier").notNullable().defaultTo(1.0);
    if (!hasFragile) table.integer("fragile_stacks").notNullable().defaultTo(0);
    if (!hasAnte) table.integer("ante_index").notNullable().defaultTo(1);
    if (!hasOver) table.boolean("is_over").notNullable().defaultTo(false);
  });
};

exports.down = async function (knex) {
  return knex.schema.table("runs", function (table) {
    table.dropColumn("gold");
    table.dropColumn("permanent_multiplier");
    table.dropColumn("fragile_stacks");
    table.dropColumn("ante_index");
    table.dropColumn("is_over");
  });
};
