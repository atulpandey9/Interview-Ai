require('dotenv').config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");
const PORT = process.env.PORT || 5000 ;
connectToDB();

app.get('/',(req,res)=>{
  return res.send("server is running")
})

app.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`);
});

