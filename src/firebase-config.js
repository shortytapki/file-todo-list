import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';

const app = initializeApp(JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG));

export const db = getFirestore(app);
