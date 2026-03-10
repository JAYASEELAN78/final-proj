import mongoose from 'mongoose';
const companySchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    contact_person: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    gst_number: { type: String }
}, { timestamps: true });
export default mongoose.model('Company', companySchema);