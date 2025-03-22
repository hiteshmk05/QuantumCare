import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Sub-schema for Identifier (simplified)
const IdentifierSchema = new Schema({
  use: String,
  type: {
    coding: [{
      system: String,
      code: String,
      display: String
    }],
    text: String
  },
  system: String,
  value: String,
  period: Schema.Types.Mixed, // Can define PeriodSchema if needed
  assigner: Schema.Types.Mixed // Reference to an Organization
}, { _id: false });

// Sub-schema for HumanName
const HumanNameSchema = new Schema({
  use: String,
  text: String,
  family: String,
  given: [String],
  prefix: [String],
  suffix: [String],
  period: Schema.Types.Mixed
}, { _id: false });

// Sub-schema for ContactPoint
const ContactPointSchema = new Schema({
  system: String, // e.g., phone, email
  value: String,
  use: String,
  rank: Number,
  period: Schema.Types.Mixed
}, { _id: false });

// Sub-schema for Address
const AddressSchema = new Schema({
  use: String,
  type: String,
  text: String,
  line: [String],
  city: String,
  district: String,
  state: String,
  postalCode: String,
  country: String,
  period: Schema.Types.Mixed
}, { _id: false });

// Sub-schema for CodeableConcept
const CodeableConceptSchema = new Schema({
  coding: [{
    system: String,
    version: String,
    code: String,
    display: String,
    userSelected: Boolean
  }],
  text: String
}, { _id: false });

// Sub-schema for Attachment
const AttachmentSchema = new Schema({
  contentType: String,
  language: String,
  data: String,
  url: String,
  size: Number,
  hash: String,
  title: String,
  creation: Date
}, { _id: false });

// Sub-schema for Reference
const ReferenceSchema = new Schema({
  reference: String,
  type: String,
  identifier: IdentifierSchema,
  display: String
}, { _id: false });

// Sub-schema for Period
const PeriodSchema = new Schema({
  start: Date,
  end: Date
}, { _id: false });

// Create a sub-schema for Link
const LinkSchema = new Schema({
  other: ReferenceSchema,
  type: String // e.g., "replaced-by", "replaces", "refer", "seealso"
}, { _id: false });

// Define the main resource schema for Patient
const resourceSchema = new Schema({
  resourceType: { type: String, required: true, default: 'Patient' },
  id: String,
  meta: Schema.Types.Mixed, // Meta is a complex object; use Mixed or define a sub-schema
  implicitRules: String,
  language: String,
  text: Schema.Types.Mixed, // Narrative; can be a sub-schema if needed
  contained: [Schema.Types.Mixed],
  extension: [Schema.Types.Mixed],
  modifierExtension: [Schema.Types.Mixed],
  identifier: [IdentifierSchema],
  active: Boolean,
  name: [HumanNameSchema],
  telecom: [ContactPointSchema],
  gender: String, // Expected values: "male", "female", "other", "unknown"
  birthDate: String, // Storing as a string (ISO date) or Date if you prefer
  deceasedBoolean: Boolean,
  deceasedDateTime: Date,
  address: [AddressSchema],
  maritalStatus: CodeableConceptSchema,
  multipleBirthBoolean: Boolean,
  multipleBirthInteger: Number,
  photo: [AttachmentSchema],
  contact: [{
    relationship: [CodeableConceptSchema],
    name: HumanNameSchema,
    telecom: [ContactPointSchema],
    address: AddressSchema,
    gender: String,
    organization: ReferenceSchema,
    period: PeriodSchema
  }],
  communication: [{
    language: CodeableConceptSchema,
    preferred: Boolean
  }],
  generalPractitioner: [ReferenceSchema],
  managingOrganization: ReferenceSchema,
  link: [LinkSchema] // Use the LinkSchema here
}, { timestamps: true });

// Define an (empty) metaData schema (update as needed)
const metaDataSchema = new Schema({}, { _id: false });

// Main Patient schema based on the FHIR Patient resource
const PatientSchema = new Schema({
  metaData: metaDataSchema,
  resource: {
    type: resourceSchema,
    required: true,
  }
});

// Export the model
const Patient = mongoose.model('Patient', PatientSchema);
export default Patient;
