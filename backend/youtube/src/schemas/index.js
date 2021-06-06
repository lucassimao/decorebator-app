const { gql } = require("apollo-server");

const typeDefs = gql`
  type Subtitle {
    languageCode: String
    languageName: String
    isAutomatic: Boolean
    downloadUrl: String
  }
  type URLMetaData {
    title: String
    description: String
    icon: String
    image: String
    keywords: [String]
    language: String
    type: String
    url: String
    provider: String
  }
  type Query {
    getAvailableVideoSubtitles(url: String!): [Subtitle!]
    getUrlMetaData(url: String!): URLMetaData!
  }
`;

module.exports = typeDefs;
