const axios = require('axios');

// GraphQL query to fetch a list of questions
const problemsQuery = `#graphql
query getProblems($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug,
    limit: $limit,
    skip: $skip,
    filters: $filters
  ) {
    total: totalNum
    
    questions: data {
      questionFrontendId
      title
      titleSlug
      difficulty
      acRate
      topicTags {
        name
      }
    }
  }
}`;

// GraphQL query to fetch detailed content for a question
const questionContentQuery = `#graphql
query questionContent($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionFrontendId
    title
    titleSlug
    difficulty
    acRate
    content
    topicTags {
      name
    }
  }
}`;

// Function to fetch all questions (supports pagination via limit and skip)
async function fetchAllQuestions(limit =3000, skip = 0) {
  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      {
        query: problemsQuery,
        variables: { categorySlug: "",limit, skip, filters: {} }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com'
        }
      }
    );
    if (response.data.errors) {
      throw new Error(JSON.stringify(response.data.errors));
    }
    return response.data.data.problemsetQuestionList.questions;
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    return [];
  }
}

// Function to fetch detailed content for a single question by slug
async function fetchQuestionContent(titleSlug) {
  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      {
        query: questionContentQuery,
        variables: { titleSlug }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com'
        }
      }
    );
    if (response.data.errors) {
      throw new Error(JSON.stringify(response.data.errors));
    }
    return response.data.data.question;
  } catch (err) {
    console.error('Error fetching question content:', err.message);
    throw err;
  }
}

module.exports = { fetchAllQuestions, fetchQuestionContent };
