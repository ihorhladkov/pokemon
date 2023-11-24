const MAX_DEX_ID = 100;

export const getRandomPokemon = (notThisOne?: number): number => {
  const pokedexNumber = Math.floor(Math.random() * (MAX_DEX_ID - 1) + 1);

  if (pokedexNumber !== notThisOne) return pokedexNumber;
  return getRandomPokemon(notThisOne)
};

export const getOptionForVote = () => {
  const firstId = getRandomPokemon();
  const secondId = getRandomPokemon(firstId);

  return [firstId, secondId];
};
