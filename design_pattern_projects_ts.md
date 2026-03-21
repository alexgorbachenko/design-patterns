# Design Pattern Practice Projects

A collection of beginner-friendly exercises to practice software design patterns in **TypeScript**, themed around sports, personal finance, Pokémon, and RuneScape.

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

Work through the projects in this sequence for a natural learning progression:

**Factory → Decorator → Observer → Strategy → Builder → Composite → Command → State → Singleton → Facade**

---

## Creational Patterns

### 1. Factory — Pokémon Starter Selector

**Pattern:** Factory Method
**Difficulty:** ⭐ Beginner
**Theme:** Pokémon

#### Overview
Build a `PokemonFactory` that creates different Pokémon objects based on a starter name. The factory hides the construction details so callers never need to know how each Pokémon is built — they just ask for one by name.

#### Requirements

- Define a `Pokemon` interface with the following fields:
  - `name: string`
  - `type: string` (e.g. `"Fire"`, `"Water"`, `"Grass"`)
  - `hp: number`
  - `attackPower: number`
- Create concrete classes that implement `Pokemon` for at least three starters:
  - `Charmander` — Fire type, 39 HP, 52 attack
  - `Squirtle` — Water type, 44 HP, 48 attack
  - `Bulbasaur` — Grass type, 45 HP, 49 attack
- Each class must implement an `attack(): void` method that logs a message like: `"Charmander used Ember! It deals 52 damage."`
- Create a `PokemonFactory` class with a `static create(name: string): Pokemon` method that returns the correct instance
- Throw a typed `Error` with a descriptive message if an unknown starter name is passed

#### Stretch Goals
- Add a fourth starter of your own invention
- Add a `defend(damage: number): void` method that reduces `hp` and logs remaining health
- Add an `isAlive(): boolean` method that returns `false` when `hp` reaches 0

#### What You're Practicing
- Centralising object creation logic
- Hiding constructor complexity from callers
- Writing to an interface rather than a concrete type

---

### 2. Builder — Fantasy Sports Lineup Builder

**Pattern:** Builder
**Difficulty:** ⭐ Beginner
**Theme:** Sports (American Football)

#### Overview
Construct a fantasy football lineup step by step using a `LineupBuilder`. The builder pattern lets you assemble a complex object incrementally, validating each step, and only producing the final object when it's complete.

#### Requirements

- Define a `Lineup` interface with the following fields:
  - `quarterback: string`
  - `runningBacks: string[]` (max 2)
  - `wideReceivers: string[]` (max 3)
  - `tightEnd: string`
  - `kicker: string`
  - `defense: string`
- Create a `LineupBuilder` class with the following methods, each returning `this` to enable chaining:
  - `setQuarterback(name: string): this`
  - `addRunningBack(name: string): this`
  - `addWideReceiver(name: string): this`
  - `setTightEnd(name: string): this`
  - `setKicker(name: string): this`
  - `setDefense(team: string): this`
  - `build(): Lineup` — validates and returns the completed lineup
- Method chaining should work like: `builder.setQuarterback("Josh Allen").addRunningBack("Derrick Henry").build()`
- `build()` must validate before returning:
  - `quarterback` is required
  - At least 1 `runningBack` is required
  - At least 1 `wideReceiver` is required
  - Throw a descriptive `Error` if any required field is missing

#### Stretch Goals
- Add a `totalProjectedPoints: number` field that sums projected points per player
- Support a `flex: string | null` slot that can hold a running back, wide receiver, or tight end
- Add a `reset(): this` method to the builder to start over

#### What You're Practicing
- Constructing complex objects step by step
- Method chaining with `this` return types
- Separating construction logic from the final object's representation

---

### 3. Singleton — RuneScape Game Config

**Pattern:** Singleton
**Difficulty:** ⭐ Beginner
**Theme:** RuneScape

#### Overview
Model a global `GameConfig` that stores server-wide settings. Only one instance of `GameConfig` should ever exist — no matter how many times it is requested. This prevents conflicting configurations across different parts of the application.

#### Requirements

- Create a `GameConfig` class with the following private fields:
  - `serverRegion: string` (e.g. `"US-East"`, `"EU-West"`)
  - `graphicsQuality: "Low" | "Medium" | "High"` (use a union type)
  - `soundEnabled: boolean`
  - `musicVolume: number` (0–100)
  - `displayFps: boolean`
