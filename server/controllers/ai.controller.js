import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateImpactReport } from "../services/gemini.service.js";

export const generateReport = async (req, res, next) => {
  try {
    console.log("REQ BODY:", req.body);
    
    const { prompt } = req.body;
    if (!prompt) {
      throw new ApiError(400, "Prompt is required");
    }

    const report = await generateImpactReport(prompt);

    res.status(200).json({
  success: true,
  text: report
});

  } catch (error) {
    next(error); // send to error middleware
  }
};