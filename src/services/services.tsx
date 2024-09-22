import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBIDJnY9yyIiZktYAoOKllPnrhjk-l2hQI",
  authDomain: "sergipecars.firebaseapp.com",
  projectId: "sergipecars",
  storageBucket: "sergipecars.appspot.com",
  messagingSenderId: "1089406840099",
  appId: "1:1089406840099:web:23c208550c001c5544f096",
  measurementId: "G-RFFHHNG2TD",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { analytics, db, auth, storage };
