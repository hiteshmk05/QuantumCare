import express, { Application } from "express";

import { connect } from "./config/database";
import patientRoutes from "./routes/patientRoutes";

require('dotenv').config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

connect();

app.use(express.json());

app.use("/api/v1/patient",patientRoutes);

app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;