import { PokemonType } from "../PokemonTypes";
import { StarterPokemon } from "./StarterPokemon";
import { PokemonBase } from "./PokemonBase";

export class Charmander extends PokemonBase {
    name: string;
    type: PokemonType;
    attackPower: number;
    hp: number;

    constructor(){
        super();
        this.name = StarterPokemon.Charmander;
        this.hp = 39;
        this.type = PokemonType.Fire;
        this.attackPower = 52;
    }

    attack = () => {
        console.log(`${this.name} used Ember! It deals ${this.attackPower} damage.`);
    }
}