import axios from 'axios';
import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddNewPost from './pages/AddNewPost';
import MyRecommendedPosts from './pages/MyRecommendedPosts';
import FloatingMenu from './components/FloatingMenu';
import {
  Typography,
  AppBar,
  Toolbar,
  Button,
  ButtonGroup,
  Alert,
  Snackbar,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RecommendIcon from '@mui/icons-material/Recommend';
import HomeIcon from '@mui/icons-material/Home';

function App() {
  const baseURL = 'http://localhost:3080';
  const popularityOptions = [1, 2, 4, 10, 20];

  const [userId, setUserId] = useState('');

  const [selectedPopularityQuery, setSelectedPopularityQuery] = useState('');
  const [selectedTagQuery, setSelectedTagQuery] = useState('');

  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const [tags, setTags] = useState({});
  const [tagsList, setTagsList] = useState([]); // Goes to the TagCloud
  const [selectedTagId, setSelectedTagId] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);

  const [alertMsg, setAlertMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        handleAlert('', false, '');
      }, 1500);
    }
  }, [showAlert]);

  const handleAlert = (message, isShow, type) => {
    setAlertMsg(message);
    setShowAlert(isShow);
    setAlertType(type);
  };

  ///////////////////////////////////// data req /////////////////////////////////////

  axios.defaults.withCredentials = true;
  ///////////////////// get req /////////////////////

  // sets a userId cookie
  const getUser = useCallback(() => {
    axios
      .get(`${baseURL}/user`)
      .then((response) => {
        setUserId(response.data.id);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  const getPosts = useCallback(() => {
    axios
      .get(`${baseURL}/posts`)
      .then((response) => {
        const posts = [...response.data['Posts']].map(post => {
          const { likesCounter, dislikesCounter } = calculateLikesAndDislikesAmount(post.usersLikeOrDislike)
          post.likes = likesCounter
          post.dislikes = dislikesCounter
          // console.log(`(get)${post.id} has ${likesCounter} likes and ${dislikesCounter} dislikes`);
          return post
        })
        setAllPosts(posts);
        setFilteredPosts(posts);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  const getTags = useCallback(() => {
    axios
      .get(`${baseURL}/tags`)
      .then((response) => {
        setTags({ ...response.data['Tags'] });
        const tagsList = [];
        for (const tagName in response.data['Tags']) {
          tagsList.push(tagName);
        }
        setTagsList(tagsList);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  useEffect(() => {
    getPosts();
    getTags();
    getUser();
  }, [getPosts, getTags, getUser]);

  const getFilteredPosts = (popularity, tag) => {
    const url = popularity !== '' ? `popularity=${popularity}` : '';
    axios
      .get(`${baseURL}/posts?${url}`)
      .then((response) => {
        setFilteredPosts([...response.data['Posts']]);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };

  const getRecommendedPostsForMe = () => {
    // TODO - add the recommended-posts-for-me functionality here
  };

  ///////////////////// ADDING POST /////////////////////
  const addPost = (id, title, content, selectedTag) => {
    axios
      .post(
        `${baseURL}/posts`,
        {
          post: {
            id,
            title,
            content,
          }
        },
        {
          headers: {
            // to send a request with a body as json you need to use this 'content-type'
            'content-type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((response) => {
        console.log(`new post have been added to the server :\n${response.data.newPost}`);
      });
  };

  ///////////////////// TAGS MANAGMENT /////////////////////
  const addNewTag = (tagName) => {
    axios
      .post(`${baseURL}/tags/tagName/${tagName}`)
      .then((response) => {
        setTags({ ...response.data['Tags'] });
        const tagsList = [];
        for (const tagName in response.data['Tags']) {
          tagsList.push(tagName);
        }
        setTagsList(tagsList);
        console.log(tagsList);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };

  // Handles the adding of a tag to some post, will be passed to Home component
  const addTagOnPost = (tagName, postId) => {
    axios
      .post(`${baseURL}/tags/tagName/${tagName}/${postId}`)
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }

  ///////////////////// LIKES MANAGMENT /////////////////////

  // Sends a post request with postId, userId (via cookie) and status ('like'/'dislike')
  // to the server and updates the specific post.usersLikeOrDislike with a (maybe fresh new) key of userId
  // and the value of status
  const handleUpdateLikesAndDislikes = (postId, status) => {
    axios
      .post(
        `${baseURL}/posts/${postId}`,
        {
          userId,
          status
        },
        {
          headers: {
            // to send a request with a body as json you need to use this 'content-type'
            'content-type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((response) => {
        // Local client state update
        const { userId, status } = response.data
        const updatedPosts = filteredPosts.map(post => {
          if (post.id === postId) {
            post.usersLikeOrDislike[userId] = status
            const { likesCounter, dislikesCounter } = calculateLikesAndDislikesAmount(post.usersLikeOrDislike)
            post.likes = likesCounter
            post.dislikes = dislikesCounter
            console.log(`(post)${post.id} has ${likesCounter} likes and ${dislikesCounter} dislikes`);
          }
          return post
        })
        setFilteredPosts(updatedPosts)
        // setFilteredPosts(updatedPosts)
        console.log(`post number ${postId} is now ${status + 'd'} by user ${userId}`);
      })
      .catch(err => console.log);
  }

  const calculateLikesAndDislikesAmount = (usersLikeOrDislikeObj) => {
    let likesCounter = 0
    let dislikesCounter = 0
    Object.values(usersLikeOrDislikeObj).forEach(status => {
      if (status === 'like') {
        likesCounter++
      }
      if (status === 'dislike') {
        dislikesCounter++
      }
    })
    return { likesCounter, dislikesCounter }
  }


  ///////////////////////////////////// handle click events /////////////////////////////////////
  const handlePopularityClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopularityMenuClose = (selectedOption) => {
    setAnchorEl(null);
    filterPostsByPopularity(selectedOption);
  };

  const handleHomeClick = () => {
    setFilteredPosts(allPosts);
    setSelectedPopularityQuery('');
    setSelectedTagId('');
  };

  ///////////////////////////////////// filters /////////////////////////////////////
  const filterPostsByPopularity = (minLikeNum = 1) => {
    setSelectedPopularityQuery(`${minLikeNum}`);
    getFilteredPosts(minLikeNum, selectedTagQuery);
  };

  ///////////////////////////////////// render components /////////////////////////////////////
  const renderToolBar = () => {
    return (
      <AppBar position='sticky' color='inherit'>
        <Toolbar>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              onClick={handleHomeClick}
              href='/'
              size='large'
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button
              href='/add-new-post'
              size='large'
              startIcon={<AddCircleIcon />}
              data-testid='addNewPostBtn'
            >
              Add a New Post
            </Button>
          </ButtonGroup>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Enter 2023 Blog Exam
          </Typography>
          <Button
            className={
              window.location.href !==
                'http://localhost:3000/my-recommended-posts' &&
                window.location.href !== 'http://localhost:3000/add-new-post'
                ? ''
                : 'visibilityHidden'
            }
            size='large'
            startIcon={<FilterAltIcon />}
            onClick={(e) => handlePopularityClick(e)}
            data-testid='popularityBtn'
          >
            Filter by Popularity
          </Button>
          <FloatingMenu
            menuOptions={popularityOptions}
            anchorElement={anchorEl}
            handleMenuClose={handlePopularityMenuClose}
          />
        </Toolbar>
      </AppBar>
    );
  };

  return (
    <div className='App'>
      {renderToolBar()}
      {showAlert && (
        <Snackbar>
          <Alert severity={alertType} data-testid='alert'>
            {alertMsg}
          </Alert>
        </Snackbar>
      )}
      <Router>
        <Routes>
          <Route
            path='/my-recommended-posts'
            element={
              <MyRecommendedPosts
                Posts={[]}
                Tags={tags}
                getRecommendedPostsForMe={getRecommendedPostsForMe}
                userId={userId}
              />
            }
          />
          <Route
            path='/add-new-post'
            element={<AddNewPost handleAddPost={addPost} />}
          />
          <Route
            path='/'
            element={
              <Home
                Posts={filteredPosts}
                Tags={tags}
                tagsList={tagsList}
                handleAddNewTag={addNewTag}
                handleAddTagOnPost={addTagOnPost}
                selectedTagId={selectedTagId}
                selectedPopularityQuery={selectedPopularityQuery}
                userId={userId}
                handleUpdateLikesAndDislikes={handleUpdateLikesAndDislikes}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
