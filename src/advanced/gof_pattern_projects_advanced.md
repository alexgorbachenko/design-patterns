# GoF Design Pattern Projects — Advanced

A collection of TypeScript exercises for the 2 most advanced GoF patterns, themed around RuneScape. Tackle these after completing the beginner and intermediate sets.

---

## Setup

```bash
npm init -y
npm install typescript ts-node @types/node --save-dev
npx tsc --init
```

Run any file with `npx ts-node your-file.ts`.

---

## A Note on Difficulty

Visitor and Interpreter are the most conceptually demanding patterns in the entire GoF catalogue. Visitor requires comfort with double-dispatch and stable class hierarchies. Interpreter requires comfort with recursive object trees and grammar design. If either feels overwhelming, revisit the Composite and Command patterns first — both are direct foundations for what you'll build here.

---

## Behavioral Patterns

### 1. Visitor — RuneScape Item Analyser

**Pattern:** Visitor
**Difficulty:** ⭐⭐⭐ Advanced
**Theme:** RuneScape

#### Overview
A RuneScape item analysis tool needs to perform different operations on different item types — calculating alch value, computing weight, and estimating street price. Each item type (weapon, food, rune, armour) calculates these differently. The Visitor pattern lets you add new operations without modifying any item class.

#### Requirements

- Define an `ItemVisitor` interface with a visit method for each item type:
  - `visitWeapon(weapon: Weapon): void`
  - `visitFood(food: Food): void`
  - `visitRune(rune: Rune): void`
  - `visitArmour(armour: Armour): void`
- Define an `Item` interface with:
  - `name: string`
  - `accept(visitor: ItemVisitor): void`
- Create the following concrete item classes, each implementing `Item`:
  - `Weapon` — fields: `name`, `attackBonus: number`, `baseValue: number`; `accept()` calls `visitor.visitWeapon(this)`
  - `Food` — fields: `name`, `healAmount: number`, `baseValue: number`; `accept()` calls `visitor.visitFood(this)`
  - `Rune` — fields: `name`, `spellType: string`, `baseValue: number`; `accept()` calls `visitor.visitRune(this)`
  - `Armour` — fields: `name`, `defenceBonus: number`, `baseValue: number`; `accept()` calls `visitor.visitArmour(this)`
- Create the following concrete visitor classes implementing `ItemVisitor`:
  - `AlchValueVisitor` — logs the high alch value for each item type (weapons: `baseValue × 0.6`, food: `baseValue × 0.4`, runes: `baseValue × 1.0`, armour: `baseValue × 0.65`)
  - `WeightVisitor` — logs estimated carry weight per item type (weapons: 2.5kg, food: 0.5kg, runes: 0.0kg, armour: 5.0kg)
  - `StreetPriceVisitor` — logs an estimated Grand Exchange street price (`baseValue` × a type-specific multiplier of your choice)
- Create an `Inventory` class holding `Item[]` with a `runVisitor(visitor: ItemVisitor): void` method that calls `accept()` on every item

#### Stretch Goals
- Add a `TotalValueVisitor` that accumulates total alch value across all items and prints a grand total at the end
- Add a fifth item type `QuestItem` and update all three visitors to handle it
- Add a `FilteredInventory` subclass that only runs the visitor on items matching a predicate `(item: Item) => boolean`

#### What You're Practicing
- Adding new operations to a class hierarchy without modifying those classes
- The double-dispatch mechanism — `accept()` on the item calls back into the correct `visit` method on the visitor
- When Visitor is appropriate: stable class hierarchy, frequently changing operations

---

### 2. Interpreter — RuneScape Trigger Script Engine

**Pattern:** Interpreter
**Difficulty:** ⭐⭐⭐ Advanced
**Theme:** RuneScape

#### Overview
A RuneScape plugin system lets advanced players write simple trigger scripts to automate responses during gameplay — things like `IF hp < 50 THEN eat shark` or `IF prayer < 20 THEN drink prayer potion`. An Interpreter parses this mini-language and executes each rule against the current game state.

#### Requirements

- Define a `GameContext` interface representing the current game state:
  - `hp: number`, `maxHp: number`
  - `prayer: number`, `maxPrayer: number`
  - `inventory: string[]`
  - `log(message: string): void`
- Define an `Expression` interface with:
  - `interpret(context: GameContext): boolean` — evaluates a condition against the context
- Define an `Action` interface with:
  - `execute(context: GameContext): void` — performs an action against the context
- Create the following condition expression classes implementing `Expression`:
  - `HpBelowExpression` — constructor accepts `threshold: number`; returns `true` if `context.hp < threshold`
  - `PrayerBelowExpression` — constructor accepts `threshold: number`; returns `true` if `context.prayer < threshold`
  - `HasItemExpression` — constructor accepts `itemName: string`; returns `true` if inventory contains the item
  - `AndExpression` — constructor accepts two `Expression` objects; returns `true` only if both are true
  - `OrExpression` — constructor accepts two `Expression` objects; returns `true` if either is true
- Create the following action classes implementing `Action`:
  - `EatFoodAction` — constructor accepts `foodName: string`; removes the food from inventory and restores 20 HP (capped at `maxHp`); logs the action
  - `DrinkPotionAction` — constructor accepts `potionName: string`; removes the potion from inventory and restores 30 prayer (capped at `maxPrayer`); logs the action
- Create a `TriggerRule` class with:
  - Constructor accepts `condition: Expression` and `action: Action`
  - `evaluate(context: GameContext): void` — runs the action only if the condition returns `true`
- Create a `TriggerEngine` with:
  - `addRule(rule: TriggerRule): void`
  - `tick(context: GameContext): void` — evaluates all rules against the current context in order
- Demonstrate a simulated game loop that calls `tick()` each iteration with changing HP and prayer values, triggering rules automatically

#### Stretch Goals
- Add a `NotExpression` that inverts any condition
- Add a `CooldownAction` wrapper that prevents an action from firing more than once every N ticks
- Parse rules from plain strings like `"IF hp < 50 THEN eat shark"` using a simple string tokenizer

#### What You're Practicing
- Representing a grammar as a composable class hierarchy
- Building boolean logic from simple, nestable primitives
- The difference between Interpreter (executes a grammar) and Command (encapsulates a single action)

---

## Quick Reference

| # | Pattern | Category | Theme |
|---|---------|----------|-------|
| 1 | Visitor | Behavioral | RuneScape |
| 2 | Interpreter | Behavioral | RuneScape |
