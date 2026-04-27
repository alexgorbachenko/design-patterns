import { PokemonType } from "./PokemonTypes";
import { StarterPokemon } from "./StarterPokemon";
import { PokemonBase } from "./PokemonBase";

export class Bulbasaur extends PokemonBase {
    name: string;
    hp: number;
    type: PokemonType;
    attackPower: number;

    constructor(){
        super();
        this.name = StarterPokemon.Bulbasaur;
        this.hp = 45;
        this.type = PokemonType.Grass;
        this.attackPower = 49;
    }

    attack = () => {
        console.log(`${this.name} used Leaf Blade! It deals ${this.attackPower} damage.`);
    }
}