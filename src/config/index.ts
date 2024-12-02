import dotenv from "dotenv";
import path from "path";


dotenv.config({path: path.join(process.cwd(), '.env')});


export default {
    port: process.env.PORT,
    cloud_name: process.env.CLOUDYNARY_CLOUDE_NAME,
    cloud_api_key: process.env.CLOUDYNARY_API_KEY,
    cloud_secret_key: process.env.CLOUDYNARY_SECRET_KEY,
}