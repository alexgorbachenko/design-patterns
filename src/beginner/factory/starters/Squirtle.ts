import { Pokemon } from "../PokemonFactory";
import { PokemonType } from "../PokemonTypes";
import { StarterPokemon } from "./StarterPokemon";

export class Squirtle implements Pokemon {
    name: string;
    hp: number;
    type: PokemonType;
    attackPower: number;

    constructor(){
        this.name = StarterPokemon.Squirtle;
        this.hp = 44;
        this.type = PokemonType.Water;
        this.attackPower = 48;
    }

    attack = () => {
        console.log(`${this.name} used Water Blast! It deals ${this.attackPower} damage.`);
    }
}