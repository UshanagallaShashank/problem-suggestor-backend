const Problem = require('../models/Problem');
const { fetchAllQuestions, fetchQuestionContent } = require('./leetcodeController');
const { fetchCommunitySolutions } = require('./leetcodeSolutionController');

async function insertAllProblems(req, res) {
  try {
    console.log('Fetching all questions from LeetCode...');
    // Fetch all questions using a high limit (e.g. 3000)
    const questions = await fetchAllQuestions(3500, 0);
    console.log(`Total questions fetched: ${questions.length}`);

    let newCount = 0;
    let duplicateCount = 0;

    // Loop over each fetched question.
    for (const question of questions) {
      console.log(`Processing question: ${question.titleSlug}`);
      // Check if a problem with the same titleSlug already exists.
      const exists = await Problem.findOne({ titleSlug: question.titleSlug });
      if (exists) {
        duplicateCount++;
        console.log(`Skipping duplicate: ${question.titleSlug}`);
        continue;
      }

      console.log(`Fetching detailed content for: ${question.titleSlug}`);
      const detailed = await fetchQuestionContent(question.titleSlug);
      if (!detailed) {
        console.log(`No detailed content found for: ${question.titleSlug}`);
        continue;
      }

      console.log(`Fetching community solutions for: ${question.titleSlug}`);
      // Fetch up to 3 community solutions.
      const solutions = await fetchCommunitySolutions(question.titleSlug, { first: 3 });
      console.log(`Fetched ${solutions.length} community solutions for: ${question.titleSlug}`);

      // Create a new Problem document with all relevant fields.
      const newProblem = new Problem({
        questionFrontendId: detailed.questionFrontendId,
        title: detailed.title,
        titleSlug: detailed.titleSlug,
        description: detailed.content || detailed.title,
        difficulty: detailed.difficulty,
        acRate: detailed.acRate,
        topicTags: detailed.topicTags || [],
        testCases: [], // Optionally, add logic to populate test cases if available.
        solutions: solutions.slice(0, 3) // Store up to 3 solutions.
      });

      await newProblem.save();
      newCount++;
      console.log(`Inserted new problem: ${detailed.titleSlug}`);
    }

    const summaryMessage = `Inserted ${newCount} new problems. Skipped ${duplicateCount} duplicates.`;
    console.log(summaryMessage);
    return res.status(200).json({ success: true, message: summaryMessage });
  } catch (error) {
    console.error('Error inserting problems into DB:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { insertAllProblems };
