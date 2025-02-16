const axios = require('axios');

const communitySolutionsQuery = `query communitySolutions(
  $questionSlug: String!
  $skip: Int!
  $first: Int!
  $query: String
  $orderBy: TopicSortingOption
  $languageTags: [String!]
  $topicTags: [String!]
) {
  questionSolutions(
    filters: {
      questionSlug: $questionSlug
      skip: $skip
      first: $first
      query: $query
      orderBy: $orderBy
      languageTags: $languageTags
      topicTags: $topicTags
    }
  ) {
    hasDirectResults
    totalNum
    solutions {
      id
      title
      commentCount
      topLevelCommentCount
      viewCount
      pinned
      isFavorite
      solutionTags {
        name
        slug
      }
      post {
        id
        status
        voteCount
        creationDate
        isHidden
        author {
          username
          isActive
          nameColor
          activeBadge {
            displayName
            icon
          }
          profile {
            userAvatar
            reputation
          }
        }
        content
      }
      searchMeta {
        content
        contentType
        commentAuthor {
          username
        }
        replyAuthor {
          username
        }
        highlights
      }
    }
  }
}`;

async function fetchCommunitySolutions(questionSlug, options = {}) {
  // Default options as in your curl command:
  const variables = {
    questionSlug,
    skip: 0,
    first: 5,
    query: "",
    orderBy: "hot",
    languageTags: ["java"],
    topicTags: [""],
    ...options
  };

  try {
    const response = await axios.post(
      'https://leetcode.com/graphql/',
      { query: communitySolutionsQuery, variables },
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
          // Replace with your valid CSRF token if necessary.
          'Cookie': ''
        }
      }
    );
    if (response.data.errors) {
      throw new Error(JSON.stringify(response.data.errors));
    }
    // Return the solutions array from the response.
    return response.data.data.questionSolutions.solutions;
  } catch (err) {
    console.error('Error fetching community solutions:', err.message);
    throw err;
  }
}




module.exports = { fetchCommunitySolutions };
