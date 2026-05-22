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

if(usernameEl){

usernameEl.innerText = username;

}

if(useridEl){

useridEl.innerText = userId;

}

if(profileEl){

profileEl.src = photo;

}

/* ========================= */
/* REFERRAL LINK */
/* ========================= */

const referralLink =
`https://t.me/emoneymakebd_bot?startapp=${userId}`;

if(inviteLinkEl){

inviteLinkEl.innerText =
referralLink;

}

/* ========================= */
/* REFERRAL SYSTEM */
/* ========================= */

const startParam =
tg.initDataUnsafe.start_param;

const referrerId =
startParam || null;

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

coin:25,

refer:0,

referEarn:0,

withdraw:0,

dailyEarn:0,

completedSocialTasks:[],

completedDailyTasks:[],

joinedBy:referrerId || "",

referrerName:"",

referrerPhoto:"",

createdAt:Date.now()

lastActive:Date.now()
});

/* ========================= */
/* REFERRAL BONUS */
/* ========================= */

if(referrerId && referrerId !== userId){

const refUserRef =
doc(db,"users",String(referrerId));

const refSnap =
await getDoc(refUserRef);

if(refSnap.exists()){

const refData =
refSnap.data();

// UPDATE REFERRER

await updateDoc(refUserRef,{

coin:increment(25),

refer:increment(1),

referEarn:increment(25)

});

// SAVE REFERRER INFO

await updateDoc(userRef,{

referrerName:
refData.username || "",

referrerPhoto:
refData.photo || ""

});

}
}
}

/* ========================= */
/* LOAD USER */
/* ========================= */

const userData =
(await getDoc(userRef)).data();

/* ========================= */
/* UI DATA */
/* ========================= */

if(coinEl){

coinEl.innerText =
userData.coin || 0;

}

if(bdtEl){

bdtEl.innerText =
(userData.coin / 10).toFixed(2);

}

if(totalReferEl){

totalReferEl.innerText =
userData.refer || 0;

}

if(dailyEarnEl){

dailyEarnEl.innerText =
userData.dailyEarn || 0;

}

if(referEarnEl){

referEarnEl.innerText =
userData.referEarn || 0;

}

if(totalWithdrawEl){

totalWithdrawEl.innerText =
userData.withdraw || 0;

}

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


/* ========================= */
/* SUBMIT WITHDRAW */
/* ========================= */

window.submitWithdraw = async()=>{

const method =
document.getElementById("paymentMethod").value;

const accountName =
document.getElementById("accountName").value;

const accountNumber =
document.getElementById("accountNumber").value;

const amount =
Number(
document.getElementById("withdrawAmount").value
);

// EMPTY

if(!method || !accountName || !accountNumber || !amount){

alert("Fill all fields");

return;

}

// VALIDATION

if(method === "recharge"){

if(amount < 20 || amount > 100){

alert(
"Recharge Limit: 20Tk - 100Tk"
);

return;

}

}else{

if(amount < 500 || amount > 1000){

alert(
"Cashout Limit: 500Tk - 1000Tk"
);

return;

}

}

// COIN CHECK

const needCoin =
amount * 10;

if(userData.coin < needCoin){

alert(
"Not Enough Coin"
);

return;

}

// BUTTON

const btn =
document.getElementById("withdrawButton");

btn.innerText =
"Processing...";

// SAVE FIREBASE

await addDoc(
collection(db,"withdraws"),
{

userId:userId,

username:username,

method:method,

accountName:accountName,

accountNumber:accountNumber,

amount:amount,

coin:needCoin,

status:"Pending",

createdAt:Date.now()

}
);

// DEDUCT COIN

await updateDoc(userRef,{

coin:increment(-needCoin),

withdraw:increment(amount)

});

// SUCCESS

btn.innerText =
"Success";

alert(
"Withdraw Request Submitted"
);

// RESET

document.getElementById(
"accountName"
).value = "";

document.getElementById(
"accountNumber"
).value = "";

document.getElementById(
"withdrawAmount"
).value = "";

// RELOAD DATA

loadUserData();

};

/* ========================= */
/* LEADERBOARD */
/* ========================= */

async function loadLeaderboard(){

const board =
document.getElementById(
"leaderboardList"
);

if(!board) return;

board.innerHTML = "";

const q =
query(
collection(db,"users")
);

const snap =
await getDocs(q);

let users = [];

snap.forEach((doc)=>{

users.push(doc.data());

});

// SORT

users.sort((a,b)=>
(b.coin || 0) - (a.coin || 0)
);

// TOP USERS

users.forEach((data,index)=>{

const shortId =
String(data.id)
.slice(0,2)
+
"***"
+
String(data.id).slice(-2);

board.innerHTML += `

<div class="leaderboard-item">

<div class="leaderboard-left">

<div class="leaderboard-rank">
#${index+1}
</div>

<img
class="leaderboard-avatar"
src="${data.photo}"
/>

<div>

<h3 class="leaderboard-name">
${data.username}
</h3>

<p class="leaderboard-id">
ID: ${shortId}
</p>

</div>

</div>

<div class="leaderboard-right">

<img
class="leaderboard-coin-icon"
src="https://cdn-icons-png.flaticon.com/512/272/272525.png"
/>

<span class="leaderboard-coin">
${data.coin || 0}
</span>

</div>

</div>

`;

});

}

loadLeaderboard();

/* ========================= */
/* LOAD WITHDRAW HISTORY */
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
src="${
data.method === 'bkash'
? 'https://images.seeklogo.com/logo-png/47/3/bkash-logo-png_seeklogo-471379.png'
: data.method === 'nagad'
? 'https://seeklogo.com/images/N/nagad-logo-7A70CCFEE0-seeklogo.com.png'
: 'https://cdn-icons-png.flaticon.com/128/1018/1018197.png'
}"
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

loadWithdrawHistory();
