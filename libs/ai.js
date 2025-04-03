import { GoogleGenerativeAI } from '@google/generative-ai'

const key = process.env.GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const generatePrompt = (trainingRecord) => {
  const training = JSON.parse(trainingRecord.training);
  const exercises = training.exercises;
  const totalTime = trainingRecord.duration;

  let prompt = `Giúp tôi tính calo tiêu hao cho buổi tập:\n`;

  exercises.forEach((exerciseData, index) => {
    const exercise = exerciseData.exercise;
    const sets = exerciseData.sets;

    // Tạo thông tin bài tập
    let exerciseInfo = `- ${exercise.name}: `;
    let setsInfo = sets
      .map((set, setIndex) => {
        return `${set.reps} reps x ${set.kilogram} kg${setIndex === sets.length - 1 ? '' : ', '}`;
      })
      .join("");
    exerciseInfo += `${sets.length} sets (${setsInfo}).`;

    prompt += exerciseInfo + `\n`;
  });

  prompt += `- Tổng thời gian: ${totalTime}, chia đều cho ${exercises.length} bài tập.\n`;

  return prompt;
}
const createWorkoutPlans = async (trainingRecord) => {
  const prompt = generatePrompt(trainingRecord)

  try {
    const res = await model.generateContent(prompt);
    const workoutPlanText = res.response.candidates[0].content.parts[0].text;
    const startIndex = workoutPlanText.indexOf('{');
    const endIndex = workoutPlanText.lastIndexOf('}');
    const cleanedJson = workoutPlanText.substring(startIndex, endIndex + 1);
    const workoutPlan = JSON.parse(cleanedJson);

    return workoutPlan;
  } catch (error) {
    console.error("Error:", error.message || error);
  }
};


export default createWorkoutPlans;