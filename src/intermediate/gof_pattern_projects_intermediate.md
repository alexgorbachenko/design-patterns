# GoF Design Pattern Projects — Intermediate

A collection of TypeScript exercises for 11 intermediate GoF patterns, themed around RuneScape and Pokémon.

---

## Setup

```bash
npm init -y
npm install typescript ts-node @types/node --save-dev
npx tsc --init
```

Run any file with `npx ts-node your-file.ts`.

---

## Suggested Order

**Abstract Factory → Prototype → Adapter → Bridge → Flyweight → Proxy → Chain of Responsibility → Iterator → Mediator → Memento → Template Method**

---

## Creational Patterns

### 1. Abstract Factory — Pokémon Generation Selector

**Pattern:** Abstract Factory
**Difficulty:** ⭐⭐ Intermediate
**Theme:** Pokémon

#### Overview
Your Pokémon game supports multiple generations. Each generation has its own family of related objects — starters, a rival, and a gym leader. An Abstract Factory ensures that when you select a generation, every object you get belongs to that generation consistently. You should never end up with a Kanto starter paired with a Johto rival.

#### Requirements

- Define the following product interfaces:
  - `Starter` with fields `name: string`, `type: string`, and method `introduce(): void`
  - `Rival` with fields `name: string` and method `challenge(): void`
  - `GymLeader` with fields `name: string`, `badgeName: string` and method `battle(): void`
- Define a `PokemonFactory` abstract factory interface with:
  - `createStarter(): Starter`
  - `createRival(): Rival`
  - `createGymLeader(): GymLeader`
- Implement two concrete factories:
  - `KantoFactory` — returns `Charmander`, `Gary`, and `Brock`
  - `JohtoFactory` — returns `Cyndaquil`, `Silver`, and `Falkner`
- Write a `startGame(factory: PokemonFactory): void` function that uses only the factory interface — never referencing concrete classes directly — to create and introduce all three objects
- Demonstrate swapping factories and observing that all objects change together

#### Stretch Goals
- Add a third `HoennFactory` with Torchic, Brendan/May, and Roxanne
- Add a `createMap(): GameMap` product to each factory that returns a region-specific map object
- Add a factory registry: `FactoryRegistry.get("kanto")` returns the correct factory by name

#### What You're Practicing
- Creating families of related objects without specifying concrete classes
- Ensuring product compatibility within a family
- The difference between Abstract Factory (families) and Factory Method (single products)

---

### 2. Prototype — RuneScape Enemy Spawner

**Pattern:** Prototype
**Difficulty:** ⭐⭐ Intermediate
**Theme:** RuneScape

#### Overview
RuneScape worlds spawn hundreds of enemies simultaneously. Constructing each enemy from scratch is expensive — stats, drop tables, combat scripts, and patrol routes all need to be initialized. Instead, you configure one master `Enemy` prototype per type and clone it every time a new instance is needed.

#### Requirements

- Define an `Enemy` interface with:
  - Fields: `name: string`, `hp: number`, `maxHp: number`, `attackLevel: number`, `defenceLevel: number`, `dropTable: string[]`, `patrolRoute: string[]`
  - Method: `clone(): Enemy` — returns a deep copy of the enemy
  - Method: `printStats(): void`
- Create concrete classes implementing `Enemy`:
  - `Goblin` — 25 HP, attack 1, defence 1, drops `["Bones", "Coins"]`, patrols `["Lumbridge", "Draynor"]`
  - `Guard` — 70 HP, attack 29, defence 29, drops `["Bones", "Coins", "Iron Sword"]`, patrols `["Varrock", "Falador"]`
  - `BlackKnight` — 105 HP, attack 46, defence 49, drops `["Bones", "Coins", "Black equipment"]`, patrols `["Falador", "Ice Mountain"]`
- Ensure `clone()` performs a **deep copy** — modifying a cloned enemy's `dropTable` or `patrolRoute` must not affect the prototype
- Create a `SpawnManager` class with:
  - `register(name: string, prototype: Enemy): void` — stores a prototype by name
  - `spawn(name: string): Enemy` — clones and returns the registered prototype
  - `spawnMany(name: string, count: number): Enemy[]` — returns an array of clones

