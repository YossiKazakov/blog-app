import { List, Typography } from '@mui/material';
import FloatingMenu from '../components/FloatingMenu';
import Post from '../components/Post';
import TagsCloud from '../components/TagsCloud';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function Home({ // Child of App.js
  Posts,
  Tags, 
  tagsList, 
  handleAddNewTag, 
  handleAddTagOnPost,
  selectedTagId, 
  selectedPopularityQuery,
  selectedTagQuery,
  filterPostsByTag,
  userId, 
  handleUpdateLikesAndDislikes, 
  disableTags,
  showTagCloud
}) {

  const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState(null);

  ///////////////////////////////////// handle query param /////////////////////////////////////
  searchParams.get('popularity'); // Why needed?

  useEffect(() => {
    const updateQueryParams = () => { // isnt looping, but if needed can be fixed with creating a new instance of URLSerachParams
      if (selectedPopularityQuery)
        searchParams.set('popularity', selectedPopularityQuery)
      if (selectedTagQuery)
        searchParams.set('tag', selectedTagQuery)
      setSearchParams(searchParams)
    }
    updateQueryParams()
  }, [selectedPopularityQuery, selectedTagQuery, searchParams, setSearchParams])

  ///////////////////////////////////// handle tag on post /////////////////////////////////////
  const handleAddTagClick = (event, selectedPostId) => { // Goes to Post.js
    // console.log(`+ sign (add tag) clicked on post ${selectedPostId}`); 
    setAnchorEl(event.currentTarget); // Scroll down menu bar
  };


  const handleMenuClose = (selectedOption) => { // Goes to FloatingMenu.js
    if (!selectedOption) return
    if (isNaN(Number(selectedOption))) { // Case where it is the Tag menu
      const postId = anchorEl.getAttribute('data-testid').split('postAddTagBtn-')[1]
      handleAddTagOnPost(selectedOption, postId)
    }
    setAnchorEl(null);
  };

  ///////////////////////////////////// handle filter tag /////////////////////////////////////
  const handleTagClick = (tagName, tagId) => { // Why declared in Home.js and not in App.js?
    filterPostsByTag(tagName)
  };

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
                isTagDisabled={disableTags}
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
      {showTagCloud && (<TagsCloud
        tagsList={tagsList}
        handleAddNewTag={handleAddNewTag}
        selectedTagId={selectedTagId}
        handleTagClick={handleTagClick}
      />)}
      <FloatingMenu
        menuOptions={tagsList}
        anchorElement={anchorEl}
        handleMenuClose={handleMenuClose}
      />
    </div>
  );
}

export default Home;
