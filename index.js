const {ApolloServer} = require('apollo-server');
const {transformSchemaFederation} = require("graphql-transform-federation");
const {introspectSchema, makeRemoteExecutableSchema} = require('graphql-tools');
const fetch = require('node-fetch');
const {HttpLink} = require('apollo-link-http');

const SERVICE_NAME = process.env.SERVICE_NAME || "quizzing"
const SERVICE_URL = process.env.SERVICE_URL || "https://faker.graphqleditor.com/salalem/quizschema/graphql"
const link = new HttpLink({uri: SERVICE_URL, fetch})

introspectSchema(link).then((schema) => {
    new ApolloServer({
        schema: transformSchemaFederation(makeRemoteExecutableSchema({schema, link}), {
            Query: {
                // Ensure the root queries of this schema show up the combined schema
                extend: true,
            }
        })
    }).listen({
        port: 4001,
    }).then(({url}) => {
        console.log(`🚀 Transformed ${SERVICE_NAME} service ready at ${url}`);
    });
});