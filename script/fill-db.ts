import { PokemonClient } from "pokenode-ts";

import { prisma } from "../src/server/utils/prisma";

export const fillDb = async () => {
  const pokeApi = new PokemonClient();
  const pokemons = await pokeApi.listPokemons(0, 493);

  const formatedPokemons = pokemons.results.map((pokemon, index) => ({
    id: index,
    name: pokemon.name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      index + 1
    }.png`,
  }));

  formatedPokemons.forEach(async (pokemon) => {
    const createPokemon = await prisma.pokemon.create({ data: { ...pokemon } });
  });
};

fillDb()
