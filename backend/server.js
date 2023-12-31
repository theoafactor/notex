const express = require("express");
const session = require("express-session");
const connectMongoDBStore = require("connect-mongodb-session");
const mongodbstore = connectMongoDBStore(session);
const cors = require("cors");
const User = require("./User/Auth");

require("dotenv").config();


const store = new mongodbstore({
    uri: "mongodb+srv://cyclobold_user:kM92hD8Amnfm6b9t@cluster0.qcoqo.mongodb.net/notex?retryWrites=true&w=majority",
    collection: "sessions"
})



//create the server app
const server = express();

server.use(cors());

server.use(session({
    secret: "thisiswhateveriamputtingherethisworks",
    saveUninitialized: false,
    resave: false,
    store: store
}))

server.use(express.json());

//set the port
const PORT = process.env.PORT;

//set the endpoint

// root
server.get("/", (request, response) => {

    response.send({
        message: "Server works fine"
    })


})

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

            // send verification email
            const send_email_feedback = await User.sendVerificationEmail(email)

            if(send_email_feedback){
                return response.send({
                    message: `Account created: ${feedback.message} `,
                    code: "success",
                    data: feedback.data
                })
            }

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

        //login the user into a session
        console.log("Logs in the user")

        request.session.user = result.data;

        return response.send({
            message: result.message,
            code: result.code,
            data: result.data,
            session: request.session.id
        })


   }

  


})


server.post("/logout-user", function(request, response){

    let token = request.body.token;

    request.session.destroy(function(){

        return response.send({
            message: "User's session destroyed!",
            code: "logout-success",
            data: null,
            type: "logout-user"
        })

    })

   


})


//listening
server.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`))