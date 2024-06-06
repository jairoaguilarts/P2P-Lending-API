const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); 
const { connectToDatabase } = require('./config/db');
const app = express();
const indexRouter = require('./routes/index');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());  

connectToDatabase();

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
