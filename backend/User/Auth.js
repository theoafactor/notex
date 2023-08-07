require("dotenv").config();
const mongodb = require("mongodb");
const bcrypt = require("bcrypt");

//create a client
const client = new mongodb.MongoClient(process.env.DB_URL);

const User = (function(){

    /**
     * Checks if email exists
     * @param {*} email 
     */
    const checkIfEmailExists = async (email) => {

        const feedback = await client.db(process.env.DB_NAME).collection("users").findOne({ email: email });

        console.log(`Check: `, feedback)

        if(feedback){
            //the email exists already...
            return "exists";
        }else{
            return "not-exist";
        }

    }


   /**
    * - Creates a new user
    * @param {string} firstname 
    * @param {string} lastname 
    * @param {string} email 
    * @param {number} password 
    * @returns {any}
    */
    const createUserAccount = async (firstname, lastname, email, password) => {

        // check if the email has been used already..
        const result = await checkIfEmailExists(email);

        if(result == "exists"){
            //the user exists already
            return {
                message: "This email has been used already",
                code: "duplicate-error",
                data: { email: email }
            }
        }else{
            //the user does not exist 

            password = await bcrypt.hash(password, 10)

            const user = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            }

            const feedback = await client.db(process.env.DB_NAME).collection("users").insertOne(user);

            if(feedback){
                return {
                    message: "User created",
                    code: "success",
                    data: { firstname: firstname, lastname: lastname, email: email }
                }
            }

        }


    }

    /**
     * Gets the user data by email
     * @param {*} email 
     */
    const getUserData = async (email) => {

        const user = await client.db(process.env.DB_NAME).collection(process.env.USERS_TB).findOne({email});

        if(user){
            return user;
        }

        return null;

    }


    /**
     * Logs in the user 
     * @param {string} email  the user used to register
     * @param {string} password 
     */
    const loginUser = async (email, password) => {

        let check_user = await checkIfEmailExists(email)

        if(check_user === "exists"){

            //get user information
           let get_user_result = await getUserData(email)

           if(get_user_result != null){
            //log in the usser
            //generate unique token

            let current_password = get_user_result.password;

          

            const password_check = await bcrypt.compare(password, current_password);

            console.log(password_check)

            if(password_check){
                const date = new Date();

                const current_time = date.getTime();
    
                const token = `tok_${current_time}`;
     
                const feedback = await client.db(process.env.DB_NAME).collection("users").updateOne({email: email}, {$set: {"is_user_logged_in": true, "login_token": token }})
    
                
    
                if(feedback){
    
                    return{
                        message: "User logged in",
                        code: "success",
                        data: {
                            is_user_logged_in: true,
                            user: await client.db(process.env.DB_NAME).collection(process.env.USERS_TB).findOne({email}),
                            token: token
                        }
                    }
    
                }

            }else{
                return {
                    message: "User does not exist",
                    code: "error"
                }

            }

          


        }else{
            return {
                message: "User does not exist",
                code: "error"
            }
        }


           }else{
            return {
                message: "User's email does not exist",
                code: "error"
            }

           }

        

    }


    return {
        
        createUserAccount: createUserAccount,
        loginUser: loginUser


    }





}())

module.exports = User;