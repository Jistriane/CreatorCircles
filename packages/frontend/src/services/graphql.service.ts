// Integração GraphQL para indexação de eventos
import { gql } from '@apollo/client';

// ...existing code...

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
