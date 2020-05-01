const {gql} = require('apollo-server')

const typeDefs = gql`
    type Language{
        code: String!
        name: String!
    }
    type Subtitle {
        language: Language!
        isAutomatic: Boolean
        downloadUrl: String
    }
    type Query {
        getAvailableVideoSubtitles(url: String!): [Subtitle!]  
    }
`;


module.exports = typeDefs