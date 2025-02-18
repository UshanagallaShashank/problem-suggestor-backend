const { fetchAllQuestions } = require('./leetcodeController'); // Returns an array of questions
const Problem = require('../models/Problem');
const UserProgress = require('../models/UserProgress');

/**
 * Define an ordering for difficulty.
 */
const difficultyOrder = {
  "easy": 1,
  "medium": 2,
  "hard": 3
};

/**
 * Helper: Dynamically find a candidate problem for a given difficulty by iterating thresholds.
 * @param {Array} questions - Array of unsolved questions.
 * @param {string} targetDifficulty - "Easy", "Medium", or "Hard"
 * @param {number} startThreshold - Starting acRate threshold (e.g., 90 for Easy)
 * @param {number} minThreshold - Minimum acRate threshold (e.g., 70 for Easy)
 * @returns {object|null} - Object with candidate and usedThreshold, or null if none found.
 */
function findCandidateForDifficulty(questions, targetDifficulty, startThreshold, minThreshold) {
  for (let threshold = startThreshold; threshold >= minThreshold; threshold -= 5) {
    const candidate = questions.find(q =>
      q.difficulty.toLowerCase() === targetDifficulty.toLowerCase() &&
      q.acRate >= threshold
    );
    if (candidate) {
      return { candidate, usedThreshold: threshold };
    }
  }
  return null;
}

/**
 * Generate a personalized suggestion for the next problem for the user.
 * - Fetches all questions (excluding "Database" problems).
 * - Retrieves user progress from the database.
 * - Filters out problems the user has already solved (by titleSlug).
 * - Sorts unsolved questions first by difficulty (Easy → Medium → Hard) then by acRate descending.
 * - Determines the target difficulty based on solved counts and performance.
 * - Uses an offset (points to subtract from the starting threshold) to allow picking the next candidate.
 * 
 * @param {string} userId - The user's ID.
 * @param {number} offset - (Optional) Points to subtract from the default threshold (default: 0).
 * @returns {object} - Contains candidate problem details, suggestedSlug, progress counts, suggestion message, target level, and the threshold used.
 */
async function getPersonalizedSuggestionAdvanced(userId, offset = 0) {
  // 1. Fetch all questions (using a high limit to cover 3000+ problems)
  const allQuestions = await fetchAllQuestions(6000, 0);
  console.log(`Fetched ${allQuestions.length} questions from LeetCode.`);
  
  // 2. Exclude questions whose topicTags include "Database" (case-insensitive) and empty arrays.
  const filteredQuestions = allQuestions.filter(q => {
    if (!q.topicTags || !Array.isArray(q.topicTags) || q.topicTags.length === 0) {
      return false; 
    }
    
    return !q.topicTags.some(tag => tag.name.toLowerCase() === 'database');
  });
  
  console.log(`Filtered down to ${filteredQuestions.length} questions excluding Database topics.`);
  
  // 3. Retrieve user progress from the DB.
  const progress = await UserProgress.find({ userId });
  console.log(`User progress records fetched: ${progress.length}`);
  
  // 4. Get solved Problem documents from your Problem collection.
  const solvedProblemIds = progress.map(record => record.problemId.toString());
  const solvedProblems = await Problem.find({ _id: { $in: solvedProblemIds } });
  const solvedTitleSlugs = solvedProblems.map(problem => problem.titleSlug);
  console.log(`User has solved ${solvedTitleSlugs.length} problems (by titleSlug).`);
  
  // 5. Filter out questions that the user has already solved.
  const unsolvedQuestions = filteredQuestions.filter(q => !solvedTitleSlugs.includes(q.titleSlug));
  console.log(`Remaining unsolved questions: ${unsolvedQuestions.length}`);
  
  // 6. Sort unsolved questions:
  unsolvedQuestions.sort((a, b) => {
    const diffA = difficultyOrder[a.difficulty.toLowerCase()] || 999;
    const diffB = difficultyOrder[b.difficulty.toLowerCase()] || 999;
    if (diffA !== diffB) {
      return diffA - diffB;
    }
    return b.acRate - a.acRate;
  });
  
  // 7. Group user's solved progress by difficulty.
  const progressByDifficulty = { Easy: [], Medium: [], Hard: [] };
  progress.forEach(record => {
    if (record.difficulty in progressByDifficulty) {
      progressByDifficulty[record.difficulty].push(record);
    }
  });
  const countEasy = progressByDifficulty.Easy.length;
  const countMedium = progressByDifficulty.Medium.length;
  const countHard = progressByDifficulty.Hard.length;
  
  // 8. Determine target difficulty and threshold criteria.
  let targetDifficulty = 'Easy';
  let startThreshold, minThresholdValue, note;
  
  // Defaults for Easy:
  startThreshold = 80;
  minThresholdValue = 10; // (You might adjust this, as acRate rarely goes that low for Easy)
  note = `Practice Easy problems with acceptance rate ≥ ${startThreshold}%.`;
  
  if (countEasy >= 20) {
    const lowEasy = progressByDifficulty.Easy.filter(rec => rec.acRate < 90);
    if (lowEasy.length > 0) {
      targetDifficulty = 'Medium';
      startThreshold = 80;
      minThresholdValue = 50;
      note = `You've solved at least 20 Easy problems, but some had acRate below 90%. Try a Medium problem with acceptance rate ≥ ${startThreshold}%.`;
    }
  }
  
  if (targetDifficulty === 'Medium' && countMedium >= 50) {
    const lowMedium = progressByDifficulty.Medium.filter(rec => rec.acRate < 80);
    if (lowMedium.length > 0) {
      targetDifficulty = 'Hard';
      startThreshold = 60;
      minThresholdValue = 30;
      note = `You've solved at least 50 Medium problems, but some had acRate below 80%. Consider a Hard problem with acceptance rate ≥ ${startThreshold}%.`;
    }
  }
  
  // 9. Apply the offset (points to subtract from the starting threshold) for "next" candidate.
  const adjustedThreshold = startThreshold - offset;
  console.log(`Target difficulty: ${targetDifficulty}, adjusted threshold: ${adjustedThreshold}, minimum: ${minThresholdValue}`);
  
  // 10. Use dynamic threshold search to find a candidate from unsolved questions.
  const result = findCandidateForDifficulty(unsolvedQuestions, targetDifficulty, adjustedThreshold, minThresholdValue);
  if (!result) {
    throw new Error(`No candidate found for level "${targetDifficulty}" with acceptance rate ≥ ${minThresholdValue}%`);
  }
  
  const { candidate, usedThreshold } = result;
  const suggestionMessage = `Based on your progress (Easy: ${countEasy}, Medium: ${countMedium}, Hard: ${countHard}),
we suggest you attempt a ${targetDifficulty} problem. We recommend problem "${candidate.title}" (ID: ${candidate.questionFrontendId})
with an acceptance rate of ${candidate.acRate}%. (Threshold used: ${usedThreshold}%) ${note}`;
  
  return {
    candidate,
    suggestedSlug: candidate.titleSlug,
    progress: { Easy: countEasy, Medium: countMedium, Hard: countHard },
    suggestion: suggestionMessage,
    targetLevel: targetDifficulty,
    usedThreshold
  };
}

module.exports = { getPersonalizedSuggestionAdvanced };

