import { SourceNodesArgs, GatsbyGraphQLType } from 'gatsby';
import { Schemas, TypePath } from './types';
/**
 * Converts an object mapping custom type API IDs to JSON schemas to an array
 * of GraphQL type definitions. The result is intended to be called with
 * Gatsby's `createTypes` action.
 *
 * @param schemas An object mapping custom type API IDs to JSON schemas.
 *
 * @returns An array of GraphQL type definitions.
 */
export declare const schemasToTypeDefs: (schemas: Schemas, gatsbyContext: SourceNodesArgs) => {
    typeDefs: GatsbyGraphQLType[];
    typePaths: TypePath[];
};
