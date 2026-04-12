# Design Pattern Practice Projects — Beginner

A collection of beginner-friendly exercises to practice software design patterns in **TypeScript**, themed around sports, personal finance, Pokémon, and RuneScape. Each project includes Jest test cases and specific TypeScript features to practice.

---

## Setup

```bash
npm init -y
npm install typescript ts-node @types/node --save-dev
npm install jest @types/jest ts-jest --save-dev
npx tsc --init
```

Add to `package.json`:
```json
"scripts": {
  "test": "jest"
},
"jest": {
  "preset": "ts-jest",
  "testEnvironment": "node"
}
```

Run tests with `npm test`. Run a single file with `npx jest pokemon-factory.test.ts`.

**TDD Approach:** For each project, write the tests first, watch them fail, then implement the code until they pass.

---

## Suggested Order

**Factory → Decorator → Observer → Strategy → Builder → Composite → Command → State → Singleton → Facade**

---

## TypeScript Features Introduced Across This File

| Project | TypeScript Feature |
|---|---|
| Factory | Interfaces, `static` methods, typed `Error` |
| Builder | `this` return types, method chaining, `string \| null` |
| Singleton | `private` constructors, `private static` fields, union types |
| Decorator | `abstract` classes, `protected` members |
| Composite | Recursive interfaces, typed arrays |
| Facade | Interface composition, multi-class orchestration |
| Observer | Interface-based callbacks, `jest.fn()` mocks |
| Strategy | `Record<string, number>`, swappable interface implementations |
| Command | Typed class fields, encapsulated state mutation |
| State | Polymorphism via interfaces, runtime delegation |

---

## Creational Patterns

### 1. Factory — Pokémon Starter Selector

**Pattern:** Factory Method
**Difficulty:** ⭐ Beginner
**Theme:** Pokémon
**TypeScript Features:** Interfaces, `static` methods, typed `Error`

#### Overview
Build a `PokemonFactory` that creates different Pokémon objects based on a starter name. The factory hides the construction details so callers never need to know how each Pokémon is built — they just ask for one by name.

#### TypeScript Features

- **Interfaces** — define `Pokemon` as an `interface`; concrete classes use the `implements` keyword to satisfy it. The factory's return type is `Pokemon`, never a concrete class like `Charmander` — this is what "programming to an interface" means in practice
- **`static` methods** — declare `PokemonFactory.create()` as `static` so it is called directly on the class without needing an instance: `PokemonFactory.create("Charmander")`
- **Typed `Error`** — throw `new Error("Unknown starter: Mewtwo")` for unrecognised names. Notice the return type of `create()` is `Pokemon` — TypeScript knows a thrown `Error` exits the function, so no `return` is needed in the `default` branch

#### Requirements

- Define a `Pokemon` interface with: `name: string`, `type: string`, `hp: number`, `attackPower: number`
- Create concrete classes implementing `Pokemon`:
  - `Charmander` — Fire type, 39 HP, 52 attack
  - `Squirtle` — Water type, 44 HP, 48 attack
  - `Bulbasaur` — Grass type, 45 HP, 49 attack
- Each class must implement `attack(): void` logging: `"Charmander used Ember! It deals 52 damage."`
- Create `PokemonFactory` with `static create(name: string): Pokemon` — return type is `Pokemon`, not a concrete class
- Throw a typed `Error` with a descriptive message for unknown starter names

#### Tests

```typescript
// pokemon-factory.test.ts
describe("PokemonFactory", () => {
  it("creates a Charmander with correct stats", () => {
    const p = PokemonFactory.create("Charmander");
    expect(p.name).toBe("Charmander");
    expect(p.type).toBe("Fire");
    expect(p.hp).toBe(39);
    expect(p.attackPower).toBe(52);
  });

  it("creates a Squirtle with correct stats", () => {
    const p = PokemonFactory.create("Squirtle");
    expect(p.type).toBe("Water");
    expect(p.hp).toBe(44);
  });

  it("creates a Bulbasaur with correct stats", () => {
    const p = PokemonFactory.create("Bulbasaur");
    expect(p.type).toBe("Grass");
    expect(p.hp).toBe(45);
  });

  it("throws an error for an unknown starter", () => {
    expect(() => PokemonFactory.create("Mewtwo")).toThrow();
  });

  it("returns a different instance each call", () => {
    const a = PokemonFactory.create("Charmander");
    const b = PokemonFactory.create("Charmander");
    expect(a).not.toBe(b);
  });

  it("logs an attack message without throwing", () => {
    const p = PokemonFactory.create("Charmander");
    expect(() => p.attack()).not.toThrow();
  });
});
```

#### Stretch Goals
- Add a fourth starter of your own invention
- Add `defend(damage: number): void` that reduces `hp` and logs remaining health
- Add `isAlive(): boolean` that returns `false` when `hp` reaches 0

#### What You're Practicing
- Centralising object creation logic
- Hiding constructor complexity from callers
- Writing to an interface rather than a concrete type

---

### 2. Builder — Fantasy Sports Lineup Builder

