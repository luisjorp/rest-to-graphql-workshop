const fetch = require("node-fetch");
const {ApolloServer, gql} = require("apollo-server");
const {find, filter} = require('lodash');
// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

// mock data for characters
const characters = [
  {
    name: "Rick Sanchez",
    id: 1,
    status: "Alive",
    episodes: [
      "https://rickandmortyapi.com/api/episode/1",
      "https://rickandmortyapi.com/api/episode/2"
    ]
  },
  {
    name: "Morty Smith",
    id: 2,
    status: "Alive",
    episodes: [
      "https://rickandmortyapi.com/api/episode/1",
      "https://rickandmortyapi.com/api/episode/3"
    ]
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
    # Comments in GraphQL are defined with the hash (#) symbol.

    # This "Book" type can be used in other type declarations.
    type Book {
        title: String
        author: String
    }

    enum characterStatus {
        Alive
        Dead
        Unknown
    }

    type Character {
        name: String
        id: ID
        image: String
        status: characterStatus
        episodes: [Episode]
    }

    type Episode {
        id: ID
        name: String
        air_date: String
        url: String
        characters: [Character]
    }


    # The "Query" type is the root of all GraphQL queries.
    # (A "Mutation" type will be covered later on.)
    type Query {
        books: [Book]

        characters: [Character]
        character(id: ID!): Character

        episodes: [Episode]
        episode(id: ID!): Episode

    }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,

    characters: () => fetchCharacters(),
    character: (parent, args, context, info) => {
      const {id} = args;
      return fetchCharacterById(id);
    },

    episodes: () => fetchEpisodes(),
    episode: (parent, args, context, info) => {
      const {id} = args;
      return fetchEpisodeById(id)
    }

  },
  Character: {
    episodes(character) {
      return character.episode.map(url => {
        return fetchEpisodeByUrl(url)
      })
    }
  },
  Episode: {
    characters(episode){
      return episode.characters.map(url => {
        return fetchCharacterByUrl(url)
      })
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({typeDefs, resolvers});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});


// mock data for episodes
const episodes = [
  {
    name: "Pilot",
    id: 1
  },
  {
    name: "Lawnmower Dog",
    id: 2
  }
];

function fetchEpisodes() {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch("https://rickandmortyapi.com/api/episode/")
    .then(res => res.json())
    .then(json => json.results);
}

function fetchEpisodeById(id) {
  return fetch("https://rickandmortyapi.com/api/episode/" + id)
    .then(res => res.json())
    .then(json => json);
}

function fetchEpisodeByUrl(url) {
  return fetch(url)
    .then(res => res.json())
    .then(json => json);
}

function fetchCharacters() {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch("https://rickandmortyapi.com/api/character/")
    .then(res => res.json())
    .then(json => json.results);
}

function fetchCharacterById(id) {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch("https://rickandmortyapi.com/api/character/" + id)
    .then(res => res.json())
    .then(json => json);
}

function fetchCharacterByUrl(url) {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch(url)
    .then(res => res.json())
    .then(json => json);
}
