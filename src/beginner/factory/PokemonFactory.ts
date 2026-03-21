import { PokemonType } from "./starter-pokemon/PokemonTypes";
import { Bulbasaur } from "./starter-pokemon/Bulbasaur";
import { Charmander } from "./starter-pokemon/Charmander";
import { Squirtle } from "./starter-pokemon/Squirtle";
import { StarterPokemon } from "./starter-pokemon/StarterPokemon";

export interface Pokemon {
    name: string;
    type: PokemonType;
    hp: number;
    attackPower: number;
    attack: () => void;
    defend: (damage: number) => void;
    isAlive: () => boolean;
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