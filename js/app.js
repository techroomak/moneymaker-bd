// =========================
// FIREBASE
// =========================

import { db }
from "./firebase.js";

import {
doc,
setDoc,
getDoc,
updateDoc,
increment
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ========================= */
/* TELEGRAM */
/* ========================= */

const tg =
window.Telegram.WebApp;

tg.ready();

tg.expand();

/* ========================= */
/* USER */
/* ========================= */

const user =
tg.initDataUnsafe.user;

// TELEGRAM ONLY

if(!user){

alert("Open inside Telegram");

throw new Error("Telegram Only");

}

/* ========================= */
/* USER INFO */
/* ========================= */

const userId =
String(user.id);

const username =
user.first_name ||
user.username;

const photo =
user.photo_url;

/* ========================= */
/* HTML ELEMENTS */
/* ========================= */

const usernameEl =
document.getElementById("username");

const useridEl =
document.getElementById("userid");

const profileEl =
document.getElementById("profile");

const coinEl =
document.getElementById("coin");

const bdtEl =
document.getElementById("bdt");

const totalReferEl =
document.getElementById("totalRefer");

const dailyEarnEl =
document.getElementById("dailyEarn");

const referEarnEl =
document.getElementById("referEarn");

const totalWithdrawEl =
document.getElementById("totalWithdraw");

const inviteLinkEl =
document.getElementById("inviteLink");

/* ========================= */
/* UI UPDATE */
/* ========================= */

usernameEl.innerText =
username;

useridEl.innerText =
userId;

profileEl.src =
photo;

/* ========================= */
/* REFERRAL LINK */
/* ========================= */

const referralLink =
`https://t.me/emoneymakebd_bot/app?startapp=${userId}`;

inviteLinkEl.innerText =
referralLink;

/* ========================= */
/* DATABASE */
/* ========================= */

const userRef =
doc(db,"users",userId);

/* ========================= */
/* CREATE USER */
/* ========================= */

const snap =
await getDoc(userRef);

if(!snap.exists()){

await setDoc(userRef,{

id:userId,

username:username,

photo:photo,

coin:0,

refer:0,

referEarn:0,

withdraw:0,

dailyEarn:0,

completedSocialTasks:[],

completedDailyTasks:[],

createdAt:Date.now()

});

}

/* ========================= */
/* LOAD USER */
/* ========================= */

const userData =
(await getDoc(userRef)).data();

/* ========================= */
/* UI DATA */
/* ========================= */

coinEl.innerText =
userData.coin || 0;

bdtEl.innerText =
(userData.coin / 10).toFixed(2);

totalReferEl.innerText =
userData.refer || 0;

dailyEarnEl.innerText =
userData.dailyEarn || 0;

referEarnEl.innerText =
userData.referEarn || 0;

totalWithdrawEl.innerText =
userData.withdraw || 0;

/* ========================= */
/* COPY INVITE */
/* ========================= */

window.copyInvite = ()=>{

navigator.clipboard.writeText(
referralLink
);

tg.showAlert(
"Referral Link Copied"
);

};

/* ========================= */
/* CLAIM COIN */
/* ========================= */

window.claimCoin =
async(amount)=>{

await updateDoc(userRef,{

coin:increment(amount),

dailyEarn:increment(amount)

});

loadUserData();

};

/* ========================= */
/* LOAD DATA FUNCTION */
/* ========================= */

async function loadUserData(){

const updatedSnap =
await getDoc(userRef);

const updatedData =
updatedSnap.data();

coinEl.innerText =
updatedData.coin || 0;

bdtEl.innerText =
(updatedData.coin / 10).toFixed(2);

dailyEarnEl.innerText =
updatedData.dailyEarn || 0;

}

/* ========================= */
/* DAILY TIMER */
/* ========================= */

function startTimer(){

const timer =
document.getElementById("dailyTimer");

if(!timer) return;

let h=23;
let m=59;
let s=59;

setInterval(()=>{

s--;

if(s<0){

s=59;
m--;

}

if(m<0){

m=59;
h--;

}

timer.innerText =

`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

},1000);

}

startTimer();

/* ========================= */
/* SOCIAL TASK */
/* ========================= */

window.completeSocialTask =
async(button)=>{

button.innerText =
"Completed";

button.disabled = true;

button.classList.remove(
"social-button"
);

button.classList.add(
"social-complete-button"
);

};

/* ========================= */
/* AD COOLDOWN */
/* ========================= */

window.startAdCooldown =
(button,timerEl)=>{

button.style.display =
"none";

timerEl.style.display =
"block";

let time = 120;

const interval =
setInterval(()=>{

time--;

const min =
Math.floor(time/60);

const sec =
time%60;

timerEl.innerText =

`${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

if(time<=0){

clearInterval(interval);

button.style.display =
"flex";

timerEl.style.display =
"none";

}

},1000);

};

/* ========================= */
/* WITHDRAW */
/* ========================= */

window.changeWithdrawInfo = ()=>{

document.getElementById("withdrawAmount").value = "";

document.getElementById("withdrawInfo").style.display = "none";

document.getElementById("coinConvert").style.display = "none";

};

/* ========================= */
/* CHECK WITHDRAW */
/* ========================= */

window.checkWithdrawAmount = ()=>{

const method =
document.getElementById("paymentMethod").value;

const amount =
Number(
document.getElementById("withdrawAmount").value
);

const convert =
document.getElementById("coinConvert");

const info =
document.getElementById("withdrawInfo");

// EMPTY

if(!amount){

convert.style.display = "none";

info.style.display = "none";

return;

}

const neededCoin =
amount * 10;

// SHOW COIN

convert.style.display = "block";

convert.innerText =
`${neededCoin} Coin Required`;

// RECHARGE

if(method === "recharge"){

if(amount < 20 || amount > 100){

info.style.display = "block";

info.innerText =
"Recharge Limit: Min 20Tk • Max 100Tk";

info.style.color =
"#ef4444";

}else{

info.style.display = "none";

}

}

// BKASH / NAGAD

else{

if(amount < 500 || amount > 1000){

info.style.display = "block";

info.innerText =
"Cashout Limit: Min 500Tk • Max 1000Tk";

info.style.color =
"#ef4444";

}else{

info.style.display = "none";

}

}

};
