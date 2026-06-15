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
onSnapshot,
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
`https://t.me/emoneymakebd_bot?start=${userId}`;

if(inviteLinkEl){

inviteLinkEl.innerText =
referralLink;

}

/* ========================= */
/* REFERRAL SYSTEM */
/* ========================= */

const urlParams =
new URLSearchParams(
window.location.search
);

const referrerId =
urlParams.get("ref");

/* ========================= */
/* DATABASE */
/* ========================= */

const userRef =
doc(db,"users",userId);

const settingsRef =
doc(db,"settings","app");

/* ========================= */
/* CREATE USER */
/* ========================= */

const settingsSnapInit =
await getDoc(settingsRef);

const settingsDataInit =
settingsSnapInit.data() || {};

const snap =
await getDoc(userRef);

if(!snap.exists()){

await setDoc(userRef,{

id:userId,

username:username,

photo:photo,

coin:settingsDataInit.registrationBonus || 50,

refer:0,

referEarn:0,

withdraw:0,

dailyEarn:0,

dailyAds:0,
totalAds:0,
lastAdWatch:0,
dailyEarnDate:0,
ad1Count:0,
ad2Count:0,
ad3Count:0,
ad4Count:0,

ad1Last:0,
ad2Last:0,
ad3Last:0,
ad4Last:0,

completedDailyTasks:[],
dailyTaskProgress:{},
lastDailyTaskDate:"",
claimedDailyTasks:[],
socialTaskVersions:{},

joinedBy:referrerId || "",
referrerName:"",
referrerPhoto:"",

createdAt:Date.now(),
pending: 0,
totalEarn:settingsDataInit.registrationBonus || 50,

dailyTaskDate: "",
adLimitDate: "",

dailyWithdrawCount: 0,
lastWithdrawDate: "",

isPremium: false,

country: "",
division: "",
district: "",

deviceType: "",
platform: tg.platform || "",
deviceId:
`${tg.platform}|${navigator.userAgent}|${screen.width}x${screen.height}|${Intl.DateTimeFormat().resolvedOptions().timeZone}`,

userAgent:
navigator.userAgent,

joinDate: Date.now(),

lastActive:Date.now(),
teamBonus: 0,
totalTeamBonus: 0,
teamClaimable:0,
lastTeamClaim:"",
referDailyEarn:0,
yesterdayReferEarn:0,
teamCommissionEarned:0
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


// UPDATE REFERRER for banned

await updateDoc(refUserRef,{
refer:increment(1)
});

if(refData.banned !== true){

const settingsSnap =
await getDoc(settingsRef);

const referBonus =
settingsSnap.data()?.referBonus || 10;

await updateDoc(refUserRef,{
coin:increment(referBonus),
referEarn:increment(referBonus),
totalEarn:increment(referBonus)
});
}
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
/* APP SETTINGS DEFAULT */
/* ========================= */

const settingsSnap =
await getDoc(settingsRef);

if(!settingsSnap.exists()){

  await setDoc(settingsRef,{

    maintenance:false,
    notice:"Welcome",

    ads:true,
    socialTask:true,
    dailyTask:true,
    withdraw:true,

    ad1Reward:2,
    ad2Reward:2,
    ad3Reward:4,
    ad4Reward:5,

    ad1Limit:25,
    ad2Limit:20,
    ad3Limit:15,
    ad4Limit:10,

    ad1Zone:"",
    ad2Zone:"",
    ad3Zone:"",
    ad4Zone:"",

    referBonus:10,
    registrationBonus:5,

    minWithdrawCoin:1000,
    minReferForWithdraw:5,

    minWithdraw:500,
    maxWithdraw:1000,

    rechargeMin:20,
    rechargeMax:100,

    cashoutMin:500,
    cashoutMax:1000,
    coinRate:10,
    dailyWithdrawLimit:3,

dailyTasks:{
 task1:{
  name:"Website Visit",
  reward:20,
  dailyLimit:1,
  enabled:true,
  links:[]
 }
},
socialTasks:{}
  });

}

let settingsData =
(await getDoc(settingsRef)).data();

const missingSettings = {};

if(settingsData.ads === undefined)
missingSettings.ads = true;

if(settingsData.withdraw === undefined)
missingSettings.withdraw = true;

if(settingsData.ad1Reward === undefined)
missingSettings.ad1Reward = 0;

if(settingsData.ad2Reward === undefined)
missingSettings.ad2Reward = 0;

if(settingsData.ad3Reward === undefined)
missingSettings.ad3Reward = 0;

if(settingsData.ad4Reward === undefined)
missingSettings.ad4Reward = 0;

if(settingsData.ad1Limit === undefined)
missingSettings.ad1Limit = 0;

if(settingsData.ad2Limit === undefined)
missingSettings.ad2Limit = 0;

if(settingsData.ad3Limit === undefined)
missingSettings.ad3Limit = 0;

if(settingsData.ad4Limit === undefined)
missingSettings.ad4Limit = 0;

if(settingsData.ad1Zone === undefined)
missingSettings.ad1Zone = "";

if(settingsData.ad2Zone === undefined)
missingSettings.ad2Zone = "";

if(settingsData.ad3Zone === undefined)
missingSettings.ad3Zone = "";

if(settingsData.ad4Zone === undefined)
missingSettings.ad4Zone = "";

if(settingsData.referBonus === undefined)
missingSettings.referBonus = 10;

if(settingsData.registrationBonus === undefined)
missingSettings.registrationBonus = 5;

if(settingsData.minWithdrawCoin === undefined)
missingSettings.minWithdrawCoin = 1000;

if(settingsData.minReferForWithdraw === undefined)
missingSettings.minReferForWithdraw = 5;

if(settingsData.minWithdraw === undefined)
missingSettings.minWithdraw = 500;

if(settingsData.maxWithdraw === undefined)
missingSettings.maxWithdraw = 1000;

if(settingsData.rechargeMin === undefined)
missingSettings.rechargeMin = 20;

if(settingsData.rechargeMax === undefined)
missingSettings.rechargeMax = 100;

if(settingsData.coinRate === undefined)
missingSettings.coinRate = 10;

if(settingsData.cashoutMin === undefined)
missingSettings.cashoutMin = 500;

if(settingsData.cashoutMax === undefined)
missingSettings.cashoutMax = 1000;

if(settingsData.dailyWithdrawLimit === undefined)
missingSettings.dailyWithdrawLimit = 3;

if(settingsData.joinGateEnabled === undefined)
missingSettings.joinGateEnabled = true;

if(settingsData.joinGate === undefined)
missingSettings.joinGate = {

title:"Official Channel",

username:"",

chatId:"",

logo:"https://telegram.org/img/t_logo.png"

};

if(settingsData.dailyTasks === undefined)
missingSettings.dailyTasks = {
 task1:{
  name:"Website Visit",
  reward:0,
  dailyLimit:1,
  enabled:true,
  links:[]
 }
};
if(settingsData.socialTasks === undefined)
missingSettings.socialTasks = {

 task1:{
  name:"Telegram Channel",
  reward:0,
  enabled:true,
  link:"",
  logo:"",
  chatId:"",
 },

 task2:{
  name:"Telegram Group",
  reward:0,
  enabled:true,
  link:"",
  logo:"",
  chatId:""
 },

 task3:{
  name:"",
  reward:0,
  enabled:true,
  link:"",
  logo:"",
  chatId:""
 },

 task4:{
  name:"",
  reward:0,
  enabled:true,
  link:"",
  logo:"",
  chatId:""
 },

 task5:{
  name:"",
  reward:0,
  enabled:true,
  link:"",
  logo:"",
  chatId:""
 },

 task6:{
  name:"",
  reward:0,
  enabled:true,
  link:"",
  logo:"",
  chatId:"" 
 }

};

if(Object.keys(missingSettings).length > 0){

  await updateDoc(
    settingsRef,
    missingSettings
  );

}

/* ========================= */
/* LOAD USER */
/* ========================= */

const userData =
(await getDoc(userRef)).data();

const gate = settingsData.joinGate || {};

const joinGatePopup =
document.getElementById("joinGatePopup");

if(
joinGatePopup &&
settingsData.joinGateEnabled === true &&
userData.channelVerified !== true
){

joinGatePopup.style.display = "flex";

document.getElementById("joinGateTitle").innerText =
gate.title || "Official Channel";

document.getElementById("joinGateLogo").src =
gate.logo || "https://telegram.org/img/t_logo.png";

document.getElementById("joinGateJoinBtn").onclick = ()=>{

window.open(
`https://t.me/${gate.username}`,
"_blank"
);

};

}

const verifyBtnEl =
document.getElementById("joinGateVerifyBtn");

if(verifyBtnEl){

verifyBtnEl.onclick = async()=>{
try{
const verifyBtn =
document.getElementById("joinGateVerifyBtn");

verifyBtn.innerText =
"Verifying...";

verifyBtn.classList.add(
"loading"
);
await new Promise(resolve => setTimeout(resolve, 100));  
const res = await fetch(
`https://telegram-check.techroom-ak.workers.dev?userId=${userId}&chatId=${gate.chatId}`
);

const data = await res.json();

if(!data.joined){

verifyBtn.innerText =
"Verify";

verifyBtn.classList.remove(
"loading"
);
  
alert("Join করে Verify বাটন চাপুন");

return;

}

await updateDoc(userRef,{
channelVerified:true
});

document.getElementById("joinGatePopup").style.display = "none";

verifyBtn.innerText =
"Verify";

verifyBtn.classList.remove(
"loading"
);
  
alert("Verification Successful");

}catch(e){

verifyBtn.innerText =
"Verify";

verifyBtn.classList.remove(
"loading"
);

alert("Verification Failed");

console.error(e);

}

};
}
const missingFields = {};
if(userData.pending === undefined)
missingFields.pending = 0;

if(userData.channelVerified === undefined)
missingFields.channelVerified = false;

if(userData.totalEarn === undefined)
missingFields.totalEarn = 0;

if(userData.dailyTaskDate === undefined)
missingFields.dailyTaskDate = "";

if(userData.adLimitDate === undefined)
missingFields.adLimitDate = "";

if(userData.dailyWithdrawCount === undefined)
missingFields.dailyWithdrawCount = 0;

if(userData.lastWithdrawDate === undefined)
missingFields.lastWithdrawDate = "";

if(userData.isPremium === undefined)
missingFields.isPremium = false;

if(userData.country === undefined)
missingFields.country = "";

if(userData.division === undefined)
missingFields.division = "";

if(userData.district === undefined)
missingFields.district = "";

if(userData.deviceType === undefined)
missingFields.deviceType = "";

if(userData.platform === undefined)
missingFields.platform = tg.platform || "";

if(userData.deviceId === undefined)
missingFields.deviceId =
`${tg.platform}|${navigator.userAgent}|${screen.width}x${screen.height}|${Intl.DateTimeFormat().resolvedOptions().timeZone}`;

if(userData.userAgent === undefined)
missingFields.userAgent =
navigator.userAgent;

if(userData.joinDate === undefined)
missingFields.joinDate = Date.now();

if(userData.pendingSocialTasks === undefined)
missingFields.pendingSocialTasks = [];

if(userData.socialTaskVersions === undefined)
missingFields.socialTaskVersions = {};
  
if(Object.keys(missingFields).length > 0){
   await updateDoc(userRef, missingFields);
}

await updateDoc(userRef,{
lastActive:Date.now()
});

const now = new Date();

const today =
`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;

if(userData.dailyEarnDate !== today){

await updateDoc(userRef,{

teamBonus:
increment(
Math.floor(
(userData.referDailyEarn || 0) * 0.10
)
),

totalTeamBonus:
increment(
Math.floor(
(userData.referDailyEarn || 0) * 0.10
)
),

yesterdayReferEarn:
userData.referDailyEarn || 0,

referDailyEarn:0,

dailyEarn:0,
dailyAds:0,

dailyEarnDate:today,

dailyTaskProgress:{},

completedDailyTasks:[],
claimedDailyTasks:[]
});

userData.dailyEarn = 0;
userData.dailyAds = 0;

}

if(userData.adLimitDate !== today){

  await updateDoc(userRef,{
    ad1Count:0,
    ad2Count:0,
    ad3Count:0,
    ad4Count:0,
    adLimitDate:today
  });

  userData.ad1Count = 0;
  userData.ad2Count = 0;
  userData.ad3Count = 0;
  userData.ad4Count = 0;

}

/* ========================= */
/* UI DATA */
/* ========================= */

if(coinEl){

coinEl.innerText =
userData.coin || 0;

}

const withdrawBalance =
document.getElementById(
"withdrawBalance"
);

if(withdrawBalance){

withdrawBalance.innerText =
userData.coin || 0;

}

const withdrawBalanceBdt =
document.getElementById(
"withdrawBalanceBdt"
);

if(withdrawBalanceBdt){

withdrawBalanceBdt.innerText =
`৳ ${(
(userData.coin || 0)
/ settingsData.coinRate
).toFixed(2)}`;

}

if(bdtEl){

bdtEl.innerText =
(userData.coin / settingsData.coinRate).toFixed(2);

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
const ad1 = document.getElementById("ad1Limit");
const ad2 = document.getElementById("ad2Limit");
const ad3 = document.getElementById("ad3Limit");
const ad4 = document.getElementById("ad4Limit");

if(ad1) ad1.innerText =
`${userData.ad1Count || 0}/${settingsData.ad1Limit}`;

if(ad2) ad2.innerText =
`${userData.ad2Count || 0}/${settingsData.ad2Limit}`;

if(ad3) ad3.innerText =
`${userData.ad3Count || 0}/${settingsData.ad3Limit}`;

if(ad4) ad4.innerText =
`${userData.ad4Count || 0}/${settingsData.ad4Limit}`;

const buttons =
document.querySelectorAll(".claim-button");

const nextTime = new Date();
nextTime.setHours(24,0,0,0);

function startLimitCountdown(button){

  button.disabled = true;

  const interval = setInterval(()=>{

    const diff =
    nextTime.getTime() - Date.now();

    if(diff <= 0){

      clearInterval(interval);

      button.disabled = false;

      button.innerHTML = "Claim";

      return;

    }

    const h =
    Math.floor(diff / 3600000);

    const m =
    Math.floor((diff % 3600000) / 60000);

    const s =
    Math.floor((diff % 60000) / 1000);

    button.innerText =
    `${h}h ${m}m ${s}s`;

  },1000);

}

if(buttons[0] && (userData.ad1Count || 0) >= settingsData.ad1Limit){
  startLimitCountdown(buttons[0]);
}

if(buttons[1] && (userData.ad2Count || 0) >= settingsData.ad2Limit){
  startLimitCountdown(buttons[1]);
}

if(buttons[2] && (userData.ad3Count || 0) >= settingsData.ad3Limit){
  startLimitCountdown(buttons[2]);
}

if(buttons[3] && (userData.ad4Count || 0) >= settingsData.ad4Limit){
  startLimitCountdown(buttons[3]);
}

const ad1RewardText =
document.getElementById("ad1RewardText");

const ad2RewardText =
document.getElementById("ad2RewardText");

const ad3RewardText =
document.getElementById("ad3RewardText");

const ad4RewardText =
document.getElementById("ad4RewardText");

if(ad1RewardText)
ad1RewardText.innerText =
`+${settingsData.ad1Reward} Coin`;

if(ad2RewardText)
ad2RewardText.innerText =
`+${settingsData.ad2Reward} Coin`;

if(ad3RewardText)
ad3RewardText.innerText =
`+${settingsData.ad3Reward} Coin`;

if(ad4RewardText)
ad4RewardText.innerText =
`+${settingsData.ad4Reward} Coin`;

/* ========================= */
/* COPY INVITE */
/* ========================= */

window.copyInvite = ()=>{

navigator.clipboard.writeText(
referralLink
);

tg.showAlert(
"Referral Link Copied ✅✅"
);

};

/* ========================= */
/* CLAIM COIN */
/* ========================= */

window.claimCoin =
async(amount)=>{

const latestSnap =
await getDoc(userRef);

const latestData =
latestSnap.data();

if(latestData.banned === true){

  tg.showPopup({
    title:"Account Suspended",
    message:"Reward system is disabled for your account.",
    buttons:[{type:"ok"}]
  });

  return;

}

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

const withdrawBalance =
document.getElementById(
"withdrawBalance"
);

if(withdrawBalance){

withdrawBalance.innerText =
updatedData.coin || 0;

}

const withdrawBalanceBdt =
document.getElementById(
"withdrawBalanceBdt"
);

if(withdrawBalanceBdt){

withdrawBalanceBdt.innerText =
`৳ ${(
(updatedData.coin || 0)
/ settingsData.coinRate
).toFixed(2)}`;

}
  
bdtEl.innerText =
(updatedData.coin / settingsData.coinRate).toFixed(2);

dailyEarnEl.innerText =
updatedData.dailyEarn || 0;

const ad1 = document.getElementById("ad1Limit");
const ad2 = document.getElementById("ad2Limit");
const ad3 = document.getElementById("ad3Limit");
const ad4 = document.getElementById("ad4Limit");

if(ad1) ad1.innerText =
`${updatedData.ad1Count || 0}/${settingsData.ad1Limit}`;

if(ad2) ad2.innerText =
`${updatedData.ad2Count || 0}/${settingsData.ad2Limit}`;

if(ad3) ad3.innerText =
`${updatedData.ad3Count || 0}/${settingsData.ad3Limit}`;

if(ad4) ad4.innerText =
`${updatedData.ad4Count || 0}/${settingsData.ad4Limit}`;

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

window.selectMethod = (method,el)=>{

document
.querySelectorAll(".method-card")
.forEach(card=>{
card.classList.remove("active");
});

el.classList.add("active");

document.getElementById(
"paymentMethod"
).value = method;

changeWithdrawInfo();

};

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

if(
dailyWithdrawCount >=
settingsData.dailyWithdrawLimit
){

limit.style.display = "block";

limit.innerText =
"Daily Withdraw Limit Reached";

limit.style.color =
"#ef4444";

return;

}

const needCoin =
amount * settingsData.coinRate;

// SHOW COIN

convert.style.display = "block";

convert.innerText =
`${needCoin} Coin Required`;

// RECHARGE

if(method === "recharge"){

if(
amount < settingsData.rechargeMin ||
amount > settingsData.rechargeMax
){

info.style.display = "block";

info.innerText =
`Recharge Limit: Min ${settingsData.rechargeMin}Tk • Max ${settingsData.rechargeMax}Tk`;

info.style.color =
"#ef4444";

}else{

info.style.display = "none";

}

}

// BKASH / NAGAD

else{

if(
amount < settingsData.cashoutMin ||
amount > settingsData.cashoutMax
){

info.style.display = "block";

info.innerText =
`Cashout Limit: Min ${settingsData.cashoutMin}Tk • Max ${settingsData.cashoutMax}Tk`;

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

if(settingsData.withdraw !== true){

tg.showPopup({
title:"Withdraw Closed Now",
message:"Withdraw allow only 1th-5th each month.",
buttons:[{type:"ok"}]
});

return;

}

const latestSnap =
await getDoc(userRef);

const latestData =
latestSnap.data();

if(latestData.banned === true){

  tg.showPopup({
    title:"Your Account Suspended",
    message:"আপনার একাউন্ট ব্যান করা হয়েছে.n/n/সাপোর্টে কথা বলুন📞.",
    buttons:[{type:"ok"}]
  });

  return;

}

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

/* EMPTY */

if(
!method ||
!accountName ||
!accountNumber ||
!amount
){

alert("ফিল্ড গুলো পূরণ করুন");

return;

}

/* VALIDATION */

if(method === "Recharge"){

if(
amount < settingsData.rechargeMin ||
amount > settingsData.rechargeMax
){

alert(
`Recharge Limit: ${settingsData.rechargeMin}Tk - ${settingsData.rechargeMax}Tk`
);

return;

}

}else{

if(
amount < settingsData.cashoutMin ||
amount > settingsData.cashoutMax
){

alert(
`Cashout Limit: ${settingsData.cashoutMin}Tk - ${settingsData.cashoutMax}Tk`
);

return;

}

}


/* MIN COIN CHECK */

if(
(latestData.coin || 0) <
settingsData.minWithdrawCoin
){

alert(
`সর্বনিম্ন ${settingsData.minWithdrawCoin}💰 কয়েন লাগবে`
);

return;

}

  /* MIN REFER CHECK */

if(
(latestData.refer || 0) <
settingsData.minReferForWithdraw
){

alert(
`সর্বনিম্ন ${settingsData.minReferForWithdraw} 👥 রেফার থাকতে হবে`
);

return;

}

  
/* COIN CHECK */

const needCoin =
amount * settingsData.coinRate;

if((latestData.coin || 0) < needCoin){

alert("Not Enough Coin");

return;

}

/* BUTTON */

const sameDeviceQuery = query(
collection(db,"users"),
where("deviceId","==",latestData.deviceId)
);

const sameDeviceSnap =
await getDocs(sameDeviceQuery);

const btn =
document.getElementById(
"withdrawButton"
);

btn.disabled = true;

btn.innerText =
"Processing...";

/* SAVE */

try{

const sameDeviceQuery = query(
collection(db,"users"),
where("deviceId","==",latestData.deviceId)
);

const sameDeviceSnap =
await getDocs(sameDeviceQuery);

const accounts = [];

sameDeviceSnap.forEach((d)=>{

const u = d.data();

accounts.push({
userId:d.id,
username:u.username || "Unknown"
});

});

const logRef = await addDoc(
collection(db,"logs"),
{
username,
userId,
deviceId:latestData.deviceId || "",
platform:latestData.platform || "",
userAgent:latestData.userAgent || "",
matchedAccounts:accounts,
accountCount:sameDeviceSnap.size,
reason:
sameDeviceSnap.size > 1
?
"Same Device Detected"
:
"Withdraw Request",
createdAt:Date.now()
}
);

await updateDoc(logRef,{
documentId:logRef.id
});

}catch(err){

console.log("Log Error:",err);

}
  
const withdrawRef = await addDoc(
collection(db,"withdraws"),
{

userId:userId,

username:username,

photo:user.photo_url,

method:method,

accountName:accountName,

accountNumber:accountNumber,

amount:amount,

coin:needCoin,

status:"Pending",

createdAt:Date.now(),

requestTime:
new Date()
.toLocaleString()

}
);

await updateDoc(withdrawRef,{
documentId:withdrawRef.id
});
  
/* PENDING */

await updateDoc(userRef,{
pending:increment(1)
});

/* DEDUCT COIN */

await updateDoc(userRef,{
coin:increment(-needCoin)
});

/* SUCCESS */

btn.innerText =
"Success";

alert(
"Withdraw Request Submitted"
);

/* RESET */

document.getElementById(
"accountName"
).value = "";

document.getElementById(
"accountNumber"
).value = "";

document.getElementById(
"withdrawAmount"
).value = "";

loadUserData();

const withdrawBalance =
document.getElementById(
"withdrawBalance"
);

if(withdrawBalance){

withdrawBalance.innerText =
`${latestData.coin - needCoin} Coin`;

}
  
/* BUTTON RESET */

setTimeout(()=>{

btn.disabled = false;

btn.innerText =
"Withdraw";

},2000);

};

/* ========================= */
/* LEADERBOARD */
/* ========================= */

async function loadLeaderboard(){

const board = document.getElementById("leaderboardList");
if(!board) return;

board.innerHTML = "";

const q = query(collection(db,"users"));
const snap = await getDocs(q);

let users = [];

snap.forEach((doc)=>{
users.push(doc.data());
});

users.sort((a,b)=>(b.coin||0)-(a.coin||0));

const top3 = users.slice(0,3);
const others = users.slice(3,10);

const myRank =
users.findIndex(
u => String(u.id) === userId
)+1;

let html = `
<div class="top3-wrapper">
`;

const displayTop3 = [
top3[1],
top3[0],
top3[2]
];
displayTop3.forEach((user,index)=>{

let cardClass = "";

if(index === 0){
cardClass = "top2";
}
else if(index === 1){
cardClass = "top1";
}
else{
cardClass = "top3";
}
 
const crown =
index===1
? "👑"
: index===0
? "♔"
: "♔";

const rankNo =
index===1
? "1"
: index===0
? "2"
: "3";

html += `
<div class="top-card ${cardClass}">

<div class="top-crown">
${crown}
</div>

<img
class="top-avatar"
src="${user.photo}"
>

<div class="rank-badge">
${rankNo}
</div>

<div class="top-name">
${user.username}
</div>

<div class="top-coin">
<img
class="leaderboard-coin-icon"
src="https://cdn-icons-png.flaticon.com/128/11280/11280638.png"
>
${user.coin || 0}
</div>

<div class="top-refer">

<img
class="leaderboard-refer-icon"
src="https://cdn-icons-png.flaticon.com/128/681/681494.png"
>

<span>${user.refer || 0}</span>

</div>

</div>
`;
});

html += `
</div>

<div  class="leaderboard-list">
`;

others.forEach((user,index)=>{

const rank = index + 4;

html += `

<div class="leaderboard-item ${
String(user.id)===userId ? "you-card" : ""
}">

<div class="leaderboard-left">

<div class="leaderboard-rank">
#${rank}
</div>

<img
class="leaderboard-avatar"
src="${user.photo}"
>

<div>

<div class="leaderboard-name">
${String(user.id)===userId ? "You" : user.username}
</div>

<div class="leaderboard-id">
${String(user.id)===userId
? user.username
: `ID: ${String(user.id).slice(0,2)}***${String(user.id).slice(-2)}`
}
</div>

</div>

</div>

<div class="leaderboard-right">

<div class="leaderboard-coin">

<img
class="leaderboard-coin-icon"
src="https://cdn-icons-png.flaticon.com/128/11280/11280638.png"
>

${user.coin || 0}

</div>

<div class="leaderboard-refer">
<img
class="leaderboard-refer-icon"
src="https://cdn-icons-png.flaticon.com/128/681/681494.png"
>

<span>${user.refer || 0}</span>
</div>

</div>

</div>
`;
});

html += `</div>`;

const me =
users.find(
u => String(u.id) === userId
);

if(me && myRank > 10){

html += `

<div class="leaderboard-item you-card">

<div class="leaderboard-left">

<div class="leaderboard-rank">
#${myRank}
</div>

<img
class="leaderboard-avatar"
src="${me.photo}"
>

<div>

<div class="leaderboard-name">
You
</div>

<div class="leaderboard-id">
${me.username}
</div>

</div>

</div>

<div class="leaderboard-right">

<div class="leaderboard-coin">

<img
class="leaderboard-coin-icon"
src="https://cdn-icons-png.flaticon.com/128/11280/11280638.png"
>

${me.coin || 0}

</div>

<div class="leaderboard-refer">
👥 ${me.refer || 0}
</div>

</div>

</div>

`;
}

board.innerHTML = html;
}

if(document.getElementById("leaderboardList")){
   loadLeaderboard();
}
/* ========================= */
/* TEAM PAGE */
/* ========================= */

async function loadTeamData(){

const teamList =
document.getElementById("teamList");

if(!teamList) return;

const q =
query(
collection(db,"users"),
where("joinedBy","==",userId)
);

const snap =
await getDocs(q);

let totalRefer = 0;
let activeRefer = 0;

if(snap.empty){

teamList.innerHTML = `

<div class="team-loading">

<h3>আপনার কোনো রেফার নেই</h3>

<p>
রেফার করুন আপনার বন্ধুকে   এবং লাইফটাইম ১০% বোনাস জিতুন ডেইলি
</p>

</div>

`;

return;

}

teamList.innerHTML = "";
  
snap.forEach((docSnap)=>{

const data = docSnap.data();

totalRefer++;

const isInactive =
(Date.now() - (data.lastActive || 0))
>
(30 * 60 * 60 * 1000);

if(!isInactive){
activeRefer++;
}

const status =
isInactive
?
"Inactive"
:
"Active";

const statusClass =
isInactive
?
"team-status-inactive"
:
"team-status-active";

teamList.innerHTML += `

<div class="team-row">

<div class="team-user">

<img src="${data.photo}">

<div class="team-user-info">

<div class="team-user-name">
${data.username || data.first_name || "No Name"}
</div>
<div class="team-user-id">
ID:${docSnap.id}
</div>

</div>

</div>

<div>
0
</div>

<div>
${data.dailyEarn || 0}
</div>

<div>

<div>
${data.totalEarn || 0}
</div>

<div
style="
display:flex;
align-items:center;
justify-content:center;
gap:3px;
font-size:10px;
margin-top:2px;
color:#64748b;
"
>

<img
src="https://cdn-icons-png.flaticon.com/128/681/681494.png"
style="
width:11px;
height:11px;
"
>

<span>
${data.refer || 0}
</span>

</div>

</div>

<div class="${statusClass}">
${status}
</div>

</div>

`;

});

const totalReferEl =
document.getElementById("teamTotalRefer2");

const activeReferEl =
document.getElementById("teamActiveRefer");

const referCountEl =
document.getElementById("teamReferCount");

if(totalReferEl)
totalReferEl.innerText = totalRefer;

if(activeReferEl)
activeReferEl.innerText = activeRefer;

if(referCountEl)
referCountEl.innerText = totalRefer;

}

/* ========================= */
/* LOAD WITHDRAW HISTORY */
/* ========================= */

function loadWithdrawHistory(){

const historyList =
document.getElementById(
"historyList"
);

if(!historyList) return;

const q =
query(
collection(db,"withdraws"),
where("userId","==",userId),
orderBy("createdAt","desc")
);

onSnapshot(q,(snapshot)=>{

historyList.innerHTML = "";

snapshot.forEach((doc)=>{

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
? 'https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg'
: data.method === 'nagad'
? 'https://www.logo.wine/a/logo/Nagad/Nagad-Vertical-Logo.wine.svg'
: 'https://cdn-icons-png.flaticon.com/128/9418/9418116.png'
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

<div class="history-status
${

data.status === "Success"
?
"success-status"

:

data.status === "Cancelled"
?
"cancel-status"

:

"pending-status"

}
">

${data.status}

</div>

</div>

</div>

`;

});

});

}

