# GoF Design Pattern Projects — Intermediate

A collection of TypeScript exercises for 11 intermediate GoF patterns, themed around RuneScape and Pokémon. Each project includes a TypeScript features section, requirements that reference those features directly, and Jest test cases.

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

Run tests with `npm test`.

---

## Suggested Order

**Abstract Factory → Prototype → Adapter → Bridge → Flyweight → Proxy → Chain of Responsibility → Iterator → Mediator → Memento → Template Method**

---

## TypeScript Features Introduced Across This File

| Project | TypeScript Feature |
|---|---|
| Abstract Factory | `const enum`, optional fields `?`, optional chaining `?.` |
| Prototype | `Readonly<T>`, `readonly` fields, `Pick<T, K>` |
| Adapter | Type aliases, intersection types `&`, type assertions `as` |
| Bridge | `abstract` classes, `protected` members, constructor parameter properties |
| Flyweight | `as const`, `keyof typeof`, index signatures |
| Proxy | `get`/`set` accessors, private class fields `#`, non-null assertion `!` |
| Chain of Responsibility | Discriminated unions, type narrowing with `switch`, `never` exhaustiveness |
| Iterator | Generic constraints `T extends object`, generator functions `function*`, `Symbol.iterator` |
| Mediator | `satisfies` operator, template literal types, `Extract<T, U>` |
| Memento | `Readonly<T>`, `Object.freeze()`, `ReturnType<T>`, `Partial<T>` |
| Template Method | `protected abstract`, `readonly abstract`, hook methods |

---

## Creational Patterns

### 1. Abstract Factory — Pokémon Generation Selector

**Pattern:** Abstract Factory
**Difficulty:** ⭐⭐ Intermediate
**Theme:** Pokémon
**TypeScript Features:** `const enum`, optional fields `?`, optional chaining `?.`

#### Overview
Your Pokémon game supports multiple generations. An Abstract Factory ensures that when you select a generation, every object — starter, rival, gym leader — belongs to that generation consistently.

#### TypeScript Features

- **`const enum`** — declare `const enum Generation { Kanto, Johto }` instead of plain string literals. Unlike a regular `enum`, a `const enum` is fully erased at compile time — TypeScript replaces every usage with its numeric value inline, producing no runtime object. This makes them faster and smaller, but they can't be iterated at runtime
- **Optional fields `?`** — add `catchphrase?: string` to the `Rival` interface. The `?` means the field may be absent entirely — TypeScript types it as `string | undefined` and forces callers to handle that before using the value
- **Optional chaining `?.`** — access `rival.catchphrase?.toUpperCase()` safely. If `catchphrase` is `undefined`, the expression short-circuits to `undefined` rather than throwing. TypeScript enforces that `?.` is required here because the field is typed as optional

#### Requirements

- Define `const enum Generation` with at least `Kanto` and `Johto`
- Define product interfaces:
  - `Starter` — `name: string`, `type: string`, `introduce(): void`
  - `Rival` — `name: string`, `catchphrase?: string` (optional), `challenge(): void`
  - `GymLeader` — `name: string`, `badgeName: string`, `battle(): void`
- Define `PokemonFactory` interface with `readonly generation: Generation`, `createStarter()`, `createRival()`, `createGymLeader()`
- Implement `KantoFactory` (Charmander, Gary, Brock) and `JohtoFactory` (Cyndaquil, Silver, Falkner)
- Write `startGame(factory: PokemonFactory): void` using only the factory interface; use `rival.catchphrase?.toUpperCase()` to demonstrate optional chaining — if the rival has no catchphrase, nothing should crash
- Create `FactoryRegistry` backed by `Map<Generation, PokemonFactory>` with `register` and `get`; `get` throws a descriptive `Error` if the generation is not registered

#### Tests

```typescript
// abstract-factory.test.ts
describe("Pokémon Abstract Factory", () => {
  it("KantoFactory creates a Fire-type starter named Charmander", () => {
    const starter = new KantoFactory().createStarter();
    expect(starter.name).toBe("Charmander");
    expect(starter.type).toBe("Fire");
  });

  it("JohtoFactory creates Cyndaquil", () => {
    expect(new JohtoFactory().createStarter().name).toBe("Cyndaquil");
  });

  it("KantoFactory rival is Gary", () => {
    expect(new KantoFactory().createRival().name).toBe("Gary");
  });

  it("JohtoFactory rival is Silver", () => {
    expect(new JohtoFactory().createRival().name).toBe("Silver");
  });

  it("startGame runs without throwing for either factory", () => {
    expect(() => startGame(new KantoFactory())).not.toThrow();
    expect(() => startGame(new JohtoFactory())).not.toThrow();
  });

  it("FactoryRegistry returns the correct factory by generation", () => {
    const registry = new FactoryRegistry();
    registry.register(new KantoFactory());
    expect(registry.get(Generation.Kanto).generation).toBe(Generation.Kanto);
  });

  it("FactoryRegistry throws for unregistered generation", () => {
    const registry = new FactoryRegistry();
    expect(() => registry.get(Generation.Johto)).toThrow();
  });

  it("optional catchphrase accessed via ?. does not throw", () => {
    const rival = new KantoFactory().createRival();
    expect(() => rival.catchphrase?.toUpperCase()).not.toThrow();
  });
});
```

#### Stretch Goals
- Add `Generation.Hoenn` and `HoennFactory` with Torchic, Brendan, and Roxanne
- Add `createMap(): GameMap` returning a region-specific map object to each factory
- Add `Object.values(Generation)` logging at startup — note this will not work with `const enum`; try switching to a regular `enum` and observe the difference

#### What You're Practicing
- Creating families of related objects without specifying concrete classes
- Ensuring product compatibility within a family
- The difference between Abstract Factory (families) and Factory Method (single products)

---

### 2. Prototype — RuneScape Enemy Spawner

**Pattern:** Prototype
**Difficulty:** ⭐⭐ Intermediate
**Theme:** RuneScape
**TypeScript Features:** `Readonly<T>`, `readonly` fields, `Pick<T, K>`

#### Overview
Configure one master `Enemy` prototype per type and clone it whenever a new instance is needed, instead of rebuilding enemies from scratch.

#### TypeScript Features

