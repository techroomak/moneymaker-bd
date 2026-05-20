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

const user =
tg.initDataUnsafe?.user;

/* ========================= */
/* USER INFO */
/* ========================= */

const userId =
user?.id || "123456789";

const username =
user?.first_name ||
user?.username ||
"Money Maker BD";

const photo =
user?.photo_url ||
"https://telegram.org/img/t_logo.png";

/* ========================= */
/* UI UPDATE */
/* ========================= */

document.getElementById("username")
.innerText = username;

document.getElementById("userid")
.innerText = userId;

document.getElementById("profile")
.src = photo;

/* ========================= */
/* REFERRAL LINK */
/* ========================= */

const referralLink =
`https://t.me/emoneymakebd_bot/app?startapp=${userId}`;

document.getElementById("inviteLink")
.innerText = referralLink;

/* ========================= */
/* DATABASE */
/* ========================= */

const userRef =
doc(db,"users",String(userId));

const snap =
await getDoc(userRef);

if(!snap.exists()){

await setDoc(userRef,{

username: username,
coin: 0,
refer: 0,
referEarn: 0,
withdraw: 0,
dailyEarn: 0,
created: Date.now()

});

}

const userData =
(await getDoc(userRef)).data();

/* ========================= */
/* UI DATA */
/* ========================= */

document.getElementById("coin")
.innerText =
userData.coin;

document.getElementById("bdt")
.innerText =
(userData.coin/10).toFixed(2);

document.getElementById("totalRefer")
.innerText =
userData.refer;

document.getElementById("dailyEarn")
.innerText =
userData.dailyEarn;

document.getElementById("referEarn")
.innerText =
userData.referEarn;

document.getElementById("totalWithdraw")
.innerText =
userData.withdraw;

/* ========================= */
/* CLAIM COIN */
/* ========================= */

window.claimCoin =
async(amount)=>{

await updateDoc(userRef,{
coin: increment(amount),
dailyEarn: increment(amount)
});

location.reload();

};

/* ========================= */
/* COPY INVITE */
/* ========================= */

window.copyInvite = ()=>{

navigator.clipboard.writeText(referralLink);

alert("Referral Link Copied");

};

/* ========================= */
/* DAILY TIMER */
/* ========================= */

function startTimer(){

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

document.getElementById("dailyTimer")
.innerText =
`${h}:${m}:${s}`;

},1000);

}

startTimer();