loadWithdrawHistory();

await updateDoc(userRef,{
online:true,
lastActive:Date.now()
});

setInterval(async()=>{

await updateDoc(userRef,{
lastActive:Date.now()
});

},5000);

/* ========================= */
/* APP SETTINGS */
/* ========================= */

onSnapshot(
doc(db,"settings","app"),
(snapshot)=>{

const settings =
snapshot.data();
settingsData = settings;

const ad1RewardText =
document.getElementById("ad1RewardText");

const ad2RewardText =
document.getElementById("ad2RewardText");

const ad3RewardText =
document.getElementById("ad3RewardText");

const ad4RewardText =
document.getElementById("ad4RewardText");

if(ad1RewardText)
ad1RewardText.innerText =
`+${settings.ad1Reward} Coin`;

if(ad2RewardText)
ad2RewardText.innerText =
`+${settings.ad2Reward} Coin`;

if(ad3RewardText)
ad3RewardText.innerText =
`+${settings.ad3Reward} Coin`;

if(ad4RewardText)
ad4RewardText.innerText =
`+${settings.ad4Reward} Coin`;

if(!settings) return;

const referBonusText =
document.getElementById("referBonusText");

if(referBonusText){

referBonusText.innerHTML = `

<img
class="mini-coin-icon"
src="https://cdn-icons-png.flaticon.com/128/11280/11280638.png"
/>

${settings.referBonus || 0} Coin Per Refer

`;

}
  
/* MAINTENANCE */

if(settings.maintenance){

document.body.innerHTML = `

<div style="
display:flex;
justify-content:center;
align-items:center;
height:100vh;
background:#111827;
color:white;
padding:20px;
text-align:center;
font-size:24px;
font-weight:700;
">

${settings.maintenanceMessage ||
"🚧 App আপডেট চলছে, n/n/ কিছুক্ষণ পর আবার চেষ্টা করুন।"}

</div>

`;

return;

  }

/* NOTICE */

const noticeEl =
document.getElementById("noticeText");

if(noticeEl){

noticeEl.innerText =
settings.notice || "";

}
renderDailyTasks();
renderSocialTasks();
});

