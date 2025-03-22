import express, { Router } from 'express';
import { createPatient, deletePatient, getPatient, getPatients, updatePatient } from '../controllers/PatientController';
const router: Router = express.Router();



router.post('/createPatient', createPatient);
router.post('/getPatients', getPatients);
router.post('/getPatientById/:id', getPatient);
router.put('/updatePatient/:id', updatePatient);
router.delete('/deletePatients/:id', deletePatient);

export default router;
