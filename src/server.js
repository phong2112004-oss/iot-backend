import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import dashboardRoutes from './routes/dashboardRoutes.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined
    }),
    databaseURL: "https://ahuproject-b5139-default-rtdb.asia-southeast1.firebasedatabase.app/"
  });
}

app.use('/api', dashboardRoutes);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

export default app;