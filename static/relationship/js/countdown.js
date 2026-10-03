
const relationshipStart = new Date((window.RELATIONSHIP_START || "2023-10-14") + "T00:00:00");

function updateCounter(){
  const now=new Date();
  let diff=Math.max(0,now-relationshipStart);
  const daysTotal=Math.floor(diff/86400000);
  const years=Math.floor(daysTotal/365.2425);
  const days=Math.floor(daysTotal-years*365.2425);
  const hours=Math.floor((diff%86400000)/3600000);
  const minutes=Math.floor((diff%3600000)/60000);
  const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=String(val).padStart(2,"0")};
  set("years",years);set("days",days);set("hours",hours);set("minutes",minutes);
}
updateCounter();setInterval(updateCounter,30000);

// Meeting countdown is intentionally separate: put the next meeting date here.
// Example: window.NEXT_MEETING = "2026-12-20T18:00:00";
window.NEXT_MEETING = window.NEXT_MEETING || null;
function updateMeeting(){
  const el=document.getElementById("meetingCountdown");
  if(!el)return;
  if(!window.NEXT_MEETING){el.textContent="Set NEXT_MEETING in countdown.js when you know the date ♡";return;}
  const diff=new Date(window.NEXT_MEETING)-new Date();
  if(diff<=0){el.textContent="we're together. finally. ♡";return;}
  const d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),m=Math.floor(diff%3600000/60000);
  el.textContent=`${d} days · ${h} hours · ${m} minutes`;
}
updateMeeting();setInterval(updateMeeting,30000);
