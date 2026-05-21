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

if(!user){

document.body.innerHTML =
"<h1>Open Inside Telegram</h1>";

throw new Error(
"Telegram Only"
);

}

/* ========================= */
/* ADMIN CHECK */
/* ========================= */

const adminRef =
doc(db,"admin",String(user.id));

const adminSnap =
await getDoc(adminRef);

// NOT ADMIN

if(!adminSnap.exists()){

document.body.innerHTML =

`

<div style="

height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#0f172a;
color:white;
font-size:24px;
font-family:sans-serif;

">

Access Denied

</div>

`;

throw new Error(
"Not Admin"
);

}

// ADMIN OK

console.log(
"Admin Access Granted"
);
