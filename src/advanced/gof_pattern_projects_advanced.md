# GoF Design Pattern Projects — Advanced

TypeScript exercises for the 2 most advanced GoF patterns, themed around RuneScape. Each project includes a TypeScript features section, requirements that reference those features directly, and Jest test cases.

Tackle these after completing the beginner and intermediate sets. If Visitor or Interpreter feel overwhelming, revisit Composite and Command first — both are direct foundations for what you'll build here.

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

## TypeScript Features Introduced in This File

| Project | TypeScript Feature |
|---|---|
| Visitor | Conditional types, `infer`, overloaded function signatures |
| Interpreter | Generic recursive types, `as const` token definitions, type predicates `is` |

---

## Behavioral Patterns

### 1. Visitor — RuneScape Item Analyser

**Pattern:** Visitor
**Difficulty:** ⭐⭐⭐ Advanced
**Theme:** RuneScape
**TypeScript Features:** Conditional types, `infer`, overloaded function signatures

#### Overview
Add new analysis operations — alch value, weight, street price — to item classes without modifying them, using the double-dispatch Visitor pattern.

#### TypeScript Features

- **Conditional types** — define `type VisitReturnFor<V, I extends Item> = V extends { [K in \`visit\${Capitalize<string>}\`]: (...args: any[]) => infer R } ? R : never`. A conditional type uses the form `A extends B ? C : D` — if `A` is assignable to `B`, the type resolves to `C`, otherwise `D`. This lets you compute types based on relationships between other types, rather than hardcoding them
- **`infer` keyword** — used inside a conditional type to capture and name a type that TypeScript figures out during the check. In `(...args: any[]) => infer R`, the `infer R` binds whatever return type TypeScript finds to the name `R`, which can then be used in the true branch. Without `infer`, you cannot extract parts of a type from a pattern match
- **Overloaded function signatures** — define `runVisitorAndCollect` with separate overloads so TypeScript knows the return type varies by visitor: one overload returns `number[]` for `AlchValueVisitor`, another returns `number[]` for `WeightVisitor`. Overloads let you express that a function behaves differently depending on its argument types, making the return type statically known at each call site

#### Requirements

- Add a `kind` discriminant to every item: `kind: "weapon" | "food" | "rune" | "armour"`
- Define `ItemVisitor` interface with `visitWeapon(weapon: Weapon): void`, `visitFood(food: Food): void`, `visitRune(rune: Rune): void`, `visitArmour(armour: Armour): void`
- Define `Item` interface with `name: string`, `kind: string`, `accept(visitor: ItemVisitor): void`
- Create concrete item classes, each implementing `Item`:
  - `Weapon` — `kind: "weapon"`, `attackBonus: number`, `baseValue: number`; `accept()` calls `visitor.visitWeapon(this)`
  - `Food` — `kind: "food"`, `healAmount: number`, `baseValue: number`; `accept()` calls `visitor.visitFood(this)`
  - `Rune` — `kind: "rune"`, `spellType: string`, `baseValue: number`; `accept()` calls `visitor.visitRune(this)`
  - `Armour` — `kind: "armour"`, `defenceBonus: number`, `baseValue: number`; `accept()` calls `visitor.visitArmour(this)`
- Create three visitor classes implementing `ItemVisitor`:
  - `AlchValueVisitor` — weapons: `baseValue × 0.6`, food: `baseValue × 0.4`, runes: `baseValue × 1.0`, armour: `baseValue × 0.65`; exposes `onResult: (val: number) => void` callback for testability
  - `WeightVisitor` — weapons: 2.5kg, food: 0.5kg, runes: 0.0kg, armour: 5.0kg; exposes `onResult` callback
  - `StreetPriceVisitor` — `baseValue × a type-specific multiplier`; exposes `onResult` callback
- Create `Inventory` holding `Item[]`:
  - `runVisitor(visitor: ItemVisitor): void` — calls `accept()` on every item
  - Add overloaded signatures for `runVisitorAndCollect` that accepts a specific visitor type and returns a typed result array