**Pattern:** Builder
**Difficulty:** ⭐ Beginner
**Theme:** Sports (American Football)
**TypeScript Features:** `this` return types, method chaining, `string | null`

#### Overview
Construct a fantasy football lineup step by step using a `LineupBuilder`. The builder pattern lets you assemble a complex object incrementally, validating each step, and only producing the final object when it's complete.

#### TypeScript Features

- **`this` return types** — each setter method declares its return type as `this` rather than `LineupBuilder`. This means if you subclass `LineupBuilder`, chained calls still return the subclass type rather than the parent — TypeScript tracks this automatically
- **Method chaining** — because setters return `this`, calls can be chained: `builder.setQuarterback("Josh Allen").addRunningBack("Henry").build()`. TypeScript enforces that each chained call is valid at compile time
- **`string | null`** — type the optional `flex` field as `string | null` rather than leaving it `undefined`. This makes it explicit that the field exists but has no value, and forces callers to handle the `null` case before using it

#### Requirements

- Define a `Lineup` interface with: `quarterback: string`, `runningBacks: string[]`, `wideReceivers: string[]`, `tightEnd: string`, `kicker: string`, `defense: string`, `flex: string | null`
- Create `LineupBuilder` with the following methods each typed to return `this`:
  - `setQuarterback(name: string): this`
  - `addRunningBack(name: string): this`
  - `addWideReceiver(name: string): this`
  - `setTightEnd(name: string): this`
  - `setKicker(name: string): this`
  - `setDefense(team: string): this`
  - `setFlex(name: string): this` — sets the `flex: string | null` field
  - `build(): Lineup` — validates and returns the completed lineup
- `build()` must throw a descriptive `Error` if `quarterback`, at least 1 running back, or at least 1 wide receiver is missing

#### Tests

```typescript
// lineup-builder.test.ts
describe("LineupBuilder", () => {
  let builder: LineupBuilder;

  beforeEach(() => {
    builder = new LineupBuilder();
  });

  it("builds a valid lineup with all required fields", () => {
    const lineup = builder
      .setQuarterback("Josh Allen")
      .addRunningBack("Derrick Henry")
      .addWideReceiver("Stefon Diggs")
      .setTightEnd("Travis Kelce")
      .setKicker("Justin Tucker")
      .setDefense("Bills")
      .build();

    expect(lineup.quarterback).toBe("Josh Allen");
    expect(lineup.runningBacks).toContain("Derrick Henry");
    expect(lineup.wideReceivers).toContain("Stefon Diggs");
  });

  it("throws if quarterback is missing", () => {
    expect(() =>
      builder.addRunningBack("Derrick Henry").addWideReceiver("Diggs").build()
    ).toThrow();
  });

  it("throws if no running backs are set", () => {
    expect(() =>
      builder.setQuarterback("Josh Allen").addWideReceiver("Diggs").build()
    ).toThrow();
  });

  it("throws if no wide receivers are set", () => {
    expect(() =>
      builder.setQuarterback("Josh Allen").addRunningBack("Henry").build()
    ).toThrow();
  });

  it("supports method chaining", () => {
    expect(() =>
      builder
        .setQuarterback("Josh Allen")
        .addRunningBack("Henry")
        .addWideReceiver("Diggs")
        .build()
    ).not.toThrow();
  });

  it("accumulates multiple running backs", () => {
    const lineup = builder
      .setQuarterback("Allen")
      .addRunningBack("Henry")
      .addRunningBack("McCaffrey")
      .addWideReceiver("Diggs")
      .build();
    expect(lineup.runningBacks).toHaveLength(2);
  });

  it("flex defaults to null when not set", () => {
    const lineup = builder
      .setQuarterback("Allen")
      .addRunningBack("Henry")
      .addWideReceiver("Diggs")
      .build();
    expect(lineup.flex).toBeNull();
  });

  it("flex can be set to a player name", () => {
    const lineup = builder
      .setQuarterback("Allen")
      .addRunningBack("Henry")
      .addWideReceiver("Diggs")
      .setFlex("Kelce")
      .build();
    expect(lineup.flex).toBe("Kelce");
  });
});
```

#### Stretch Goals
- Add `totalProjectedPoints: number` summing projected points per player
- Add `reset(): this` to start the builder over
- Try subclassing `LineupBuilder` and confirm chained calls return the subclass type

#### What You're Practicing
- Constructing complex objects step by step
- Method chaining with `this` return types
- Separating construction logic from the final object's representation

---

### 3. Singleton — RuneScape Game Config

**Pattern:** Singleton
**Difficulty:** ⭐ Beginner
**Theme:** RuneScape
**TypeScript Features:** `private` constructors, `private static` fields, union types

#### Overview
Model a global `GameConfig` that stores server-wide settings. Only one instance of `GameConfig` should ever exist — no matter how many times it is requested.

#### TypeScript Features