- **`readonly` fields** — declare `readonly name: string` on the `Enemy` interface. TypeScript will produce a compile error if any code attempts to reassign `enemy.name` after creation. This is a type-level guarantee, not a runtime one — it catches mistakes early without any runtime cost
- **`Readonly<T>`** — wrap stored prototypes as `Readonly<Enemy>` in `SpawnManager`. `Readonly<T>` makes every field of `T` readonly, protecting the master prototype from mutation. Clones are returned as mutable `Enemy` objects — only the stored prototype is frozen at the type level
- **`Pick<T, K>`** — define `type EnemyStats = Pick<Enemy, "hp" | "attackLevel" | "defenceLevel">` to extract a subset of fields. `Pick` lets you create focused types from larger ones without duplicating field definitions

#### Requirements

- Define `Enemy` interface with `readonly name: string`, `hp: number`, `maxHp: number`, `attackLevel: number`, `defenceLevel: number`, `dropTable: string[]`, `patrolRoute: string[]`, `clone(): Enemy`, `printStats(): void`
- Create `Goblin`, `Guard`, `BlackKnight` implementing `Enemy`
- `clone()` must deep-copy array fields using spread: `dropTable: [...this.dropTable]` — modifying a clone's arrays must not affect the original
- Create `SpawnManager`:
  - `private prototypes: Map<string, Readonly<Enemy>>` — prototypes stored as `Readonly` to prevent mutation
  - `register(name: string, prototype: Enemy): void` — stores a `Readonly` version
  - `spawn(name: string): Enemy` — clones and returns a mutable copy; throws if not found
  - `spawnMany(name: string, count: number): Enemy[]`
- Define `type EnemyStats = Pick<Enemy, "hp" | "attackLevel" | "defenceLevel">` and write a standalone `compareStats(a: EnemyStats, b: EnemyStats): void` function that accepts any object with those three fields

#### Tests

```typescript
// prototype-spawner.test.ts
describe("RuneScape Enemy Prototype", () => {
  let manager: SpawnManager;

  beforeEach(() => {
    manager = new SpawnManager();
    manager.register("goblin", new Goblin());
    manager.register("guard", new Guard());
  });

  it("spawns an enemy with correct stats", () => {
    const goblin = manager.spawn("goblin");
    expect(goblin.name).toBe("Goblin");
    expect(goblin.hp).toBe(25);
  });

  it("spawned clone is a different object reference", () => {
    expect(manager.spawn("goblin")).not.toBe(manager.spawn("goblin"));
  });

  it("mutating clone dropTable does not affect prototype", () => {
    manager.spawn("goblin").dropTable.push("Dragon Bones");
    expect(manager.spawn("goblin").dropTable).not.toContain("Dragon Bones");
  });

  it("mutating clone patrolRoute does not affect prototype", () => {
    manager.spawn("goblin").patrolRoute.push("Grand Exchange");
    expect(manager.spawn("goblin").patrolRoute).not.toContain("Grand Exchange");
  });

  it("spawnMany returns the correct number of clones", () => {
    expect(manager.spawnMany("goblin", 5)).toHaveLength(5);
  });

  it("spawnMany returns distinct objects", () => {
    const goblins = manager.spawnMany("goblin", 3);
    expect(goblins[0]).not.toBe(goblins[1]);
  });

  it("throws for unregistered enemy name", () => {
    expect(() => manager.spawn("dragon")).toThrow();
  });
});
```

#### Stretch Goals
- Add `spawnBoss(name: string, hpMultiplier: number): Enemy` that clones and scales HP
- Add `resetHp(): void` that restores `hp` to `maxHp`
- Try mutating a `Readonly<Enemy>` prototype and observe the TypeScript compile error

#### What You're Practicing
- Cloning objects instead of reconstructing them
- Deep vs. shallow copying
- Using TypeScript's type system to enforce immutability on prototypes

---

## Structural Patterns

### 3. Adapter — Pokémon External Stats API

**Pattern:** Adapter
**Difficulty:** ⭐⭐ Intermediate
**Theme:** Pokémon
**TypeScript Features:** Type aliases, intersection types `&`, type assertions `as`

#### Overview
Translate data from a third-party API shape into your internal `Pokemon` interface using an Adapter, without touching either side.

#### TypeScript Features

- **Type aliases** — define `type PokemonType = "Fire" | "Water" | "Grass" | "Electric" | "Psychic"` and use it wherever a Pokémon type is needed. Type aliases give a name to any type expression — here they make the valid types explicit and reusable, and your editor will autocomplete the valid values
- **Intersection types `&`** — define `type DetailedPokemon = Pokemon & { nationalDexNumber: number; generation: number }`. The `&` operator combines two types into one that must satisfy both. `DetailedPokemon` has every field from `Pokemon` plus the two additional ones — no duplication required
- **Type assertions `as`** — when mapping `element_type: string` from the external API to `PokemonType`, use `element_type as PokemonType` to tell TypeScript you know the value is valid. This bypasses the type checker for that expression — use it sparingly and only when you've validated the value yourself

#### Requirements

- Define `type PokemonType = "Fire" | "Water" | "Grass" | "Electric" | "Psychic"`
- Define internal `Pokemon` interface: `name: string`, `type: PokemonType`, `hp: number`, `attackPower: number`, `displaySummary(): void`
- Define `ExternalPokemonData` interface: `pokemon_name: string`, `element_type: string`, `base_stats: { hit_points: number; attack: number }`
- Create `ExternalPokeApi` with `fetchByName(name: string): ExternalPokemonData` returning mock data for at least Charmander, Squirtle, and Pikachu
- Create `PokeApiAdapter` implementing `Pokemon`:
  - Holds a `private` `ExternalPokeApi` reference
  - `loadByName(name: string): void` — fetches and maps the external data; uses `as PokemonType` when assigning `element_type`; throws for unknown names
  - All `Pokemon` interface fields and methods are then accessible
- Define `type DetailedPokemon = Pokemon & { nationalDexNumber: number; generation: number }` and verify TypeScript requires all fields from both sides when constructing one

#### Tests