#### Stretch Goals
- Add a `spawnBoss(name: string, hpMultiplier: number): Enemy` that clones and scales HP
- Demonstrate that mutating a spawned clone does not affect the registered prototype
- Add a `resetHp(): void` method that restores `hp` to `maxHp` — useful after cloning a partially damaged prototype

#### What You're Practicing
- Cloning objects instead of reconstructing them
- Deep vs. shallow copying
- Registry-based object management

---

## Structural Patterns

### 3. Adapter — Pokémon External Stats API

**Pattern:** Adapter
**Difficulty:** ⭐⭐ Intermediate
**Theme:** Pokémon

#### Overview
You're building a Pokédex app that consumes data from a third-party API. The API returns data in its own shape, which doesn't match your internal `Pokemon` interface at all. Rather than rewriting your app or the API, you write an `Adapter` that translates the external format into your internal one.

#### Requirements

- Define your internal `Pokemon` interface:
  - `name: string`
  - `type: string`
  - `hp: number`
  - `attackPower: number`
  - `displaySummary(): void`
- Define the external API response shape as a separate interface `ExternalPokemonData`:
  - `pokemon_name: string`
  - `element_type: string`
  - `base_stats: { hit_points: number; attack: number }`
- Create a hardcoded `ExternalPokeApi` class with a `fetchByName(name: string): ExternalPokemonData` method that returns mock data in the external format for at least three Pokémon
- Create a `PokeApiAdapter` class that:
  - Accepts an `ExternalPokeApi` instance in its constructor
  - Implements the `Pokemon` interface
  - Internally calls `fetchByName()` and maps the result to the internal interface fields
- The rest of your app should only ever interact with the `Pokemon` interface — never `ExternalPokemonData` directly

#### Stretch Goals
- Add a second external source `LegacyPokedexData` with yet another shape, and write a second adapter for it
- Add caching inside the adapter so repeated calls for the same Pokémon don't re-fetch
- Write a `PokedexApp` class that accepts any `Pokemon` and calls `displaySummary()` — demonstrating it works with both adapters

#### What You're Practicing
- Translating between incompatible interfaces
- Isolating third-party dependencies behind your own interface
- The difference between Adapter (translation) and Facade (simplification)

---

### 4. Bridge — RuneScape Spell Caster

**Pattern:** Bridge
**Difficulty:** ⭐⭐ Intermediate
**Theme:** RuneScape

#### Overview
A RuneScape player can cast spells from different spell books (Standard, Ancient, Arceuus) using different weapons (Staff, Wand, Tome). Without the Bridge pattern, you'd need a class for every combination — `AncientStaffCaster`, `AncientWandCaster`, and so on. The Bridge separates the spell abstraction from the weapon implementation so they can vary independently.

#### Requirements

- Define a `Weapon` interface (the **implementation** side of the bridge):
  - `name: string`
  - `getMagicBonus(): number`
  - `getAttackSpeed(): string` — returns `"Fast"`, `"Normal"`, or `"Slow"`
- Create three concrete weapon classes implementing `Weapon`:
  - `Staff` — magic bonus +10, speed `"Slow"`
  - `Wand` — magic bonus +17, speed `"Fast"`
  - `Tome` — magic bonus +8, speed `"Normal"`
- Define an abstract `Spell` class (the **abstraction** side of the bridge):
  - Constructor accepts a `weapon: Weapon`
  - Abstract method `cast(): void`
  - Abstract field `spellBook: string`
- Create two concrete spell classes extending `Spell`:
  - `FireBlast` — spell book `"Standard"`; `cast()` logs damage calculated using weapon's magic bonus
  - `IceBarrage` — spell book `"Ancient"`; `cast()` logs freeze duration modified by weapon's attack speed
- Demonstrate casting each spell with each weapon (6 combinations total) without creating 6 separate classes

