import express, { Application } from "express";

import { connect } from "./config/database";
import patientRoutes from "./routes/patientRoutes";
import reportRoutes from "./routes/reportRoutes"
import geminiRoutes from './routes/geminiRoutes';

require('dotenv').config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

connect();

app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use("/api/v1/patient",patientRoutes);
app.use("/api/v1/report",reportRoutes);
app.use('/gemini', geminiRoutes);

app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;