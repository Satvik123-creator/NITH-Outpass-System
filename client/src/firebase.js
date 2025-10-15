import { initializeApp } from "firebase/app";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
// re-export common auth helpers so components import from a single file
export { isSignInWithEmailLink, signInWithEmailLink, sendSignInLinkToEmail };

// runtime helper to validate the Firebase config and surface useful debug info
export function validateFirebaseSetup() {
  const cfg = app.options || {};
  const missing = [];
  ["apiKey", "authDomain", "projectId"].forEach((k) => {
    if (!cfg[k]) missing.push(k);
  });
  return {
    ok: missing.length === 0,
    missing,
    options: cfg,
  };
}