#### Stretch Goals
- Add an `ArceuusSpell` concrete class with a `reanimationTarget: string` field
- Add a `getCastCost(): number` method to `Spell` that returns the rune cost, modified by weapon type
- Add a `NullWeapon` class representing bare-handed casting with zero bonuses

#### What You're Practicing
- Decoupling abstraction from implementation so both can vary independently
- Preferring composition over a combinatorial explosion of subclasses
- The difference between Bridge (planned separation) and Adapter (after-the-fact translation)

---

### 5. Flyweight — RuneScape World Tile Renderer

**Pattern:** Flyweight
**Difficulty:** ⭐⭐ Intermediate
**Theme:** RuneScape

#### Overview
A RuneScape world map contains tens of thousands of tiles. Most tiles of the same type (Grass, Water, Rock, Sand) share identical intrinsic properties — texture, walkability, and color. Storing all of this data in every tile object would use enormous amounts of memory. The Flyweight pattern separates shared (intrinsic) data from unique (extrinsic) data so it is stored only once.

#### Requirements

- Define a `TileType` class representing shared intrinsic data:
  - `texture: string` (e.g. `"grass.png"`)
  - `walkable: boolean`
  - `color: string` (e.g. `"#4CAF50"`)
  - `render(x: number, y: number): void` — logs the tile type being rendered at the given coordinates
- Create the following tile type instances (these are the flyweights):
  - `GrassTile` — walkable, green
  - `WaterTile` — not walkable, blue
  - `RockTile` — not walkable, grey
  - `SandTile` — walkable, yellow
- Create a `TileFactory` that:
  - Maintains a `private cache: Record<string, TileType>`
  - `getTileType(name: string): TileType` — returns a cached instance, creating it only if it doesn't already exist
  - `getCacheSize(): number` — returns the number of unique tile types currently cached
- Create a `WorldMap` class that:
  - Holds a grid of `{ tileType: TileType; x: number; y: number }` objects (extrinsic data stored outside the flyweight)
  - `placeTile(name: string, x: number, y: number): void`
  - `renderAll(): void` — calls `render()` on every tile
- Demonstrate that placing 1000 grass tiles only creates one `GrassTile` flyweight object

#### Stretch Goals
- Add a memory usage comparison: log how much memory would be used with vs. without the Flyweight
- Add `passageBonus: number` to `TileType` that modifies movement speed
- Add a `getTileAt(x: number, y: number): TileType` method to `WorldMap`

#### What You're Practicing
- Separating intrinsic (shared) state from extrinsic (unique) state
- Using a factory/cache to ensure shared instances are reused
- Recognising when memory efficiency justifies the added complexity

---

### 6. Proxy — Pokémon Move Lazy Loader

**Pattern:** Proxy
**Difficulty:** ⭐⭐ Intermediate
**Theme:** Pokémon

#### Overview
A Pokémon's move set contains rich data — base power, accuracy, PP, effect descriptions, and animation metadata. Loading all of this upfront for every move is expensive. A `MoveProxy` sits in front of the real `Move` object and defers loading the full data until the move is actually used in battle.

#### Requirements

- Define a `Move` interface with:
  - `name: string`
  - `getBasePower(): number`
  - `getAccuracy(): number`
  - `getPP(): number`
  - `getDescription(): string`
  - `use(attacker: string, defender: string): void`
- Create a `RealMove` class that implements `Move`:
  - Constructor accepts all fields
  - `use()` logs a detailed battle message including power, accuracy, and description
  - Add a `console.log` inside the constructor that says `"[RealMove] Loading full data for: <name>"` so you can see when it is actually instantiated
- Create a `MoveProxy` class that also implements `Move`:
  - Constructor accepts only `name: string` — it does **not** instantiate `RealMove` yet
  - `name` is immediately accessible without triggering a load
  - All other methods (`getBasePower`, `use`, etc.) instantiate `RealMove` lazily on first access and delegate to it from then on
- Create a `Pokemon` class that holds a `moves: Move[]` array populated with `MoveProxy` instances
- Demonstrate that simply creating a Pokémon with four moves does not trigger any `RealMove` loads — only accessing a move's data does

