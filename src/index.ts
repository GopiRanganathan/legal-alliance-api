import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import AccountRouter from './routers/account';
import ExpertiseManager from './business/expertisemanager';
import ExpertiseRouter from './routers/expertise';
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err: any) => {
    console.error('❌ Connection error:', err);
  });

app.get('/', (req, res) => {
  res.send('Hello');
});

app.use('/account', AccountRouter)
app.use('/', ExpertiseRouter)

new ExpertiseManager().import()
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

