import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let firestore = null;
let app = null;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  firestore = getFirestore(app);
}

export { firestore, app };

// Client-side-only code
export const initializeAnalytics = () => {
  if (typeof window !== "undefined") {
    import("firebase/analytics").then(({ getAnalytics }) => {
      getAnalytics(app);
    });
  }
};
