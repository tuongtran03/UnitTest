import createWorkoutPlans from "../libs/ai.js"
import Plan from "../models/plan.model.js";
export const updateCurrentPlanById = async (req, res) => {
    try {
        const planId = req.params.planId
        const current = req.query.current

        const updated = await Plan.findByIdAndUpdate(planId, { current: current }, { new: true })
        res.status(200).json({ message: "Update Plan Successfully", data: updated })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const recreatePlans = async (req, res) => {
    try {
        const { _id } = req.user
        await Plan.deleteMany({ user: _id })
        const plans = req.body
        const saved = await Plan.insertMany(plans)
        res.status(200).json({ message: "Tạo lại kế hoạch tập luyện thành công!", data: saved })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createPlans = async (req, res) => {

    const plans = req.body

    try {


        // ai.js
        // const workoutPlans = await createWorkoutPlans(user, exerciseList)

        // const workoutPlans = await createWorkoutPlans(user, exerciseList)
        // const cleanedJsonString = JSON.parse(workoutPlans.candidates[0].content.parts[0].text);
        // const formattedJsonString = JSON.stringify(cleanedJsonString, null, 2);
        // console.log(formattedJsonString);


        // save plans to mongodb right there below
        const saved = await Plan.insertMany(plans)
        // const saved = await newPlan.save()



        res.status(200).json({ message: "Tạo kế hoạch tập luyện thành công!", data: saved })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAllPlansByUserId = async (req, res) => {
    try {

        const { _id } = req.user

        const data = await Plan.find({ user: _id })
            .populate({
                path: 'user'
            })
            .populate({
                path: 'trainings',
                populate: {
                    path: 'exercises.exercise',
                }
            })

        res.status(200).json({ message: "Lấy dữ liệu lộ trình bài tập thành công!", data: data })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}