/* ========================= */
/* ADS BUTTON SYSTEM */
/* ========================= */

document
.querySelectorAll(".claim-button")
.forEach((button,index)=>{

button.onclick = async()=>{

if(settingsData.ads !== true){

tg.showPopup({
title:"Ads Disabled",
message:"Ads system is currently disabled.",
buttons:[{type:"ok"}]
});

return;

}

if(button.disabled) return;

button.disabled = true;

const originalText =
button.innerHTML;

button.innerText =
"Loading Ad...";

let reward = 0;

if(index === 0)
reward = settingsData.ad1Reward;

else if(index === 1)
reward = settingsData.ad2Reward;

else if(index === 2)
reward = settingsData.ad3Reward;

else if(index === 3)
reward = settingsData.ad4Reward;

/* USER DATA */

const userSnap =
await getDoc(userRef);

const userData =
userSnap.data();

if(userData.banned === true){

  tg.showPopup({
    title:"Your Account Banned",
    message:"Rewards are disabled for your account.",
    buttons:[{type:"ok"}]
  });

  button.disabled = false;
  button.innerHTML = originalText;

  return;

}
/* SETTINGS */

let limit = 0;
let cooldown = 0;
let adCountField = "";
let adLastField = "";

/* BUTTON 1 */

if(index === 0){

limit = settingsData.ad1Limit;
cooldown = settingsData.ad1Cooldown;

adCountField =
"ad1Count";

adLastField =
"ad1Last";

}

/* BUTTON 2 */

else if(index === 1){

limit = settingsData.ad2Limit;
cooldown = settingsData.ad2Cooldown;


adCountField =
"ad2Count";

adLastField =
"ad2Last";

}

/* BUTTON 3 */

else if(index === 2){

limit = settingsData.ad3Limit;
cooldown = settingsData.ad3Cooldown;


adCountField =
"ad3Count";

adLastField =
"ad3Last";

}

/* BUTTON 4 */

else if(index === 3){

limit = settingsData.ad4Limit;
cooldown = settingsData.ad4Cooldown;

adCountField =
"ad4Count";

adLastField =
"ad4Last";

}

/* DAILY LIMIT */

if((userData[adCountField]) >= limit){

const lastWatch =
userData[adLastField];

const nextTime = new Date();
nextTime.setHours(24,0,0,0);

const interval =
setInterval(()=>{

const now =
Date.now();

const diff =
nextTime - now;

if(diff <= 0){

clearInterval(interval);

button.disabled = false;

button.innerHTML =
originalText;

return;

}

const h =
Math.floor(diff / 3600000);

const m =
Math.floor((diff % 3600000) / 60000);

const s =
Math.floor((diff % 60000) / 1000);

button.innerText =

`${h}h ${m}m ${s}s`;

},1000);

return;

}

/* ========================= */
/* BUTTON 1 */
/* ========================= */

if(index === 0){

show_11035690()

.then(async()=>{

if(userData.joinedBy){

const refRef =
doc(
db,
"users",
String(userData.joinedBy)
);

await updateDoc(refRef,{
referDailyEarn:
increment(reward)
});

}
  
await updateDoc(userRef,{

coin:increment(reward),

dailyEarn:increment(reward),
totalEarn:increment(reward),
dailyAds:increment(1),
totalAds:increment(1),
ad1Count:increment(1),
  
ad1Last:Date.now(),

lastAdWatch:Date.now()

});

await loadUserData();

tg.showPopup({

title:"Ads Reward Added",

message:`${reward} Coin Added Successfully`,

buttons:[
{
type:"ok"
}
]

});

button.innerHTML =
"✅ Claimed";

let sec = cooldown;

const timer =
setInterval(()=>{

button.innerText =
`Wait ${sec}s`;

sec--;

if(sec < 0){

clearInterval(timer);

button.disabled = false;

button.innerHTML =
originalText;

}

},1000);

})

.catch(async(error)=>{

await saveErrorLog(
"Monetag Ad Failed",
error
);

button.disabled = false;

button.innerHTML =
originalText;

alert("বিজ্ঞাপন সম্পূর্ণ দেখা হয়নি।   অনুগ্রহ করে বিজ্ঞাপনটি সম্পূর্ণ দেখুন।");

});

}

/* ========================= */
/* BUTTON 2 */
/* ========================= */

else if(index === 1){

show_11035690()

.then(async()=>{

if(userData.joinedBy){

const refRef =
doc(
db,
"users",
String(userData.joinedBy)
);

await updateDoc(refRef,{
referDailyEarn:
increment(reward)
});

}
  
await updateDoc(userRef,{
  
coin:increment(reward),
dailyEarn:increment(reward),
totalEarn:increment(reward),
dailyAds:increment(1),
totalAds:increment(1),
ad2Count:increment(1),
ad2Last:Date.now(),
lastAdWatch:Date.now()

});
  
await loadUserData();

tg.showPopup({

title:"Ads Reward Added ✅ ",

message:`${reward} Coin Added Successfully`,

buttons:[
{
type:"ok"
}
]

});

button.innerHTML =
"✅ Claimed";

let sec = cooldown;

const timer =
setInterval(()=>{

button.innerText =
`Wait ${sec}s`;

sec--;

if(sec < 0){

clearInterval(timer);

button.disabled = false;

button.innerHTML =
originalText;

}

},1000);

})

.catch(async(error)=>{

await saveErrorLog(
"Monetag Ad Failed",
error
);

button.disabled = false;

button.innerHTML =
originalText;

alert("বিজ্ঞাপন সম্পূর্ণ দেখা হয়নি। n/n/ অনুগ্রহ করে বিজ্ঞাপনটি সম্পূর্ণ দেখুন।");

});

}

/* ========================= */
/* BUTTON 3 */
/* ========================= */

else if(index === 2){

show_11035690('pop')

.then(async()=>{

if(userData.joinedBy){

const refRef =
doc(
db,
"users",
String(userData.joinedBy)
);

await updateDoc(refRef,{
referDailyEarn:
increment(reward)
});

}
  
await updateDoc(userRef,{
  
coin:increment(reward),
dailyEarn:increment(reward),
totalEarn:increment(reward),
dailyAds:increment(1),
totalAds:increment(1),
ad3Count:increment(1),
  
ad3Last:Date.now(),

lastAdWatch:Date.now()

});

await loadUserData();

tg.showPopup({

title:"Ads Reward Added ✅",

message:`${reward} Coin Added Successfully`,

buttons:[
{
type:"ok"
}
]

});

button.innerHTML =
"✅ Claimed";

let sec = cooldown;

const timer =
setInterval(()=>{

button.innerText =
`Wait ${sec}s`;

sec--;

if(sec < 0){

clearInterval(timer);

button.disabled = false;

button.innerHTML =
originalText;

}

},1000);

})

.catch(async(error)=>{

await saveErrorLog(
"Monetag Ad Failed",
error
);

button.disabled = false;

button.innerHTML =
originalText;

alert("এডস সম্পূর্ণ দেখা হয়নি। অনুগ্রহ করে এডস সম্পূর্ণ দেখুন।");

});

}

/* ========================= */
/* BUTTON 4 */
/* ========================= */

else if(index === 3){

show_11035690('pop')

.then(async()=>{

if(userData.joinedBy){

const refRef =
doc(
db,
"users",
String(userData.joinedBy)
);

await updateDoc(refRef,{
referDailyEarn:
increment(reward)
});

}
  
await updateDoc(userRef,{
  
coin:increment(reward),
dailyEarn:increment(reward),
totalEarn:increment(reward),
dailyAds:increment(1),
totalAds:increment(1),
ad4Count:increment(1),
ad4Last:Date.now(),
lastAdWatch:Date.now()

});
  
await loadUserData();

tg.showPopup({

title:"Ads Reward Added ✅",

message:`${reward} Coin Added Successfully`,

buttons:[
{
type:"ok"
}
]

});

button.innerHTML =
"✅ Claimed";

let sec = cooldown;

const timer =
setInterval(()=>{

button.innerText =
`Wait ${sec}s`;

sec--;

if(sec < 0){

clearInterval(timer);

button.disabled = false;

button.innerHTML =
originalText;

}

},1000);

})

.catch(async(error)=>{

await saveErrorLog(
"Monetag Ad Failed",
error
);

button.disabled = false;

button.innerHTML =
originalText;

alert("এডস সম্পূর্ণ দেখা হয়নি। অনুগ্রহ করে এডস সম্পূর্ণ দেখুন।");

});

}

};

});

