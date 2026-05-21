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
increment,
collection,
addDoc,
query,
where,
getDocs,
orderBy
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

let dailyWithdrawCount = 0;

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

const limit =
document.getElementById("withdrawLimit");

// EMPTY

if(!amount){

convert.style.display = "none";

info.style.display = "none";

limit.style.display = "none";

return;

}

// DAILY LIMIT

if(dailyWithdrawCount >= 3){

limit.style.display = "block";

limit.innerText =
"Daily Withdraw Limit Reached";

limit.style.color =
"#ef4444";

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

/* ========================= */
/* NOTIFICATION SYSTEM */
/* ========================= */

window.openNotification = ()=>{

document.getElementById(
"notificationPopup"
).style.display = "flex";

// HIDE RED DOT

document.getElementById(
"notifyDot"
).style.display = "none";

};

window.closeNotification = ()=>{

document.getElementById(
"notificationPopup"
).style.display = "none";

};

/* ========================= */
/* AUTO REMOVE NOTIFICATION */
/* ========================= */

setTimeout(()=>{

const items =
document.querySelectorAll(
".notification-item"
);

// REMOVE FIRST OLD NOTIFICATION

if(items.length > 0){

items[0].remove();

}

// CHECK REMAINING

const leftItems =
document.querySelectorAll(
".notification-item"
);

// HIDE DOT IF EMPTY

if(leftItems.length === 0){

document.getElementById(
"notifyDot"
).style.display = "none";

}

},10000);


/* ========================= */
/* WITHDRAW SYSTEM */
/* ========================= */

import {
collection,
addDoc,
query,
where,
getDocs,
orderBy
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ========================= */
/* SUBMIT WITHDRAW */
/* ========================= */

window.submitWithdraw = async()=>{

const method =
document.getElementById(
"paymentMethod"
).value;

const name =
document.getElementById(
"accountName"
).value;

const number =
document.getElementById(
"accountNumber"
).value;

const amount =
Number(
document.getElementById(
"withdrawAmount"
).value
);

const neededCoin =
amount * 10;

// CHECK EMPTY

if(!name || !number || !amount){

tg.showAlert(
"Fill all fields"
);

return;

}

// CHECK COIN

if(userData.coin < neededCoin){

tg.showAlert(
"Not enough coin"
);

return;

}

// DAILY LIMIT

if(dailyWithdrawCount >= 3){

tg.showAlert(
"Daily withdraw limit reached"
);

return;

}

// SAVE REQUEST

await addDoc(
collection(db,"withdraws"),
{

userId:userId,

username:username,

method:method,

accountName:name,

accountNumber:number,

amount:amount,

coin:neededCoin,

status:"Pending",

createdAt:Date.now()

}
);

// DEDUCT COIN

await updateDoc(userRef,{

coin:increment(-neededCoin)

});

// UPDATE LIMIT

dailyWithdrawCount++;

// SUCCESS

tg.showAlert(
"Withdraw Request Submitted"
);

// RELOAD

location.reload();

};

/* ========================= */
/* LOAD HISTORY */
/* ========================= */

async function loadWithdrawHistory(){

const historyList =
document.getElementById(
"historyList"
);

if(!historyList) return;

historyList.innerHTML = "";

const q =
query(
collection(db,"withdraws"),
where("userId","==",userId)
);

const snap =
await getDocs(q);

snap.forEach((doc)=>{

const data =
doc.data();

historyList.innerHTML += `

<div class="history-item">

<div class="history-left">

<div class="history-method">

<img
class="history-method-icon"
src="https://cdn-icons-png.flaticon.com/512/2489/2489756.png"
/>

<span>
${data.method}
</span>

</div>

<h3 class="history-title">
${data.accountNumber}
</h3>

<p class="history-date">
${new Date(data.createdAt).toLocaleString()}
</p>

</div>

<div class="history-right">

<div class="history-amount">
${data.amount}Tk
</div>

<div class="history-status pending-status">
${data.status}
</div>

</div>

</div>

`;

});

}

loadWithdrawHistory();window.submitWithdraw = async()=>{

alert("Button Working");

};


