const pdfParse=requier("pdf-parse")
const generateInterviewReport=require("../services/ai.service")
const interviewReportModel=require("../models/interviewReport.model")
async function generateInterviewReportController(req,res) {
    const resumeFile=req.file

    const resumeContent=pdfParse(req.file.buffer)
    const {selfDescription,jobDescription}=req.body

    const interviewReportByAI=await generateInterviewReport({
        resume:resumeContent,
        selfDescription,
        jobDescription
    })

const interviewReport=await interviewReportModel.create({
    user:req.user.id,
    resume:resumeContent,
    selfDiscription,
    jobDescription,
    ...interviewReportByAI
})
res.status(201).json({
    message:"interview report genereted successfully"
})
}

module.exports={generateInterviewReportController}