```typescript
// adapter.test.ts
describe("Pokémon API Adapter", () => {
  let adapter: PokeApiAdapter;

  beforeEach(() => {
    adapter = new PokeApiAdapter(new ExternalPokeApi());
  });

  it("maps pokemon_name to name correctly", () => {
    adapter.loadByName("Charmander");
    expect(adapter.name).toBe("Charmander");
  });

  it("maps element_type to a valid PokemonType", () => {
    adapter.loadByName("Charmander");
    expect(["Fire", "Water", "Grass", "Electric", "Psychic"]).toContain(adapter.type);
  });

  it("maps hit_points to hp correctly", () => {
    adapter.loadByName("Charmander");
    expect(adapter.hp).toBe(39);
  });

  it("maps attack to attackPower correctly", () => {
    adapter.loadByName("Charmander");
    expect(adapter.attackPower).toBe(52);
  });

  it("displaySummary does not throw", () => {
    adapter.loadByName("Squirtle");
    expect(() => adapter.displaySummary()).not.toThrow();
  });

  it("throws for an unknown Pokémon name", () => {
    expect(() => adapter.loadByName("Missingno")).toThrow();
  });

  it("DetailedPokemon intersection type includes nationalDexNumber", () => {
    const detailed: DetailedPokemon = {
      name: "Bulbasaur", type: "Grass", hp: 45, attackPower: 49,
      nationalDexNumber: 1, generation: 1,
      displaySummary: () => {}
    };
    expect(detailed.nationalDexNumber).toBe(1);
  });
});
```

#### Stretch Goals
- Add a `LegacyPokedexData` source with a different shape and write a second adapter for it
- Add a `Map<string, Pokemon>` cache inside the adapter to avoid re-fetching the same Pokémon
- Write `PokedexApp` accepting any `Pokemon` and verify both adapters work with it

#### What You're Practicing
- Translating between incompatible interfaces
- Isolating third-party dependencies behind your own interface
- The difference between Adapter (translation) and Facade (simplification)

---

### 4. Bridge — RuneScape Spell Caster

**Pattern:** Bridge
**Difficulty:** ⭐⭐ Intermediate
**Theme:** RuneScape
**TypeScript Features:** `abstract` classes, `protected` members, constructor parameter properties

#### Overview
Separate spell abstraction from weapon implementation so any spell can be cast with any weapon without creating a class for every combination.

#### TypeScript Features

- **`abstract` classes** — declare `abstract class Spell`. Abstract classes can contain both implemented and unimplemented methods. TypeScript prevents you from instantiating `Spell` directly — only concrete subclasses like `FireBlast` can be instantiated. Any method marked `abstract` must be implemented by every subclass or TypeScript will produce a compile error
- **`protected` members** — declare `protected weapon: Weapon` on `Spell`. `protected` means the field is accessible inside `Spell` and all its subclasses, but invisible to external callers. This lets `FireBlast` read `this.weapon.getMagicBonus()` directly without needing a getter
- **Constructor parameter properties** — write `constructor(protected weapon: Weapon)` as a shorthand. TypeScript automatically declares `weapon` as a `protected` field and assigns the constructor argument to it in one step — no separate `this.weapon = weapon` line needed

#### Requirements

- Define `Weapon` interface with `name: string`, `getMagicBonus(): number`, `getAttackSpeed(): "Fast" | "Normal" | "Slow"` — use a union type, not plain `string`, for attack speed
- Create `Staff` (+10 bonus, `"Slow"`), `Wand` (+17, `"Fast"`), `Tome` (+8, `"Normal"`)
- Define `abstract class Spell`:
  - Use constructor parameter property: `constructor(protected weapon: Weapon)`
  - `readonly abstract spellBook: string`
  - `protected abstract getSpellName(): string`
  - `protected abstract getBaseMaxHit(): number`
  - Concrete `cast(): void` that calls `getSpellName()`, `getBaseMaxHit()`, and `weapon.getMagicBonus()` to produce output — subclasses never re-implement this
- Create `FireBlast` (`spellBook = "Standard"`, max hit 32) and `IceBarrage` (`spellBook = "Ancient"`, max hit 30; overrides `cast()` to also log freeze duration based on `weapon.getAttackSpeed()`)
- Demonstrate all 6 spell/weapon combinations without creating 6 separate classes

#### Tests

```typescript
// bridge.test.ts
describe("RuneScape Spell Bridge", () => {
  it("FireBlast with Staff casts without throwing", () => {
    expect(() => new FireBlast(new Staff()).cast()).not.toThrow();
  });

  it("FireBlast with Wand casts without throwing", () => {
    expect(() => new FireBlast(new Wand()).cast()).not.toThrow();
  });

  it("IceBarrage with Tome casts without throwing", () => {
    expect(() => new IceBarrage(new Tome()).cast()).not.toThrow();
  });

  it("FireBlast has Standard spell book", () => {
    expect(new FireBlast(new Staff()).spellBook).toBe("Standard");
  });

  it("IceBarrage has Ancient spell book", () => {
    expect(new IceBarrage(new Wand()).spellBook).toBe("Ancient");
  });

  it("Wand getAttackSpeed returns Fast", () => {
    expect(new Wand().getAttackSpeed()).toBe("Fast");
  });

  it("Staff getMagicBonus returns a number", () => {
    expect(typeof new Staff().getMagicBonus()).toBe("number");
  });

  it("all 6 weapon/spell combinations cast without throwing", () => {
    const weapons = [new Staff(), new Wand(), new Tome()];
    weapons.flatMap(w => [new FireBlast(w), new IceBarrage(w)])
      .forEach(s => expect(() => s.cast()).not.toThrow());
  });
});
```

#### Stretch Goals
- Add `ArceuusSpell` with a `reanimationTarget: string` constructor parameter
- Add `getCastCost(): Record<string, number>` to `Spell` returning rune costs
- Add `NullWeapon` with 0 bonus and `"Normal"` speed; try instantiating `Spell` directly and observe the compile error

#### What You're Practicing
- Decoupling abstraction from implementation so both can vary independently
- Preferring composition over a combinatorial explosion of subclasses
- Using `abstract` and `protected` to enforce contracts within a class hierarchy

---

### 5. Flyweight — RuneScape World Tile Renderer

**Pattern:** Flyweight
**Difficulty:** ⭐⭐ Intermediate
**Theme:** RuneScape
**TypeScript Features:** `as const`, `keyof typeof`, index signatures

#### Overview
Share intrinsic tile data across thousands of tiles instead of duplicating it, by storing it once per tile type and referencing it by position.

