const mongoose=require('mongoose');

const blacklistTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        require:true,
    }
},{
    timestamps:true
})

const tokenBlackListModel=mongoose.model("blacklistTokens",blacklistTokenSchema);

module.exports=tokenBlackListModel;