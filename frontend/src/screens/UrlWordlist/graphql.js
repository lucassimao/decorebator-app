import { gql } from "@apollo/client";


export const GET_URL_METADATA = gql`
  query getUrlMetaData($url: String!) {
    urlMetaData: getUrlMetaData(url: $url) {
      title
      description
      icon
      image
      keywords
      language
      type
      url
      provider
  }
}
`;
