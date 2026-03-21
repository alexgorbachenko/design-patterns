import { Pokemon } from "../PokemonFactory";
import { PokemonType } from "../PokemonTypes";
import { StarterPokemon } from "./StarterPokemon";

export class Bulbasaur implements Pokemon {
    name: string;
    hp: number;
    type: PokemonType;
    attackPower: number;

    constructor(){
        this.name = StarterPokemon.Bulbasaur;
        this.hp = 45;
        this.type = PokemonType.Grass;
        this.attackPower = 49;
    }

    attack = () => {
        console.log(`${this.name} used Leaf Blade! It deals ${this.attackPower} damage.`);
    }
}