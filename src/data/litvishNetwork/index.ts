/**
 * Single import surface for the Lithuanian-yeshiva network dataset.
 */
export type {
  Person,
  RelationshipEdge,
  EdgeType,
  Yeshiva,
  Board,
  BoardId,
  YeshivaRole,
  PersonYeshivaRole,
  NetworkData,
} from './types';

export { people } from './people';
export { edges } from './edges';
export { yeshivot, boards } from './yeshivot';