#### TypeScript Features

- **`as const`** — declare `const TILE_CONFIGS = { grass: { ... }, water: { ... } } as const`. Without `as const`, TypeScript widens the string values to `string`. With it, every value is narrowed to its exact literal type — `walkable` becomes `true` or `false`, never just `boolean`. This makes the config a single source of truth the type system can reason about
- **`keyof typeof`** — derive `type TileName = keyof typeof TILE_CONFIGS` directly from the config object. This means `TileName` is automatically `"grass" | "water" | "rock" | "sand"` — you never have to maintain the union type separately. If you add a new tile to `TILE_CONFIGS`, `TileName` updates automatically
- **Index signatures** — type the tile cache as `private cache: { [tileName: string]: TileType }`. An index signature means any string key maps to a `TileType` value. This is more flexible than a fixed set of known keys, appropriate here because tile names come in at runtime

#### Requirements

- Define `const TILE_CONFIGS` with at least grass, water, rock, and sand entries; mark it `as const`
- Derive `type TileName = keyof typeof TILE_CONFIGS` — never write the union type manually
- Create `TileType` class with `readonly texture: string`, `readonly walkable: boolean`, `readonly color: string`, and `render(x: number, y: number): void`
- Create `TileFactory`:
  - `private cache: { [tileName: string]: TileType }` — index-signature cache
  - `getTileType(name: TileName): TileType` — creates on first access, returns cached instance thereafter; `TileName` parameter type prevents invalid tile names at compile time
  - `getCacheSize(): number`
- Create `WorldMap`:
  - `placeTile(name: TileName, x: number, y: number): void`
  - `renderAll(): void`
- Demonstrate that placing 1000 grass tiles only creates one `TileType` flyweight instance

#### Tests

```typescript
// flyweight.test.ts
describe("RuneScape Tile Flyweight", () => {
  let factory: TileFactory;

  beforeEach(() => { factory = new TileFactory(); });

  it("returns the same instance for the same tile name", () => {
    expect(factory.getTileType("grass")).toBe(factory.getTileType("grass"));
  });

  it("returns different instances for different tile names", () => {
    expect(factory.getTileType("grass")).not.toBe(factory.getTileType("water"));
  });

  it("cache size is 1 after requesting the same tile 1000 times", () => {
    for (let i = 0; i < 1000; i++) factory.getTileType("grass");
    expect(factory.getCacheSize()).toBe(1);
  });

  it("grass tile is walkable", () => {
    expect(factory.getTileType("grass").walkable).toBe(true);
  });

  it("water tile is not walkable", () => {
    expect(factory.getTileType("water").walkable).toBe(false);
  });

  it("WorldMap renderAll does not throw", () => {
    const map = new WorldMap(factory);
    map.placeTile("grass", 0, 0);
    map.placeTile("rock", 1, 1);
    expect(() => map.renderAll()).not.toThrow();
  });

  it("cache grows by one per unique tile type", () => {
    factory.getTileType("grass");
    factory.getTileType("water");
    expect(factory.getCacheSize()).toBe(2);
  });
});
```

#### Stretch Goals
- Add `passageBonus: number` to each tile config entry and derive its type from `TILE_CONFIGS`
- Write `getTileAt(x: number, y: number): TileType | undefined` on `WorldMap`
- Try passing an invalid tile name like `"lava"` to `getTileType()` and observe the TypeScript compile error

#### What You're Practicing
- Separating intrinsic (shared) from extrinsic (unique) state
- Using a cache to ensure shared instances are reused
- Deriving types from runtime values with `as const`, `typeof`, and `keyof`

---

### 6. Proxy — Pokémon Move Lazy Loader

**Pattern:** Proxy
**Difficulty:** ⭐⭐ Intermediate
**Theme:** Pokémon
**TypeScript Features:** `get`/`set` accessors, private class fields `#`, non-null assertion `!`

#### Overview
Defer loading a move's full data until it is actually used in battle, using a proxy that sits in front of the real `Move` object.

#### TypeScript Features

- **`get`/`set` accessors** — expose `pp` on `RealMove` through a getter/setter pair rather than a plain field. The `get pp()` accessor is called when someone reads the value; `set pp(value)` is called when they assign it. This lets you add validation in the setter (`if (value < 0) throw new RangeError(...)`) that a plain field cannot provide
- **Private class fields `#`** — declare `#realMove: RealMove | null = null` using the `#` prefix instead of TypeScript's `private` keyword. `#` fields are enforced at runtime by the JavaScript engine — they literally do not exist outside the class. TypeScript's `private` is compile-time only and can be bypassed with `as any`. Use `#` when true runtime privacy matters
- **Non-null assertion `!`** — after confirming `#realMove` is not null with `this.#load()`, write `this.#realMove!.getBasePower()` to tell TypeScript you know it is defined. The `!` suppresses the null check TypeScript would otherwise require. Use it sparingly — only when you have already guaranteed the value exists through your own logic

#### Requirements

- Define `Move` interface with `name: string`, `getBasePower(): number`, `getAccuracy(): number`, `getPP(): number`, `getDescription(): string`, `use(attacker: string, defender: string): void`
- Create `RealMove` implementing `Move`:
  - Use `get pp()` / `set pp(value: number)` accessors — the setter throws `RangeError` if value is negative
  - Log `"[RealMove] Loading full data for: <name>"` in the constructor so tests can spy on it
- Create `MoveProxy` implementing `Move`:
  - `#realMove: RealMove | null = null` — true private field
  - `name` is available immediately without loading `RealMove`
  - A `private #load(): RealMove` helper instantiates `RealMove` on first call and stores it in `#realMove`; subsequent calls return the cached instance using `!`
  - All other interface methods call `#load()` then delegate using `!`
- Demonstrate that creating a `Pokemon` with four `MoveProxy` moves does not produce any `"[RealMove] Loading"` logs until a move is actually accessed

#### Tests

