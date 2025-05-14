const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const cors = require('cors')

// Define a GraphQL schema with a Person type
const schema = buildSchema(`
  type Address {
    street: String
    city: String
    country: String
  }

  type Person {
    id: ID
    name: String
    age: Int
    email: String
    address: Address
  }

  type Query {
    person(id: ID!): Person
    people: [Person]
  }
`)

// Sample data
const peopleData = [
  {
    id: '1',
    name: 'Alice',
    age: 30,
    email: 'alice@example.com',
    address: {
      street: '123 Main St',
      city: 'Wonderland',
      country: 'Fictionland',
    },
  },
  {
    id: '2',
    name: 'Bob',
    age: 25,
    email: 'bob@example.com',
    address: {
      street: '456 Side St',
      city: 'Nowhere',
      country: 'Imaginaria',
    },
  },
]

// Root resolver
const root = {
  person: ({ id }) => peopleData.find((p) => p.id === id),
  people: () => peopleData,
}

const app = express()

app.use(cors())

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL UI for easy exploration
  })
)

const PORT = 4000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`)
})
