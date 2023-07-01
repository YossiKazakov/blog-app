import { useEffect, useState } from 'react';
import Home from './Home';

function MyRecommendedPosts({
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
  getRecommendedPostsForMe
}) {
  const [recommendedPosts, setRecommendedPosts] = useState(Posts)
  useEffect(() => {
    setRecommendedPosts(getRecommendedPostsForMe())
  }, [getRecommendedPostsForMe]);

  return <Home
    Posts={recommendedPosts}
    Tags={Tags}
    tagsList={tagsList}
    handleAddNewTag={handleAddNewTag}
    handleAddTagOnPost={handleAddTagOnPost}
    selectedTagId={selectedTagId}
    selectedPopularityQuery={selectedPopularityQuery}
    selectedTagQuery={selectedTagQuery}
    filterPostsByTag={filterPostsByTag}
    userId={userId}
    handleUpdateLikesAndDislikes={handleUpdateLikesAndDislikes}
    disableTags={true}
    showTagCloud={false}
  />
}

export default MyRecommendedPosts;