```typescript
// proxy.test.ts
describe("Pokémon Move Proxy", () => {
  it("accessing name does not instantiate RealMove", () => {
    const spy = jest.spyOn(console, "log");
    const proxy = new MoveProxy("Thunderbolt", 90, 100, 15, "Electric shock");
    void proxy.name;
    expect(spy).not.toHaveBeenCalledWith(expect.stringContaining("Loading full data"));
    spy.mockRestore();
  });

  it("accessing getBasePower triggers RealMove load", () => {
    const spy = jest.spyOn(console, "log");
    const proxy = new MoveProxy("Thunderbolt", 90, 100, 15, "Electric shock");
    proxy.getBasePower();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Loading full data"));
    spy.mockRestore();
  });

  it("RealMove loads only once across multiple calls", () => {
    const spy = jest.spyOn(console, "log");
    const proxy = new MoveProxy("Thunderbolt", 90, 100, 15, "Electric shock");
    proxy.getBasePower();
    proxy.getAccuracy();
    proxy.getPP();
    const loads = spy.mock.calls.filter(c => String(c[0]).includes("Loading full data"));
    expect(loads).toHaveLength(1);
    spy.mockRestore();
  });

  it("proxy name matches provided name", () => {
    expect(new MoveProxy("Surf", 90, 100, 15, "A wave").name).toBe("Surf");
  });

  it("RealMove pp setter throws RangeError for negative value", () => {
    const move = new RealMove("Tackle", 40, 100, 35, "A tackle");
    expect(() => { move.pp = -1; }).toThrow(RangeError);
  });

  it("use() does not throw", () => {
    expect(() => new MoveProxy("Tackle", 40, 100, 35, "A tackle").use("Pikachu", "Charmander")).not.toThrow();
  });
});
```

#### Stretch Goals
- Add `LoggingMoveProxy` wrapping any `Move` and logging every call with `Date.now()` timestamps
- Add `AuthorisedMoveProxy` throwing when `getPP() === 0`
- Implement an alternative using TypeScript's built-in `Proxy` object and compare the two approaches

#### What You're Practicing
- Controlling access to an object through an intermediary
- Lazy initialisation — deferring expensive work until it is actually needed
- True runtime encapsulation with private class fields `#`

---

## Behavioral Patterns

### 7. Chain of Responsibility — RuneScape Damage Calculator

**Pattern:** Chain of Responsibility
**Difficulty:** ⭐⭐ Intermediate
**Theme:** RuneScape
**TypeScript Features:** Discriminated unions, type narrowing with `switch`, `never` exhaustiveness

#### Overview
Pass incoming damage through a configurable chain of reduction handlers before applying it to the player's HP. Each handler checks whether it applies, reduces the damage if so, then passes the remainder to the next.

#### TypeScript Features

- **Discriminated unions** — define `type AttackType = { kind: "Melee" } | { kind: "Ranged"; isTyped: boolean } | { kind: "Magic"; spellElement: string }`. The shared `kind` field is the discriminant. TypeScript uses it to narrow the union — inside `case "Magic":`, it knows `spellElement` exists; inside `case "Melee":`, it knows it does not
- **Type narrowing with `switch`** — use `switch (context.attack.kind)` to narrow `AttackType`. Each `case` branch gives TypeScript full knowledge of which union member you're in, making spell-specific fields accessible without casting
- **`never` exhaustiveness** — add a `default` branch that assigns to `never`: `const _exhaustive: never = context.attack`. If you ever add a new `kind` to `AttackType` without updating the switch, TypeScript will produce a compile error in the default branch — it's a compile-time guarantee that all cases are handled

#### Requirements

- Define `type AttackType = { kind: "Melee" } | { kind: "Ranged"; isTyped: boolean } | { kind: "Magic"; spellElement: string }`
- Define `CombatContext` interface: `attack: AttackType`, `activePrayer: string | null`, `armourSet: string | null`, `absorptionCharges: number`
- Define `abstract class DamageHandler`:
  - `protected next: DamageHandler | null = null`
  - `setNext(handler: DamageHandler): DamageHandler` — sets next and returns it for chaining
  - `abstract handle(damage: number, context: CombatContext): number`
- Create four handlers, using `switch (context.attack.kind)` with `never` exhaustiveness in `OverheadPrayerHandler`:
  - `OverheadPrayerHandler` — blocks 100% damage when prayer matches attack kind; uses `switch` + `never`
  - `EliteVoidHandler` — 15% reduction when `armourSet === "Elite Void"`
  - `AbsorptionPotionHandler` — absorbs up to 50 damage per hit, decrements `absorptionCharges`
  - `BaseDefenceHandler` — always-last flat 10% reduction
- Demonstrate two chains: fully protected vs. no gear

#### Tests

```typescript
// chain-of-responsibility.test.ts
describe("RuneScape Damage Chain", () => {
  const ctx = (overrides: Partial<CombatContext> = {}): CombatContext => ({
    attack: { kind: "Melee" },
    activePrayer: null, armourSet: null, absorptionCharges: 0,
    ...overrides
  });

  it("BaseDefenceHandler reduces damage by 10%", () => {
    expect(new BaseDefenceHandler().handle(100, ctx())).toBeCloseTo(90);
  });

  it("OverheadPrayerHandler blocks 100% for matching attack", () => {
    const h = new OverheadPrayerHandler();
    h.setNext(new BaseDefenceHandler());
    expect(h.handle(100, ctx({ activePrayer: "Protect from Melee" }))).toBe(0);
  });

  it("OverheadPrayerHandler passes through for non-matching prayer", () => {
    const h = new OverheadPrayerHandler();
    h.setNext(new BaseDefenceHandler());
    expect(h.handle(100, ctx({ activePrayer: "Protect from Magic" }))).toBeGreaterThan(0);
  });

  it("EliteVoidHandler reduces damage by 15%", () => {
    const h = new EliteVoidHandler();
    h.setNext(new BaseDefenceHandler());
    expect(h.handle(100, ctx({ armourSet: "Elite Void" }))).toBeCloseTo(76.5);
  });

  it("AbsorptionPotionHandler absorbs up to 50 damage and decrements charges", () => {
    const h = new AbsorptionPotionHandler();
    h.setNext(new BaseDefenceHandler());
    const context = ctx({ absorptionCharges: 3 });
    expect(h.handle(30, context)).toBe(0);
    expect(context.absorptionCharges).toBe(2);
  });

  it("full chain with no protections applies only base reduction", () => {
    const chain = new OverheadPrayerHandler();
    chain.setNext(new EliteVoidHandler()).setNext(new AbsorptionPotionHandler()).setNext(new BaseDefenceHandler());
    expect(chain.handle(100, ctx())).toBeCloseTo(90);
  });
});
```

