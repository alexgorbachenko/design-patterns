import { PokemonType } from "./PokemonTypes";
import { StarterPokemon } from "./StarterPokemon";
import { PokemonBase } from "./PokemonBase";

export class Squirtle extends PokemonBase {
    name: string;
    hp: number;
    type: PokemonType;
    attackPower: number;

    constructor(){
        super();
        this.name = StarterPokemon.Squirtle;
        this.hp = 44;
        this.type = PokemonType.Water;
        this.attackPower = 48;
    }

    attack = () => {
        console.log(`${this.name} used Water Blast! It deals ${this.attackPower} damage.`);
    }
}