/* Task Edit */
function renderDailyTasks(){

const list =
document.getElementById(
"dailyTaskList"
);

const section =
document.querySelector(
".daily-task-section"
);

if(!list) return;

const task =
settingsData.dailyTasks?.task1;

const completed =
(userData.completedDailyTasks || [])
.includes("task1");

const claimed =
(userData.claimedDailyTasks || [])
.includes("task1");

if(!task || task.enabled !== true){

list.innerHTML = "";

if(section){
section.style.display = "none";
}

return;

}

if(section){
section.style.display = "block";
}

list.innerHTML = `

<div class="task-item">

<div class="task-left">

<img
class="task-icon"
src="https://cdn-icons-png.flaticon.com/128/8743/8743996.png"
/>

<div>

<h3 class="task-title">
${task.name}
</h3>

<p class="task-description">
 টাস্কটি সম্পুর্ণ করে কয়েন জিতুন
</p>

<p
id="dailyTaskProgress"
class="task-progress"
>
${userData.dailyTaskProgress?.task1 || 0}/${task.links?.length || 0}
</p>

</div>

</div>

<div class="task-right">

<p class="task-reward">

<img
class="mini-coin-icon"
src="https://cdn-icons-png.flaticon.com/128/11280/11280638.png"
/>

${task.reward} Coin

</p>

${
completed && !claimed
?

`<button
class="task-button orange-btn"
onclick="claimDailyReward()"
>
Claim
</button>`

:

`<button
class="task-button
${claimed ? 'red-btn' : 'blue-btn'}"
${claimed ? 'disabled' : ''}
id="dailyTaskStartBtn"
>
${claimed ? 'Completed' : 'Start'}
</button>`
}
</div>

`;
const dailyBtn =
document.getElementById(
"dailyTaskStartBtn"
);

if(dailyBtn){

dailyBtn.onclick =
startDailyTask;

}
}

