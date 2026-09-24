const mongoose = require('mongoose');
const User = require('../backend/models/User');

const MONGO_URI = "mongodb://madhuraaryahsworld_db_user:jY61IpcvILaQSrFi@ac-q9qvkil-shard-00-00.lf9okn2.mongodb.net:27017,ac-q9qvkil-shard-00-01.lf9okn2.mongodb.net:27017,ac-q9qvkil-shard-00-02.lf9okn2.mongodb.net:27017/?ssl=true&replicaSet=atlas-hag5a5-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(MONGO_URI).then(async () => {
    console.log("Connected to MongoDB.");
    const users = await User.find({ role: 'partner' }).sort({ createdAt: -1 }).limit(5);
    console.log("Latest partners:", JSON.stringify(users, null, 2));
    process.exit(0);
}).catch(console.error);
