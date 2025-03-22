import mongoose from "mongoose";

require('dotenv').config();

export const connect = () => {
    if (!process.env.MONGODB_URL) {
        console.error("MONGODB_URL is not defined in environment variables");
        process.exit(1);
    }

    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => console.log("Database connected successfully"))
        .catch((error) => {
            console.error("Couldn't connect to database", error);
            process.exit(1);
        });
};
