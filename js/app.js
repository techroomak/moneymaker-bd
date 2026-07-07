// =========================
// FIREBASE
// =========================

import { db, auth }
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
orderBy,
runTransaction,
deleteDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ========================= */
/* TELEGRAM */
/* ========================= */

const tg =
window.Telegram.WebApp;

tg.ready();

tg.expand();


const adsgram2 = window.Adsgram?.init({
    blockId: "36847"
});

const adsgram4 = window.Adsgram?.init({
    blockId: "36859"
});

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
/* AUTH WAIT */
/* ========================= */

while (!auth.currentUser) {

  await new Promise(resolve =>
    setTimeout(resolve, 100)
  );

}

console.log(
  "AUTH UID:",
  auth.currentUser.uid
);

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

authUid: auth.currentUser?.uid || "",
telegramId: userId,

username:username,

photo:photo,

coin:settingsDataInit.registrationBonus || 50,

refer:0,

referEarn:0,

withdraw:0,

dailyEarn:0,
yesterdayEarn:0,
dailyAds:0,
totalAds:0,
yesterdayAds:0,
lifetimeAds:0, 
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
refer:increment(1),
referEarn:increment(settingsDataInit.referBonus || 10),
coin:increment(settingsDataInit.referBonus || 10),
totalEarn:increment(settingsDataInit.referBonus || 10)
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
    rechargeMin:20,
    rechargeMax:100,

    cashoutMin:500,
    cashoutMax:1000,
    coinRate:10,
    dailyWithdrawLimit:3,
    yesterdayAds:0,
    lastAdsResetDate:"",
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
/* PAGE NAVIGATION */
/* ========================= */

window.openPage = async(url)=>{

    await showPageAd();

    window.location.href = url;

};

/* ========================= */
/* GLOBAL ADS */
/* ========================= */

window.showPageAd = async()=>{

    if(!settingsData.ads) return;

    try{

        await show_11035690({

            type:"inApp",

            inAppSettings:{
                frequency:1,
                capping:0,
                interval:0,
                timeout:5,
                everyPage:false
            }

        });

    }catch(e){

        console.log("Page Ad Skipped");

    }

};

/* ========================= */
/* STARTUP LOADING */
/* ========================= */

window.showStartupLoading = async()=>{

    const loading =
    document.getElementById("appLoading");

    if(!loading) return;

    await new Promise(r=>setTimeout(r,900));

    loading.style.display="none";

    showPageAd();

};

/* ========================= */
/* LOAD USER */
/* ========================= */

const userData =
(await getDoc(userRef)).data();

if(!userData){

alert("User Data Missing");

throw new Error(
"User document not found"
);

}

if(!userData.authUid){

await updateDoc(userRef,{
authUid: auth.currentUser?.uid || ""
});

userData.authUid =
auth.currentUser?.uid || "";

}

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

