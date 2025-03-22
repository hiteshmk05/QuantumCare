import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// --- Sub-schemas ---

// Identifier (simplified)
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
  period: Schema.Types.Mixed, // Optionally, define a PeriodSchema
  assigner: Schema.Types.Mixed // Optionally, define a Reference to an Organization
}, { _id: false });

// HumanName
const HumanNameSchema = new Schema({
  use: String,
  text: String,
  family: String,
  given: [String],
  prefix: [String],
  suffix: [String],
  period: Schema.Types.Mixed
}, { _id: false });

// ContactPoint
const ContactPointSchema = new Schema({
  system: String, // e.g., phone, email
  value: String,
  use: String,
  rank: Number,
  period: Schema.Types.Mixed
}, { _id: false });

// Address
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

// CodeableConcept
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

// Attachment (for photos, etc.)
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

// Period
const PeriodSchema = new Schema({
  start: Date,
  end: Date
}, { _id: false });

// Reference
const ReferenceSchema = new Schema({
  reference: String,
  type: String,
  identifier: IdentifierSchema,
  display: String
}, { _id: false });

// --- Practitioner Schema ---

const resourceSchema=new Schema({
    resourceType: { type: String, required: true, default: 'Practitioner' },
  id: String,
  meta: Schema.Types.Mixed,             // Meta information (can be defined in detail if needed)
  implicitRules: String,
  language: String,
  text: Schema.Types.Mixed,              // Narrative text
  contained: [Schema.Types.Mixed],
  extension: [Schema.Types.Mixed],
  modifierExtension: [Schema.Types.Mixed],
  
  // FHIR Practitioner specific fields
  identifier: [IdentifierSchema],        // An identifier for the practitioner
  active: Boolean,                       // Record active status
  name: [HumanNameSchema],               // Practitioner names
  telecom: [ContactPointSchema],         // Contact details
  gender: String,                        // Expected: "male", "female", "other", "unknown"
  birthDate: String,                     // Date of birth (ISO string or Date type)
  deceasedBoolean: Boolean,
  deceasedDateTime: Date,
  address: [AddressSchema],              // Addresses
  photo: [AttachmentSchema],             // Photos
  
  // Qualification details
  qualification: [{
    identifier: [IdentifierSchema],    // Qualification identifier(s)
    code: CodeableConceptSchema,         // Coded representation of the qualification
    period: PeriodSchema,                // Validity period for the qualification
    issuer: ReferenceSchema              // Issuing organization
  }],
  
  // Communication languages
  communication: [{
    language: CodeableConceptSchema,     // Language code
    preferred: Boolean                   // Preferred indicator
  }]
}, { timestamps: true
})

const metaDataSchema=new Schema({

})
const PractitionerSchema = new Schema({
    metaData: metaDataSchema,
    resource:{
        type:resourceSchema,
        required:true,
    }
});

// Export the model
module.exports = mongoose.model('Practitioner', PractitionerSchema);
