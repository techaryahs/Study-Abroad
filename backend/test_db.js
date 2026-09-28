const mongoose = require('mongoose');
const Student = require('./models/Student');

mongoose.connect('mongodb+srv://user:Amit123@ac-q9qvkil-shard-00-00.lf9okn2.mongodb.net/test?retryWrites=true&w=majority')
.then(async () => {
  const user = await Student.findOne({ email: 'amit.aryahsworld@gmail.com' });
  console.log("Cart in DB:", user.cart);
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
