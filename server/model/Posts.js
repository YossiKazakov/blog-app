// Important! - This is just a naive implementation for example. You can modify all of the implementation in this file.

// usersLikeOrDislike is an object where key is some userId and the value is a 'like' if this user
// liked the post or 'dislike' if he disliked it. If its neither of those, then there will be no
// key for that userId 
const Posts = [
    {
        id: "11",
        title: 'Example Title 1',
        content: 'Example content 1',
        userId: "11",
        usersLikeOrDislike: {}
    },
    {
        id: "12",
        title: 'Example Title 2',
        content: 'Example content 2',
        userId: "11",
        usersLikeOrDislike: {}
    },
    {
        id: "13",
        title: 'Example Title 3',
        content: 'Example content that has more then 300 characters, Example content that has more then 300 characters, Example content that has more then 300 characters, Example content that has more then 300 characters, Example content that has more then 300 characters, Example content that has more then 300 characters',
        userId: "11",
        usersLikeOrDislike: {}
    }
];
// const Posts = [
//     {
//         "11": {
//             title: 'Example Title 1',
//             content: 'Example content 1',
//             userId: "11",
//             likes: 0,
//             dislikes: 0
//         }
//     },
//     {
//         "12": {
//             title: 'Example Title 1',
//             content: 'Example content 2',
//             userId: "11",
//             likes: 0,
//             dislikes: 0
//         }
//     },
//     {
//         "13": {
//             title: 'Example Title 1',
//             content: 'Example content 3',
//             userId: "11",
//             likes: 0,
//             dislikes: 0
//         }
//     }
// ]
module.exports = { Posts };