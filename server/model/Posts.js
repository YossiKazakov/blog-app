// // Important! - This is just a naive implementation for example. You can modify all of the implementation in this file.

const Posts = [
    {
        id: "11",
        title: 'Example Title 1',
        content: 'Example content 1',
        userId: "11",
        usersLikeOrDislike: {}, // An object that for each user that reacted to this post stores the user id
        likes: 0,               // as key and the reaction ('like'/'dislike') as value
        dislikes: 0
    },
    {
        id: "12",
        title: 'Example Title 2',
        content: 'Example content 2',
        userId: "11",
        usersLikeOrDislike: {},
        likes: 0,
        dislikes: 0
    },
    {
        id: "13",
        title: 'Example Title 3',
        content: 'Example content that has more then 300 characters, Example content that has more then 300 characters, Example content that has more then 300 characters, Example content that has more then 300 characters, Example content that has more then 300 characters, Example content that has more then 300 characters',
        userId: "11",
        usersLikeOrDislike: {},
        likes: 0,
        dislikes: 0
    }
];

module.exports = { Posts };