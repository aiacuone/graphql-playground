import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
} from '@apollo/client';

// Apollo Client setup
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

// Define the fragment and query
const PERSON_FRAGMENT = gql`
  fragment personFields on Person {
    id
    name
    email
    age
  }
`;

const GET_PERSON = gql`
  ${PERSON_FRAGMENT}
  query GetPerson($id: ID!) {
    person(id: $id) {
      ...personFields
      address {
        city
        country
      }
    }
  }
`;

function Person({ id }) {
  const { loading, error, data } = useQuery(GET_PERSON, { variables: { id } });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const { person } = data;
  return (
    <div>
      <h2>{person.name}</h2>
      <p>Email: {person.email}</p>
      <p>Age: {person.age}</p>
      <p>
        City: {person.address.city}, {person.address.country}
      </p>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>GraphQL Person Query with Fragment</h1>
        <Person id="1" />
      </div>
    </ApolloProvider>
  );
}

export default App;