#### Tests

```typescript
// visitor.test.ts
describe("RuneScape Item Visitor", () => {
  let sword: Weapon;
  let shark: Food;
  let fireRune: Rune;
  let platebody: Armour;
  let inventory: Inventory;

  beforeEach(() => {
    sword = new Weapon("Dragon Sword", 60, 1000);
    shark = new Food("Shark", 20, 200);
    fireRune = new Rune("Fire Rune", "Fire", 5);
    platebody = new Armour("Rune Platebody", 65, 800);
    inventory = new Inventory([sword, shark, fireRune, platebody]);
  });

  it("AlchValueVisitor does not throw on any item type", () => {
    expect(() => inventory.runVisitor(new AlchValueVisitor())).not.toThrow();
  });

  it("WeightVisitor does not throw on any item type", () => {
    expect(() => inventory.runVisitor(new WeightVisitor())).not.toThrow();
  });

  it("Weapon accept calls visitWeapon on the visitor", () => {
    const mock: ItemVisitor = {
      visitWeapon: jest.fn(), visitFood: jest.fn(),
      visitRune: jest.fn(), visitArmour: jest.fn()
    };
    sword.accept(mock);
    expect(mock.visitWeapon).toHaveBeenCalledWith(sword);
    expect(mock.visitFood).not.toHaveBeenCalled();
  });

  it("Food accept calls visitFood on the visitor", () => {
    const mock: ItemVisitor = {
      visitWeapon: jest.fn(), visitFood: jest.fn(),
      visitRune: jest.fn(), visitArmour: jest.fn()
    };
    shark.accept(mock);
    expect(mock.visitFood).toHaveBeenCalledWith(shark);
  });

  it("AlchValueVisitor computes weapon alch value as baseValue * 0.6", () => {
    const visitor = new AlchValueVisitor();
    const results: number[] = [];
    visitor.onResult = (val) => results.push(val);
    sword.accept(visitor);
    expect(results[0]).toBeCloseTo(600);
  });

  it("WeightVisitor returns 0 for a rune", () => {
    const visitor = new WeightVisitor();
    const results: number[] = [];
    visitor.onResult = (val) => results.push(val);
    fireRune.accept(visitor);
    expect(results[0]).toBe(0);
  });

  it("Inventory runVisitor calls accept on every item", () => {
    const mock: ItemVisitor = {
      visitWeapon: jest.fn(), visitFood: jest.fn(),
      visitRune: jest.fn(), visitArmour: jest.fn()
    };
    inventory.runVisitor(mock);
    expect(mock.visitWeapon).toHaveBeenCalledTimes(1);
    expect(mock.visitFood).toHaveBeenCalledTimes(1);
    expect(mock.visitRune).toHaveBeenCalledTimes(1);
    expect(mock.visitArmour).toHaveBeenCalledTimes(1);
  });
});
```

#### Stretch Goals
- Add `TotalValueVisitor` with `getTotal(): number` that accumulates across all items
- Add a fifth item `QuestItem` with `kind: "quest"` — observe TypeScript forcing you to update every `ItemVisitor` implementation immediately due to the interface contract
- Add `FilteredInventory` extending `Inventory` with `runVisitor(visitor, predicate: (item: Item) => boolean): void`

#### What You're Practicing
- Adding new operations to a class hierarchy without modifying those classes
- Double-dispatch — `accept()` on the item calls back into the correct `visit` method on the visitor
- Using conditional types and `infer` to make visitor return types statically known at each call site

---

### 2. Interpreter — RuneScape Trigger Script Engine

**Pattern:** Interpreter
**Difficulty:** ⭐⭐⭐ Advanced
**Theme:** RuneScape
**TypeScript Features:** Generic recursive types, `as const` token definitions, type predicates `is`

#### Overview
Parse and execute simple trigger scripts like `IF hp < 50 THEN eat shark` against the current game state, using composable expression and action objects.

#### TypeScript Features

