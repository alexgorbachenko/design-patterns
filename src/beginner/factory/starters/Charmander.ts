import { Pokemon } from "../PokemonFactory";
import { PokemonType } from "../PokemonTypes";
import { StarterPokemon } from "./StarterPokemon";

export class Charmander implements Pokemon {
    name: string;
    hp: number;
    type: PokemonType;
    attackPower: number;

    constructor(){
        this.name = StarterPokemon.Charmander;
        this.hp = 39;
        this.type = PokemonType.Fire;
        this.attackPower = 52;
    }

    attack = () => {
        console.log(`${this.name} used Ember! It deals ${this.attackPower} damage.`);
    }
}