// Integração GraphQL para indexação de eventos
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://graphql-beta.mainnet.sui.io',
  cache: new InMemoryCache(),
});

// Query para listar círculos criados
export const GET_CIRCLES = gql`
  query GetCircles($first: Int!, $after: String) {
    events(
      filter: {
        eventType: "creator_circles::circle_core::CircleCreated"
      }
      first: $first
      after: $after
    ) {
      nodes {
        sendingModule {
          package
          module
          name
        }
        json
        timestamp
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
