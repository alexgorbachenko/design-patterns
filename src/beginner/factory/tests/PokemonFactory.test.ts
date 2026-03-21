import { expect, test } from '@jest/globals';
import { PokemonFactory } from '../PokemonFactory';
import { StarterPokemon } from '../starters/StarterPokemon';
import { PokemonType } from '../PokemonTypes';

test('Creates Charmander correctly', () => {
    const charmander = PokemonFactory.create(StarterPokemon.Charmander);
    expect(charmander).toBeDefined;
    expect(charmander.name).toBe(StarterPokemon.Charmander);
    expect(charmander.type).toBe(PokemonType.Fire);
    expect(charmander.hp).toBe(39);
    expect(charmander.attackPower).toBe(52);
});

test('Creates Squirtle correctly', () => {
    const squirtle = PokemonFactory.create(StarterPokemon.Squirtle);
    expect(squirtle).toBeDefined;
    expect(squirtle.name).toBe(StarterPokemon.Squirtle);
    expect(squirtle.type).toBe(PokemonType.Water);
    expect(squirtle.hp).toBe(44);
    expect(squirtle.attackPower).toBe(48);
});

test('Creates Bulbasaur correctly', () => {
    const bulbasaur = PokemonFactory.create(StarterPokemon.Bulbasaur);
    expect(bulbasaur).toBeDefined;
    expect(bulbasaur.name).toBe(StarterPokemon.Bulbasaur);
    expect(bulbasaur.type).toBe(PokemonType.Grass);
    expect(bulbasaur.hp).toBe(45);
    expect(bulbasaur.attackPower).toBe(49);
});

test('Throws error when invalid Pokemon', () => {
    expect(() => PokemonFactory.create('Test')).toThrow('Unknown Pokemon: Test');
});