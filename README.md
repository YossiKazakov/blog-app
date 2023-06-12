# Welcome to your Wix Enter exam
## Prerequisites:
- NPM (version 8 or 9)
- Node (version 18)

## Instructions
- open a terminal and navigate to this project's dir
- run `npm install` (in case of errors check the troubleshooting section of this README)
- run `npm start`
- to check out example tests run `npm test` while your app is running
- Important notes
  - please do not change anything in the `package.json` files
  - you shouldn't add any new dependency to the project

## Submitting exam instructions
When you're ready to submit your exam:
1. Open the project's directory in your terminal
2. Delete `node_modules`
   1. run `rm -rf node_modules`
   2. run `rm -rf client/node_modules`
   3. run `rm -rf server/node_modules`
3. zip your project's directory
4. email your zip file to `wixenter@wix.com`
   1. You should preferably send this email from the email you used to apply to Wix Enter
   2. The title should be `Wix Enter exam submission - {Your full name}`
   3. The content should include `email: {The email address you used for your application}`
## Requirements:
### Tags:
1. Implement the add tag functionality to a post. You'll notice that currently the “+” sign to add a tag to a post will open a Select component with the available tags, but clicking on them will do nothing
> you can look at the tags list implementation (for both the **client** and **server** side) for an example. 
### Like / Dislike:
1. Implement the like & dislike functionality to a post. You'll notice that currently the like and dislike buttons are available, but clicking on them will do nothing.
   1. Clicking on like as the first reaction to a post should result in a full like button indicator with `data-testid={'fullLikeIcon-'+${postId}}`
   2. Clicking on dislike as the first reaction to a post should result in a full dislike button indicator with `data-testid={'fullDislikeIcon-'+${postId}}`
   3. Clicking on like on a post that is already liked should do nothing
   4. Clicking on dislike on a post that is already disliked should do nothing
   5. Clicking on like on a post that is already disliked should toggle the post to liked mode (same as in the first bullet)
   6. Clicking on dislike on a post that is already liked should toggle the post to disliked mode (same as in the second bullet)
### Filter:
1. By popularity - clicking on popularity from the menu should change the url and show only posts with higher popularity (number of likes). Currently clicking on a dropdown item will redirect but no filtering will occur
2. By tag - Clicking on a tag from the tags list, or from a post's tags should change the url and show only posts with the selected tag. Currently clicking on them does nothing
3. Support filtering by both tag and popularity by url, for example tag=frontend&popularity=2. If a user clicks on a tag from the tags list, and then on popularity, both should be in the url
4. Bonus - Mark the selected tag and/or popularity option using the components' apis, selected color should be "primary".
### Recommendations
1. Add a button to the header menu with the text `Explore more posts` and with `data-testid=myRecommendedPostsBtn`. Clicking on this button will redirect to `/my-recommended-posts` page which show posts in the same manner as the home page, but filters only recommended posts. The following attributes are true for a post to be considered a recommended post:
   - the user did not react to the post yet (neither like nor dislike)
   - other users that have liked posts that the user liked, also liked this post.
   > so for example if user1 liked posts 1 and 3, and user2 liked posts 1 and 2, then they both liked post 1, and the recomended posts for user1 will only show post 2, and the recomended posts for user2 will only show post 3.
> To simulate multiple users, you can just browse the app from different browsers, or clear the user cookie
1. Bonus - recommended posts should be sorted by recommendation strength - recommendation strength is the number of users who liked a post, and also liked a different post that the current user liked.
### Add post:
1. Clicking on the submit button should not submit anything if required fields are empty. Instead an empty required field should indicate an error
2. Use actual tags instead of hardcoded ones // ignore
3. Should submit when all required fields are filled, and then redirect to the home page
4. Bonus - limit the title to 80 characters and show an error message for longer values
### Bonus:
1. Bonus - provide an ellipsis solution for content longer than 200 characters with a read more button. Read more button should have `data-testid=postContent-readMoreButton`