- **`private` constructor** — marking the constructor `private` makes it a compile-time error to call `new GameConfig()` from outside the class. TypeScript enforces this statically — no runtime check needed
- **`private static` instance field** — declare `private static instance: GameConfig` on the class itself. The field belongs to the class, not any instance, and is hidden from outside callers
- **Union types** — type `graphicsQuality` as `"Low" | "Medium" | "High"` instead of plain `string`. TypeScript will reject `setGraphicsQuality("Ultra")` at compile time, and your editor will autocomplete the valid values

#### Requirements

- Create `GameConfig` with `private` fields:
  - `serverRegion: string`
  - `graphicsQuality: "Low" | "Medium" | "High"` — use a union type, not `string`
  - `soundEnabled: boolean`
  - `musicVolume: number` (0–100)
  - `displayFps: boolean`
- Mark the constructor `private`
- Declare `private static instance: GameConfig`
- Expose `static getInstance(): GameConfig` — creates lazily on first call, returns the same reference thereafter
- Add typed getters and setters for each field — the setter for `graphicsQuality` must accept only `"Low" | "Medium" | "High"`
- Add `printConfig(): void` logging all settings
- Add `static resetInstance(): void` — sets `instance` back to `undefined` so tests can isolate themselves

#### Tests

```typescript
// game-config.test.ts
describe("GameConfig Singleton", () => {
  beforeEach(() => {
    GameConfig.resetInstance();
  });

  it("returns the same instance on multiple calls", () => {
    const a = GameConfig.getInstance();
    const b = GameConfig.getInstance();
    expect(a).toBe(b);
  });

  it("reflects changes made through any reference", () => {
    const a = GameConfig.getInstance();
    const b = GameConfig.getInstance();
    a.setMusicVolume(75);
    expect(b.getMusicVolume()).toBe(75);
  });

  it("sets and gets serverRegion correctly", () => {
    GameConfig.getInstance().setServerRegion("EU-West");
    expect(GameConfig.getInstance().getServerRegion()).toBe("EU-West");
  });

  it("sets and gets graphicsQuality correctly", () => {
    GameConfig.getInstance().setGraphicsQuality("High");
    expect(GameConfig.getInstance().getGraphicsQuality()).toBe("High");
  });

  it("sets and gets soundEnabled correctly", () => {
    GameConfig.getInstance().setSoundEnabled(false);
    expect(GameConfig.getInstance().getSoundEnabled()).toBe(false);
  });

  it("printConfig does not throw", () => {
    expect(() => GameConfig.getInstance().printConfig()).not.toThrow();
  });
});
```

#### Stretch Goals
- Define `type GraphicsQuality = "Low" | "Medium" | "High"` as a named alias and use it for the setter parameter type
- Add a `reset(): void` instance method that restores all settings to defaults
- Try calling `new GameConfig()` and observe the TypeScript compile error

#### What You're Practicing
- Controlling instantiation with `private` constructors
- Managing shared global state safely
- Understanding the trade-offs of Singletons (notice `resetInstance()` is needed just to make tests work)

---

## Structural Patterns

### 4. Decorator — Personal Finance Transaction Tagger

**Pattern:** Decorator
**Difficulty:** ⭐ Beginner
**Theme:** Personal Finance
**TypeScript Features:** `abstract` classes, `protected` members

#### Overview
Start with a simple `Transaction` object and layer additional metadata or behavior on top of it using decorators, without modifying the original class.

#### TypeScript Features

- **`abstract` classes** — define `TransactionDecorator` as `abstract class`. It cannot be instantiated directly — only its concrete subclasses can. It provides shared constructor logic and a `protected` wrapped reference, but delegates the actual method implementations to subclasses
- **`protected` members** — declare the wrapped `Transaction` reference as `protected transaction: Transaction` inside `TransactionDecorator`. This means concrete decorators like `TaxTaggedTransaction` can access `this.transaction` directly, but external callers cannot — it is invisible outside the class hierarchy

#### Requirements

- Define a `Transaction` interface with `getDescription(): string` and `getAmount(): number`
- Create `BasicTransaction` implementing `Transaction`:
  - Constructor accepts `description: string` and `amount: number`
- Create `abstract class TransactionDecorator` implementing `Transaction`:
  - Constructor accepts `protected transaction: Transaction` — this is the wrapped inner transaction
  - Subclasses access the wrapped transaction via `this.transaction`
- Create the following concrete decorator classes extending `TransactionDecorator`:
  - `TaxTaggedTransaction` — `getDescription()` returns the inner description plus `"[TAX DEDUCTIBLE]"`
  - `RecurringTransaction` — `getDescription()` appends `"[RECURRING]"`; adds a `frequency: string` field
  - `FlaggedTransaction` — `getDescription()` appends `"[FLAGGED FOR REVIEW]"`; `getAmount()` prefixes the value with a warning string
- Decorators must be stackable: `new FlaggedTransaction(new TaxTaggedTransaction(new BasicTransaction("Rent", 1200)))`

#### Tests

