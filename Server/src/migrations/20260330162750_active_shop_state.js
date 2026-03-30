exports.up = async function (knex) {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS active_shop_state (
      run_id INTEGER PRIMARY KEY REFERENCES runs(id) ON DELETE CASCADE,
      jokers JSONB NOT NULL DEFAULT '[]'::jsonb,
      relics JSONB NOT NULL DEFAULT '[]'::jsonb,
      enhancement_packs INTEGER NOT NULL DEFAULT 0,
      reroll_cost INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
};

exports.down = async function (knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS active_shop_state;
  `);
};
