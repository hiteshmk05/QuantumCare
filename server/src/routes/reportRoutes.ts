import express, { Router } from 'express';
import { createDiagnosticReport } from '../controllers/ReportController';
const router: Router = express.Router();

router.post('/uploadReport/:id',createDiagnosticReport);

export default router;
