# GoF Design Pattern Examples

Real-world examples of all 23 Gang of Four design patterns, themed around RuneScape and Pokémon.

---

## Creational Patterns

### Factory Method
You're building a Pokémon game and need to create different Pokémon based on which starter the player picks. Instead of scattering `new Charmander()` calls everywhere, a `PokemonFactory.create("Charmander")` centralizes creation so adding a new Pokémon never requires changing existing code.

### Builder
A RuneScape character creator lets players customize their account step by step — username, combat style, starting skills, and tutorial island choices. A `CharacterBuilder` assembles all of this incrementally and only produces the final `Character` object once every required field is filled.

### Singleton
RuneScape's game server has one global `WorldConfig` that stores the current world number, player cap, and whether it's a members world. Every part of the codebase needs access to it, but there should only ever be one — a Singleton ensures no two conflicting configs exist simultaneously.

### Abstract Factory
Your Pokémon game supports two generations — Kanto and Johto — and each generation has its own set of related objects: starters, gyms, and rival characters. An `AbstractPokemonFactory` ensures that when you pick Johto, you consistently get Johto starters, Johto gyms, and a Johto rival — never a mix from different generations.

### Prototype
In RuneScape, enemies like Goblins are spawned hundreds of times across the world. Rather than constructing each one from scratch, you create one fully configured `Goblin` prototype and clone it whenever a new one is needed, saving the overhead of repeated initialization.

---

## Structural Patterns

### Decorator
A RuneScape player's attack can be wrapped with layers of equipment bonuses. A base `Attack` object gets wrapped by `DragonWeaponAttack`, then `PrayerBoostAttack`, then `PotionBoostAttack` — each decorator adds its bonus on top of the last without modifying the underlying attack logic.

### Composite
A Pokémon trainer's bag contains individual items (Potion, Pokéball) and sub-bags (Medicine Pocket, Battle Pocket) that themselves contain items. Both individual items and pockets implement the same `BagItem` interface, so `getTotalWeight()` works the same way regardless of nesting depth.

### Facade
Initiating a Pokémon trade involves verifying both players are connected, checking neither Pokémon is holding a banned item, validating the trade is fair, and updating both inventories. A `TradeFacade.executeTrade(player1, player2)` hides all of that complexity behind one clean call.

### Adapter
You want to use a third-party Pokémon stats API in your app, but it returns data in a completely different shape than your internal `Pokemon` interface expects. An `ExternalApiAdapter` wraps the third-party response and translates it into your internal format without touching either side.

### Bridge
A RuneScape spell can be cast with different weapons (Staff, Wand, Tome) and across different spell books (Standard, Ancient, Arceuus). The Bridge pattern separates the spell abstraction from the weapon implementation so any combination works without creating a class for every pairing.

### Flyweight
A RuneScape world renders thousands of `GrassTile` objects simultaneously. Since every grass tile shares the same texture, color, and properties, a Flyweight stores that shared data once and each tile only stores its unique position — massively reducing memory usage.

### Proxy
A Pokémon's full move data — animations, sound effects, detailed descriptions — is expensive to load. A `MoveProxy` sits in front of the real `Move` object and only loads the full data when the move is actually used in battle, keeping startup time fast.

---

## Behavioral Patterns

### Observer
When a Pokémon faints in battle, several things need to happen: the UI updates, the opponent gains XP, an achievement tracker checks for a badge, and the battle log records the event. Each of these is an observer subscribed to the `PokemonFainted` event, and none of them need to know about each other.

### Strategy
A RuneScape bot can train combat using different strategies — `AggressiveStrategy` (max damage), `DefensiveStrategy` (minimize damage taken), or `EfficientStrategy` (best XP per hour). The `CombatTrainer` class accepts any strategy and delegates to it, so switching training styles never requires changing the trainer itself.

### Command
A RuneScape macro tool records player actions — teleport, eat food, cast spell — as command objects that can be queued, replayed, and undone. The action queue doesn't need to know what each command does, just that it can call `execute()` on it.

