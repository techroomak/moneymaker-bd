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
/* SECRET ADMIN ACCESS */
/* ========================= */

const url =
new URL(window.location.href);

const key =
url.searchParams.get("key");

// SECRET KEY

if(key !== "AKADMIN2026"){

document.body.innerHTML =

`

<div style="

height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#020617;
color:white;
font-size:28px;
font-family:sans-serif;

">

Access Denied

</div>

`;

throw new Error(
"Unauthorized Access"
);

}

/* ========================= */
/* ADMIN ACCESS */
/* ========================= */

console.log(
"Admin Access Granted"
);
