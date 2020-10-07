/**
 * Define data structure for API getRecentReactions
 **/

type ReactionTypeType = {};
export type GetRecentReactions = {
  recentReactions?: {
    reactionType?: ReactionTypeType[];
  };
};