- Implement the Singleton pattern:
  - Mark the constructor `private`
  - Use a `private static instance: GameConfig` field
  - Expose a `static getInstance(): GameConfig` method that lazily creates and returns the single instance
  - Calling `getInstance()` multiple times must always return the exact same object reference
- Add typed getters and setters for each setting
- Add a `printConfig(): void` method that logs all current settings to the console

#### Stretch Goals
- Add a `reset(): void` method that restores all settings to their default values
- Write a small test demonstrating that two calls to `getInstance()` return the same reference using `===`
- Define a `type GraphicsQuality = "Low" | "Medium" | "High"` alias and reuse it throughout

#### What You're Practicing
- Controlling instantiation with `private` constructors
- Managing shared global state safely
- Understanding the trade-offs of Singletons (global state can make testing harder)

---

## Structural Patterns

### 4. Decorator — Personal Finance Transaction Tagger

**Pattern:** Decorator
**Difficulty:** ⭐ Beginner
**Theme:** Personal Finance

#### Overview
Start with a simple `Transaction` object and layer additional metadata or behavior on top of it using decorators. Each decorator wraps the transaction and adds something new — without modifying the original class.

#### Requirements

- Define a `Transaction` interface with:
  - `getDescription(): string`
  - `getAmount(): number`
- Create a `BasicTransaction` class that implements `Transaction`:
  - Constructor accepts `description: string` and `amount: number`
- Create an abstract `TransactionDecorator` class that implements `Transaction` and holds a `protected` reference typed as `Transaction`
- Create the following concrete decorator classes extending `TransactionDecorator`:
  - `TaxTaggedTransaction` — appends `"[TAX DEDUCTIBLE]"` to the description
  - `RecurringTransaction` — appends `"[RECURRING]"` to the description; adds a `frequency: string` field (e.g. `"Monthly"`)
  - `FlaggedTransaction` — appends `"[FLAGGED FOR REVIEW]"` to the description; prefixes the amount with a warning string
- Decorators must be stackable, e.g.: `new FlaggedTransaction(new TaxTaggedTransaction(new BasicTransaction("Office Supplies", 49.99)))`

#### Stretch Goals
- Add a `CurrencyConvertedTransaction` decorator that accepts a `rate: number` and multiplies `getAmount()` by it
- Add a `SplitTransaction` decorator that accepts a `ratio: number` (0–1) and returns only that proportion of the amount
- Log the full decorator chain to observe how the description accumulates layer by layer

#### What You're Practicing
- Extending object behavior without inheritance
- Composing behavior by wrapping objects
- The open/closed principle — open for extension, closed for modification

---

### 5. Composite — RuneScape Inventory

**Pattern:** Composite
**Difficulty:** ⭐ Beginner
**Theme:** RuneScape

#### Overview
Model a RuneScape inventory where items can be individual objects or containers (bags/pouches) that hold other items. Both share the same interface, so callers can treat them uniformly.

#### Requirements

- Define an `InventoryItem` interface with:
  - `getName(): string`
  - `getWeight(): number`
  - `display(indent: number): void`
- Create a `SingleItem` class that implements `InventoryItem`:
  - Constructor accepts `name: string` and `weight: number`
- Create a `Container` class that implements `InventoryItem`:
  - Constructor accepts `name: string`
  - Holds a `private items: InventoryItem[]` array
  - Implements `add(item: InventoryItem): void` and `remove(item: InventoryItem): void`
  - `getWeight()` returns the sum of all contained items' weights
  - `display()` prints its own name then recursively displays children with increased indentation
- Demonstrate nesting: a `Backpack` containing a `Pouch`, which contains two `SingleItem` objects

#### Expected Output
```
Backpack (3.5 kg)
  Pouch (1.5 kg)
    Dragon Bones (1.0 kg)
    Shark (0.5 kg)
  Rune Sword (2.0 kg)
```

#### Stretch Goals
- Add a `maxWeight: number` field to `Container` that throws an `Error` when exceeded
- Add an `itemCount(): number` method that recursively counts all leaf `SingleItem` nodes
- Add a `find(name: string): InventoryItem | null` method that searches the tree recursively

#### What You're Practicing
- Treating individual objects and groups uniformly through a shared interface
- Recursive tree structures
- The difference between leaf nodes and composite nodes

---

### 6. Facade — Pokémon Battle System

**Pattern:** Facade
**Difficulty:** ⭐ Beginner
**Theme:** Pokémon

#### Overview
A Pokémon battle involves several complex subsystems: type effectiveness, status effects, accuracy, and faint detection. Build a `BattleManager` facade that hides all of this behind a single clean method.