```typescript
// transaction-decorator.test.ts
describe("Transaction Decorators", () => {
  it("BasicTransaction returns correct description and amount", () => {
    const t = new BasicTransaction("Coffee", 4.50);
    expect(t.getDescription()).toBe("Coffee");
    expect(t.getAmount()).toBe(4.50);
  });

  it("TaxTaggedTransaction appends tag to description", () => {
    const t = new TaxTaggedTransaction(new BasicTransaction("Office Chair", 200));
    expect(t.getDescription()).toContain("[TAX DEDUCTIBLE]");
    expect(t.getAmount()).toBe(200);
  });

  it("RecurringTransaction appends tag to description", () => {
    const t = new RecurringTransaction(new BasicTransaction("Netflix", 15.99));
    expect(t.getDescription()).toContain("[RECURRING]");
  });

  it("FlaggedTransaction appends tag to description", () => {
    const t = new FlaggedTransaction(new BasicTransaction("Casino", 500));
    expect(t.getDescription()).toContain("[FLAGGED FOR REVIEW]");
  });

  it("decorators are stackable and accumulate descriptions", () => {
    const t = new FlaggedTransaction(
      new TaxTaggedTransaction(new BasicTransaction("Office Supplies", 49.99))
    );
    expect(t.getDescription()).toContain("[TAX DEDUCTIBLE]");
    expect(t.getDescription()).toContain("[FLAGGED FOR REVIEW]");
    expect(t.getAmount()).toBe(49.99);
  });

  it("stacked decorators preserve the original amount", () => {
    const t = new RecurringTransaction(
      new TaxTaggedTransaction(new BasicTransaction("Rent", 1200))
    );
    expect(t.getAmount()).toBe(1200);
  });
});
```

#### Stretch Goals
- Add `CurrencyConvertedTransaction` accepting a `rate: number` and multiplying `getAmount()` by it
- Add `SplitTransaction` accepting a `ratio: number` (0–1) returning that proportion of the amount
- Try instantiating `TransactionDecorator` directly and observe the TypeScript compile error

#### What You're Practicing
- Extending object behavior without inheritance
- Composing behavior by wrapping objects
- The open/closed principle — open for extension, closed for modification

---

### 5. Composite — RuneScape Inventory

**Pattern:** Composite
**Difficulty:** ⭐ Beginner
**Theme:** RuneScape
**TypeScript Features:** Recursive interfaces, typed arrays

#### Overview
Model a RuneScape inventory where items can be individual objects or containers that hold other items, both sharing the same interface.

#### TypeScript Features

- **Recursive interfaces** — `Container` holds a `private items: InventoryItem[]` where `InventoryItem` is the same interface that `Container` itself implements. This is valid TypeScript — an interface can reference itself recursively, which is what makes tree structures possible
- **Typed arrays** — declare `items` as `InventoryItem[]` rather than `any[]`. TypeScript enforces that only objects implementing `InventoryItem` can be added to the array, catching type errors at compile time rather than runtime

#### Requirements

- Define an `InventoryItem` interface with: `getName(): string`, `getWeight(): number`, `display(indent: number): void`
- Create `SingleItem` implementing `InventoryItem`:
  - Constructor accepts `name: string` and `weight: number`
- Create `Container` implementing `InventoryItem`:
  - Constructor accepts `name: string`
  - `private items: InventoryItem[]` — typed array; only `InventoryItem` objects allowed
  - `add(item: InventoryItem): void` and `remove(item: InventoryItem): void`
  - `getWeight()` returns the sum of all children's weights recursively
  - `display(indent)` prints its name, then recursively calls `display(indent + 2)` on each child
- Demonstrate nesting: a `Backpack` containing a `Pouch`, which contains two `SingleItem` objects

#### Tests

```typescript
// inventory-composite.test.ts
describe("RuneScape Inventory Composite", () => {
  it("SingleItem returns correct name and weight", () => {
    const item = new SingleItem("Dragon Bones", 1.0);
    expect(item.getName()).toBe("Dragon Bones");
    expect(item.getWeight()).toBe(1.0);
  });

  it("empty Container has zero weight", () => {
    const bag = new Container("Bag");
    expect(bag.getWeight()).toBe(0);
  });

  it("Container weight equals sum of children", () => {
    const bag = new Container("Bag");
    bag.add(new SingleItem("Sword", 2.5));
    bag.add(new SingleItem("Shield", 3.0));
    expect(bag.getWeight()).toBe(5.5);
  });

  it("nested Containers sum weight recursively", () => {
    const pouch = new Container("Pouch");
    pouch.add(new SingleItem("Rune", 0.0));
    pouch.add(new SingleItem("Shark", 0.5));
    const backpack = new Container("Backpack");
    backpack.add(pouch);
    backpack.add(new SingleItem("Sword", 2.0));
    expect(backpack.getWeight()).toBe(2.5);
  });

  it("removing an item reduces the weight", () => {
    const bag = new Container("Bag");
    const sword = new SingleItem("Sword", 2.0);
    bag.add(sword);
    bag.remove(sword);
    expect(bag.getWeight()).toBe(0);
  });

  it("display does not throw for nested items", () => {
    const bag = new Container("Bag");
    bag.add(new SingleItem("Bones", 1.0));
    expect(() => bag.display(0)).not.toThrow();
  });
});
```

