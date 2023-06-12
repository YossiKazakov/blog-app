const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cors = require('cors');

const { baseUrl } = require('../constants');
const { Posts } = require('./model/Posts');
const { Tags } = require('./model/Tags');

const app = express();
const port = 3080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

const corsOptions = {
  origin: `${baseUrl.client}`,
  credentials: true,
};

app.get('/', cors(corsOptions), (req, res) => {
  res.send('Welcome to your Wix Enter exam!');
});

app.get('/user', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId || uuidv4();
  res.cookie('userId', userId).send({ id: userId });
});

///////////////////////////////////// posts /////////////////////////////////////
app.get('/posts', cors(corsOptions), (req, res) => {
  if (req.query.popularity) {
    // TODO - implement popularity filter functionality here
    const popularity = Number(req.query.popularity);
    res.send({ Posts });
    return;
    // End of TODO
  }
  res.send({ Posts });
});

app.post('/posts', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  const { id, title, content } = req.body.post
  // console.log(req.body);

  if (!id || !title || !content) {
    res.status(400).end();
    return;
  }
  const newPost = { id, title, content, userId, likes: 0, dislikes: 0 }
  Posts.push(newPost)
  res.send({ newPost }).status(200).end();

});

app.post('/posts/:id', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  const { id } = req.params
  const { likes, dislikes } = req.body.post

  if (!id) {
    res.status(400).end("no id provided");
    return;
  }

  const index = Posts.findIndex((post) => post.id === id)
  Posts[index].likes = likes
  Posts[index].dislikes = dislikes
  const newState = { likes: Posts[index].likes, dislikes: Posts[index].dislikes }
  // console.log(Posts);

  res.send({ newState }).status(200).end();

});




///////////////////////////////////// tags /////////////////////////////////////
app.get('/tags', cors(corsOptions), (req, res) => {
  res.send({ Tags });
});

app.post('/tags/tagName/:tagName', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  const { tagName } = req.params;
  if (Tags[tagName]) {
    res.status(400).end();
    return;
  }
  Tags[tagName] = {};
  res.send({ Tags }).status(200).end();
});


//Post request to add a postId (and boolean true) under some tagName. 
//Fierd when the user clicks on the + sign of some post and adds tag to it
app.post('/tags/tagName/:tagName/:postId', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  const { tagName, postId } = req.params;

  Tags[tagName] = { ...Tags[tagName], [postId]: true };
  res.send({ message: `${tagName} added successfully on post ${postId}` }).status(200).end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
