const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const {AuthenticationError, UserInputError} = require('apollo-server');

module.exports = {
    Query: {
        async getOnlyMyPosts(_,{username},context){
            console.log(username);
            const user = checkAuth(context);
            console.log(user);
            try{
                const posts = await Post.find({username:username});
                console.log(posts);
                return posts;
            } catch(err){
                throw new Error(err);
            }
        },
        async getPosts(){
            try{
                const posts = await Post.find();
                return posts;
            } catch(err){
                throw new Error(err);
            }
        },
        async getPost(_,{postId}){
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post;
                }
                else{
                    throw new Error('Post not found');
                }
            }catch(err){
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_,{body},context){
            const user = checkAuth(context);
            console.log(user);
            if(body.trim() === ""){
                throw new Error('Post body must not be empty');
            }
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toString()
            });
            const post = await newPost.save();
            return post;
        },
        async deletePost(_,{postId},context){
            const user = checkAuth(context);
            try{
                const post = await Post.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return "Post deleted successfully";
                }
                else{
                    throw new AuthenticationError('Action not allowed')
                }
            }catch(err){
                throw new Error(err);
            }
        },
        async likePost(_,{postId},context){
            const {username} = checkAuth(context);
            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find(like => like.username === username)){
                    //post already liked, unkine it
                    post.likes = post.likes.filter(like => like.username !== username);
                    await post.save();
                }else{
                    //post not liked, like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toString()
                    })
                }
                await post.save();
                return post;
            }else{
                throw new UserInputError('Post not found');
            }
        }
    }
}