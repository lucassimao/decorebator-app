# Decorebator App

A contextually based memorization app for expanding your vocabulary

## Goal

Help language learners acquire new expressions, idioms and vocabularies through a context focused way.

I'm personally tired of boring memorization apps, which throw words and expressions at me without any context nor paying attention on our personal goals and focus.

So I decided to build mine.

## Tech stack

+ Backend
    - eslint
    - prettier
    - Jest
    - Docker
    - PostgreSQL 12
    - Google Cloud Platform ( Cloud Run, Cloud Build, Cloud SQL, Cloud Storage, compute engine )
    - TypeOrm
    - Micro services
      + youtube, quizzes, crawler
        - Node.js (v14)
        - GraphQL apollo server
        - Typescript
        - graphql-codegen
        - ts-node
      + auth, wordlists
        - Node.js (v14)
        - Express.Js restful APIs
        - JavaScript / ES

+ Frontend
    - Firebase Hosting
    - React 16+
    - Material-UI 4.1
    - Quizzes: GraphQL/ Apollo Client 3
    - Wordlist CRUD: redux / react-redux / redux-thunk
+ Microservices integration tests: Java 11 and testcontainers