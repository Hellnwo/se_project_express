const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/index');
const { PORT = 3001 } = process.env;
const app = express();

mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.log('Connected to DB');
})
.catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '686de36e734d327abefc0d09'// paste the _id of the test user created in the previous step
  };
  next();
});

app.use('/', mainRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
})