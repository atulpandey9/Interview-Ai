const mongoose=require('mongoose');

async function connectToDB(){
    try{await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to DataBase")
    }
    catch(error){
  console.log("error")
    }
 
}
module.exports=connectToDB;