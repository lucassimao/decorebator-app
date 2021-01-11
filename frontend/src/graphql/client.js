import { ApolloClient, InMemoryCache, ApolloLink, Observable } from "@apollo/client";
import { stitchSchemas } from '@graphql-tools/stitch';
import { introspectSchema } from '@graphql-tools/wrap';
import { print } from 'graphql';
import { SchemaLink } from '@apollo/client/link/schema';


async function remoteExecutor(url, { document, variables }) {
    const query = print(document);
    const fetchResult = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: process.env.REACT_APP_AUTH_TOKEN },
        body: JSON.stringify({ query, variables }),
    });
    return fetchResult.json();
}


const getYoutubeSchema = async () => {
    const youtubeServiceExecutor = remoteExecutor.bind(null, process.env.REACT_APP_YOUTUBE_SERVICE_URL);
    const schema = await introspectSchema(youtubeServiceExecutor);
    return {
        schema, executor: youtubeServiceExecutor
    }
}

const getQuizzSchema = async () => {
    const quizzServiceExecutor = remoteExecutor.bind(null, process.env.REACT_APP_QUIZZES_SERVICE_URL);
    const schema = await introspectSchema(quizzServiceExecutor);
    return {
        schema, executor: quizzServiceExecutor
    }
}

let schemaLink;

const schemaLinkObservable = new Observable(subscriber => {
    const promises = Promise.all([getYoutubeSchema(), getQuizzSchema()]);
    promises.then(([youtubeSchema, quizzSchema]) => {
        const schema = stitchSchemas({
            subschemas: [
                youtubeSchema,
                quizzSchema,
            ]
        });

        subscriber.next(new SchemaLink({ schema }));
        subscriber.complete();
    })
    .catch(e => console.error(e));
})

const subscription = schemaLinkObservable.subscribe(schemaLinkInstance => schemaLink = schemaLinkInstance )

const apiGatewayLink = new ApolloLink((operation, forward) => {

    if (subscription.closed) {
        return schemaLink.request(operation)
    }

    return schemaLinkObservable.map(schemaLink => schemaLink.request(operation))
});

export const apolloClient = new ApolloClient({
    headers: {
        authorization: process.env.REACT_APP_AUTH_TOKEN
    },
    credentials: 'omit',
    link: apiGatewayLink,
    cache: new InMemoryCache(),
});