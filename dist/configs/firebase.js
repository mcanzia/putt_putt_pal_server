"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAdmin = exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : require('./serviceAccountKey.json');
if (process.env.NODE_ENV === 'test') {
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
    firebase_admin_1.default.initializeApp({
        projectId: 'puttputtpal-dev'
    });
}
else {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceKey),
        databaseURL: 'https://puttputtpal-dev-default-rtdb.firebaseio.com/',
    });
}
exports.db = firebase_admin_1.default.database();
exports.firebaseAdmin = firebase_admin_1.default;
