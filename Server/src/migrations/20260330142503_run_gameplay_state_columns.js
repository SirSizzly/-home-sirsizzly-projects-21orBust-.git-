exports.up = async function (knex) {
  await knex.raw(`
    ALTER TABLE runs
      ADD COLUMN IF NOT EXISTS gold INTEGER NOT NULL DEFAULT 5,
      ADD COLUMN IF NOT EXISTS fragile_stacks INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS permanent_multiplier NUMERIC NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS ante_index INTEGER NOT NULL DEFAULT 1,
      ADD COLUMN IF NOT EXISTS is_complete BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL;
  `);
};

exports.down = async function (knex) {
  await knex.raw(`
    ALTER TABLE runs
      DROP COLUMN IF EXISTS gold,
      DROP COLUMN IF EXISTS fragile_stacks,
      DROP COLUMN IF EXISTS permanent_multiplier,
      DROP COLUMN IF EXISTS ante_index,
      DROP COLUMN IF EXISTS is_complete,
      DROP COLUMN IF EXISTS completed_at,
      DROP COLUMN IF EXISTS updated_at;
  `);
};
