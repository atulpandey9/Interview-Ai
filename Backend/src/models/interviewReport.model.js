const mongoose=require('mongoose');


const technicalQuestionSchema=new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    intention:{
        type:String,
        required:true,
    },
    answere:{
        type:String,
        required:true
    }
},{
    _id:false
})

const behavioralQuestionSchema=new mongoose.Schema({
      question:{
        type:String,
        required:true
    },
    intention:{
        type:String,
        required:true,
    },
    answere:{
        type:String,
        required:true
    }
},{
    _id:false
})

const skillGapSchema=new mongoose.Schema({
    skill:{
        type:String,
        required:true
    },
    severity:{

        type:String,
        enum:["low","medium","high"],
        required:true
    }
},{
    _id:false
})

const preprationPlanSchema=new mongoose.Schema({
    day:{
        type:Number,
        required:true,
    },
    focus:{
        type:String,
        required:true,
    },
task:[{
    type:String,
    required:true
}]
})

const interviewReportSchema=new mongoose.Schema({
    jobDescription:{
        type:String,
        required:true,
    },
    resume:{
        type:String,
    },
    selfDiscription:{
        type:String,
    },
    matchScore:{
        type:Number,
        min:0,
        max:100,
    },
    technicalQuestion:[technicalQuestionSchema],
    behavioralQuestionSchema:[behavioralQuestionSchema],
    skillGapSchema:[skillGapSchema],
    preprationPlanSchema:[preprationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},{

    timestamps:true
})

const interviewReportModel=mongoose.model("interviewreport",interviewReportSchema);

module.exports=interviewReportModel;