- **Generic recursive types** — define `type ExpressionTree = LeafExpression | { op: "AND" | "OR"; left: ExpressionTree; right: ExpressionTree }`. A recursive type references itself in its own definition. TypeScript supports this as long as the recursion is through an object property (not directly). This models tree-shaped data at the type level — any valid expression tree is either a leaf or a compound node whose children are also expression trees
- **`as const` token definitions** — declare `const KEYWORDS = ["IF", "THEN", "AND", "OR", "NOT"] as const`. Without `as const`, TypeScript widens the type to `string[]`. With `as const`, it narrows to `readonly ["IF", "THEN", "AND", "OR", "NOT"]` — a tuple with exact literal types. You can then derive `type Keyword = typeof KEYWORDS[number]` to get the union `"IF" | "THEN" | "AND" | "OR" | "NOT"` directly from the array, with no duplication
- **Type predicates `is`** — declare `function isKeyword(token: string): token is Keyword`. A type predicate is a special return type that tells TypeScript: "if this function returns `true`, then the argument is of this narrower type." Inside an `if (isKeyword(token))` block, TypeScript automatically narrows `token` from `string` to `Keyword` — no casting required

#### Requirements

- Define `const KEYWORDS = ["IF", "THEN", "AND", "OR", "NOT"] as const`
- Derive `type Keyword = typeof KEYWORDS[number]` — never write the union type manually
- Define `GameContext` interface: `hp: number`, `maxHp: number`, `prayer: number`, `maxPrayer: number`, `inventory: string[]`, `log(message: string): void`
- Define `Expression` interface: `interpret(context: GameContext): boolean`
- Define `Action` interface: `execute(context: GameContext): void`
- Define the recursive type:
  ```
  type LeafExpression = { kind: "leaf"; expression: Expression }
  type CompoundExpression = { kind: "compound"; op: "AND" | "OR"; left: ExpressionTree; right: ExpressionTree }
  type ExpressionTree = LeafExpression | CompoundExpression
  ```
- Create condition expression classes implementing `Expression`:
  - `HpBelowExpression` — `interpret()` returns `context.hp < threshold`
  - `PrayerBelowExpression` — `interpret()` returns `context.prayer < threshold`
  - `HasItemExpression` — `interpret()` returns `context.inventory.includes(itemName)`
  - `AndExpression` — both sub-expressions must return `true`
  - `OrExpression` — either sub-expression must return `true`
  - `NotExpression` — inverts one sub-expression
- Create action classes implementing `Action`:
  - `EatFoodAction` — removes food from inventory, restores 20 HP capped at `maxHp`
  - `DrinkPotionAction` — removes potion, restores 30 prayer capped at `maxPrayer`
- Create `TriggerRule`: constructor accepts `condition: Expression` and `action: Action`; `evaluate(context): void` runs `action` only if `condition` is true
- Create `TriggerEngine`: `addRule`, `tick(context)`
- Write `function isKeyword(token: string): token is Keyword` using `(KEYWORDS as readonly string[]).includes(token)`; use it in a `tokenize(script: string): Array<Keyword | string>` function that classifies each token

#### Tests