window.startDailyTask = async()=>{

const task =
settingsData.dailyTasks?.task1;

if(!task) return;

const progress =
userData.dailyTaskProgress?.task1 || 0;

if(
!task.links ||
progress >= (task.links?.length || 0)
){
alert("Task already completed");
return;
}

if(
!task.links ||
!task.links[progress]
){

alert("Task Start Soon");

return;

}

window.open(
task.links[progress],
"_blank"
);

const progressEl =
document.getElementById(
"dailyTaskProgress"
);

const startBtn =
document.getElementById(
"dailyTaskStartBtn"
);

if(startBtn){

startBtn.disabled = true;

startBtn.innerText =
"Wait 10s";

}
  
let sec = 10;

const timer =
setInterval(()=>{

if(startBtn){

startBtn.innerText =
`Wait ${sec}s`;

}

sec--;

if(sec < 0){

clearInterval(timer);

}

},1000);
  
setTimeout(async()=>{

const newProgress =
progress + 1;

if(
newProgress >=
task.links.length
){

await updateDoc(userRef,{

completedDailyTasks:[
...(userData.completedDailyTasks || []),
"task1"
]

});

userData.completedDailyTasks = [
...(userData.completedDailyTasks || []),
"task1"
];

}
  
await updateDoc(userRef,{

dailyTaskProgress:{
...(userData.dailyTaskProgress || {}),
task1:newProgress
}

});

userData.dailyTaskProgress = {
...(userData.dailyTaskProgress || {}),
task1:newProgress
};

if(startBtn){

startBtn.disabled = false;

startBtn.innerText =
"Start";

}
  
renderDailyTasks();

},10000);

};