#### Stretch Goals
- Add `maxWeight: number` to `Container` that throws when exceeded
- Add `itemCount(): number` recursively counting all leaf `SingleItem` nodes
- Add `find(name: string): InventoryItem | null`

#### What You're Practicing
- Treating individual objects and groups uniformly through a shared interface
- Recursive tree structures
- The difference between leaf nodes and composite nodes

---

### 6. Facade — Pokémon Battle System

**Pattern:** Facade
**Difficulty:** ⭐ Beginner
**Theme:** Pokémon
**TypeScript Features:** Interface composition, multi-class orchestration

#### Overview
Hide the complexity of a Pokémon battle (type effectiveness, status effects, accuracy, faint detection) behind a single `BattleManager.attack()` method.

#### TypeScript Features

- **Interface composition** — define `Pokemon` as a small focused interface (`name`, `type`, `hp`, `attackPower`). The `BattleManager` accepts `Pokemon` parameters, meaning any object satisfying that interface works — the facade is not tied to a specific class
- **Multi-class orchestration** — `BattleManager` holds `private` references to each subsystem (`private typeCalc: TypeCalculator`, etc.) typed to their specific class. Callers only see `BattleManager`'s public method; TypeScript hides the subsystem types entirely

#### Requirements

- Create the following subsystem classes:
  - `TypeCalculator` — `getMultiplier(attackType: string, defenderType: string): number` returns `2.0`, `0.5`, or `1.0`
  - `StatusEffectManager` — `applyStatusEffect(pokemon: Pokemon, move: string): void`
  - `AccuracyChecker` — `doesMoveHit(move: string): boolean`
  - `FaintChecker` — `hasFainted(pokemon: Pokemon): boolean` returns `true` if `hp <= 0`
- Create `BattleManager`:
  - Holds `private` typed references to each subsystem
  - Single public method: `attack(attacker: Pokemon, defender: Pokemon, move: string): string`
  - The return type is `string` — a plain-English result the caller can log or display
- The caller should never need to interact with any subsystem directly

#### Tests

```typescript
// battle-facade.test.ts
describe("BattleManager Facade", () => {
  let manager: BattleManager;
  let charmander: Pokemon;
  let squirtle: Pokemon;

  beforeEach(() => {
    manager = new BattleManager();
    charmander = { name: "Charmander", type: "Fire", hp: 39, attackPower: 52 };
    squirtle = { name: "Squirtle", type: "Water", hp: 44, attackPower: 48 };
  });

  it("returns a non-empty result string", () => {
    const result = manager.attack(charmander, squirtle, "Ember");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("result string includes attacker name", () => {
    const result = manager.attack(charmander, squirtle, "Ember");
    expect(result).toContain("Charmander");
  });

  it("result string includes move name", () => {
    const result = manager.attack(charmander, squirtle, "Ember");
    expect(result).toContain("Ember");
  });

  it("does not throw for any valid input", () => {
    expect(() => manager.attack(charmander, squirtle, "Flamethrower")).not.toThrow();
  });

  it("attack is the only public method on BattleManager", () => {
    expect(typeof manager.attack).toBe("function");
  });
});
```

#### Stretch Goals
- Add `runBattle(pokemon1: Pokemon, pokemon2: Pokemon): void`
- Add `BattleLog` storing results as `string[]`
- Expose `getLastBattleSummary(): string`

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
**TypeScript Features:** Interface-based callbacks, `jest.fn()` mocks

#### Overview
Create a `Game` that broadcasts score updates to multiple listeners, each reacting independently.

#### TypeScript Features

- **Interface-based callbacks** — define `ScoreObserver` as an interface with a single method. Any object implementing that interface can subscribe — you never depend on a concrete class. This is the TypeScript equivalent of passing a function pointer
- **`jest.fn()` mocks** — in tests, create a mock observer with `{ onScoreUpdate: jest.fn() }`. This satisfies the `ScoreObserver` interface at runtime while letting you assert that `onScoreUpdate` was called with specific arguments. This is one of Jest's most important features for testing decoupled code

#### Requirements

- Define `ScoreObserver` interface with `onScoreUpdate(homeTeam: string, awayTeam: string, homeScore: number, awayScore: number): void`
- Create `Game` with:
  - `private observers: ScoreObserver[]` — typed array ensuring only valid observers can subscribe
  - `subscribe(observer: ScoreObserver): void`
  - `unsubscribe(observer: ScoreObserver): void` — removes by reference using `Array.filter`
  - `scoreGoal(team: string): void` — increments score and notifies all `observers`
- Create at least three concrete observer classes implementing `ScoreObserver`:
  - `ScoreboardDisplay` — logs a formatted score string
  - `BettingTracker` — logs which team is winning and updated odds
  - `NewsAlertService` — logs a breaking news alert

#### Tests