```typescript
// interpreter.test.ts
describe("RuneScape Trigger Interpreter", () => {
  let ctx: GameContext;

  beforeEach(() => {
    ctx = {
      hp: 100, maxHp: 100, prayer: 100, maxPrayer: 100,
      inventory: ["Shark", "Prayer Potion"],
      log: jest.fn()
    };
  });

  it("HpBelowExpression returns true when hp < threshold", () => {
    ctx.hp = 40;
    expect(new HpBelowExpression(50).interpret(ctx)).toBe(true);
  });

  it("HpBelowExpression returns false when hp >= threshold", () => {
    ctx.hp = 80;
    expect(new HpBelowExpression(50).interpret(ctx)).toBe(false);
  });

  it("PrayerBelowExpression returns true when prayer < threshold", () => {
    ctx.prayer = 15;
    expect(new PrayerBelowExpression(20).interpret(ctx)).toBe(true);
  });

  it("HasItemExpression returns true when item is in inventory", () => {
    expect(new HasItemExpression("Shark").interpret(ctx)).toBe(true);
  });

  it("HasItemExpression returns false when item is absent", () => {
    expect(new HasItemExpression("Dragon Sword").interpret(ctx)).toBe(false);
  });

  it("AndExpression returns true only when both conditions are true", () => {
    ctx.hp = 40;
    expect(new AndExpression(new HpBelowExpression(50), new HasItemExpression("Shark")).interpret(ctx)).toBe(true);
  });

  it("AndExpression returns false when one condition is false", () => {
    ctx.hp = 80;
    expect(new AndExpression(new HpBelowExpression(50), new HasItemExpression("Shark")).interpret(ctx)).toBe(false);
  });

  it("OrExpression returns true when either condition is true", () => {
    ctx.hp = 80;
    expect(new OrExpression(new HpBelowExpression(50), new HasItemExpression("Shark")).interpret(ctx)).toBe(true);
  });

  it("NotExpression inverts the result", () => {
    expect(new NotExpression(new HpBelowExpression(50)).interpret(ctx)).toBe(true);
  });

  it("EatFoodAction restores HP and removes food", () => {
    ctx.hp = 50;
    new EatFoodAction("Shark").execute(ctx);
    expect(ctx.hp).toBeGreaterThan(50);
    expect(ctx.inventory).not.toContain("Shark");
  });

  it("DrinkPotionAction restores prayer and removes potion", () => {
    ctx.prayer = 50;
    new DrinkPotionAction("Prayer Potion").execute(ctx);
    expect(ctx.prayer).toBeGreaterThan(50);
    expect(ctx.inventory).not.toContain("Prayer Potion");
  });

  it("TriggerRule fires action when condition is true", () => {
    ctx.hp = 30;
    new TriggerRule(new HpBelowExpression(50), new EatFoodAction("Shark")).evaluate(ctx);
    expect(ctx.hp).toBeGreaterThan(30);
  });

  it("TriggerRule does not fire when condition is false", () => {
    ctx.hp = 99;
    new TriggerRule(new HpBelowExpression(50), new EatFoodAction("Shark")).evaluate(ctx);
    expect(ctx.inventory).toContain("Shark");
  });

  it("TriggerEngine evaluates all rules on tick", () => {
    ctx.hp = 30;
    ctx.prayer = 10;
    const engine = new TriggerEngine();
    engine.addRule(new TriggerRule(new HpBelowExpression(50), new EatFoodAction("Shark")));
    engine.addRule(new TriggerRule(new PrayerBelowExpression(20), new DrinkPotionAction("Prayer Potion")));
    engine.tick(ctx);
    expect(ctx.hp).toBeGreaterThan(30);
    expect(ctx.prayer).toBeGreaterThan(10);
  });

  it("isKeyword returns true for valid keywords", () => {
    expect(isKeyword("IF")).toBe(true);
    expect(isKeyword("THEN")).toBe(true);
  });

  it("isKeyword returns false for non-keywords", () => {
    expect(isKeyword("hp")).toBe(false);
    expect(isKeyword("shark")).toBe(false);
  });
});
```

#### Stretch Goals
- Write `parseRule(script: string): TriggerRule` that fully parses `"IF hp < 50 THEN eat shark"` using `tokenize` and `isKeyword`
- Add `CooldownAction` wrapping any `Action` and preventing it from firing more than once every N ticks
- Write `printTree(tree: ExpressionTree, depth: number = 0): void` that recursively prints the expression tree using the `kind` discriminant to distinguish leaves from compound nodes

#### What You're Practicing
- Representing a grammar as a composable class hierarchy
- Modelling recursive data structures at the type level with `ExpressionTree`
- Using type predicates to narrow types during parsing without casting

---

## Quick Reference

| # | Pattern | Category | Theme | TypeScript Feature |
|---|---------|----------|-------|--------------------|
| 1 | Visitor | Behavioral | RuneScape | Conditional types, `infer`, overloads |
| 2 | Interpreter | Behavioral | RuneScape | Recursive types, `as const`, type predicates `is` |
