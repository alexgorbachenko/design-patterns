import { expect, test } from '@jest/globals';
import { PokemonFactory } from './PokemonFactory';
import { StarterPokemon } from './starter-pokemon/StarterPokemon';
import { PokemonType } from './starter-pokemon/PokemonTypes';

test('Creates Charmander correctly', () => {
    const charmander = PokemonFactory.create(StarterPokemon.Charmander);
    expect(charmander).toBeDefined;
    expect(charmander.name).toBe(StarterPokemon.Charmander);
    expect(charmander.type).toBe(PokemonType.Fire);
    expect(charmander.hp).toBe(39);
    expect(charmander.attackPower).toBe(52);
    expect(charmander.isAlive()).toBeTruthy;
});

test('Creates Squirtle correctly', () => {
    const squirtle = PokemonFactory.create(StarterPokemon.Squirtle);
    expect(squirtle).toBeDefined;
    expect(squirtle.name).toBe(StarterPokemon.Squirtle);
    expect(squirtle.type).toBe(PokemonType.Water);
    expect(squirtle.hp).toBe(44);
    expect(squirtle.attackPower).toBe(48);
    expect(squirtle.isAlive()).toBeTruthy;
});

test('Creates Bulbasaur correctly', () => {
    const bulbasaur = PokemonFactory.create(StarterPokemon.Bulbasaur);
    expect(bulbasaur).toBeDefined;
    expect(bulbasaur.name).toBe(StarterPokemon.Bulbasaur);
    expect(bulbasaur.type).toBe(PokemonType.Grass);
    expect(bulbasaur.hp).toBe(45);
    expect(bulbasaur.attackPower).toBe(49);
    expect(bulbasaur.isAlive()).toBeTruthy;
});

test('IsAlive false when HP is 0 or less', () => {
    const bulbasaur = PokemonFactory.create(StarterPokemon.Bulbasaur);
    bulbasaur.defend(50);
    expect(bulbasaur.isAlive()).toBeFalsy;
});

test('Throws error when invalid Pokemon', () => {
    expect(() => PokemonFactory.create('Test')).toThrow('Unknown Pokemon: Test');
});

test('Returns a different instance each call', () => {
    const a = PokemonFactory.create(StarterPokemon.Charmander);
    const b = PokemonFactory.create(StarterPokemon.Charmander);
    expect(a).not.toBe(b);
});

test("logs an attack message without throwing", () => {
    const p = PokemonFactory.create(StarterPokemon.Charmander);
    expect(() => p.attack()).not.toThrow();
});