```typescript
// score-observer.test.ts
describe("Sports Score Observer", () => {
  let game: Game;
  let mockObserver: jest.Mocked<ScoreObserver>;

  beforeEach(() => {
    game = new Game("Lakers", "Celtics");
    mockObserver = { onScoreUpdate: jest.fn() };
  });

  it("notifies subscribed observers on scoreGoal", () => {
    game.subscribe(mockObserver);
    game.scoreGoal("Lakers");
    expect(mockObserver.onScoreUpdate).toHaveBeenCalledTimes(1);
  });

  it("passes correct score values to observer", () => {
    game.subscribe(mockObserver);
    game.scoreGoal("Lakers");
    expect(mockObserver.onScoreUpdate).toHaveBeenCalledWith("Lakers", "Celtics", 1, 0);
  });

  it("does not notify after unsubscribe", () => {
    game.subscribe(mockObserver);
    game.unsubscribe(mockObserver);
    game.scoreGoal("Lakers");
    expect(mockObserver.onScoreUpdate).not.toHaveBeenCalled();
  });

  it("notifies multiple observers", () => {
    const second = { onScoreUpdate: jest.fn() };
    game.subscribe(mockObserver);
    game.subscribe(second);
    game.scoreGoal("Celtics");
    expect(mockObserver.onScoreUpdate).toHaveBeenCalled();
    expect(second.onScoreUpdate).toHaveBeenCalled();
  });

  it("increments the correct team score", () => {
    game.subscribe(mockObserver);
    game.scoreGoal("Celtics");
    expect(mockObserver.onScoreUpdate).toHaveBeenCalledWith("Lakers", "Celtics", 0, 1);
  });
});
```

#### Stretch Goals
- Add `GameClock` observer tracking elapsed time
- Allow filtering — only notify `NewsAlertService` on lead changes
- Add `once(observer: ScoreObserver): void` that auto-unsubscribes after first notification

#### What You're Practicing
- Decoupled event-driven communication
- The difference between the subject (broadcaster) and observers (listeners)
- Dynamic subscription management at runtime

---

### 8. Strategy — Personal Finance Budget Calculator

**Pattern:** Strategy
**Difficulty:** ⭐ Beginner
**Theme:** Personal Finance
**TypeScript Features:** `Record<string, number>`, swappable interface implementations

#### Overview
Build a `BudgetCalculator` that swaps between different budgeting strategies at runtime without changing the calculator itself.

#### TypeScript Features

- **`Record<string, number>`** — the return type of `allocate()` is `Record<string, number>`, a typed object where keys are category names and values are amounts. This is equivalent to `{ [key: string]: number }` but cleaner to write. It tells TypeScript the object will always map strings to numbers
- **Swappable interface implementations** — `BudgetCalculator` holds a `private strategy: BudgetStrategy` field typed to the interface, never a concrete class. When you call `setStrategy()`, TypeScript only cares that the new object satisfies `BudgetStrategy` — it does not care which class it is. This is the open/closed principle in action

#### Requirements

- Define `BudgetStrategy` interface with `allocate(income: number): Record<string, number>`
- Create concrete strategy classes:
  - `FiftyThirtyTwentyStrategy` — 50% needs, 30% wants, 20% savings
  - `ZeroBasedStrategy` — 60% needs, 20% wants, 10% savings, 10% investments
  - `EnvelopeStrategy` — fixed: rent $1200, groceries $400, entertainment $200; savings gets the remainder
- Create `BudgetCalculator`:
  - `private strategy: BudgetStrategy` — typed to the interface
  - `setStrategy(strategy: BudgetStrategy): void`
  - `calculate(income: number): void` — delegates to `this.strategy.allocate()` and logs the result

#### Tests

```typescript
// budget-strategy.test.ts
describe("Budget Strategies", () => {
  it("FiftyThirtyTwenty allocates 50% to needs", () => {
    const result = new FiftyThirtyTwentyStrategy().allocate(2000);
    expect(result["needs"]).toBe(1000);
  });

  it("FiftyThirtyTwenty allocates 30% to wants", () => {
    const result = new FiftyThirtyTwentyStrategy().allocate(2000);
    expect(result["wants"]).toBe(600);
  });

  it("FiftyThirtyTwenty allocates 20% to savings", () => {
    const result = new FiftyThirtyTwentyStrategy().allocate(2000);
    expect(result["savings"]).toBe(400);
  });

  it("ZeroBased allocations sum to income", () => {
    const result = new ZeroBasedStrategy().allocate(3000);
    const total = Object.values(result).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(3000);
  });

  it("EnvelopeStrategy remainder goes to savings", () => {
    const result = new EnvelopeStrategy().allocate(2500);
    expect(result["savings"]).toBe(2500 - 1200 - 400 - 200);
  });

  it("BudgetCalculator delegates to the active strategy", () => {
    const calc = new BudgetCalculator();
    const strategy = { allocate: jest.fn().mockReturnValue({ needs: 500 }) };
    calc.setStrategy(strategy);
    calc.calculate(1000);
    expect(strategy.allocate).toHaveBeenCalledWith(1000);
  });

  it("BudgetCalculator switches strategies at runtime", () => {
    const calc = new BudgetCalculator();
    const s1 = { allocate: jest.fn().mockReturnValue({}) };
    const s2 = { allocate: jest.fn().mockReturnValue({}) };
    calc.setStrategy(s1);
    calc.calculate(1000);
    calc.setStrategy(s2);
    calc.calculate(1000);
    expect(s1.allocate).toHaveBeenCalledTimes(1);
    expect(s2.allocate).toHaveBeenCalledTimes(1);
  });
});
```

