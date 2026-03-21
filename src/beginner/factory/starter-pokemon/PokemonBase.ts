import { Pokemon } from "../PokemonFactory";
import { PokemonType } from "./PokemonTypes";

export abstract class PokemonBase implements Pokemon {
    abstract name: string;
    abstract type: PokemonType;
    abstract attackPower: number;
    abstract hp: number;

    abstract attack(): void;

    defend = (damage: number) => {
        this.hp -= damage;
        console.log(`${this.name} took ${damage} damage! Remaining HP: ${this.hp}`);
    }

    isAlive = () => {
        return this.hp > 0;
    };
}
