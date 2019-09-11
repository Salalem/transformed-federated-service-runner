const {RemoteGraphQLDataSource} = require("@apollo/gateway");
const {ApolloServer} = require('apollo-server');

const {ApolloGateway} = require("@apollo/gateway");

const LMS_SERVICE_NAME =  "lms"
const LMS_SERVICE_URL =  process.env.LMS_SERVICE_URL
const LMS_APP_API_KEY = process.env.LMS_APP_API_KEY

const gateway = new ApolloGateway({
    introspectionHeaders: {
        "App-Api-Key": LMS_APP_API_KEY
    },
    buildService({name, url}) {
        return new RemoteGraphQLDataSource({
            url, willSendRequest({request, context}) {
                if (name === LMS_SERVICE_NAME) {
                    request.http.headers.set('App-Api-Key', LMS_APP_API_KEY);
                    request.http.headers.set('Authorization', context.LMSAuthorization);
                }
            },
        });
    },
    serviceList: [
        {name: LMS_SERVICE_NAME, url: LMS_SERVICE_URL},
    ],
});


const server = new ApolloServer({
    cors: {
        origin: 'https://course-builder.api.salalem.com',
        credentials: true
    },
    context: ({req}) => ({
        LMSAuthorization: req.headers.authorization
    }),
    gateway,
    subscriptions: false,
});

server.listen(
    4000,
    '0.0.0.0'
).then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});