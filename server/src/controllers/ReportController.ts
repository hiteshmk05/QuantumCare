import { Request, Response } from 'express';
// import DiagnosticReport from '../models/DiagnosticReport';
import DiagnosticReport from '../models/DiagnosticReport';
import Patient from '../models/Patient';

/**
 * Controller to create a DiagnosticReport for a given patient.
 * Expects the patient id (e.g., "patient/123") as a route parameter.
 * The request body should contain the DiagnosticReport fields under the "resource" key.
 */
export const createDiagnosticReport = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract the patient id from the route parameters.
    // const patientIdParam: string | undefined= req.query['id'] // e.g., "patient/123"
    const patientIdParam:string = req.params.id;
    // Search for the patient document by matching the FHIR resource id.
    // Adjust the query if your patient resource id is stored differently.
    const patient = await Patient.findOne({ 'resource.id': patientIdParam });

    // {
//     "message": "Internal Server Error",
//     "error": "DiagnosticReport validation failed: resource: Path `resource` is required."
// }

    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }
    //http://localhost:4000/api/v1/report/uploadReport/12345

    // Prepare the diagnostic report data.
    // Do not add extra fields; expect the necessary structure in req.body.
    const diagnosticReportData = req.body;

    // Set the metaData's paitentID field to reference the found patient.
    diagnosticReportData.metaData = { paitentID: patient._id };

    // Create a new DiagnosticReport document.
    const diagnosticReport = new DiagnosticReport(diagnosticReportData);

    // Save the DiagnosticReport in the database.
    await diagnosticReport.save();

    // Respond with the newly created report.
    res.status(201).json(diagnosticReport);
    return;
  } catch (error: any) {
    // Log the error or handle it appropriately in production.
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
    return;
  }
};
