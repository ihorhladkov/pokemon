
import { Inter } from "next/font/google";
import { trpc } from "../utils/trpc";
import { getOptionForVote } from "../utils/getRandomPokemon";
import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

// interface Props {
//   firstPokemonId: number;
//   secondPokemonId: number;
// }

export default function Home() {
  const [ids, updateIds] = useState(() => getOptionForVote());
  const [firstPokemonId, secondPokemonId] = ids;

  const { mutate: voteMutate } = trpc.voteCast.useMutation();

  const onVoteRoundest = (selected: number) => {
    if (selected === firstPokemonId) {
      voteMutate({ votedFor: firstPokemonId, votedAgainst: secondPokemonId });
    } else {
      voteMutate({ votedFor: secondPokemonId, votedAgainst: firstPokemonId });
    }
    updateIds(getOptionForVote());
  };

  return (
    <>
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is Rounder?</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 grid grid-cols-3 items-center justify-center w-[400px] h-[300px]  max-w-2xl">
        <Suspense fallback={<p>Loading...</p>}>
          <PokemonListing
            pokemonId={firstPokemonId}
            vote={() => onVoteRoundest(firstPokemonId)}
          />
        </Suspense>
        <div className="mx-auto p-8">VS</div>
        <Suspense fallback={<p>Loading...</p>}>
          <PokemonListing
            pokemonId={secondPokemonId}
            vote={() => onVoteRoundest(secondPokemonId)}
          />
        </Suspense>
      </div>
    </div>
    </>
  );
}

interface PropsPokemon {
  pokemonId: number;
  vote: () => void;
}

export const PokemonListing: React.FC<PropsPokemon> = ({ pokemonId, vote }) => {
  const { data: pokemon } = trpc.getPokemonById.useQuery({
    id: +pokemonId,
  });

  return (
    <div>
      {pokemon ? (
        <>
          <Image
            width={100}
            height={100}
            alt="Pokemon"
            src={`${pokemon?.spritesUrl}`}
          />
          <div className="text-xl text-center capitalize">
            {pokemon?.nickname}
          </div>
        </>
      ) : (
        <>
          <div className="animate-pulse rounded-full bg-gray-600 h-[96px] w-full mb-1" />
          <div className="animate-pulse rounded-md bg-gray-600 h-[28px] w-full" />
        </>
      )}
      <button
        className="bg-blue-500 w-full mx-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1"
        onClick={vote}
      >
        Vote
      </button>
    </div>
  );
};

// export const getServerSideProps = () => {
//   const [firstPokemonId, secondPokemonId] = getOptionForVote();

//   return {
//     props: {
//       firstPokemonId,
//       secondPokemonId,
//     },
//   };
// };
