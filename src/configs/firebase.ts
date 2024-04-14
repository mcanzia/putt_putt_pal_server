import admin, { ServiceAccount } from 'firebase-admin';
const serviceKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : require('./serviceAccountKey.json');

if (process.env.NODE_ENV === 'test') {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
  admin.initializeApp({
    projectId: 'puttputtpal-dev'
  });
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceKey as ServiceAccount),
    databaseURL: 'https://puttputtpal-dev-default-rtdb.firebaseio.com/',
  });
}

export const db = admin.database();
export const firebaseAdmin = admin;