#### Stretch Goals
- Add `CustomStrategy` accepting a user-defined `Record<string, number>` map
- Validate that allocations sum to 100% and throw if not
- Add `compareStrategies(income: number, strategies: BudgetStrategy[]): void`

#### What You're Practicing
- Making algorithms interchangeable at runtime
- Separating strategy logic from the object that uses it
- The open/closed principle

---

### 9. Command — RuneScape Action Queue

**Pattern:** Command
**Difficulty:** ⭐ Beginner
**Theme:** RuneScape
**TypeScript Features:** Typed class fields, encapsulated state mutation

#### Overview
Model RuneScape player actions as command objects that can be queued, executed, and optionally undone.

#### TypeScript Features

- **Typed class fields** — declare all `Player` fields with explicit types (`name: string`, `hp: number`, `position: string`, `inventory: string[]`). TypeScript will enforce that `hp` can only be assigned a number, `inventory` can only hold strings, and so on — catching mistakes before they become bugs
- **Encapsulated state mutation** — each command stores a `private previousHp: number` (or similar) at execute time so `undo()` can restore it. Typing these as `private` means only the command itself can touch them — external code cannot accidentally corrupt the undo state

#### Requirements

- Define `Command` interface with `execute(): void`, `undo(): void`, `getDescription(): string`
- Create `Player` with typed fields: `name: string`, `hp: number`, `position: string`, `inventory: string[]`
- Create concrete command classes:
  - `AttackCommand` — constructor: `player: Player`, `damage: number`; stores `private previousHp: number`; `execute()` reduces HP; `undo()` restores from `previousHp`
  - `EatFoodCommand` — constructor: `player: Player`, `food: string`; stores `private previousHp: number`; `execute()` restores HP (capped at 99) and removes food; `undo()` reverses both
  - `TeleportCommand` — constructor: `player: Player`, `destination: string`; stores `private previousPosition: string`; `execute()` updates position; `undo()` restores from `previousPosition`
- Create `ActionQueue`:
  - `private executed: Command[]` — typed array holding only `Command` objects
  - `addAction(command: Command): void`
  - `executeAll(): void`
  - `undoLast(): void`
  - `printHistory(): void`

#### Tests

```typescript
// action-queue.test.ts
describe("RuneScape Command Pattern", () => {
  let player: Player;

  beforeEach(() => {
    player = new Player("Zezima", 99, "Lumbridge", ["Shark"]);
  });

  it("AttackCommand reduces player HP", () => {
    new AttackCommand(player, 20).execute();
    expect(player.hp).toBe(79);
  });

  it("AttackCommand undo restores HP", () => {
    const cmd = new AttackCommand(player, 20);
    cmd.execute();
    cmd.undo();
    expect(player.hp).toBe(99);
  });

  it("EatFoodCommand restores HP and removes food", () => {
    player.hp = 50;
    new EatFoodCommand(player, "Shark").execute();
    expect(player.hp).toBeGreaterThan(50);
    expect(player.inventory).not.toContain("Shark");
  });

  it("EatFoodCommand undo reverses HP and returns food", () => {
    player.hp = 50;
    const cmd = new EatFoodCommand(player, "Shark");
    cmd.execute();
    cmd.undo();
    expect(player.hp).toBe(50);
    expect(player.inventory).toContain("Shark");
  });

  it("TeleportCommand changes position", () => {
    new TeleportCommand(player, "Varrock").execute();
    expect(player.position).toBe("Varrock");
  });

  it("TeleportCommand undo restores previous position", () => {
    const cmd = new TeleportCommand(player, "Varrock");
    cmd.execute();
    cmd.undo();
    expect(player.position).toBe("Lumbridge");
  });

  it("ActionQueue executes all commands in order", () => {
    const queue = new ActionQueue();
    queue.addAction(new AttackCommand(player, 10));
    queue.addAction(new AttackCommand(player, 10));
    queue.executeAll();
    expect(player.hp).toBe(79);
  });

  it("ActionQueue undoLast reverses the most recent command", () => {
    const queue = new ActionQueue();
    queue.addAction(new AttackCommand(player, 10));
    queue.executeAll();
    queue.undoLast();
    expect(player.hp).toBe(99);
  });
});
```

#### Stretch Goals
- Add `MacroCommand` accepting `Command[]` and executing them as one unit
- Add `redoLast(): void`
- Cap undo history at the last 10 actions

#### What You're Practicing
- Encapsulating actions as first-class typed objects
- Building an executable and reversible action history
- Decoupling the invoker (`ActionQueue`) from the receiver (`Player`)

---

### 10. State — Pokémon Status Conditions

**Pattern:** State
**Difficulty:** ⭐ Beginner
**Theme:** Pokémon
**TypeScript Features:** Polymorphism via interfaces, runtime delegation

