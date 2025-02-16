const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
require('dotenv').config();
const {processPrompt}=require("./aiController")
const { fetchCommunitySolutions } = require('./leetcodeSolutionController'); // Adjust path as needed

async function improveUserCode(slug, userCode) {
  if (!userCode) {
    throw new Error('User code is required in the request body.');
  }
  try {
    // Fetch community solutions for the given slug.
    const communitySolutions = await fetchCommunitySolutions(slug);
    let communityCode = '';
    if (communitySolutions && communitySolutions.length > 0) {
      // Depending on your solution structure, adjust as needed.
      communityCode = communitySolutions[0].post?.content || communitySolutions[0].code || '';
    }
    // Build a prompt that includes both the community solution and the user code.
    const prompt =
`Here are two pieces of code for the same LeetCode problem:

--- Community Solution ---
${communityCode || "No community solution available."}

--- User Code ---
${userCode}

Please provide detailed suggestions on how to improve the user's code. Include comparisons between the two approaches, point out potential inefficiencies or issues in the user's code, and provide a better alternative approach in plain text without any code  if you wanted to give a code make it better  with Capitalize the first letter of the first word in the sentence. and return for better visualization`;

    const aiResponse = await processPrompt(prompt);
    return aiResponse;
  } catch (error) {
    console.error('Error improving user code:', error.message);
    throw error;
  }
}

module.exports = { improveUserCode };
