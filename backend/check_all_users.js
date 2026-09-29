const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Consultant = require('./models/Consultant');

const MONGO_URI = "mongodb://madhuraaryahsworld_db_user:jY61IpcvILaQSrFi@ac-q9qvkil-shard-00-00.lf9okn2.mongodb.net:27017,ac-q9qvkil-shard-00-01.lf9okn2.mongodb.net:27017,ac-q9qvkil-shard-00-02.lf9okn2.mongodb.net:27017/?ssl=true&replicaSet=atlas-hag5a5-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(MONGO_URI).then(async () => {
    console.log("Connected to MongoDB.");
    const users = await User.find({}).sort({ createdAt: -1 }).limit(3);
    const students = await Student.find({}).sort({ createdAt: -1 }).limit(3);
    const consultants = await Consultant.find({}).sort({ createdAt: -1 }).limit(3);
    console.log("Users:", JSON.stringify(users, null, 2));
    console.log("Students:", JSON.stringify(students, null, 2));
    console.log("Consultants:", JSON.stringify(consultants, null, 2));
    process.exit(0);
}).catch(console.error);
