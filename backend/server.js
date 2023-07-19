const express = require("express");
const User = require("./User/Auth");

require("dotenv").config();



//create the server app
const server = express();

server.use(express.json());

//set the port
const PORT = process.env.PORT;

//set the endpoint

//authentication
server.post("/register-user", async (request, response) => {

    //check the user information
    let firstname = request.body.firstname.trim();
    let lastname = request.body.lastname.trim();
    let email = request.body.email.trim();
    let password = request.body.password.trim();

    if(firstname.length > 0 && lastname.length > 0 && email.length > 0 && password.length > 0){
        //proceed

        const feedback = await User.createUserAccount(firstname, lastname, email, password);

        console.log(feedback)
       

        if(feedback.code == "success"){
            return response.send({
                message: `Account created: ${feedback.message} `,
                code: "success",
                data: feedback.data
            })
        }

        return response.send({
            message: `Could not create account: `,
            code: `Error: ${feedback.code}`,
            data: null
        })

    }

    return response.send({
        message: "All fields are required", 
        code: 'error',
        data: null
    })





})


//login 
server.post("/login-user", async (request, response) => {

    let email = request.body.email.trim();
    let password = request.body.password.trim();

    if(email.length == 0 || password.length == 0){
        //username and password required

        return response.send({
            message: "Username and Password required",
            code: "error",
            data: null
        })


    }

   let result = await User.loginUser(email, password)

   if(result.code == 'error'){
        return response.send({
            message: "We could not log you in at the moment. Have you registered?",
            code: "error",
            data: null
        })
   }else{

        return response.send({
            message: result.message,
            code: result.code,
            data: result.data
        })


   }

  


})



//listening
server.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`))