window.claimDailyReward = async()=>{

const task =
settingsData.dailyTasks?.task1;
  
if(userData.joinedBy){

const refRef =
doc(
db,
"users",
String(userData.joinedBy)
);

await updateDoc(refRef,{
referDailyEarn:
increment(task.reward)
});

}

await updateDoc(userRef,{

coin:increment(task.reward),

dailyEarn:increment(task.reward),
totalEarn:increment(task.reward),
claimedDailyTasks:[
...(userData.claimedDailyTasks || []),
"task1"
]

});

userData.claimedDailyTasks = [
...(userData.claimedDailyTasks || []),
"task1"
];

alert(
`${task.reward} Coin Added Successfully`
);

renderDailyTasks();

loadUserData();

};

function renderSocialTasks(){

const list =
document.getElementById(
"socialTaskList"
);

const section =
document.querySelector(
".social-task-section"
);
  
if(!list) return;

list.innerHTML = "";
let visibleCount = 0;

const tasks =
settingsData.socialTasks || {};

for(let i=1;i<=6;i++){

const task =
tasks[`task${i}`];

const completed =
(userData.completedSocialTasks || [])
.includes(`task${i}`);

const claimed =
(userData.claimedSocialTasks || [])
.includes(`task${i}`);

if(!task || task.enabled !== true)
continue;

visibleCount++;

list.innerHTML += `

<div class="social-item">

<div class="social-left">

<img
class="social-icon"
src="${task.logo || 'https://cdn-icons-png.flaticon.com/128/8297/8297314.png'}"
/>

<div>

<h3 class="social-title">
${task.name}
</h3>

<p class="social-description">
Complete Task
</p>

</div>

</div>

<div class="social-right">

<div class="social-reward">

<img
class="mini-coin-icon"
src="https://cdn-icons-png.flaticon.com/128/11280/11280638.png"
/>

${task.reward} Coin

</div>

${
claimed
?

`<button
class="social-button social-complete-button"
disabled
>
Completed
</button>`

:

`<button
class="social-button social-start-btn"
data-id="${i}"
>
${
(userData.pendingSocialTasks || [])
.includes(`task${i}`)
?
"Verify"
:
"Start"
}
</button>`
}

</div>

</div>

`;

document
.querySelectorAll(".social-start-btn")
.forEach(btn=>{

btn.onclick = ()=>{

startSocialTask(
btn.dataset.id
);

};

});
  
}

if(section){

section.style.display =
visibleCount > 0
?
"block"
:
"none";

}

}

