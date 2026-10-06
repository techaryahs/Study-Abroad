const fs = require('fs');

// 1. Add the controller function
const controllerFile = 'backend/controllers/user.controller.js';
let controllerContent = fs.readFileSync(controllerFile, 'utf8');

const getDocumentFunc = `
exports.getDocument = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }
    
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ message: "Database connection not ready" });
    }
    
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'student_documents'
    });
    
    const fileId = new mongoose.Types.ObjectId(id);
    const files = await bucket.find({ _id: fileId }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    const file = files[0];
    res.set("Content-Type", file.contentType || "application/pdf");
    res.set("Content-Disposition", \`inline; filename="\${file.filename}"\`);
    
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.on('error', (err) => {
      console.error("GridFS Stream Error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error reading document stream" });
      }
    });
    
    downloadStream.pipe(res);
  } catch (err) {
    console.error("getDocument Error:", err);
    res.status(500).json({ message: "Server error retrieving document" });
  }
};
`;

controllerContent += '\n' + getDocumentFunc;
fs.writeFileSync(controllerFile, controllerContent);

// 2. Add the route
const routesFile = 'backend/routes/user.routes.js';
let routesContent = fs.readFileSync(routesFile, 'utf8');

const routeInjection = 'router.get("/document/:id", userController.getDocument);\n';
const moduleExportIdx = routesContent.indexOf('module.exports = router;');
routesContent = routesContent.slice(0, moduleExportIdx) + routeInjection + routesContent.slice(moduleExportIdx);

fs.writeFileSync(routesFile, routesContent);
console.log("Document route successfully added!");