#### Stretch Goals
- Add `NecklaceOfAnguishHandler` that increases ranged damage — narrow `context.attack` to `kind === "Ranged"` first
- Build a `ChainBuilder` accepting `DamageHandler[]` that links them dynamically
- Add a new `kind: "Typeless"` to `AttackType` and observe the compile error in `OverheadPrayerHandler`'s `never` branch

#### What You're Practicing
- Passing a request through a configurable pipeline of handlers
- Exhaustive type narrowing with discriminated unions and `never`
- Building composable processing pipelines

---

### 8. Iterator — Pokémon PC Box

**Pattern:** Iterator
**Difficulty:** ⭐⭐ Intermediate
**Theme:** Pokémon
**TypeScript Features:** Generic constraints `T extends object`, generator functions `function*`, `Symbol.iterator`

#### Overview
Traverse a Pokémon PC box grid in multiple ways — row by row, by type, fainted only — without exposing the internal grid structure to the caller.

#### TypeScript Features

- **Generic constraints `T extends object`** — define `interface Iterator<T extends object>`. The constraint `extends object` prevents the iterator from being used with primitive types like `number` or `string` — it only works with object types. This is appropriate here since iterating primitive values is rarely the intent
- **Generator functions `function*`** — implement iterators as `function*` generators using `yield`. Instead of manually tracking index state in a class, a generator function pauses at each `yield` and resumes where it left off. TypeScript types the return as `Generator<T>`, which automatically satisfies the iterator protocol
- **`Symbol.iterator`** — implement `[Symbol.iterator](): IterableIterator<Pokemon>` on `PCBox`. This is the built-in JavaScript iteration protocol. Once implemented, TypeScript knows `PCBox` is iterable and allows `for...of` loops and spread syntax `[...box]` on it directly

#### Requirements

- Define `interface Iterator<T extends object>` with `hasNext(): boolean`, `next(): T`, `reset(): void`
- Define `Pokemon` interface: `name: string`, `type: string`, `hp: number`, `isFainted(): boolean`
- Create `PCBox`:
  - `private grid: (Pokemon | null)[][]` — 5 rows × 6 columns, initialised with `null`
  - `addPokemon(pokemon: Pokemon, row: number, col: number): void`
  - `createIterator(): Iterator<Pokemon>` — implemented as a `function*` generator that `yield`s non-null entries row by row; wraps the generator in an object satisfying `Iterator<Pokemon>`
  - `createTypeIterator(type: string): Iterator<Pokemon>` — filters by type
  - `createFaintedIterator(): Iterator<Pokemon>` — filters by `isFainted()`
  - `[Symbol.iterator](): IterableIterator<Pokemon>` — delegates to the row-by-row generator, enabling `for...of` and `[...box]`

#### Tests

```typescript
// iterator.test.ts
describe("Pokémon PC Box Iterator", () => {
  let box: PCBox;
  const make = (name: string, type: string, hp: number): Pokemon => ({
    name, type, hp, isFainted: () => hp === 0
  });

  beforeEach(() => {
    box = new PCBox();
    box.addPokemon(make("Pikachu", "Electric", 100), 0, 0);
    box.addPokemon(make("Charmander", "Fire", 100), 0, 1);
    box.addPokemon(make("Squirtle", "Water", 0), 1, 0);
  });

  it("default iterator yields all non-null Pokémon", () => {
    const iter = box.createIterator();
    const results: Pokemon[] = [];
    while (iter.hasNext()) results.push(iter.next());
    expect(results).toHaveLength(3);
  });

  it("type iterator only yields matching type", () => {
    const iter = box.createTypeIterator("Fire");
    const results: Pokemon[] = [];
    while (iter.hasNext()) results.push(iter.next());
    expect(results).toHaveLength(1);
    expect(results[0].type).toBe("Fire");
  });

  it("fainted iterator only yields fainted Pokémon", () => {
    const iter = box.createFaintedIterator();
    const results: Pokemon[] = [];
    while (iter.hasNext()) results.push(iter.next());
    expect(results.every(p => p.isFainted())).toBe(true);
  });

  it("Symbol.iterator works with for...of", () => {
    const names: string[] = [];
    for (const p of box) names.push(p.name);
    expect(names).toContain("Pikachu");
  });

  it("spread operator works via Symbol.iterator", () => {
    expect([...box]).toHaveLength(3);
  });

  it("reset allows re-traversal from the beginning", () => {
    const iter = box.createIterator();
    while (iter.hasNext()) iter.next();
    iter.reset();
    expect(iter.hasNext()).toBe(true);
  });
});
```

#### Stretch Goals
- Add `createReverseIterator(): Iterator<Pokemon>` traversing bottom-right to top-left
- Write a generic `count<T extends object>(iter: Iterator<T>): number` utility
- Try using `Array.from(box)` and confirm it works via `Symbol.iterator`

#### What You're Practicing
- Traversing collections without exposing internal structure
- Generator functions as an ergonomic alternative to manual iterator classes
- Making custom classes work natively with TypeScript's iteration protocols

---

### 9. Mediator — RuneScape Clan Chat

**Pattern:** Mediator
**Difficulty:** ⭐⭐ Intermediate
**Theme:** RuneScape
**TypeScript Features:** `satisfies` operator, template literal types, `Extract<T, U>`

#### Overview
Centralise clan chat communication so players, the rank system, and the mute system never reference each other directly.

#### TypeScript Features

- **`satisfies` operator** — write `const RANK_ORDER = { Guest: 0, Member: 1, ... } satisfies Record<ClanRank, number>`. Unlike a type annotation (`: Record<ClanRank, number>`), `satisfies` validates the object against the type without widening it — TypeScript still infers the exact literal type of each value. This means `RANK_ORDER.Owner` is typed as `6`, not just `number`
- **Template literal types** — define `type ClanMessage = \`[Clan] \${string}: \${string}\``. TypeScript checks that any string assigned to `ClanMessage` matches this pattern at the type level. This makes malformed log messages a compile-time error rather than a runtime surprise
- **`Extract<T, U>`** — derive `type PrivilegedRank = Extract<ClanRank, "Lieutenant" | "Captain" | "General" | "Owner">`. `Extract` filters a union, keeping only the members that are assignable to `U`. This lets you define a subset of ranks that have muting permissions without duplicating the string literals