/* SOCIAL TASK */

async function startSocialTask(id){

const task =
settingsData.socialTasks?.[`task${id}`];

const currentVersion =
task.version || 1;

const savedVersion =
userData.socialTaskVersions?.[`task${id}`] || 0;

if(savedVersion !== currentVersion){

await updateDoc(userRef,{
claimedSocialTasks:
(userData.claimedSocialTasks || [])
.filter(x => x !== `task${id}`)
});

userData.claimedSocialTasks =
(userData.claimedSocialTasks || [])
.filter(x => x !== `task${id}`);

}
  
if(!task?.enabled){
return;
}

/* TELEGRAM TASK */

if(task.type === "telegram"){

/* START */

if(
!(userData.pendingSocialTasks || [])
.includes(`task${id}`)
){

window.open(task.link,"_blank");

await updateDoc(userRef,{
pendingSocialTasks:[
...(userData.pendingSocialTasks || []),
`task${id}`
]
});

userData.pendingSocialTasks = [
...(userData.pendingSocialTasks || []),
`task${id}`
];

renderSocialTasks();

return;

}

/* VERIFY */
const btn =
document.querySelector(
`button[data-id="${id}"]`
);

btn.disabled = true;
btn.innerText = "Verifying...";

try{

const res = await fetch(
`https://telegram-check.techroom-ak.workers.dev?userId=${userId}&chatId=${task.chatId}`
);

const data = await res.json();

const latestSnap =
await getDoc(userRef);

const latestData =
latestSnap.data();

if(
(latestData.claimedSocialTasks || [])
.includes(`task${id}`)
){

btn.innerText = "Completed";
btn.disabled = true;

return;

}
  
if(!data.joined){

tg.showPopup({
title:"Join Required",
message:"Please join channel/group first",
buttons:[{type:"ok"}]
});

await updateDoc(userRef,{
pendingSocialTasks:
(userData.pendingSocialTasks || [])
.filter(x => x !== `task${id}`)
});

userData.pendingSocialTasks =
(userData.pendingSocialTasks || [])
.filter(x => x !== `task${id}`);

renderSocialTasks();

return;

}

await updateDoc(userRef,{

coin:increment(task.reward),

dailyEarn:increment(task.reward),
totalEarn:increment(task.reward),
claimedSocialTasks:[
...(userData.claimedSocialTasks || []),
`task${id}`
],

[`socialTaskVersions.task${id}`]:
task.version || 1,

completedSocialTasks:[
...(userData.completedSocialTasks || []),
`task${id}`
]

});

userData.claimedSocialTasks = [
...(userData.claimedSocialTasks || []),
`task${id}`
];

userData.completedSocialTasks = [
...(userData.completedSocialTasks || []),
`task${id}`
];

userData.pendingSocialTasks =
(userData.pendingSocialTasks || [])
.filter(x => x !== `task${id}`);

 btn.innerText = "Completed";
btn.disabled = true;

btn.style.opacity = "1";
btn.style.pointerEvents = "none"; 

if(userData.joinedBy){

const refRef =
doc(
db,
"users",
String(userData.joinedBy)
);

await updateDoc(refRef,{
referDailyEarn:
increment(task.reward)
});

}
  
alert(`${task.reward} Coin Added`);

renderSocialTasks();

loadUserData();

}catch(error){

alert(error.message);

console.error(error);

}

return;

}

/* TIMER TASK */

const btn =
document.querySelector(
`button[data-id="${id}"]`
);

window.open(
task.link,
"_blank"
);

btn.disabled = true;

let sec = task.wait || 60;

btn.innerText =
`Wait ${sec}s`;

const timer =
setInterval(()=>{

sec--;

btn.innerText =
`Wait ${sec}s`;

if(sec <= 0){

clearInterval(timer);

btn.disabled = false;

btn.innerText = "Claim";

btn.onclick = async()=>{

btn.disabled = true;
btn.innerText = "Processing...";  
  
await updateDoc(userRef,{

coin:increment(task.reward),

dailyEarn:increment(task.reward),
totalEarn:increment(task.reward),
claimedSocialTasks:[
...(userData.claimedSocialTasks || []),
`task${id}`
],

completedSocialTasks:[
...(userData.completedSocialTasks || []),
`task${id}`
]

});

userData.claimedSocialTasks = [
...(userData.claimedSocialTasks || []),
`task${id}`
];

userData.completedSocialTasks = [
...(userData.completedSocialTasks || []),
`task${id}`
];

renderSocialTasks();

loadUserData();

};

}

},1000);

}

