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

// Reference
const ReferenceSchema = new Schema({
  reference: String,
  type: String,
  identifier: IdentifierSchema,
  display: String
}, { _id: false });

// Quantity
const QuantitySchema = new Schema({
  value: Number,
  comparator: String,
  unit: String,
  system: String,
  code: String
}, { _id: false });

// Ratio (composed of two Quantities)
const RatioSchema = new Schema({
  numerator: QuantitySchema,
  denominator: QuantitySchema
}, { _id: false });

// CodeableReference – can hold either a reference or a CodeableConcept
const CodeableReferenceSchema = new Schema({
  reference: ReferenceSchema,
  concept: CodeableConceptSchema
}, { _id: false });

// Batch – details about the medication batch
const BatchSchema = new Schema({
  lotNumber: String,
  expirationDate: Date
}, { _id: false });

// Medication Ingredient – representing an ingredient sub-document
const MedicationIngredientSchema = new Schema({
  item: CodeableReferenceSchema, // Reference to Medication or Substance
  isActive: Boolean,
  // strength[x]: Only one of these would be used in practice.
  strengthRatio: RatioSchema,
  strengthCodeableConcept: CodeableConceptSchema,
  strengthQuantity: QuantitySchema
}, { _id: false });

// --- Main Medication Schema ---

const resourceSchema=new Schema({

    resourceType: { type: String, required: true, default: 'Medication' },
    id: String,
    meta: Schema.Types.Mixed,           // Meta information (can be expanded into its own schema)
    implicitRules: String,
    language: String,
    text: Schema.Types.Mixed,            // Narrative text
    contained: [Schema.Types.Mixed],
    extension: [Schema.Types.Mixed],
    modifierExtension: [Schema.Types.Mixed],
    
    // FHIR Medication-specific fields
    identifier: [IdentifierSchema],
    code: CodeableConceptSchema,
    status: String, // active | inactive | entered-in-error
    marketingAuthorizationHolder: ReferenceSchema,
    doseForm: CodeableConceptSchema,
    totalVolume: QuantitySchema,
    ingredient: [MedicationIngredientSchema],
    batch: BatchSchema,
    definition: ReferenceSchema  // Reference to MedicationKnowledge
  }, { timestamps: true}
)

const metaDataSchema=new Schema({

})

const MedicationSchema = new Schema({
    metaData: metaDataSchema,
    resource:{
        type:resourceSchema,
        required:true,
    }
});

module.exports = mongoose.model('Medication', MedicationSchema);
