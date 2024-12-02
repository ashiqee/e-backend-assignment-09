import dotenv from "dotenv";
import path from "path";


dotenv.config({path: path.join(process.cwd(), '.env')});


export default {
    port: process.env.PORT,
    cloud_name: process.env.CLOUDYNARY_CLOUDE_NAME,
    cloud_api_key: process.env.CLOUDYNARY_API_KEY,
    cloud_secret_key: process.env.CLOUDYNARY_SECRET_KEY,
    emailSender:{
        email: process.env.EMAIL,
        app_pass: process.env.APP_PASS,
    },
    jwt:{
        jwt_secret:process.env.JWT_SECRET ,
        expires_in:process.env.EXPIRES_IN,
        refresh_token_secret:process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expires_in:process.env.REFRESH_TOKEN_EXPIRES_IN,
        reset_pass_secret:process.env.RESET_PASS_TOKEN ,
        reset_pass_token_expires_in:process.env.RESET_PASS_TOKEN_EXPIRES_IN,
        
    },
    reset_pass_link:process.env.RESET_PASS_LINK,
}