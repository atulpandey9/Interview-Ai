require('dotenv').config();
const app = require("./src/app");
const connectToDB = require("./src/config/database.js");
const port= 5000;
connectToDB();

app.get('/',(req,res)=>{
  return res.send("server is running")
})

app.listen(port, () => {
  console.log(`server is running in port ${port}`);
});

