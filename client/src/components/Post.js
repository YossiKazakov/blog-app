import {
  ListItem,
  ListItemButton,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AddTagButton from './AddTagButton';
import Tag from './Tag';
import { useEffect, useState } from 'react';

function Post({ // Child of Home.js
  postId,
  postTitle,
  postContent,
  isAddTagBtn,
  handleAddTagClick,
  handleTagClick,
  selectedTagId,
  isTagDisabled,
  Tags,
  userId,
  likes,
  dislikes,
  handleUpdateLikesAndDislikes
}) {
  const [, dummyState] = useState()
  const forceReRender = () => {
    dummyState({})
  }
  const getTagsByPostId = (postID) => {
    const tagsArr = [];
    for (const tagName in Tags) {
      if (Tags[tagName][postID]) {
        tagsArr.push(tagName);
      }
    }
    return tagsArr;
  };
  const tagsNameArr = getTagsByPostId(postId);
  const isTag = tagsNameArr.length > 0 ? true : false;

  const [didUserLikePost, setDidUserLikePost] = useState(false);
  const [didUserDislikePost, setDidUserDislikePost] = useState(false);
  const [userToLikesObject, setUserToLikesObject] = useState({})
  const [likesAndDislikes, setLikesAndDislikes] = useState([likes, dislikes])


  const handleLikeAndDislike = (action) => {
    if (action === "like") {
      setDidUserLikePost(true)
      setDidUserDislikePost(false)
      setUserToLikesObject({ ...userToLikesObject, [userId]: true })
    }

    if (action === "dislike") {
      setDidUserLikePost(false)
      setDidUserDislikePost(true)
      setUserToLikesObject({ ...userToLikesObject, [userId]: false })
    }
  }

  useEffect(() => {
    const countLikesAndDislikes = () => {
      let likeCounter = 0
      let dislikeCounter = 0
      Object.entries(userToLikesObject).forEach(([id, like]) => {
        like ? likeCounter++ : dislikeCounter++
      })
      // console.log(likeCounter, dislikeCounter)
      return [likeCounter, dislikeCounter]
    }
    setLikesAndDislikes(countLikesAndDislikes())
  }, [userToLikesObject])

  useEffect(() => {
    const [likes, dislikes] = likesAndDislikes
    handleUpdateLikesAndDislikes(postId, likes, dislikes)
  }, [userToLikesObject, handleUpdateLikesAndDislikes, likesAndDislikes, postId])


  return (
    <ListItem
      alignItems='flex-start'
      key={`post-${postId}`}
      className='post'
      data-testid={`post-${postId}`}
    >
      <Card className='post'>
        <ListItemButton disableGutters>
          <CardContent>
            <Typography
              variant='h5'
              gutterBottom
              data-testid={`postTitle-${postId}`}
            >
              {postTitle}
            </Typography>
            <Typography
              variant='body1'
              gutterBottom
              data-testid={`postContent-${postId}`}
            >
              {postContent}
            </Typography>
          </CardContent>
        </ListItemButton>
        <CardActions>
          {isAddTagBtn && (
            <AddTagButton
              dataTestId={`postAddTagBtn-${postId}`}
              onClick={(e) => { // + sign clicked // Gets it from Home.js
                handleAddTagClick(e, postId)
                forceReRender()
              }}
            />
          )}
          {isTag &&
            tagsNameArr.map((tagName, index) => ( // List of tags of a post
              <Tag
                key={`post-${index}-${tagName}`}
                tagName={tagName}
                postId={postId}
                handleOnClick={handleTagClick}
                selectedTagId={selectedTagId}
                isDisabled={isTagDisabled}
              />
            ))}
          <IconButton
            aria-label='dislike'
            size='small'
            data-testid={`postDislikeBtn-${postId}`}
            onClick={() => handleLikeAndDislike("dislike")}
          >
            {didUserDislikePost ? (
              <ThumbDownAltIcon
                color='error'
                data-testid={`fullDislikeIcon-${postId}`}
              />
            ) : (
              <ThumbDownOffAltIcon
                color='error'
                data-testid={`hollowDislikeIcon-${postId}`}
              />
            )}
          </IconButton>
          <Typography
            variant='string'
            data-testid={`postDislikeNum-${postId}`}
            color='red'
          >
            {likesAndDislikes[1]}
          </Typography>
          <IconButton
            aria-label='like'
            size='small'
            data-testid={`postLikeBtn-${postId}`}
            onClick={() => handleLikeAndDislike("like")}
          >
            {didUserLikePost ? (
              <ThumbUpAltIcon
                color='success'
                data-testid={`fullLikeIcon-${postId}`}
              />
            ) : (
              <ThumbUpOffAltIcon
                color='success'
                data-testid={`hollowLikeIcon-${postId}`}
              />
            )}
          </IconButton>
          <Typography
            variant='string'
            data-testid={`postLikeNum-${postId}`}
            color='green'
          >
            {likesAndDislikes[0]}
          </Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
}

export default Post;