#### Overview
Give a `Pokemon` a `currentState` that changes its behavior based on its status condition, replacing `if/else` chains with polymorphism.

#### TypeScript Features

- **Polymorphism via interfaces** — `Pokemon.currentState` is typed as `PokemonState`, the interface. At runtime it holds a `HealthyState`, `PoisonedState`, or any other concrete state — but `Pokemon` only ever calls methods defined on `PokemonState`. Adding a new state requires no changes to `Pokemon` at all
- **Runtime delegation** — `takeTurn()` on `Pokemon` simply calls `this.currentState.takeTurn(this)`. TypeScript knows `currentState` satisfies `PokemonState`, so the call is type-safe even though the actual class of `currentState` is only known at runtime. Each state receives the `Pokemon` instance so it can read and mutate `hp`, `maxHp`, and call `setState()`

#### Requirements

- Define `PokemonState` interface with:
  - `takeTurn(pokemon: Pokemon): void`
  - `onHit(pokemon: Pokemon, damage: number): void`
  - `getStatusName(): string`
- Create concrete state classes implementing `PokemonState`:
  - `HealthyState` — `takeTurn()` logs a normal action; `onHit()` subtracts damage from `hp`
  - `PoisonedState` — `takeTurn()` deals `Math.floor(pokemon.maxHp / 8)` damage; after 5 turns calls `pokemon.setState(new HealthyState())`
  - `AsleepState` — `takeTurn()` logs `"[name] is fast asleep!"`; 33% chance each turn of calling `pokemon.setState(new HealthyState())`
  - `ParalyzedState` — `takeTurn()` has 25% chance of skipping; otherwise acts normally; does not expire
- Create `Pokemon`:
  - Fields: `name: string`, `hp: number`, `maxHp: number`, `currentState: PokemonState`
  - `setState(state: PokemonState): void` — replaces `currentState`
  - `takeTurn(): void` — delegates to `this.currentState.takeTurn(this)`
  - `takeDamage(amount: number): void` — delegates to `this.currentState.onHit(this, amount)`
  - `printStatus(): void`

#### Tests

```typescript
// pokemon-state.test.ts
describe("Pokémon State Pattern", () => {
  let pikachu: Pokemon;

  beforeEach(() => {
    pikachu = new Pokemon("Pikachu", 100, 100);
  });

  it("starts in HealthyState", () => {
    expect(pikachu.currentState.getStatusName()).toBe("Healthy");
  });

  it("HealthyState onHit reduces HP correctly", () => {
    pikachu.takeDamage(30);
    expect(pikachu.hp).toBe(70);
  });

  it("transitions to PoisonedState correctly", () => {
    pikachu.setState(new PoisonedState());
    expect(pikachu.currentState.getStatusName()).toBe("Poisoned");
  });

  it("PoisonedState reduces HP each turn", () => {
    pikachu.setState(new PoisonedState());
    pikachu.takeTurn();
    expect(pikachu.hp).toBeLessThan(100);
  });

  it("transitions to AsleepState correctly", () => {
    pikachu.setState(new AsleepState());
    expect(pikachu.currentState.getStatusName()).toBe("Asleep");
  });

  it("transitions to ParalyzedState correctly", () => {
    pikachu.setState(new ParalyzedState());
    expect(pikachu.currentState.getStatusName()).toBe("Paralyzed");
  });

  it("setState updates the currentState reference", () => {
    const healthy = new HealthyState();
    pikachu.setState(healthy);
    expect(pikachu.currentState).toBe(healthy);
  });

  it("printStatus does not throw", () => {
    expect(() => pikachu.printStatus()).not.toThrow();
  });
});
```

#### Stretch Goals
- Add `BurnedState` halving effective attack power each turn
- Add `FrozenState` requiring a `"Fire"` type move to thaw
- Simulate a 5-turn battle log between two Pokémon with random status changes

#### What You're Practicing
- Letting an object's behavior vary based on internal state
- Eliminating large `if/else` or `switch` blocks with polymorphism
- Managing state transitions cleanly

---

## Quick Reference

| # | Pattern | Category | Theme | TypeScript Feature |
|---|---------|----------|-------|--------------------|
| 1 | Factory | Creational | Pokémon | Interfaces, `static`, typed `Error` |
| 2 | Builder | Creational | Sports | `this` return types, `string \| null` |
| 3 | Singleton | Creational | RuneScape | `private` constructor, union types |
| 4 | Decorator | Structural | Personal Finance | `abstract` classes, `protected` |
| 5 | Composite | Structural | RuneScape | Recursive interfaces, typed arrays |
| 6 | Facade | Structural | Pokémon | Interface composition |
| 7 | Observer | Behavioral | Sports | Interface callbacks, `jest.fn()` |
| 8 | Strategy | Behavioral | Personal Finance | `Record<string, number>` |
| 9 | Command | Behavioral | RuneScape | Typed fields, private state |
| 10 | State | Behavioral | Pokémon | Polymorphism, runtime delegation |