#### Requirements

- Define `type ClanRank = "Guest" | "Member" | "Sergeant" | "Lieutenant" | "Captain" | "General" | "Owner"`
- Define `const RANK_ORDER satisfies Record<ClanRank, number>` — each rank maps to a numeric level 0–6
- Define `type PrivilegedRank = Extract<ClanRank, "Lieutenant" | "Captain" | "General" | "Owner">`
- Define `type ClanMessage = \`[Clan] \${string}: \${string}\`` and use it as the type for broadcast messages
- Define `ClanChatMediator` interface with `sendMessage`, `mutePlayer`, `promotePlayer`
- Create `ClanMember` with `name: string`, `rank: ClanRank`, `mutedUntil: number`; all actions delegate to the mediator
- Create `ClanChat` implementing `ClanChatMediator`:
  - `sendMessage()` — blocks muted senders; broadcasts a `ClanMessage`-typed string to all other members
  - `mutePlayer()` — uses `RANK_ORDER` to check the muter outranks the muted; only `PrivilegedRank` holders may mute
  - `promotePlayer()` — only the `Owner` can promote

#### Tests

```typescript
// mediator.test.ts
describe("RuneScape Clan Chat Mediator", () => {
  let chat: ClanChat;
  let owner: ClanMember;
  let lieutenant: ClanMember;
  let member: ClanMember;
  let guest: ClanMember;

  beforeEach(() => {
    chat = new ClanChat();
    owner = new ClanMember("Zezima", "Owner", chat);
    lieutenant = new ClanMember("Lynx Titan", "Lieutenant", chat);
    member = new ClanMember("B0aty", "Member", chat);
    guest = new ClanMember("Noob123", "Guest", chat);
    [owner, lieutenant, member, guest].forEach(m => chat.addMember(m));
  });

  it("member can send a message without throwing", () => {
    expect(() => member.say("Hello clan!")).not.toThrow();
  });

  it("muted member cannot send messages", () => {
    const spy = jest.spyOn(console, "log");
    chat.mutePlayer(lieutenant, member, 60);
    member.say("Can I talk?");
    expect(spy).not.toHaveBeenCalledWith(expect.stringContaining("B0aty"));
    spy.mockRestore();
  });

  it("guest cannot mute another member", () => {
    expect(() => chat.mutePlayer(guest, member, 60)).toThrow();
  });

  it("lieutenant can mute a member", () => {
    expect(() => chat.mutePlayer(lieutenant, member, 60)).not.toThrow();
  });

  it("only owner can promote", () => {
    expect(() => chat.promotePlayer(owner, member, "Sergeant")).not.toThrow();
    expect(() => chat.promotePlayer(lieutenant, member, "Captain")).toThrow();
  });

  it("promotion updates member rank", () => {
    chat.promotePlayer(owner, member, "Sergeant");
    expect(member.rank).toBe("Sergeant");
  });
});
```

#### Stretch Goals
- Add `kickPlayer(target: ClanMember): void` removing them from the member list
- Store the last 50 messages as `ClanMessage[]` and expose `getMessageHistory(): ClanMessage[]`
- Try assigning a malformed string to a `ClanMessage` variable and observe the compile error

#### What You're Practicing
- Centralising complex many-to-many communication
- Deriving focused types from larger ones with `Extract` and template literals
- Using `satisfies` to validate object literals without losing specificity

---

### 10. Memento — Pokémon Battle Save State

**Pattern:** Memento
**Difficulty:** ⭐⭐ Intermediate
**Theme:** Pokémon
**TypeScript Features:** `Readonly<T>`, `Object.freeze()`, `ReturnType<T>`, `Partial<T>`

#### Overview
Snapshot and restore battle state without exposing the battle's internals. The Memento is immutable — once saved, it cannot be changed.

#### TypeScript Features

- **`Readonly<T>` and `Object.freeze()`** — use both together on saved snapshots: `return Object.freeze({ ...state }) as Readonly<BattleState>`. `Readonly<T>` is a compile-time check — TypeScript will error if you try to assign to a field. `Object.freeze()` is a runtime check — it throws in strict mode if you try to mutate the object. Together they enforce immutability at both levels
- **`ReturnType<T>`** — derive `type BattleSnapshot = ReturnType<Battle["save"]>` instead of writing the type manually. `ReturnType` extracts the return type of any function or method. If `save()` ever changes its return type, `BattleSnapshot` updates automatically — no manual sync required
- **`Partial<T>`** — type the `restorePartial` parameter as `Partial<BattleState>`. `Partial<T>` makes every field of `T` optional, letting callers pass a subset of fields to restore without providing all of them

#### Requirements

- Define `BattleState` interface: `turn: number`, `playerHP: number`, `opponentHP: number`, `playerStatus: string`, `opponentStatus: string`, `activeEffects: string[]`
- Create `Battle` (Originator):
  - `save(): Readonly<BattleState>` — returns `Object.freeze({ ...currentState })` so the memento is frozen at both type and runtime levels
  - `restore(state: Readonly<BattleState>): void`
  - `restorePartial(state: Partial<BattleState>): void` — only overwrites provided fields using `Object.assign(this, state)`
  - `simulateTurn(action: string): void`
  - `printState(): void`
- Derive `type BattleSnapshot = ReturnType<Battle["save"]>` and use it as the type for the history stack
- Create `BattleHistory` (Caretaker): `private history: BattleSnapshot[]`; `push`, `pop`, `peek`, `size`

#### Tests

