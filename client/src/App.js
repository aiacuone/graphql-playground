import React from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
} from '@apollo/client'

// Apollo Client setup
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
})

// Define the fragment and query
const PERSON_FRAGMENT = gql`
  fragment personFields on Person {
    id
    name
    email
    age
    address {
      city
      country
    }
  }
`

const GET_PERSON = gql`
  ${PERSON_FRAGMENT}
  query GetPerson($id: ID!) {
    person(id: $id) {
      ...personFields
    }
  }
`

const GET_ALL_PEOPLE = gql`
  ${PERSON_FRAGMENT}
  query GetAllPeople {
    people {
      ...personFields
    }
  }
`

function Person({ id }) {
  const { loading, error, data } = useQuery(GET_PERSON, { variables: { id } })
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  const { person } = data
  return (
    <div>
      <h2>{person.name}</h2>
      <p>Email: {person.email}</p>
      <p>Age: {person.age}</p>
      <p>
        City: {person.address.city}, {person.address.country}
      </p>
    </div>
  )
}

function PeopleList() {
  const { loading, error, data } = useQuery(GET_ALL_PEOPLE)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <h2>All People</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem',
        }}
      >
        {data.people.map((person) => (
          <div
            key={person.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            <h3>{person.name}</h3>
            <p>Email: {person.email}</p>
            <p>Age: {person.age}</p>
            <p>
              Location: {person.address.city}, {person.address.country}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>GraphQL Person Query with Fragment</h1>
        <div style={{ marginBottom: '2rem' }}>
          <h2>Single Person</h2>
          <Person id="1" />
        </div>
        <PeopleList />
      </div>
    </ApolloProvider>
  )
}

export default App
