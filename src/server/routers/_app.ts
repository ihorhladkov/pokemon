import { z } from "zod";
import { procedure, router } from "../trpc";
import { PokemonClient } from "pokenode-ts";
import {prisma} from '../utils/prisma'

export const appRouter = router({
  getPokemonById: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const getPokemon = await prisma.pokemon.findFirst({
        where: {id: input.id}
      })

      if (!getPokemon) {
        return
      }

      return {
        nickname: getPokemon.name,
        spritesUrl: getPokemon.spriteUrl,
      };
    }),
  voteCast: procedure
    .input(
      z.object({
        votedFor: z.number(),
        votedAgainst: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const voteInDb = await prisma?.vote.create({
        data: {
          votedAgainstId: input.votedAgainst,
          votedForId: input.votedFor,
        },
      });
      return { success: true };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
