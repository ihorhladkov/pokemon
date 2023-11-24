import { useQuery } from "@tanstack/react-query";
import { Inter } from "next/font/google";
import { trpc } from "../utils/trpc";
import { getOptionForVote, getRandomPokemon } from "../utils/getRandomPokemon";
import { useState } from "react";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  firstPokemonId: number;
  secondPokemonId: number;
}

export default function Home(props: Props) {
  const [ids, updateIds] = useState(() => getOptionForVote());
  const [firstPokemonId, secondPokemonId] = ids;

  const { data: firstPokemon, isLoading: firstPokemonIsLoading } =
    trpc.getPokemonById.useQuery({
      id: +firstPokemonId,
    });
  const { data: secondPokemon, isLoading: secondPokemonIsLoading } =
    trpc.getPokemonById.useQuery({
      id: +secondPokemonId,
    });

  const { mutate: voteMutate } = trpc.voteCast.useMutation();

  const onVoteRoundest = (selected: number) => {
    if (selected === firstPokemonId) {
      voteMutate({ votedFor: firstPokemonId, votedAgainst: secondPokemonId });
    } else {
      voteMutate({ votedFor: secondPokemonId, votedAgainst: firstPokemonId });
    }
    updateIds(getOptionForVote());
  };

  if (firstPokemonIsLoading || secondPokemonIsLoading) {

    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is Rounder?</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        {!firstPokemonIsLoading &&
          firstPokemon &&
          !secondPokemonIsLoading &&
          secondPokemon && (
            <>
              <PokemonListing
                nickname={firstPokemon.nickname}
                sprites={firstPokemon.spritesUrl}
                vote={() => onVoteRoundest(firstPokemonId)}
              />
              <div className="p-8">VS</div>
              <PokemonListing
                nickname={secondPokemon.nickname}
                sprites={secondPokemon.spritesUrl}
                vote={() => onVoteRoundest(secondPokemonId)}
              />
            </>
          )}
      </div>
    </div>
  );
}

interface PropsPokemon {
  nickname: string;
  sprites: string | null;
  vote: () => void;
}

export const PokemonListing: React.FC<PropsPokemon> = ({
  nickname,
  sprites,
  vote,
}) => {
  return (
    <div>
      <Image width={100} height={100} alt="Pokemon Ebalo" src={`${sprites}`} />
      <div className="text-xl text-center capitalize">{nickname}</div>
      <button
        className="bg-blue-500 w-full mx-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