#### Requirements

- Create the following subsystem classes (keep them simple — complexity lives here so the facade can hide it):
  - `TypeCalculator` — `getMultiplier(attackType: string, defenderType: string): number` returns `2.0`, `0.5`, or `1.0`
  - `StatusEffectManager` — `applyStatusEffect(pokemon: Pokemon, move: string): void`
  - `AccuracyChecker` — `doesMoveHit(move: string): boolean`
  - `FaintChecker` — `hasFainted(pokemon: Pokemon): boolean` returns `true` if `hp <= 0`
- Create a `BattleManager` facade class with a single public method:
  - `attack(attacker: Pokemon, defender: Pokemon, move: string): string` — orchestrates all subsystems and returns a plain-English result string, e.g.: `"Charmander used Ember! It's super effective! Squirtle took 84 damage. Squirtle has fainted!"`
- The caller should never need to interact with any subsystem directly

#### Stretch Goals
- Add `runBattle(pokemon1: Pokemon, pokemon2: Pokemon): void` that simulates a full turn-based battle until one faints
- Add a `BattleLog` class that stores results as `string[]`
- Expose `getLastBattleSummary(): string` on the facade

#### What You're Practicing
- Simplifying complex subsystems behind a single entry point
- Hiding internal implementation details from callers
- Reducing coupling between the client and internal classes

---

## Behavioral Patterns

### 7. Observer — Sports Score Notifier

**Pattern:** Observer
**Difficulty:** ⭐ Beginner
**Theme:** Sports

#### Overview
Create a `Game` object that broadcasts score updates to multiple listeners. Each listener reacts differently when a score changes — without the `Game` needing to know anything about how its observers work.

#### Requirements

- Define a `ScoreObserver` interface with:
  - `onScoreUpdate(homeTeam: string, awayTeam: string, homeScore: number, awayScore: number): void`
- Create a `Game` class with:
  - Fields: `homeTeam: string`, `awayTeam: string`, `homeScore: number`, `awayScore: number`
  - `subscribe(observer: ScoreObserver): void`
  - `unsubscribe(observer: ScoreObserver): void`
  - `scoreGoal(team: string): void` — increments the correct score and notifies all subscribed observers
- Create at least three concrete observer classes implementing `ScoreObserver`:
  - `ScoreboardDisplay` — logs the current score in a formatted string
  - `BettingTracker` — logs which team is winning and prints updated odds
  - `NewsAlertService` — logs a news-style alert, e.g.: `"BREAKING: Lakers take the lead 54–51!"`
- Demonstrate subscribing all three, triggering score updates, then unsubscribing one and confirming it stops receiving updates

#### Stretch Goals
- Add a `GameClock` observer that tracks and logs elapsed game time
- Allow filtering — e.g. only notify `NewsAlertService` when the lead changes hands
- Add an `once(observer: ScoreObserver): void` method that auto-unsubscribes after the first notification

#### What You're Practicing
- Decoupled event-driven communication
- The difference between the subject (broadcaster) and observers (listeners)
- Dynamic subscription management at runtime

---

### 8. Strategy — Personal Finance Budget Calculator

**Pattern:** Strategy
**Difficulty:** ⭐ Beginner
**Theme:** Personal Finance

#### Overview
Build a `BudgetCalculator` that can swap between different budgeting strategies at runtime. The calculator itself stays the same — only the strategy changes.

#### Requirements

- Define a `BudgetStrategy` interface with:
  - `allocate(income: number): Record<string, number>` — returns a map of category names to allocated amounts
- Create the following concrete strategy classes:
  - `FiftyThirtyTwentyStrategy` — 50% needs, 30% wants, 20% savings
  - `ZeroBasedStrategy` — 60% needs, 20% wants, 10% savings, 10% investments
  - `EnvelopeStrategy` — fixed amounts: rent `$1200`, groceries `$400`, entertainment `$200`, savings gets the remainder
- Create a `BudgetCalculator` class with:
  - `setStrategy(strategy: BudgetStrategy): void`
  - `calculate(income: number): void` — delegates to the current strategy and logs the full allocation
- Demonstrate switching strategies for the same income and observing different breakdowns

#### Stretch Goals
- Add a `CustomStrategy` that accepts a user-defined `Record<string, number>` allocation map in its constructor
- Add validation ensuring allocations sum to 100% (or total income) and throw an `Error` if not
- Add `compareStrategies(income: number, strategies: BudgetStrategy[]): void` that prints a side-by-side comparison

