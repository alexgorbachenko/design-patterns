import { PokemonType } from "./PokemonTypes";
import { Bulbasaur } from "./starters/Bulbasaur";
import { Charmander } from "./starters/Charmander";
import { Squirtle } from "./starters/Squirtle";
import { StarterPokemon } from "./starters/StarterPokemon";

export interface Pokemon {
    name: string;
    type: PokemonType;
    hp: number;
    attackPower: number;
}

export class PokemonFactory {
    static create(name: string): Pokemon {
        let pokemon: Pokemon;
        switch(name){
            case StarterPokemon.Charmander: {
                pokemon = new Charmander();
                break;
            }
            case StarterPokemon.Squirtle: {
                pokemon = new Squirtle();
                break;
            }
            case StarterPokemon.Bulbasaur: {
                pokemon = new Bulbasaur();
                break;
            }
            default:
                throw new Error(`Unknown Pokemon: ${name}`);
        }

        return pokemon;
    }
}