#### Stretch Goals
- Add a `CachingMoveProxy` that caches the result of `getDescription()` so repeated calls don't re-fetch
- Add a `LoggingMoveProxy` that wraps `RealMove` and logs every method call with a timestamp
- Add an `AuthorisedMoveProxy` that throws an error if `use()` is called while the Pokémon has 0 PP remaining

#### What You're Practicing
- Controlling access to an object through an intermediary
- Lazy initialisation — deferring expensive work until it is actually needed
- The three proxy types: virtual (lazy load), logging, and protection

---

## Behavioral Patterns

### 7. Chain of Responsibility — RuneScape Damage Calculator

**Pattern:** Chain of Responsibility
**Difficulty:** ⭐⭐ Intermediate
**Theme:** RuneScape

#### Overview
When a RuneScape player takes a hit, the incoming damage passes through a chain of reduction handlers before being applied to HP. Each handler checks whether it applies (prayer, armour, potions), reduces the damage if so, then passes the remainder to the next handler. The chain is configurable — players with different gear have different handler chains.

#### Requirements

- Define a `DamageHandler` abstract class with:
  - `protected next: DamageHandler | null`
  - `setNext(handler: DamageHandler): DamageHandler` — sets the next handler and returns it (enables chaining)
  - Abstract method `handle(damage: number, context: CombatContext): number` — returns the remaining damage after this handler
- Define a `CombatContext` interface:
  - `activePrayer: string | null` (e.g. `"Protect from Melee"`)
  - `armourSet: string | null` (e.g. `"Elite Void"`)
  - `absorptionCharges: number`
  - `incomingAttackType: string` (e.g. `"Melee"`, `"Ranged"`, `"Magic"`)
- Create the following concrete handler classes:
  - `OverheadPrayerHandler` — if `activePrayer` matches `incomingAttackType`, reduces damage by 100%; otherwise passes through unchanged
  - `EliteVoidHandler` — if `armourSet` is `"Elite Void"`, reduces damage by 15%
  - `AbsorptionPotionHandler` — if `absorptionCharges > 0`, absorbs up to 50 damage per hit and decrements charges
  - `BaseDefenceHandler` — always applies last; reduces damage by a flat 10% and logs final damage taken
- Demonstrate two different chains: one for a heavily protected player and one for a player with no gear

#### Stretch Goals
- Add a `NecklaceOfAnguishHandler` that increases damage for ranged attacks (a handler can also increase damage)
- Make the chain order configurable at runtime by accepting `DamageHandler[]` and building the chain dynamically
- Add a `printChain(): void` method that logs the names of all handlers in the current chain

#### What You're Practicing
- Passing a request through a configurable chain of handlers
- Decoupling senders from receivers
- Building composable processing pipelines

---

### 8. Iterator — Pokémon PC Box

**Pattern:** Iterator
**Difficulty:** ⭐⭐ Intermediate
**Theme:** Pokémon

#### Overview
A Pokémon PC box stores up to 30 Pokémon in a 5×6 grid. You need to be able to traverse the box in different ways — row by row, by type, or only showing fainted Pokémon — without exposing the internal grid structure to the caller. An Iterator provides a consistent traversal interface regardless of the underlying data structure or traversal strategy.

#### Requirements

- Define an `Iterator<T>` interface with:
  - `hasNext(): boolean`
  - `next(): T`
  - `reset(): void`
- Define a `Pokemon` interface with: `name: string`, `type: string`, `hp: number`, `isFainted(): boolean`
- Create a `PCBox` class that:
  - Stores Pokémon internally as a 2D array `Pokemon[][]` (5 rows × 6 columns)
  - `addPokemon(pokemon: Pokemon, row: number, col: number): void`
  - `createIterator(): Iterator<Pokemon>` — returns a row-by-row iterator that skips empty slots
  - `createTypeIterator(type: string): Iterator<Pokemon>` — returns an iterator that only yields Pokémon of the given type
  - `createFaintedIterator(): Iterator<Pokemon>` — returns an iterator that only yields fainted Pokémon
