import React from "react";
import { prisma } from "../../server/utils/prisma";
import { inferAsyncReturnType } from "@trpc/server";
import { GetServerSideProps } from "next";
import Image from "next/image";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      votedFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          votedFor: true,
          votedAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryResults = inferAsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResults[number]) => {
  const { votedFor, votedAgainst } = pokemon._count;
  if (votedFor + votedAgainst === 0) return 0;
  return (votedFor / (votedFor + votedAgainst)) * 100;
};

const PokemonListing: React.FC<{ pokemon: PokemonQueryResults[number] }> = ({
  pokemon,
}) => {
  return (
    <div className="flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
        <Image
          src={pokemon.spriteUrl}
          width={64}
          height={64}
          layout="fixed"
          alt="234"
        />
        <div className="capitalize">{pokemon.name}</div>
      </div>
      <div className="pr-4">
        {generateCountPercent(pokemon).toFixed() + "%"}
      </div>
    </div>
  );
};

export const Results: React.FC<{
  pokemon: PokemonQueryResults;
}> = (props) => {
  return (
    <div className="flex flex-col items-center pt-20">
      <h2 className="text-2xl">Results</h2>
      <div className="p-2" />
      <div className="flex flex-col w-full max-w-2xl border">
        {props.pokemon
          .sort((a, b) => generateCountPercent(b) - generateCountPercent(a))
          .map((currentPokemon, index) => {
            return <PokemonListing pokemon={currentPokemon} key={index} />;
          })}
      </div>
    </div>
  );
};

export default Results;

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();

  return {
    props: {
      pokemon: pokemonOrdered,
    },
    revalidate: 60,
  };
};
