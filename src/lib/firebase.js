import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCy5_vonqm4GNrOw-sSzqpDiNO4BPnNrPw',
  authDomain: 'my-notebook-845c1.firebaseapp.com',
  projectId: 'my-notebook-845c1',
  storageBucket: 'my-notebook-845c1.firebasestorage.app',
  messagingSenderId: '274169392175',
  appId: '1:274169392175:web:2eac8f901099041fdeeada',
  measurementId: 'G-S9J2M5YH09',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({}),
  }),
});
export const googleProvider = new GoogleAuthProvider();

export default app;