- Demonstrate iterating the same box three ways and logging different subsets each time

#### Stretch Goals
- Add a `createReverseIterator(): Iterator<Pokemon>` that traverses from bottom-right to top-left
- Implement TypeScript's built-in `Symbol.iterator` on `PCBox` so it works with `for...of` loops
- Add a `count(iterator: Iterator<Pokemon>): number` utility that exhausts an iterator and returns the total

#### What You're Practicing
- Traversing collections without exposing internal structure
- Supporting multiple traversal strategies on the same collection
- The Iterator protocol — `hasNext` / `next` / `reset`

---

### 9. Mediator — RuneScape Clan Chat

**Pattern:** Mediator
**Difficulty:** ⭐⭐ Intermediate
**Theme:** RuneScape

#### Overview
A RuneScape clan chat involves several components that all need to interact: players send messages, the rank system enforces permissions, and the mute system silences rule-breakers. Without a Mediator, every component would need a direct reference to every other — a tightly coupled mess. The Mediator centralises all communication so components only talk to it.

#### Requirements

- Define a `ClanChatMediator` interface with:
  - `sendMessage(sender: ClanMember, message: string): void`
  - `mutePlayer(target: ClanMember, duration: number): void`
  - `promotePlayer(target: ClanMember, newRank: ClanRank): void`
- Define a `ClanRank` type as: `"Guest" | "Member" | "Sergeant" | "Lieutenant" | "Captain" | "General" | "Owner"`
- Create a `ClanMember` class with:
  - `name: string`, `rank: ClanRank`, `mutedUntil: number` (timestamp, 0 if not muted)
  - `mediator: ClanChatMediator`
  - `say(message: string): void` — delegates to `mediator.sendMessage()`
  - `mute(target: ClanMember, duration: number): void` — delegates to `mediator.mutePlayer()`
- Create a `ClanChat` class that implements `ClanChatMediator`:
  - Maintains a list of `ClanMember[]`
  - `sendMessage()` — checks if the sender is muted; if not, broadcasts to all other members; logs `"[Clan] <name>: <message>"`
  - `mutePlayer()` — only allows ranks of `Lieutenant` or above to mute; logs the action
  - `promotePlayer()` — only the `Owner` can promote; updates the target's rank and logs it
- Demonstrate: a `Guest` tries to mute someone (should fail), a `Lieutenant` mutes a `Member`, the `Member` tries to speak (should be blocked)

#### Stretch Goals
- Add a `kickPlayer(target: ClanMember): void` method that removes them from the member list
- Add a `joinRequest(applicant: ClanMember): void` flow that notifies the Owner for approval
- Add a message history log that stores the last 50 messages as `{ sender: string; message: string; timestamp: number }[]`

#### What You're Practicing
- Centralising complex many-to-many communication
- Reducing direct dependencies between components
- The difference between Mediator (central coordinator) and Observer (broadcast events)

---

### 10. Memento — Pokémon Battle Save State

**Pattern:** Memento
**Difficulty:** ⭐⭐ Intermediate
**Theme:** Pokémon

#### Overview
A Pokémon battle simulator lets you save the complete state of a battle before a risky move, then restore it if things go badly. The Memento pattern lets you snapshot and restore state without exposing the battle's internal implementation details to the outside world.

#### Requirements

- Create a `BattleState` class (the **Memento**):
  - Stores a snapshot of: `turn: number`, `playerHP: number`, `opponentHP: number`, `playerStatus: string`, `opponentStatus: string`, `activeEffects: string[]`
  - All fields are `readonly` — a memento is immutable once created
  - No public setters — the state cannot be modified after capture
- Create a `Battle` class (the **Originator**):
  - Fields: `turn: number`, `playerHP: number`, `opponentHP: number`, `playerStatus: string`, `opponentStatus: string`, `activeEffects: string[]`
  - `save(): BattleState` — captures and returns the current state as a `BattleState`
  - `restore(state: BattleState): void` — restores all fields from the memento
  - `simulateTurn(action: string): void` — applies a simplified turn result (damage, status, effect) and increments `turn`
  - `printState(): void` — logs all current fields
