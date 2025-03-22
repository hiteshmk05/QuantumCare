// filepath: c:\Users\sirius\Documents\dev\QuantumCare\quantum_care\server\src\routes\geminiRoutes.ts
import { Router } from 'express';
import { sendToGemini } from '../controllers/GeminiController';

const router = Router();

router.post('/sendToGemini', sendToGemini);

export default router;