/* team claim */

window.claimTeamBonus =
async()=>{

const snap =
await getDoc(userRef);

const data =
snap.data();

const bonus =
data.teamBonus || 0;

if(bonus <= 0){

alert("বর্তমানে কোনো টিম বোনাস জমা হয়নি।");

return;

}

const today =
new Date()
.toISOString()
.slice(0,10);

if(data.lastTeamClaim === today){

alert("আজকের বোনাস ইতোমধ্যে ক্লেইম করা হয়েছে।");

return;

}

await updateDoc(
userRef,
{
coin:increment(bonus),
totalEarn:increment(bonus),
teamBonus:0,
lastTeamClaim:today
}
);

alert(`অভিনন্দন! ${bonus} Coin সফলভাবে যোগ হয়েছে।`);
  
await loadTeamBonusData();

await loadUserData();

await loadTeamData();
  
};

async function loadTeamBonusData(){

const btn =
document.getElementById(
"claimTeamBonusBtn"
);

const teamBonusEl =
document.getElementById(
"teamBonus"
);

if(!teamBonusEl || !btn)
return;

const snap =
await getDoc(userRef);

const me =
snap.data();

const bonus =
me.teamBonus || 0;

teamBonusEl.innerText = bonus;

document.getElementById(
"totalTeamBonus"
).innerText =
me.totalTeamBonus || 0;

const today =
new Date()
.toISOString()
.slice(0,10);

if(me.lastTeamClaim === today){

btn.disabled = true;

btn.innerHTML =
"✅ Claimed";

return;

}

if(bonus > 0){

btn.disabled = false;

btn.innerHTML =
"Claim Today";

}else{

btn.disabled = true;

btn.innerHTML =
"Locked";

}

}
if(document.getElementById("teamList")){

loadTeamData();

loadTeamBonusData();
}


/* User Error Logs */

async function saveErrorLog(reason,error=""){

try{

const logRef = await addDoc(
collection(db,"logs"),
{
type:"reward_error",

userId:userId,
username:username,

reason:reason,

error:
typeof error === "string"
?
error
:
(error?.message || JSON.stringify(error)),

createdAt:Date.now()
});

await updateDoc(logRef,{
documentId:logRef.id
});

}catch(e){

console.log("Log Save Failed",e);

}

}