await createLog(
"Channel Not Joined",
gate.chatId || ""
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

if(userData.gamesUnlockedAt === undefined)
missingFields.gamesUnlockedAt = 0;

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

if(userData.yesterdayEarn === undefined)
missingFields.yesterdayEarn = 0;

if(userData.yesterdayAds === undefined)
missingFields.yesterdayAds = 0;

if(userData.lifetimeAds === undefined)
missingFields.lifetimeAds = 0;

if(userData.gamePlayed === undefined)
missingFields.gamePlayed = 0;

if(userData.gameRewarded === undefined)
missingFields.gameRewarded = 0;

if(userData.gameDailyCount === undefined)
missingFields.gameDailyCount = {};

if(userData.gamePopup === undefined)
missingFields.gamePopup = {};

if(userData.gameDate === undefined)
missingFields.gameDate = "";

if(userData.gameCoin === undefined)
missingFields.gameCoin = 0;

    
if(Object.keys(missingFields).length > 0){
   await updateDoc(userRef, missingFields);
}

await updateDoc(userRef,{
lastActive:Date.now()
});

const now = new Date();

const today =
new Date().toISOString().slice(0,10);

const appSettingsSnap =
await getDoc(settingsRef);

const appSettings =
appSettingsSnap.data() || {};
  
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

yesterdayAds:
userData.dailyAds || 0,

dailyEarn:0,
dailyAds:0,

dailyEarnDate:today,
yesterdayEarn:userData.dailyEarn || 0,
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

if(bdtEl && settingsData){

bdtEl.innerText =
((userData.coin || 0) /
(settingsData.coinRate || 10))
.toFixed(2);

}

/* ========================= */
/* TOTAL REFER COUNT */
/* ========================= */

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
    title:"🤕 Account Suspended",
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
/* GLOBAL LOG SYSTEM */
/* ========================= */

async function createLog(
reason,
error="",
docId="",
accounts=""
){

const logRef = await addDoc(
collection(db,"logs"),
{
userId,
username,
user:`${username} (${userId})`,
accounts,
reason,
error,
docId: docId || "",
time:Date.now()
}
);

if(!docId){

await updateDoc(logRef,{
docId: logRef.id
});

}

}

/* ========================= */
/* LOAD DATA FUNCTION */
/* ========================= */

async function loadUserData(){

const updatedSnap =
await getDoc(userRef);

const updatedData =
updatedSnap.data();

if(coinEl){
coinEl.innerText =
updatedData.coin || 0;
}

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
  
if(bdtEl){
bdtEl.innerText =
(updatedData.coin / settingsData.coinRate).toFixed(2);
}

if(dailyEarnEl){
dailyEarnEl.innerText =
updatedData.dailyEarn || 0;
}

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

/* DAILY LIMIT */

const withdrawCount =
userData.dailyWithdrawCount || 0;

if(
withdrawCount >=
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
/* REAL NOTIFICATION SYSTEM */
/* ========================= */

const notificationList =
document.getElementById(
"notificationList"
);

const notifyDot =
document.getElementById(
"notifyDot"
);

onSnapshot(
collection(db,"notifications"),
(snapshot)=>{

if(!notificationList) return;

let html = "";

const docs = [];

snapshot.forEach((docSnap)=>{
docs.push(docSnap);
});

docs.sort((a,b)=>
(b.data().createdAt || 0)
-
(a.data().createdAt || 0)
);

let count = 0;

docs.forEach((docSnap)=>{

const data = docSnap.data();

if(
Date.now() >
(data.expireAt || 0)
){
return;
}

if(
data.target === "user"
&&
String(data.userId)
!== userId
){
return;
}

count++;

const diff =
Date.now() -
(data.createdAt || 0);

const minutes =
Math.floor(diff / 60000);

const hours =
Math.floor(diff / 3600000);

const timeText =
hours >= 1
?
`${hours} Hour Ago`
:
`${minutes} Min Ago`;

html += `

<div class="notification-item">

<div class="notification-top">

<h3 class="notification-title">
${data.title}
</h3>

<span class="notification-badge">
NEW
</span>

</div>

<p class="notification-text">
${
(data.message || "")
.replaceAll(
",",
"<br>"
)
}
</p>

<p class="notification-time">
${timeText}
</p>

</div>

`;

});

notificationList.innerHTML =
html ||
`
<div class="notification-item">
<p>No Notification</p>
</div>
`;

notifyDot.style.display =
count > 0
?
"block"
:
"none";

});

/* ========================= */
/* SUBMIT WITHDRAW */
/* ========================= */

window.submitWithdraw = async()=>{
try{
if(settingsData.withdraw !== true){

tg.showPopup({
title:"💳 উত্তোলন শুরু হতে যাচ্ছে..",
message:"প্রতিমাসের ১-৫তারিখে পেমেন্ট দেওয়া হয়, ধন্যবাদ।",
buttons:[{type:"ok"}]
});

return;

}

const latestSnap =
await getDoc(userRef);

const latestData =
latestSnap.data();
  
const today =
new Date()
.toISOString()
.slice(0,10);

let withdrawCount =
latestData.dailyWithdrawCount || 0;

if(
latestData.lastWithdrawDate !== today
){
withdrawCount = 0;
}
  
if(latestData.banned === true){

  tg.showPopup({
    title:"🤕 আপনার একাউন্ট সাসপেন্ড করা হয়েছে",
    message:"আপনার একাউন্ট এর সকল সার্ভিস বন্ধ আছে।. 🎧 সাপোর্টে কথা বলুন.",
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

alert("নাম, নাম্বার ও টাকার পরিমাণ দিন ও পেমেন্ট মেথড সিলেক্ট করুন");

return;

}

/* VALIDATION */

if(method === "recharge"){

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

/* COIN CHECK */

const needCoin =
amount * settingsData.coinRate;

if((latestData.coin || 0) < needCoin){

alert("Not Enough Coin");

return;

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
)
{
alert(
`সর্বনিম্ন ${settingsData.minReferForWithdraw} 👥 রেফার থাকতে হবে`
);
return;
}

/* BUTTON */
  
const btn =
document.getElementById(
"withdrawButton"
);

btn.disabled = true;

btn.innerText =
"Processing...";

/* SAVE */

 /* MATCHED ACCOUNT CHECK */

let matchedAccounts = [];

const allUsers =
await getDocs(
collection(db,"users")
);

allUsers.forEach((docSnap)=>{

const u = docSnap.data();

if(
String(u.id) === String(userId)
){
return;
}

const sameDevice =
u.deviceId &&
u.deviceId === latestData.deviceId;

const sameAgent =
u.userAgent &&
u.userAgent === latestData.userAgent;

if(sameDevice || sameAgent){

matchedAccounts.push(
`${u.username} (${u.id})`
);

}

});

const matchedCount =
matchedAccounts.length + 1;

const matchedText =
matchedAccounts.length
?
matchedAccounts.join("\n")
:
"No Matched Account"; 

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

let verifyStatus =
"Verify Passed";

if(
latestData.channelVerified !== true
){

verifyStatus =
"Group Fail Verify";

}
await createLog(

matchedAccounts.length
? "Same Device Detect"
: "Withdraw Request",

matchedText,

withdrawRef.id,

`${matchedCount} (${verifyStatus})`

);

/* PENDING */

await updateDoc(userRef,{
pending:increment(1),
dailyWithdrawCount:
withdrawCount + 1,
lastWithdrawDate:today
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

}catch(err){

console.error(err);

alert(
err.code || err.message || err
);

const btn =
document.getElementById(
"withdrawButton"
);

if(btn){

btn.disabled = false;
btn.innerText = "Withdraw";

}

}

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

snap.forEach((docSnap)=>{

 const userData = docSnap.data();

 users.push({
   ...userData,
   realRefer: userData.refer || 0
 });

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
? "♛"
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

<span>${user.realRefer || 0}</span>

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

<span>${user.realRefer || 0}</span>
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
👥 ${me.realRefer || 0}
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

const members = [];

snap.forEach((docSnap)=>{

members.push({
docSnap,
data: docSnap.data()
});

});

members.sort((a,b)=>{

const aInactive =
(Date.now()-(a.data.lastActive||0))
>
(34*60*60*1000);

const bInactive =
(Date.now()-(b.data.lastActive||0))
>
(34*60*60*1000);

if(aInactive!==bInactive){
return aInactive-bInactive;
}

return (b.data.lastActive||0)-
(a.data.lastActive||0);

});

members.forEach(({docSnap,data})=>{

totalRefer++;

const today =
new Date().toISOString().slice(0,10);

const isInactive =
(Date.now() - (data.lastActive || 0))
>
(34 * 60 * 60 * 1000);

const teamDailyEarn =
isInactive
? 0
: (data.dailyEarn || 0);
  
const teamBonusToday =
Math.floor((teamDailyEarn || 0) * 0.10);

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

<div style="
display:flex;
align-items:center;
justify-content:center;
gap:3px;
">

<img
src="https://cdn-icons-png.flaticon.com/128/11280/11280638.png"
style="
width:12px;
height:12px;
"
>

<span>
${teamBonusToday || 0}
</span>

</div>

<div style="
display:flex;
align-items:center;
justify-content:center;
gap:3px;
">

<img
src="https://cdn-icons-png.flaticon.com/128/11280/11280638.png"
style="
width:12px;
height:12px;
"
>

<span>
${teamDailyEarn}
</span>

</div>

<div>

<div style="
display:flex;
align-items:center;
justify-content:center;
gap:3px;
">

<img
src="https://cdn-icons-png.flaticon.com/128/11280/11280638.png"
style="
width:12px;
height:12px;
"
>

<span>
${data.totalEarn || 0}
</span>

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

if(snapshot.empty){

historyList.innerHTML = `
<div class="empty-history">
😟 কোনো লেনদেনের তথ্য পাওয়া যায়নি।
</div>
`;

return;

}
  
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

/* ========================= */
/* ONLINE OFFLINE */
/* ========================= */
  
setInterval(async()=>{

try{

await updateDoc(userRef,{
lastActive:Date.now(),

deviceId:
`${tg.platform}|${navigator.userAgent}|${screen.width}x${screen.height}|${Intl.DateTimeFormat().resolvedOptions().timeZone}`,

userAgent:navigator.userAgent
});

}catch(e){}

},10000);

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
${settings.referBonus || 0}

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
"🚧 App আপডেট করা হয়েছে, একবার রিলোড দিন।"}

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
try{
renderDailyTasks();
}catch(e){}

try{
renderSocialTasks();
}catch(e){}
});

try{
loadPlayTask();
}catch(e){}

/* ========================= */
/* ADS BUTTON SYSTEM */
/* ========================= */

document
.querySelectorAll(".claim-button")
.forEach((button,index)=>{

button.onclick = async()=>{

if(settingsData.ads !== true){

tg.showPopup({
title:"😥 Ah! No Ads Found",
message:"সার্ভার সমস্যার কারণে এডস দেখা যায়নি। আবার চেষ্টা করুন। ধন্যবাদ",
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
    title:"আপনার একাউন্ট ব্যান করা হয়েছে",
    message:"আপনি এই মুহুর্তে কোনো রিওয়ার্ড পাবেন না।    একাউন্ট সচল করতে সাপোর্টে কথা বলুন ",
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
referDailyEarn:increment(reward),

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

title:"🎁 Ads Reward Added ✅",

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

button.disabled = false;

button.innerHTML =
originalText;

alert("বিজ্ঞাপন সম্পূর্ণ দেখা হয়নি।   অনুগ্রহ করে বিজ্ঞাপনটি সম্পূর্ণ দেখুন।");
  
await createLog(
"Ads Reward Error",
String(error?.message || error)
);
});

}

/* ========================= */
/* BUTTON 2 */
/* ========================= */

else if(index === 1){
  
try{
window.adsgramShowing = true;
    await adsgram2.show();

    if(userData.joinedBy){

        const refRef =
        doc(db,"users",String(userData.joinedBy));

        await updateDoc(refRef,{
            referDailyEarn:increment(reward)
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
        title:"Ads Reward Added ✅",
        message:`${reward} Coin Added Successfully`,
        buttons:[{type:"ok"}]
    });

    button.innerHTML="✅ Claimed";

    let sec=cooldown;

    const timer=setInterval(()=>{

        button.innerText=`Wait ${sec}s`;

        sec--;

        if(sec<0){

            clearInterval(timer);

            button.disabled=false;

            button.innerHTML=originalText;

        }

    },1000);
    
}catch(error){

    button.disabled=false;

    button.innerHTML=originalText;

    alert("Ad পাওয়া যায়নি,      App রিলোড দিন অথবা কিছুক্ষণ পর আবার চেষ্টা করুন।");

    await createLog(
        "AdsGram Reward Error",
        String(error?.message || error)
    );
}
finally{

    window.adsgramShowing = false;

}
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
referDailyEarn:increment(reward),

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

button.disabled = false;
  
button.innerHTML =
originalText;

alert("এডস সম্পূর্ণ দেখা হয়নি। অনুগ্রহ করে 10s এডস দেখুন।");
  
await createLog(
"Ads Reward Error",
String(error?.message || error)
);
});

}

/* ========================= */
/* BUTTON 4 */
/* ========================= */

else if(index === 3){
  
try{
window.adsgramShowing = true;
    await adsgram4.show();

    if(userData.joinedBy){

        const refRef =
        doc(db,"users",String(userData.joinedBy));

        await updateDoc(refRef,{
            referDailyEarn:increment(reward)
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
        buttons:[{type:"ok"}]
    });

    button.innerHTML="✅ Claimed";

    let sec=cooldown;

    const timer=setInterval(()=>{

        button.innerText=`Wait ${sec}s`;

        sec--;

        if(sec<0){

            clearInterval(timer);

            button.disabled=false;

            button.innerHTML=originalText;

        }

    },1000);

}catch(error){

    button.disabled=false;

    button.innerHTML=originalText;

    alert("Ad পাওয়া যায়নি,     App রিলোড দিন অথবা কিছুক্ষণ পর আবার চেষ্টা করুন।");

    await createLog(
        "AdsGram Reward Error",
        String(error?.message || error)
    );
}

finally{

window.adsgramShowing = false;

}
    
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
referDailyEarn:increment(task.reward),
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

/* game TASK */
function loadPlayTask(){

const btn =
document.getElementById("playTaskBtn");

if(!btn) return;

btn.onclick=()=>{

window.location.href=
"play.html?type=game";

};

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

await createLog(
"Channel Not Joined",
task.chatId || ""
);

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
referDailyEarn:increment(task.reward),
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


/* ===================================================
   PLAY V1 GAME LOADER
=================================================== */

const playLoading =
document.getElementById("playLoading");

const gameList =
document.getElementById("gameList");

const gameEmpty =
document.getElementById("gameEmpty");

const template =
document.getElementById("gameCardTemplate");

const featuredCard =
document.getElementById("featuredGameCard");

const featuredTitle =
document.getElementById("featuredGameTitle");

const featuredDescription =
document.getElementById("featuredGameDescription");

const featuredReward =
document.getElementById("featuredReward");

const featuredBanner =
document.getElementById("featuredBanner");

const featuredPlayBtn =
document.getElementById("featuredPlayBtn");

const rewardOverlay =
document.getElementById("gameRewardOverlay");

const rewardTimer =
document.getElementById("rewardTimer");

let rewardInterval = null;

let rewardReady = false;

let playGames=[];

let rewardClaimed = false;

let rewardSaving = false;

let currentGame = null;

let playStartedAt = 0;

/* ==========Load Play Game=============== */

function loadPlayGames(){

playLoading.style.display = "flex";

const q=query(

collection(db,"games"),

orderBy("sort","asc")

);

onSnapshot(q, async(snapshot)=>{

playGames=[];

snapshot.forEach(doc=>{

const game={

id:doc.id,

...doc.data()

};

if(game.enabled!==false){

playGames.push(game);

}

});

renderPlayGames();

    playLoading.style.display = "none";

await showPageAd();
    
});

}

/* ==========Render Play Game=============== */

function renderPlayGames(){

gameList.innerHTML="";

if(playGames.length===0){

gameEmpty.style.display="block";

return;

}

gameEmpty.style.display="none";

/* FEATURED */

const featured=

playGames.find(g=>g.featured===true);

if(featured){

featuredCard.style.display="flex";

featuredTitle.innerText=

featured.name||"Featured Game";

featuredDescription.innerText=

featured.description||"";

featuredReward.innerHTML=

`<img class="play-mini-coin-icon"
src="https://cdn-icons-png.flaticon.com/128/272/272525.png">

+${featured.reward} Coin`;

featuredBanner.style.backgroundImage =
`url('${featured.banner}')`;

featuredPlayBtn.onclick=()=>{

playGame(featured.id);

};

}

/* GAME LIST */

playGames.forEach(game=>{

const clone=

template.content.cloneNode(true);

clone.querySelector(".play-game-logo").src=

game.logo;

clone.querySelector(".play-game-title").innerText=

game.name;

clone.querySelector(".rewardText").innerText=

`+${game.reward}`;

clone.querySelector(".play-game-description").innerText=

game.description||"";
    
const playerCount =
clone.querySelector(".play-player-count");

if(playerCount){

    playerCount.innerText =
    game.players || 0;

}

clone.querySelector(".play-game-btn").onclick=()=>{

    playGame(game.id);

};

gameList.appendChild(clone);

});

}

/* ==========load play game=============== */

loadPlayGames();

/* ===================================================
   PLAY V1.2A UNLOCK SYSTEM
=================================================== */

const unlockPopup =
document.getElementById("gameUnlockPopup");

const unlockBtn =
document.getElementById("unlockGameBtn");

const unlockClose =
document.getElementById("closeUnlockPopup");

const unlockCoinText =
document.getElementById("unlockGameCoin");

let playUser={};

/* ========================= */

onSnapshot(userRef,(snap)=>{

playUser=snap.data() || {};

if(document.getElementById("playCoinBalance")){

document.getElementById("playCoinBalance").innerText=
playUser.gameCoin || 0;

}

});

/* ========================= */

function openUnlockPopup(){

unlockPopup.style.display="flex";

unlockCoinText.innerText=

settingsData.gameUnlockCoin || 3000;

}

/* ========================= */

function closeUnlockPopup(){

unlockPopup.style.display="none";

currentGame=null;

}

/* ========================= */

unlockClose.onclick=closeUnlockPopup;

/* ========================= */

unlockBtn.onclick=async()=>{

unlockBtn.disabled=true;

unlockBtn.innerText="Unlocking...";

const unlockCost=

settingsData.gameUnlockCoin || 3000;

const latest=

(await getDoc(userRef)).data();

/* already unlocked */

if(latest.gameUnlocked===true){

closeUnlockPopup();

unlockBtn.disabled=false;

unlockBtn.innerText="🔓 Unlock Now";

playGame(currentGame);

return;

}

/* coin check */

if((latest.coin||0)<unlockCost){

unlockBtn.disabled=false;

unlockBtn.innerText="🔓 Unlock Now";

tg.showPopup({

title:"Not Enough Coin",

message:
`You need ${unlockCost} Coin to unlock Game Mode.`,

buttons:[{type:"ok"}]

});

return;

}

/* unlock */

await updateDoc(userRef,{

coin:increment(-unlockCost),

gameUnlocked:true,
gamesUnlockedAt: Date.now()

});

await loadUserData();

closeUnlockPopup();

unlockBtn.disabled=false;

unlockBtn.innerText="🔓 Unlock Now";

if(currentGame){

playGame(currentGame);

}

};

/* ========================= */

window.addEventListener("click",(e)=>{

if(e.target===unlockPopup){

closeUnlockPopup();

}

});

/* ===================================================
   PLAY V1.2B PLAY ENGINE
=================================================== */

let currentPlayGame = null;
let rewardWaiting = false;

/* ========================= */

async function playGame(gameId){

if(rewardWaiting) return;

const game =
playGames.find(g=>g.id===gameId);

if(!game){

tg.showPopup({
title:"Game Not Found",
message:"এই গেমটি বর্তমানে উপলব্ধ নেই।",
buttons:[{type:"ok"}]
});

return;

}

currentGame = gameId;

/* Unlock Check */

const latest =
(await getDoc(userRef)).data();

if(
    latest.gameUnlocked !== true &&
    !latest.gamesUnlockedAt
){

openUnlockPopup();

return;

}

/* Loading */

const btns =
document.querySelectorAll(".play-game-btn");

btns.forEach(btn=>{

btn.disabled = true;

});

featuredPlayBtn.disabled = true;
  
/* Open Game */

openGameFrame(game);

}

/* ========================= */
/* SDK CALLBACK */
/* ========================= */


/* ========================= */

async function onGameReturn( sdk=false
){

playLoading.style.display = "none";

rewardWaiting=false;

const playTime =

Math.floor(

(Date.now()-playStartedAt)/1000

);

/* future verify */

await verifyGameReward({

game:currentPlayGame,

sdk,

playTime

});

}

/* ========================= */
/* VERIFY REWARD */
/* ========================= */

async function verifyGameReward(data){

const latestSnap = await getDoc(userRef);
const user = latestSnap.data();

const game = data.game;

if(!game) return;

/* daily reset */

const today =
new Date().toISOString().slice(0,10);

if(user.gameDate !== today){

await updateDoc(userRef,{

gameDate:today,

gamePlayed:0,

gameRewarded:0,

gameDailyCount:{},

gamePopup:{}

});

user.gameDate = today;
user.gamePlayed = 0;
user.gameRewarded = 0;
user.gameDailyCount = {};
user.gamePopup = {};

}



/* Global Daily Limit */

const globalLimit =
Number(settingsData.dailyGameLimit || 20);

if((user.gameRewarded || 0) >= globalLimit){

    tg.showPopup({

        title:"🎮 Daily Reward Limit Reached",

        message:`আজকের ${globalLimit} টি গেম রিওয়ার্ড শেষ হয়েছে। রিওয়ার্ড পেতে আগামীকাল আবার চেষ্টা করুন।`,

        buttons:[{type:"ok"}]

    });

    currentPlayGame = null;

    return;

}

/* reward limit */

const todayCount =

(user.gameDailyCount || {})[game.id] || 0;

const limit =
Number(game.dailyLimit || 0);

if(limit > 0 && todayCount >= limit){

const popupShown =

(user.gamePopup || {})[game.id];

if(!popupShown){

tg.showPopup({

title:"🎮 রিওয়ার্ড লিমিট শেষ",

message:
"আপনি আজ এই গেমের সব রিওয়ার্ড সংগ্রহ করেছেন। চাইলে গেমটি খেলতে পারবেন। নতুন রিওয়ার্ডের জন্য অন্য গেম খেলুন।",

buttons:[
{type:"ok"}
]

});

await updateDoc(userRef,{

[`gamePopup.${game.id}`]:true

});

}


currentPlayGame = null;

return;

}

/* play time */

if(!data.sdk){

if(data.playTime < 10){

currentPlayGame = null;

return;

}

}

/* next */

rewardReady = true;
/*
currentPlayGame = null;
রিওয়ার্ড একটিভ অফ 
*/
}

/* ===================================================
   PLAY V1.3B-1
   REWARD TRANSACTION
=================================================== */

async function rewardGame(game){

try{

const reward =
Number(game.reward || 0);

if(reward <= 0){
return;
}

await runTransaction(db, async(transaction)=>{

const snap =
await transaction.get(userRef);

if(!snap.exists()){

throw "USER_NOT_FOUND";

}

const user =
snap.data();

const today =
new Date().toISOString().slice(0,10);

/* Daily Reset */

let gameDate =
user.gameDate || "";

let gamePlayed =
user.gamePlayed || 0;

let gameRewarded =
user.gameRewarded || 0;

let gameDailyCount =
user.gameDailyCount || {};

let gamePopup =
user.gamePopup || {};

if(gameDate !== today){

gameDate = today;

gamePlayed = 0;

gameRewarded = 0;

gameDailyCount = {};

gamePopup = {};

}

/* Global Daily Limit Settings */

const globalLimit =
Number(settingsData.dailyGameLimit || 20);

if(gameRewarded >= globalLimit){

    throw "GLOBAL_LIMIT_REACHED";

}

/* Limit */

const currentCount =
Number(
gameDailyCount[game.id] || 0
);

const dailyLimit =
Number(game.dailyLimit || 0);

if(
dailyLimit > 0 &&
currentCount >= dailyLimit
){

throw "LIMIT_REACHED";

}

/* Update Memory */

gameDailyCount[game.id] =
currentCount + 1;

gamePlayed++;

gameRewarded++;

transaction.update(userRef,{

gameDate,

gamePlayed,

gameRewarded,

gameDailyCount,

gamePopup,

coin: Number(user.coin || 0) + reward,

gameCoin: Number(user.gameCoin || 0) + reward,

dailyEarn: Number(user.dailyEarn || 0) + reward,

totalEarn: Number(user.totalEarn || 0) + reward

}); 

/* ========================= */
/* COMPLETE TRANSACTION */
/* ========================= */

}); // End Transaction

await loadUserData();

if(document.getElementById("playCoinBalance")){

const latest =
(await getDoc(userRef)).data();

document.getElementById("playCoinBalance").innerText =
latest.gameCoin || 0;

}

tg.showPopup({

title:"🎉 Reward Collected",

message:
`You received ${reward} Coins.`,

buttons:[
{type:"ok"}
]

});

}catch(error){

console.log(error);

if(error==="LIMIT_REACHED"){

return;

}

if(error==="GLOBAL_LIMIT_REACHED"){

    tg.showPopup({

        title:"🎮 Daily Reward Limit Reached",

        message:`আজকের ${settingsData.dailyGameLimit || 20} খেলে রিওয়ার্ড লিমিট শেষ।    রিওয়ার্ড পেতে আগামীকাল আবার গেম খেলুন ।`,

        buttons:[{type:"ok"}]

    });

    return;

}

tg.showPopup({

title:"⚠️ Reward Failed",

message:
"Unable to verify reward. Please try again.",

buttons:[
{type:"ok"}
]

});

}finally{

rewardWaiting=false;

currentPlayGame=null;

}
}

/* ===================================================
   PLAY V1.4
   SDK READY
=================================================== */

let gameFrame = null;

function setGameFrame(frame){

    gameFrame = frame;

}

async function openGameFrame(game){

  if(!gameFrame){

    gameFrame =
    document.getElementById("gameFrame");

}

    if(!gameFrame){

        console.error("Game Frame Not Found");

        return;

    }

    rewardWaiting = true;

    currentPlayGame = game;

    playStartedAt = Date.now();

    await updateDoc(
    doc(db, "games", game.id),
    {
        players: increment(1)
    }
    );
    
    gameFrame.src = game.url;

currentGame = game;

playStartedAt = Date.now();

rewardReady = false;

rewardClaimed = false;

rewardSaving = false;

startRewardCountdown(
game.rewardTime || 60
);

gameFrame.style.cssText = `
display:block;
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
border:0;
z-index:999999;
background:#000;
`;

showGameBackButton();
}

function closeGameFrame(){

    if(!gameFrame) return;

    gameFrame.src="about:blank";

    gameFrame.style.display="none";
    gameFrame.style.position="";
    gameFrame.style.top="";
    gameFrame.style.left="";
    gameFrame.style.width="";
    gameFrame.style.height="";
    gameFrame.style.border="0";
    gameFrame.style.zIndex="";
    gameFrame.style.background="";

    tg.BackButton.hide();

    rewardWaiting=false;
    currentPlayGame=null;

    clearInterval(rewardInterval);
    rewardOverlay.style.display = "none";
    rewardTimer.classList.remove("reward-complete");
    rewardTimer.innerHTML = "00";
}

playStartedAt = 0;

document
.querySelectorAll(".play-game-btn")
.forEach(btn=>{

btn.disabled = false;

});

if(typeof featuredPlayBtn !== "undefined" && featuredPlayBtn){

featuredPlayBtn.disabled = false;

}

window.gameRewardCallback = function(){

    if(!currentPlayGame) return;

    onGameReturn(true);

};

window.gameCloseCallback = function(){

    closeGameFrame();

};

document
.querySelectorAll(".play-game-btn")
.forEach(btn=>{

    btn.disabled = false;

});

featuredPlayBtn.disabled = false;

loadUserData();

/* ========================= */
/* PAGE LOAD */
/* ========================= */

document.addEventListener("DOMContentLoaded",()=>{

setGameFrame(

document.getElementById("gameFrame")

);

});

/* ===================================================
   PLAY V1.5
   RESET TIMER
=================================================== */

function updateGameResetTimer(){

const timer=

document.getElementById(

"gameResetTimer"

);

if(!timer) return;

const now=

new Date();

const tomorrow=

new Date();

tomorrow.setHours(

24,0,0,0

);

const diff=

tomorrow-now;

const h=

String(

Math.floor(diff/3600000)

).padStart(2,"0");

const m=

String(

Math.floor(

(diff%3600000)

/60000

)

).padStart(2,"0");

const s=

String(

Math.floor(

(diff%60000)

/1000

)

).padStart(2,"0");

timer.innerText=

`Reset in ${h}:${m}:${s}`;

}

setInterval(

updateGameResetTimer,

1000

);

updateGameResetTimer();

/* daily limit ui */

function updateDailyLimit(){

const box=

document.getElementById(

"todayGameLimit"

);

if(!box) return;

const count =
Number(playUser.gameRewarded || 0);

const limit=

settingsData.dailyGameLimit || 50;

box.innerText=

`${count} / ${limit}`;

}

onSnapshot(userRef,(snap)=>{

playUser=snap.data()||{};

updateDailyLimit();

});

/* ===================================================
   PLAY V1.6
   BACK BUTTON
=================================================== */

function showGameBackButton(){

    tg.BackButton.show();

    tg.BackButton.onClick(()=>{

        tg.showPopup({

            title:"Exit Game?",

            message: rewardReady
            ? "আপনি কি গেম থেকে বের হতে চান?    আপনার রিওয়ার্ড দেওয়া হয়েছে"
            : "আপনি কি গেম থেকে বের হতে চান?   গেম কমপ্লিট না হলে রিওয়ার্ড দেওয়া হবে না。",

            buttons:[
                {id:"continue",type:"default",text:"Continue"},
                {id:"exit",type:"destructive",text:"Exit"}
            ]

        }, async(id)=>{

            if(id !== "exit") return;

            await goBackFromGame();

            rewardWaiting = false;

            tg.BackButton.hide();

        });

    });

}

/* Start Game Count Down */

function startRewardCountdown(seconds){

rewardReady = false;

rewardClaimed = false;

rewardSaving = false;

clearInterval(rewardInterval);

rewardOverlay.style.display = "flex";

let time = seconds;

rewardTimer.innerText = time;

rewardInterval = setInterval(()=>{

time--;

if(time >= 0){

rewardTimer.innerText = time;

}

if(time <= 0){

clearInterval(rewardInterval);

rewardReady = true;

rewardTimer.innerHTML = "✓";

rewardTimer.classList.add("reward-complete");

}

},1000);

}


/* Go back button */
async function goBackFromGame(){

  clearInterval(rewardInterval);

rewardOverlay.style.display = "none";

if(currentPlayGame && rewardReady){

await rewardGame(currentPlayGame);

}

rewardReady = false;

rewardClaimed = false;

rewardSaving = false;

currentGame = null;

rewardTimer.classList.remove("reward-complete");

rewardTimer.innerHTML = "00";

    closeGameFrame();

    loadPlayGames();

}

window.goBackFromGamePage = async()=>{

    if(gameFrame.style.display !== "none"){

        await goBackFromGame();

    }else{

        window.location.href="index.html";

    }

};

/* ========================= */
/* DEVTOOLS DETECT */
/* ========================= */
let devtoolsLogged = false;

setInterval(()=>{

const opened =
window.outerWidth - window.innerWidth > 160 ||
window.outerHeight - window.innerHeight > 160;

if(opened && !devtoolsLogged){

devtoolsLogged = true;

createLog(
"DevTools Open",
navigator.userAgent
);

}

if(!opened){

devtoolsLogged = false;

}

},5000);
