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
    period: Schema.Types.Mixed, // Can define a PeriodSchema if needed
    assigner: Schema.Types.Mixed // e.g., Reference to an Organization
    }, { _id: false }
);

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
    }, { _id: false }
);

// Reference – used to point to other FHIR resources
const ReferenceSchema = new Schema({
    reference: String,
    type: String,
    identifier: IdentifierSchema,
    display: String
    }, { _id: false }
);

// Period – for effectivePeriod and similar fields
const PeriodSchema = new Schema({
    start: Date,
    end: Date
    }, { _id: false }
);

// Annotation – for comments/notes
const AnnotationSchema = new Schema({
    authorString: String,
    time: Date,
    text: String
    }, { _id: false }
);

// Attachment – for presentedForm and media links
const AttachmentSchema = new Schema({
    contentType: String,
    language: String,
    data: String,
    url: String,
    size: Number,
    hash: String,
    title: String,
    creation: Date
    }, { _id: false }
);

// SupportingInfo sub-schema for additional report information
const SupportingInfoSchema = new Schema({
    type: CodeableConceptSchema,
    reference: ReferenceSchema
    }, { _id: false }
);

// Media sub-schema for images or data linked to the report
const MediaSchema = new Schema({
    comment: String,
    link: ReferenceSchema
    }, { _id: false }
);

// --- DiagnosticReport Schema ---

const resourceSchema=new Schema({
    resourceType: { type: String, required: true, default: 'DiagnosticReport' },
    id: String,
    meta: Schema.Types.Mixed,           // Can be further defined as needed
    implicitRules: String,
    language: String,
    text: Schema.Types.Mixed,            // Narrative text; can be expanded into a sub-schema
    contained: [Schema.Types.Mixed],
    extension: [Schema.Types.Mixed],
    modifierExtension: [Schema.Types.Mixed],
    
    // DiagnosticReport-specific fields
    identifier: [IdentifierSchema],
    basedOn: [ReferenceSchema],
    status: { type: String, required: true }, // e.g., registered, preliminary, final, etc.
    category: [CodeableConceptSchema],
    code: CodeableConceptSchema,
    subject: ReferenceSchema,
    encounter: ReferenceSchema,
    // effective[x]: only one should be provided; here we include both possibilities
    effectiveDateTime: String, // ISO dateTime string
    effectivePeriod: PeriodSchema,
    issued: Date,
    performer: [ReferenceSchema],
    resultsInterpreter: [ReferenceSchema],
    specimen: [ReferenceSchema],
    result: [ReferenceSchema],
    note: [AnnotationSchema],
    study: [ReferenceSchema],
    supportingInfo: [SupportingInfoSchema],
    media: [MediaSchema],
    composition: ReferenceSchema,
    conclusion: String,               // Markdown text
    conclusionCode: [CodeableConceptSchema],
    presentedForm: [AttachmentSchema]
    }, 
    { timestamps: true }
)

const metaDataSchema=new Schema({

})


const DiagnosticReportSchema = new Schema({
    metaData: metaDataSchema,
    resource:{
        type:resourceSchema,
        required:true,
    }

});

// Export the model
module.exports = mongoose.model('DiagnosticReport', DiagnosticReportSchema);
