// =========================
// FIREBASE
// =========================

import { db }
from "./firebase.js";

import {
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ========================= */
/* TELEGRAM */
/* ========================= */

const tg =
window.Telegram.WebApp;

tg.ready();

const user =
tg.initDataUnsafe.user;

// BLOCK OUTSIDE TG



/* ========================= */
/* ADMIN CHECK */
/* ========================= */

const adminRef =
doc(db,"admin",String(user.id));

const adminSnap =
await getDoc(adminRef);

// NOT ADMIN


// ADMIN OK

console.log(
"Admin Access Granted"
);
