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
  period: Schema.Types.Mixed, // Could be replaced with a PeriodSchema if needed
  assigner: Schema.Types.Mixed // e.g., Reference to an Organization
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

// Reference – used to point to other FHIR resources
const ReferenceSchema = new Schema({
  reference: String,
  type: String,
  identifier: IdentifierSchema,
  display: String
}, { _id: false });

// Period – for effectivePeriod and similar fields
const PeriodSchema = new Schema({
  start: Date,
  end: Date
}, { _id: false });

// Timing – for effectiveTiming (simplified)
const TimingSchema = new Schema({
  event: [Date],
  repeat: Schema.Types.Mixed, // Detailed repeat info can be added if needed
  code: CodeableConceptSchema
}, { _id: false });

// Quantity
const QuantitySchema = new Schema({
  value: Number,
  comparator: String,
  unit: String,
  system: String,
  code: String
}, { _id: false });

// Range – made of two quantities
const RangeSchema = new Schema({
  low: QuantitySchema,
  high: QuantitySchema
}, { _id: false });

// Ratio – composed of numerator and denominator
const RatioSchema = new Schema({
  numerator: QuantitySchema,
  denominator: QuantitySchema
}, { _id: false });

// SampledData (simplified)
const SampledDataSchema = new Schema({
  origin: QuantitySchema,
  period: Number,
  factor: Number,
  lowerLimit: Number,
  upperLimit: Number,
  dimensions: Number,
  data: String
}, { _id: false });

// Attachment – for files, images, etc.
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

// Annotation – for notes
const AnnotationSchema = new Schema({
  authorString: String,
  time: Date,
  text: String
}, { _id: false });

// TriggeredBy – sub-document for triggeredBy field
const TriggeredBySchema = new Schema({
  observation: ReferenceSchema,
  type: String,   // e.g. "reflex", "repeat", "re-run"
  reason: String
}, { _id: false });

// ReferenceRange – used in referenceRange and in component.referenceRange
const ReferenceRangeSchema = new Schema({
  low: QuantitySchema,
  high: QuantitySchema,
  normalValue: CodeableConceptSchema,
  type: CodeableConceptSchema,
  appliesTo: [CodeableConceptSchema],
  age: RangeSchema,
  text: String
}, { _id: false });

// Component – sub-document for component field
const ComponentSchema = new Schema({
  code: CodeableConceptSchema,
  // value[x] alternatives for component
  valueQuantity: QuantitySchema,
  valueCodeableConcept: CodeableConceptSchema,
  valueString: String,
  valueBoolean: Boolean,
  valueInteger: Number,
  valueRange: RangeSchema,
  valueRatio: RatioSchema,
  valueSampledData: SampledDataSchema,
  valueTime: String,
  valueDateTime: Date,
  valuePeriod: PeriodSchema,
  valueAttachment: AttachmentSchema,
  valueReference: ReferenceSchema,
  dataAbsentReason: CodeableConceptSchema,
  interpretation: [CodeableConceptSchema],
  referenceRange: [ReferenceRangeSchema]
}, { _id: false });

// --- Main Observation Schema ---
const resourceSchema=new Schema({
    resourceType: { type: String, required: true, default: 'Observation' },
  id: String,
  meta: Schema.Types.Mixed,          // Meta can be further defined if needed
  implicitRules: String,
  language: String,
  text: Schema.Types.Mixed,           // Narrative text (could be a sub-schema)
  contained: [Schema.Types.Mixed],
  extension: [Schema.Types.Mixed],
  modifierExtension: [Schema.Types.Mixed],
  
  identifier: [IdentifierSchema],
  instantiatesCanonical: String,
  instantiatesReference: ReferenceSchema,
  basedOn: [ReferenceSchema],
  triggeredBy: [TriggeredBySchema],
  partOf: [ReferenceSchema],
  status: { type: String, required: true }, // e.g., registered, preliminary, final, etc.
  category: [CodeableConceptSchema],
  code: CodeableConceptSchema,
  subject: ReferenceSchema,
  focus: [ReferenceSchema],
  encounter: ReferenceSchema,
  // effective[x]: Only one of these would be used in a given observation.
  effectiveDateTime: String,
  effectivePeriod: PeriodSchema,
  effectiveTiming: TimingSchema,
  effectiveInstant: Date,
  issued: Date,
  performer: [ReferenceSchema],
  // value[x]: The actual observation value (choose one alternative)
  valueQuantity: QuantitySchema,
  valueCodeableConcept: CodeableConceptSchema,
  valueString: String,
  valueBoolean: Boolean,
  valueInteger: Number,
  valueRange: RangeSchema,
  valueRatio: RatioSchema,
  valueSampledData: SampledDataSchema,
  valueTime: String,
  valueDateTime: Date,
  valuePeriod: PeriodSchema,
  valueAttachment: AttachmentSchema,
  valueReference: ReferenceSchema,
  dataAbsentReason: CodeableConceptSchema,
  interpretation: [CodeableConceptSchema],
  note: [AnnotationSchema],
  bodySite: CodeableConceptSchema,
  bodyStructure: ReferenceSchema,
  method: CodeableConceptSchema,
  specimen: ReferenceSchema,
  device: ReferenceSchema,
  referenceRange: [ReferenceRangeSchema],
  hasMember: [ReferenceSchema],
  derivedFrom: [ReferenceSchema],
  component: [ComponentSchema]
}, { timestamps: true }

)

const metaDataSchema=new Schema({
  paitentID: {
    ref:'Patient',
    type:Schema.Types.ObjectId,
}
})
const ObservationSchema = new Schema({
    metaData: metaDataSchema,
    resource:{
        type:resourceSchema,
        required:true,
    }
});

module.exports = mongoose.model('Observation', ObservationSchema);
