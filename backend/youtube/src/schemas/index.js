const {gql} = require('apollo-server')

const typeDefs = gql`
    type Subtitle {
        languageCode: String
        isAutomatic: Boolean
        downloadUrl: String
    }
    type Query {
        getAvailableVideoSubtitles(url: String): [Subtitle]  
    }
`;


module.exports = typeDefs