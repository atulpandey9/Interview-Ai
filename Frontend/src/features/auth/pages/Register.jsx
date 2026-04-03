import React from "react";
import { useState } from "react";
import { useNavigate,Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
 const handleSubbmit=(e)=>{
        e.preventDefault()
    }
const Register =()=>{
 const navigate=useNavigate()
 const [username,setUsername]=useState("")
 const [email,setEmail]= useState("")
 const [password,setPassword]=useState("")

const {loading,handleRegiser}=useAuth()

const handleSubbmit = async(e)=>{
    e.preventDefault()
    await handleRegiser({username,email,password})
    navigate("/")
}

if(loading){
    return (<main><h1>Loading....</h1></main>)
}
    return(
  <main>
    <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubbmit}>
           <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
            onChange={(e)=>{setUsername(e.target.value)}}
             type="text" id="username" name="username"  placeholder="Enter username"/>
             <label htmlFor="email">Email</label>
            <input 
             onChange={(e)=>{setEmail(e.target.value)}}
            type="emai" id="email" name="email"  placeholder="Enterr Email Address"/>
           </div>
            <div className="input-group">
            <label htmlFor="email">Password</label>
            <input 
            onChange={(e)=>{setPassword(e.target.value)}}
            type="password" id="password" name="password"  placeholder="Enterr Password"/>
           </div>
           <button className="button primary-button">Register</button>
        </form>

        <p>Already have an account?<Link to={"/login"}>Login</Link> </p>
    </div>
 </main>
    )
 
}
export default Register