#### What You're Practicing
- Making algorithms interchangeable at runtime
- Separating strategy logic from the object that uses it
- The open/closed principle — adding a new strategy never requires changing `BudgetCalculator`

---

### 9. Command — RuneScape Action Queue

**Pattern:** Command
**Difficulty:** ⭐ Beginner
**Theme:** RuneScape

#### Overview
Model RuneScape player actions as command objects that can be queued, executed in order, and optionally undone. This separates the action's logic from the code that triggers it.

#### Requirements

- Define a `Command` interface with:
  - `execute(): void`
  - `undo(): void`
  - `getDescription(): string`
- Create a `Player` class with the following typed fields:
  - `name: string`
  - `hp: number` (starts at 99)
  - `position: string` (e.g. `"Lumbridge"`)
  - `inventory: string[]`
- Create the following concrete command classes, each implementing `Command`:
  - `AttackCommand` — constructor accepts `player: Player` and `damage: number`; `execute()` reduces HP; `undo()` restores it
  - `EatFoodCommand` — constructor accepts `player: Player` and `food: string`; `execute()` restores HP (capped at 99) and removes food from inventory; `undo()` reverses both
  - `TeleportCommand` — constructor accepts `player: Player` and `destination: string`; `execute()` updates `position`; `undo()` restores the previous position
- Create an `ActionQueue` class with:
  - `addAction(command: Command): void`
  - `executeAll(): void`
  - `undoLast(): void`
  - `printHistory(): void`

#### Stretch Goals
- Add a `MacroCommand` that accepts `Command[]` and executes them as a single unit
- Add a `redoLast(): void` method
- Cap the undo history to the last 10 actions using a fixed-length array

#### What You're Practicing
- Encapsulating actions as first-class typed objects
- Building an executable and reversible action history
- Decoupling the invoker (`ActionQueue`) from the receiver (`Player`)

---

### 10. State — Pokémon Status Conditions

**Pattern:** State
**Difficulty:** ⭐ Beginner
**Theme:** Pokémon

#### Overview
Give a `Pokemon` object a `currentState` that changes its behavior based on its status condition. Rather than using a chain of `if/else` statements inside the Pokémon class, each state encapsulates its own behavior.

#### Requirements

- Define a `PokemonState` interface with:
  - `takeTurn(pokemon: Pokemon): void`
  - `onHit(pokemon: Pokemon, damage: number): void`
  - `getStatusName(): string`
- Create the following concrete state classes implementing `PokemonState`:
  - `HealthyState` — `takeTurn()` logs a normal action; `onHit()` subtracts `damage` from `hp`
  - `PoisonedState` — `takeTurn()` deals `Math.floor(pokemon.maxHp / 8)` damage per turn; after 5 turns, transitions back to `HealthyState`
  - `AsleepState` — `takeTurn()` logs `"[name] is fast asleep!"`; each turn has a 33% chance (`Math.random()`) of waking and transitioning to `HealthyState`
  - `ParalyzedState` — `takeTurn()` has a 25% chance of skipping the turn; otherwise acts normally; does not expire
- Create a `Pokemon` class with the following typed fields and methods:
  - `name: string`, `hp: number`, `maxHp: number`, `currentState: PokemonState`
  - `setState(state: PokemonState): void`
  - `takeTurn(): void` — delegates to `currentState.takeTurn()`
  - `takeDamage(amount: number): void` — delegates to `currentState.onHit()`
  - `printStatus(): void` — logs name, current HP, and status name

#### Stretch Goals
- Add a `BurnedState` that halves the Pokémon's effective attack power each turn
- Add a `FrozenState` that requires a `"Fire"` type move to thaw
- Simulate a 5-turn battle log between two Pokémon with random status changes applied

#### What You're Practicing
- Letting an object's behavior vary based on internal state
- Eliminating large `if/else` or `switch` blocks with polymorphism
- Managing state transitions cleanly

---

## Quick Reference

| # | Pattern | Category | Theme |
|---|---------|----------|-------|
| 1 | Factory | Creational | Pokémon |
| 2 | Builder | Creational | Sports |
| 3 | Singleton | Creational | RuneScape |
| 4 | Decorator | Structural | Personal Finance |
| 5 | Composite | Structural | RuneScape |
| 6 | Facade | Structural | Pokémon |
| 7 | Observer | Behavioral | Sports |
| 8 | Strategy | Behavioral | Personal Finance |
| 9 | Command | Behavioral | RuneScape |
| 10 | State | Behavioral | Pokémon |
