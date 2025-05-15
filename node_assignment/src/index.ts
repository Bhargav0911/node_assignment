import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './db.js';
import { loadData } from './utils/fetchData.js';
import usersRouter from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_, res) => res.send('API is running'));

app.use('/users', usersRouter);

connectToDatabase().then(async () => {
  await loadData();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to DB or load data', err);
});
