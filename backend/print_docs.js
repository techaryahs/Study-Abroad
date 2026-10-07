const mongoose = require('mongoose');
const Student = require('./models/Student');
// If there is a Document model, let's try to require it
let Document;
try {
  Document = require('./models/Document');
} catch (e) {}

require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const studentId = "6ac357ea8bf2edd5858a6fd7";
  
  if (Document) {
    const docs = await Document.find({ studentId }).lean();
    console.log("Documents from Document collection:", JSON.stringify(docs, null, 2));
    
    // Also check studentLeadId
    const docsByLead = await Document.find({ studentLeadId: "EL-6262-2026-00002" }).lean();
    console.log("Documents by Lead ID:", JSON.stringify(docsByLead, null, 2));
  } else {
    console.log("No Document model found.");
  }
  process.exit();
}
run();