### State
A Pokémon in battle behaves differently depending on its status condition. When `Poisoned`, it loses HP each turn. When `Asleep`, it skips its turn. When `Paralyzed`, it has a chance of being unable to move. Each status is a state object rather than a tangle of `if/else` checks inside the Pokémon class.

### Chain of Responsibility
When a RuneScape player takes damage, several handlers check it in sequence: first the `OverheadPrayerHandler` (is the player praying against this attack type?), then the `EliteVoidHandler` (are they wearing the right armor?), then the `AbsorptionPotionHandler` (do they have absorption charges?). Each handler either reduces the damage or passes it to the next.

### Iterator
A Pokémon PC box stores Pokémon in a grid. An `Iterator` lets you loop through every Pokémon in the box without knowing whether the underlying data structure is an array, a map, or something else — you just call `next()` until `hasNext()` returns false.

### Mediator
In a RuneScape clan chat, players, the chat system, the rank checker, and the mute system all need to interact. Instead of each component talking directly to every other one, they all communicate through a `ClanChatMediator` that coordinates messages, enforces ranks, and applies mutes in one place.

### Memento
A Pokémon battle simulator lets you save the exact state of a battle — both Pokémon's HP, active effects, turn count — before a risky move, then restore it if you want to try a different strategy. The `BattleMemento` stores a snapshot of state without exposing the internal details of the battle to the outside.

### Template Method
Every RuneScape boss fight follows the same skeleton: spawn the boss, run the fight loop, check for phase transitions, handle death, and distribute loot. A `BossEncounter` abstract class defines this sequence, and each concrete boss (Zulrah, Vorkath, Inferno) overrides only the steps that are unique to them.

### Visitor
A RuneScape item analysis tool needs to calculate value, weight, and alch profit for every item in a player's inventory — but each item type (weapon, food, rune) calculates these differently. A `Visitor` separates the analysis logic from the item classes, so adding a new analysis (e.g. street price) never requires modifying any item class.

### Interpreter
A RuneScape plugin system lets advanced users write simple trigger scripts like `IF hp < 50 THEN eat shark`. An `Interpreter` parses and evaluates this mini-language, turning each token into an object that can be executed against the current game state.

---

## Quick Reference

| Pattern | Category | Theme | One-Line Summary |
|---|---|---|---|
| Factory Method | Creational | Pokémon | Centralize object creation behind a single method |
| Builder | Creational | RuneScape | Assemble complex objects step by step |
| Singleton | Creational | RuneScape | Ensure only one instance of an object exists |
| Abstract Factory | Creational | Pokémon | Create families of related objects consistently |
| Prototype | Creational | RuneScape | Clone existing objects instead of rebuilding them |
| Decorator | Structural | RuneScape | Layer behavior on top of objects without changing them |
| Composite | Structural | Pokémon | Treat individual objects and groups uniformly |
| Facade | Structural | Pokémon | Simplify a complex subsystem behind one clean interface |
| Adapter | Structural | Pokémon | Translate one interface into another |
| Bridge | Structural | RuneScape | Separate abstraction from implementation |
| Flyweight | Structural | RuneScape | Share common data across many objects to save memory |
| Proxy | Structural | Pokémon | Control access to an object, e.g. for lazy loading |
| Observer | Behavioral | Pokémon | Notify multiple objects when something changes |
| Strategy | Behavioral | RuneScape | Swap algorithms at runtime without changing the caller |
| Command | Behavioral | RuneScape | Encapsulate actions as objects that can be queued and undone |
| State | Behavioral | Pokémon | Change an object's behavior based on its internal state |
| Chain of Responsibility | Behavioral | RuneScape | Pass a request through a chain of handlers |
| Iterator | Behavioral | Pokémon | Traverse a collection without knowing its structure |
| Mediator | Behavioral | RuneScape | Centralise communication between objects |
| Memento | Behavioral | Pokémon | Snapshot and restore an object's state |
| Template Method | Behavioral | RuneScape | Define a fixed algorithm skeleton with swappable steps |
| Visitor | Behavioral | RuneScape | Add new operations to objects without modifying them |
| Interpreter | Behavioral | RuneScape | Parse and execute a simple language or rule set |
