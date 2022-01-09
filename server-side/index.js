const {ApolloServer,PubSub} = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
const {MONGODB} = require('./config');
const Post = require('./models/Post');
const typeDefs = require('./grapgql/typeDefs');
const resolvers = require('./grapgql/resolvers');
//const pubsub = new PubSub();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req})
});

mongoose.connect(MONGODB, {useNewUrlParser: true}).then(()=>{
    console.log("Mongodb connected");
    return server.listen({port: 5000});
}).then((res)=>{
    console.log(`Server is running at ${res.url}`);
});