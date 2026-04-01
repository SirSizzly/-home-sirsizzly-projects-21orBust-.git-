Welcome to 21orBust! What is it?

Card‑Based Combat
Classic blackjack rules with roguelite twists
Multi‑hand play
Splits, doubles, fragile cards, multipliers, and more
Procedural deck generation

Jokers
Unique modifiers that alter scoring, payouts, or hand behavior

Rarity tiers: Common, Uncommon, Rare, Legendary

Synergy driven builds

Relics
Permanent run wide effects

Unlockable vault items

Boss‑specific relics

Enhancements
Apply modifiers directly to cards

Void borders, golden frames, phantom ink, rank ascension, etc.

Velvet Bazaar (Shop)
Buy jokers, relics, and enhancements

Reroll shop inventory

Gold‑based economy

Fully functional demo mode (front‑end only)

Demo Mode
Fully playable without backend

Deterministic card draws

Shop, gameplay, and start screen all functional

Perfect for prototyping and UI iteration

Project Structure
Code
Client/
  src/
    components/
      game/          # Gameplay UI components
    demo/
      screens/       # DemoStart, DemoGameplay, DemoShop
      data/          # demoJokers, demoRelics, demoEnhancements, etc.
      state/         # demoRunState, demoShopState
    screens/         # Production screens (WIP)
    api/             # Front-end API wrappers
    assets/          # Local images & card art
    pages/           # Routing pages
    routes/          # RunView, etc.

Server/
  engines/           # blackjackLogic, deckEngine, jokerEngine, etc.
  controllers/       # runController, shopController
  services/          # runService, shopService
  migrations/        # DB schema
  public/            # Legacy asset folder (unused in demo mode)

Tech Stack
Front-End
React + Vite

Custom component architecture

Deterministic demo state engines

Velvet‑table UI theme

Gothic Arcana styling

Back-End (WIP / optional)
Node.js + Express

Knex.js + PostgreSQL

Modular engine system:

deckEngine

handEngine

jokerEngine

relicEngine

scoringEngine

blindEngine

runEngine

Deterministic PRNG for reproducible runs

Running the Demo (Front-End Only)
bash
cd Client
npm install
npm run dev
Navigate to:

Code
/demo/start
From there you can:

Start a run

Play hands

Visit the Velvet Bazaar

Buy jokers, relics, enhancements

Progress blinds

All without backend dependencies.

Running the Backend (Optional / Experimental)
The backend is currently under reconstruction due to schema drift and engine interdependencies.
Demo mode is recommended for development. 

If you want to explore it:

bash
cd Server
npm install
npm run dev
Current Development Focus
Finalizing demo gameplay loop

Integrating shop purchases into run state

Rebuilding backend schema cleanly

Reconnecting gameplay to backend once stable

UI polish across all screens

Boss blinds & flow events

Full item registry integration

Roadmap
Short Term
Full demo run loop

Joker & relic effects applied in gameplay

Enhancement application UI

Blind progression logic

Mid-Term
Rebuild backend migrations

Reconnect run state to server

Save/load runs

Daily seeds

Long-Term
Full campaign mode

Unlockables

Achievements

Endless mode

Steam release build
