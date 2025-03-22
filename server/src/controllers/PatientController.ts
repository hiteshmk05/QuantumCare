import { Request, Response, Router } from 'express';
import Patient from '../models/Patient'; // Adjust the path if necessary



// Create a new patient document
export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    // Expect the client to send a payload containing the "resource" field (and optionally metaData)
    const { metaData, resource } = req.body;
    
    if (!resource) {
      res.status(400).json({ error: 'resource field is required' });
      return;
    }
    
    // Create new patient document using the provided data
    const newPatient = new Patient({ metaData, resource });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve all patient documents
export const getPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve a single patient by MongoDB _id
export const getPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing patient document by MongoDB _id
export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body, // expects payload with metaData and/or resource updates
      { new: true }
    );
    if (!updatedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a patient document by MongoDB _id
export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


