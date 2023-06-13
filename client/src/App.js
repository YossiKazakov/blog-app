import axios from 'axios';
import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddNewPost from './pages/AddNewPost';
import MyRecommendedPosts from './pages/MyRecommendedPosts';
import FloatingMenu from './components/FloatingMenu';
import ModalError from './components/EmptyFieldsModalError';
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

  useEffect(() => {
    console.log(`App.js re-rendered with ${allPosts.length} posts`);
  })

  const baseURL = 'http://localhost:3080';
  const popularityOptions = [1, 2, 4, 10, 20];

  const [userId, setUserId] = useState('');

  const [selectedPopularityQuery, setSelectedPopularityQuery] = useState('');
  const [selectedTagQuery, setSelectedTagQuery] = useState('');

  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const [tags, setTags] = useState({}); // Actuall tags
  const [tagsList, setTagsList] = useState([]); // Only names
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
        setAllPosts([...response.data['Posts']]);
        setFilteredPosts([...response.data['Posts']]);
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
        updateTagList({ ...response.data['Tags'] })
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
    const url = `${popularity ? `popularity=${popularity}` : ''}${tag ? `${popularity ? '&' : ''}tag=${tag}` : ''}`
    axios
      .get(`${baseURL}/posts?${url}`)
      .then((response) => {
        setFilteredPosts([...response.data['Posts']]);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };

  ///////////////////// RECOMMENDED POSTS LOGIC /////////////////////
  const getRecommendedPostsForMe = useCallback(() => {
    const posts = []
    const postsThatUserDidntReactTo = allPosts.filter(post => !(userId in post.usersLikeOrDislike))
    const usersThatShareInterest = new Set()
    allPosts.forEach(post => {
      if (post.usersLikeOrDislike[userId] === 'like') {
        Object.entries(post.usersLikeOrDislike).forEach(([id, reaction]) => {
          if (id !== userId && reaction === 'like') {
            usersThatShareInterest.add(id)
          }
        })
      }
    })
    postsThatUserDidntReactTo.forEach(post => {
      for (const user of Object.keys(post.usersLikeOrDislike)) {
        if (usersThatShareInterest.has(user)) {
          posts.push(post)
        }
      }
    })
    // console.log(Posts);
    return posts

  }, [allPosts, userId])

  ///////////////////// ADDING POST /////////////////////
  const addPost = (id, title, content, selectedTag = '') => {
    axios
      .post(
        `${baseURL}/posts`,
        {
          post: {
            id,
            title,
            content,
            selectedTag
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
        const { newPost, tags } = response.data
        setAllPosts([...allPosts, newPost])
        setTags(tags)
        updateTagList(tags)
      });
  };


  ///////////////////// TAGS MANAGMENT /////////////////////
  const addNewTag = (tagName) => {
    axios
      .post(`${baseURL}/tags/tagName/${tagName}`)
      .then((response) => {
        setTags({ ...response.data['Tags'] });
        updateTagList({ ...response.data['Tags'] })
        console.log(tagsList);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };

  // Handles the adding of a tag to some post, will be passed to Home component
  const addTagOnPost = (tagName, postId) => {
    if (tags[tagName][postId]) {
      console.log(`${tagName} tag is already on post id ${postId}`)
      return
    }
    axios
      .post(`${baseURL}/tags/tagName/${tagName}/${postId}`)
      .then((response) => {
        const updatedTags = { ...tags }
        updatedTags[tagName][postId] = true
        setTags(updatedTags)
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

        const { userId, postToUpdate, message } = response.data
        if (message) { // user already reacted to post
          console.log(message);
        }
        else {
          const updatedPosts = filteredPosts.map(post => {
            if (post.id === postToUpdate.id) {
              post = { ...postToUpdate }
            }
            return post
          })
          setFilteredPosts(updatedPosts)
          console.log(`post number ${postId} is now ${status + 'd'} by user ${userId}`)
        }
      })
      .catch(err => console.log);
  }

  ///////////////////////////////////// handle click events /////////////////////////////////////
  const handlePopularityClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopularityMenuClose = (selectedOption) => {
    setAnchorEl(null);
    filterPostsByPopularity(selectedOption);
  };

  const handleHomeClick = useCallback(() => {
    setFilteredPosts(allPosts);
    setSelectedPopularityQuery('');
    setSelectedTagId('');
  }, [allPosts])



  ///////////////////////////////////// filters /////////////////////////////////////
  const filterPostsByPopularity = (minLikeNum = 1) => {
    setSelectedPopularityQuery(`${minLikeNum}`);
    getFilteredPosts(minLikeNum, selectedTagQuery);
  };
  const filterPostsByTag = (tag) => {
    setSelectedTagQuery(tag);
    setSelectedTagId(tag)
    getFilteredPosts(selectedPopularityQuery, tag);
  };

  ///////////////////////////////////// utils /////////////////////////////////////////////

  // Called when a post is added. Since its navigating back home on submission, all states must be restareted
  useEffect(() => {
    handleHomeClick()
  }, [allPosts, handleHomeClick])

  // Reusable code for setting the tag (names) list
  const updateTagList = (tags) => {
    const tagsList = [];
    for (const tagName in tags) {
      tagsList.push(tagName);
    }
    setTagsList(tagsList);
  }

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
            <Button
              href='/my-recommended-posts'
              size='large'
              startIcon={<RecommendIcon />}
              data-testid='myRecommendedPostsBtn'
            >
              Explore more posts
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
                selectedTagQuery={selectedTagQuery}
                filterPostsByTag={filterPostsByTag}
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
