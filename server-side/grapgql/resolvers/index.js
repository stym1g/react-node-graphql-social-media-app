const post = require('./post');
const postsResolvers = require('./post');
const usersResolvers = require('./user');
const commentResolvers = require('./comment');

module.exports = {
    Post: {
        likeCount(parent){
            console.log(parent);
            return parent.likes.length;
        },
        commentCount(parent){
            return parent.comments.length;
        }
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentResolvers.Mutation
    }
}