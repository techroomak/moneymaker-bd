
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getAuth,
signInAnonymously
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/* ========================= */
/* FIREBASE CONFIG */
/* ========================= */

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmHbCk23LRldjf-wi6xpw98MCE8VoupRc",
  authDomain: "moneymaker-bd.firebaseapp.com",
  databaseURL: "https://moneymaker-bd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "moneymaker-bd",
  storageBucket: "moneymaker-bd.firebasestorage.app",
  messagingSenderId: "80983902209",
  appId: "1:80983902209:web:79b98a24d46af20b6b9800",
  measurementId: "G-ZWVPWP1ME9"
};


/* ========================= */
/* FIREBASE INIT */
/* ========================= */

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

const auth =
getAuth(app);

await signInAnonymously(auth);

export {
db
};