- Create a `BattleHistory` class (the **Caretaker**):
  - Maintains a `private history: BattleState[]` stack
  - `push(state: BattleState): void`
  - `pop(): BattleState | undefined`
  - `peek(): BattleState | undefined` — returns the most recent save without removing it
  - `size(): number`
- Demonstrate: simulate three turns, save after turn 2, continue to turn 5, then restore to the turn 2 snapshot

#### Stretch Goals
- Add a `redo` stack so you can move forward again after restoring
- Limit history to the last 5 saves and automatically discard older ones
- Add a `labelledSave(label: string)` feature so saves can be named and retrieved by label

#### What You're Practicing
- Snapshotting and restoring object state
- Keeping the memento opaque to the caretaker — it stores but does not inspect the state
- The three roles: Originator (creates/restores), Memento (stores state), Caretaker (manages mementos)

---

### 11. Template Method — RuneScape Boss Encounter

**Pattern:** Template Method
**Difficulty:** ⭐⭐ Intermediate
**Theme:** RuneScape

#### Overview
Every RuneScape boss fight follows the same overall structure: spawn the boss, run the combat loop, handle phase transitions, process death, and distribute loot. The Template Method defines this skeleton in an abstract base class, and each concrete boss overrides only the steps that are unique to it.

#### Requirements

- Create an abstract `BossEncounter` class with a `final` (non-overridable) method:
  - `start(): void` — calls the following steps in order: `spawnBoss()`, `runCombatLoop()`, `handlePhaseTransitions()`, `onDeath()`, `distributeLoot()`
- Define the following abstract methods that subclasses must implement:
  - `spawnBoss(): void` — logs the boss's arrival and sets initial HP
  - `handlePhaseTransitions(): void` — defines phase-specific mechanics
  - `distributeLoot(): void` — logs what drops were awarded
- Define the following methods with default implementations that subclasses may override:
  - `runCombatLoop(): void` — logs a generic `"Combat in progress..."` message
  - `onDeath(): void` — logs `"The boss has been defeated!"`
- Create the following concrete boss classes extending `BossEncounter`:
  - `ZulrahEncounter` — spawns with 500 HP; phases cycle between Melee, Ranged, and Magic forms; drops `"Tanzanite Fang"` or `"Onyx"` randomly
  - `VorkathEncounter` — spawns with 750 HP; phases include a freeze mechanic and a prayer-disabling attack; drops `"Skeletal Visage"` or `"Dragonfire Ward"` randomly
  - `GiantMoleEncounter` — spawns with 200 HP; digs underground randomly during combat (override `runCombatLoop`); drops `"Mole Skin"` or `"Mole Claw"`
- Call `start()` on each and observe how the shared skeleton runs with unique steps per boss

#### Stretch Goals
- Add a `preFight(): void` hook called before `spawnBoss` for setup steps like checking gear requirements
- Add an `onPhaseChange(newPhase: string): void` hook that fires whenever a boss changes form
- Add a `deathCount: number` field that increments each time `onDeath()` is called, tracking kills across multiple runs

#### What You're Practicing
- Defining a fixed algorithm skeleton with swappable steps
- The Hollywood Principle — "don't call us, we'll call you" (the base class calls subclass methods)
- The difference between abstract methods (must override) and hook methods (may override)

---

## Quick Reference

| # | Pattern | Category | Theme |
|---|---------|----------|-------|
| 1 | Abstract Factory | Creational | Pokémon |
| 2 | Prototype | Creational | RuneScape |
| 3 | Adapter | Structural | Pokémon |
| 4 | Bridge | Structural | RuneScape |
| 5 | Flyweight | Structural | RuneScape |
| 6 | Proxy | Structural | Pokémon |
| 7 | Chain of Responsibility | Behavioral | RuneScape |
| 8 | Iterator | Behavioral | Pokémon |
| 9 | Mediator | Behavioral | RuneScape |
| 10 | Memento | Behavioral | Pokémon |
| 11 | Template Method | Behavioral | RuneScape |
