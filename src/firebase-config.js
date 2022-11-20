import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getStorage } from 'firebase/storage';

const app = initializeApp(JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG));

export const db = getFirestore(app);
export const storage = getStorage(app);
// console.log(storage);
// console.log(ref(storage));
