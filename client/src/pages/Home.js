import { List, Typography } from '@mui/material';
import FloatingMenu from '../components/FloatingMenu';
import Post from '../components/Post';
import TagsCloud from '../components/TagsCloud';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function Home({ // Child of App.js
  Posts,
  Tags, // Drilling to Post.js
  tagsList, // Drilling to TagCloud and FloatingMenu.js
  handleAddNewTag, // Drilling to TagCloud.js
  handleAddTagOnPost,
  selectedTagId, // Drilling to Post.js and TagCloud.js
  selectedPopularityQuery,
  userId, // Drilling to Post.js
  handleUpdateLikesAndDislikes // Drilling to Post.js
}) {
  // useEffect(() => {
  //   console.log(Posts);
  // })
  const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPostIdToAddTagTo, setCurrentPostIdToAddTagTo] = useState(null)

  ///////////////////////////////////// handle query param /////////////////////////////////////
  searchParams.get('popularity');

  useEffect(() => {
    if (selectedPopularityQuery !== '') {
      setSearchParams({ popularity: `${selectedPopularityQuery}` });
    }
  }, [selectedPopularityQuery, setSearchParams]);

  ///////////////////////////////////// handle tag on post /////////////////////////////////////
  const handleAddTagClick = (event, selectedPostId) => {
    console.log(`+ sign (add tag) clicked on post ${selectedPostId}`);
    setAnchorEl(event.currentTarget); // Scroll down menu bar
    setCurrentPostIdToAddTagTo(selectedPostId)
  };

  const handleMenuClose = (selectedOption) => {
    setAnchorEl(null);
    console.log(`the chosen tag is ${selectedOption}`);
    // Need to do a post req to Tags and add the Tag : 
    // "selectedOption : {selectedPostId : true}"
    const newTag = selectedOption
    const onPost = currentPostIdToAddTagTo
    if (newTag) {
      handleAddTagOnPost(newTag, onPost)
    }
    setCurrentPostIdToAddTagTo(null)
  };

  ///////////////////////////////////// handle filter tag /////////////////////////////////////
  const handleTagClick = (tagName, tagId) => { };

  ///////////////////////////////////// render components /////////////////////////////////////
  return (
    <div className='container'>
      <List sx={{ width: '650px' }}>
        {Posts.length !== 0 &&
          Posts.map((post) => {
            return (
              <Post
                key={`home-${post.id}`}
                postId={post.id}
                postTitle={post.title}
                postContent={post.content}
                postUsersLikeOrDislike={post.usersLikeOrDislike}
                postLikesAmount={post.likes}
                postDislikesAmount={post.dislikes}
                isAddTagBtn={true}
                handleAddTagClick={handleAddTagClick} // Gets from App.js
                handleTagClick={handleTagClick}
                selectedTagId={selectedTagId}
                isTagDisabled={false}
                Tags={Tags}
                userId={userId}
                handleUpdateLikesAndDislikes={handleUpdateLikesAndDislikes}
              />
            );
          })}
        {Posts.length === 0 && (
          <Typography variant='h5' component='div' data-testid='emptyPostList'>
            No Posts Were Found
          </Typography>
        )}
      </List>
      <TagsCloud
        tagsList={tagsList}
        handleAddNewTag={handleAddNewTag}
        selectedTagId={selectedTagId}
        handleTagClick={handleTagClick}
      />
      <FloatingMenu
        menuOptions={tagsList}
        anchorElement={anchorEl}
        handleMenuClose={handleMenuClose}
      />
    </div>
  );
}

export default Home;
