import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import admin from 'firebase-admin';
import dashboardRoutes from './routes/dashboardRoutes.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  res.setHeader('Connection', 'close');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined
    }),
    databaseURL: "https://ahuproject-b5139-default-rtdb.asia-southeast1.firebasedatabase.app/",
    databaseAuthVariableOverride: null
  });
}

app.use('/api', dashboardRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "IoT Backend Server is running on Vercel Serverless!",
    timestamp: new Date()
  });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

export default app;