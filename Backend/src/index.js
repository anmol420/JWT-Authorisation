import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`App Started On: ${process.env.PORT}`);
        });
    })
    .catch((e) => {
        console.log(`Error - ${e}`);
    });