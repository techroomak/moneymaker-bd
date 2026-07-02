/* ===================================================
   PLAY V1
   GAME LOADER
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

let playGames=[];

/* ========================= */

function loadPlayGames(){

playLoading.style.display="flex";

const q=query(

collection(db,"games"),

orderBy("sort","asc")

);

onSnapshot(q,(snapshot)=>{

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

playLoading.style.display="none";

});

}

/* ========================= */

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

clone.querySelector(".play-game-btn").onclick=()=>{

playGame(game.id);

};

gameList.appendChild(clone);

});

}

/* ==========load play game=============== */

loadPlayGames();

/* ===================================================
   PLAY V1.2A
   UNLOCK SYSTEM
=================================================== */

const unlockPopup =
document.getElementById("gameUnlockPopup");

const unlockBtn =
document.getElementById("unlockGameBtn");

const unlockClose =
document.getElementById("closeUnlockPopup");

const unlockCoinText =
document.getElementById("unlockGameCoin");

let currentGame=null;

let playUser={};

/* ========================= */

onSnapshot(userRef,(snap)=>{

playUser=snap.data() || {};

if(document.getElementById("playCoinBalance")){

document.getElementById("playCoinBalance").innerText=
playUser.coin || 0;

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

gameUnlocked:true

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
   PLAY V1.2B
   PLAY ENGINE
=================================================== */

let currentPlayGame = null;
let playStartedAt = 0;
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

if(latest.gameUnlocked !== true){

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

playLoading.style.display = "flex";


/* Open Game */

openGameFrame(game);

}

/* ========================= */
/* SDK CALLBACK */
/* ========================= */


/* ========================= */

async function onGameReturn(

sdk=false

){

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

title:"🎮 আজকের রিওয়ার্ড শেষ",

message:
"আপনি আজ এই গেমের সব রিওয়ার্ড সংগ্রহ করেছেন। চাইলে গেমটি খেলতে পারবেন। নতুন রিওয়ার্ডের জন্য আগামীকাল আবার চেষ্টা করুন।",

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

await rewardGame(game);

currentPlayGame = null;

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
latest.coin || 0;

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

tg.showPopup({

title:"Reward Failed",

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

function openGameFrame(game){

    if(!gameFrame){

        console.error("Game Frame Not Found");

        return;

    }

    rewardWaiting = true;

    currentPlayGame = game;

    playStartedAt = Date.now();

    playLoading.style.display = "flex";

    gameFrame.src = game.url;

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

    setTimeout(()=>{

    playLoading.style.display = "none";

    document.querySelectorAll(".play-game-btn")
        .forEach(btn=>btn.disabled=false);

    featuredPlayBtn.disabled=false;

    },600);

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

}

window.gameRewardCallback = function(){

    if(!currentPlayGame) return;

    onGameReturn(true);

};

window.gameCloseCallback = function(){

    closeGameFrame();

};

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

const count=

playUser.gameRewarded || 0;

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

            message:"আপনি কি গেম থেকে বের হতে চান? গেম কমপ্লিট না হলে রিওয়ার্ড দেওয়া হবে না।",

            buttons:[
                {id:"continue",type:"default",text:"Continue"},
                {id:"exit",type:"destructive",text:"Exit"}
            ]

        },(id)=>{

            if(id==="exit"){

                closeGameFrame();

                currentPlayGame=null;
                rewardWaiting=false;

                tg.BackButton.hide();

            }

        });

    });

}
/* Go back button */
function goBackFromGame(){

    window.history.back();

}