```typescript
// memento.test.ts
describe("Pokémon Battle Memento", () => {
  let battle: Battle;
  let history: BattleHistory;

  beforeEach(() => {
    battle = new Battle(100, 100);
    history = new BattleHistory();
  });

  it("save returns a snapshot with correct HP values", () => {
    const snap = battle.save();
    expect(snap.playerHP).toBe(100);
    expect(snap.opponentHP).toBe(100);
  });

  it("saved snapshot is immutable at runtime via Object.freeze", () => {
    const snap = battle.save();
    expect(() => { (snap as any).playerHP = 999; }).toThrow();
  });

  it("restore reverts battle to saved state", () => {
    const snap = battle.save();
    battle.simulateTurn("attack");
    battle.restore(snap);
    expect(battle.playerHP).toBe(snap.playerHP);
  });

  it("BattleHistory push and pop work correctly", () => {
    history.push(battle.save());
    expect(history.size()).toBe(1);
    history.pop();
    expect(history.size()).toBe(0);
  });

  it("peek does not remove the snapshot", () => {
    history.push(battle.save());
    history.peek();
    expect(history.size()).toBe(1);
  });

  it("restorePartial only updates provided fields", () => {
    battle.simulateTurn("attack");
    const originalOpponentHP = battle.opponentHP;
    battle.restorePartial({ playerHP: 100 });
    expect(battle.playerHP).toBe(100);
    expect(battle.opponentHP).toBe(originalOpponentHP);
  });
});
```

#### Stretch Goals
- Add a redo stack so you can move forward again after restoring
- Cap history at 5 entries, discarding the oldest automatically
- Add `labelledSave(label: string): void` backed by `Map<string, BattleSnapshot>`

#### What You're Practicing
- Snapshotting and restoring object state immutably
- `Readonly<T>` and `Object.freeze()` as complementary compile-time and runtime immutability tools
- Deriving types from existing code with `ReturnType`

---

### 11. Template Method — RuneScape Boss Encounter

**Pattern:** Template Method
**Difficulty:** ⭐⭐ Intermediate
**Theme:** RuneScape
**TypeScript Features:** `protected abstract`, `readonly abstract`, hook methods

#### Overview
Define a fixed boss fight skeleton in an abstract base class; each boss overrides only its unique steps.

#### TypeScript Features

- **`protected abstract` methods** — declare `protected abstract spawnBoss(): void`. `protected` means external callers cannot call `spawnBoss()` directly — only the base class's `start()` method calls it. `abstract` means every subclass must implement it or TypeScript will produce a compile error. Together they enforce the Template Method contract: the skeleton is fixed, but the steps are swappable
- **`readonly abstract` fields** — declare `readonly abstract name: string` and `readonly abstract maxHp: number`. Subclasses must provide these values, and once set they cannot be changed — `readonly` prevents any code from reassigning them after construction
- **Hook methods** — declare `protected onPhaseChange(phase: string): void {}` with an empty body. Unlike `abstract` methods, hooks are optional — subclasses may override them if they need to react to phase changes, but they do not have to. This is how the Template Method pattern supports both mandatory and optional customisation points

#### Requirements

- Create `abstract class BossEncounter`:
  - `readonly abstract name: string`
  - `readonly abstract maxHp: number`
  - `protected hp: number` — set to `maxHp` in the constructor
  - `protected abstract spawnBoss(): void`
  - `protected abstract handlePhaseTransitions(): void`
  - `protected abstract distributeLoot(): void`
  - `protected runCombatLoop(): void` — default logs `"Combat in progress..."`; subclasses may override
  - `protected onDeath(): void` — default logs `"The boss has been defeated!"`; increments `deathCount`
  - `protected onPhaseChange(phase: string): void {}` — empty hook; subclasses may override
  - `deathCount: number = 0`
  - Concrete `start(): void` — calls all steps in order; document it as non-overridable
- Create `ZulrahEncounter` (500 HP), `VorkathEncounter` (750 HP), `GiantMoleEncounter` (200 HP — overrides `runCombatLoop`)

#### Tests

```typescript
// template-method.test.ts
describe("RuneScape Boss Template Method", () => {
  it("ZulrahEncounter has correct name", () => {
    expect(new ZulrahEncounter().name).toBe("Zulrah");
  });

  it("VorkathEncounter has correct maxHp", () => {
    expect(new VorkathEncounter().maxHp).toBe(750);
  });

  it("GiantMoleEncounter has correct maxHp", () => {
    expect(new GiantMoleEncounter().maxHp).toBe(200);
  });

  it("start() runs without throwing for Zulrah", () => {
    expect(() => new ZulrahEncounter().start()).not.toThrow();
  });

  it("start() runs without throwing for Vorkath", () => {
    expect(() => new VorkathEncounter().start()).not.toThrow();
  });

  it("start() runs without throwing for Giant Mole", () => {
    expect(() => new GiantMoleEncounter().start()).not.toThrow();
  });

  it("deathCount increments after each start()", () => {
    const boss = new ZulrahEncounter();
    boss.start();
    boss.start();
    expect(boss.deathCount).toBe(2);
  });
});
```

#### Stretch Goals
- Add `protected preFight(): void {}` hook called before `spawnBoss`
- Try instantiating `BossEncounter` directly and observe the compile error
- Add `getStats(): BossEncounterStats` returning kill count, total loot value, etc.

#### What You're Practicing
- Defining a fixed algorithm skeleton with swappable steps
- The Hollywood Principle — the base class calls subclass methods, not the other way around
- The difference between `abstract` (must override) and hook (may override) methods

---

## Quick Reference

| # | Pattern | Category | Theme | TypeScript Feature |
|---|---------|----------|-------|--------------------|
| 1 | Abstract Factory | Creational | Pokémon | `const enum`, optional `?`, `?.` |
| 2 | Prototype | Creational | RuneScape | `Readonly<T>`, `readonly`, `Pick<T,K>` |
| 3 | Adapter | Structural | Pokémon | Type aliases, `&`, `as` |
| 4 | Bridge | Structural | RuneScape | `abstract`, `protected`, constructor shorthand |
| 5 | Flyweight | Structural | RuneScape | `as const`, `keyof typeof`, index signatures |
| 6 | Proxy | Structural | Pokémon | `get`/`set`, `#` fields, `!` assertion |
| 7 | Chain of Responsibility | Behavioral | RuneScape | Discriminated unions, `switch`, `never` |
| 8 | Iterator | Behavioral | Pokémon | `T extends object`, `function*`, `Symbol.iterator` |
| 9 | Mediator | Behavioral | RuneScape | `satisfies`, template literal types, `Extract` |
| 10 | Memento | Behavioral | Pokémon | `Readonly<T>`, `Object.freeze`, `ReturnType`, `Partial` |
| 11 | Template Method | Behavioral | RuneScape | `protected abstract`, `readonly abstract`, hooks |
