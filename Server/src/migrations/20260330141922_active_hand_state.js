exports.up = async function (knex) {
  await knex.raw(`
    ALTER TABLE active_hand_state
    DROP CONSTRAINT IF EXISTS active_hand_state_pkey;

    ALTER TABLE active_hand_state
    ADD CONSTRAINT active_hand_state_pkey PRIMARY KEY (run_id, hand_index);
  `);
};

exports.down = async function (knex) {
  await knex.raw(`
    ALTER TABLE active_hand_state
    DROP CONSTRAINT IF EXISTS active_hand_state_pkey;

    ALTER TABLE active_hand_state
    ADD CONSTRAINT active_hand_state_pkey PRIMARY KEY (run_id);
  `);
};
