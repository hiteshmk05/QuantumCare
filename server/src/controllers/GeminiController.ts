// filepath: c:\Users\sirius\Documents\dev\QuantumCare\quantum_care\server\src\controllers\GeminiController.ts
import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined');
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

interface GeminiInput {
    prompt: string;
}

export const sendToGemini = async (req: Request, res: Response): Promise<void> => {
    try {
        const payload = req.body;

        // Ensure payload.entry exists and is an array
        if (!payload.entry || !Array.isArray(payload.entry)) {
            res.status(400).json({ message: 'Invalid payload format' });
            return;
        }

        // Extract relevant data from the payload
        const diagnosticReportEntry = payload.entry.find((entry: any) => entry.resource.resourceType === 'DiagnosticReport');
        if (!diagnosticReportEntry) {
            res.status(400).json({ message: 'DiagnosticReport not found in payload' });
            return;
        }

        const patientId = diagnosticReportEntry.resource.subject.reference;
        const observations = payload.entry.filter((entry: any) => entry.resource.resourceType === 'Observation').map((entry: any) => ({
            resourceType: entry.resource.resourceType,
            id: entry.resource.id,
            status: entry.resource.status,
            code: entry.resource.code,
            valueQuantity: entry.resource.valueQuantity,
            referenceRange: entry.resource.referenceRange,
            interpretation: entry.resource.interpretation,
        }));
        const diagnosticReport = diagnosticReportEntry.resource;

        // Prepare the data to send to Gemini API
        const geminiPayload = {
            patientId,
            observations,
            diagnosticReport,
        };

        // Convert the payload to a string prompt
        const prompt ="You are a clinical decision support system designed to assist doctors in decision-making. You will receive patient vitals as your input. Based on this information, you need to generate  potential diseases and recommend medications and  treatment plans for those diseases" +JSON.stringify(geminiPayload);

        // Call the Gemini API using the GoogleGenerativeAI library
        const result = await model.generateContent(prompt);

        // Respond with the result from Gemini API
        res.status(200).json({ response: result.response.text() });
    } catch (error: any) {
        console.error('Error sending data to Gemini API:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};