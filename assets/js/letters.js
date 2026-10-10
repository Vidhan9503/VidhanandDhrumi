const letterData = {
 miss:["you miss me","I know. I miss you too. I wish I could just appear at your door whenever the distance gets annoying. Until teleportation is invented, consider this a tiny version of me sitting beside you, stealing your blanket and telling you that we'll get through this day too."],
 bad:["you've had a bad day","You don't have to turn every bad day into a lesson. Sometimes a day is just rubbish. Eat something, drink water, complain to me, and let yourself be taken care of a little. Tomorrow gets another chance."],
 sleep:["you can't sleep","Put the phone down after reading this. Close your eyes. Imagine we're somewhere quiet, with no alarms tomorrow. Breathe. You are safe, you are loved, and there is nothing you need to solve at 2:17 a.m."],
 happy:["you need a reminder","In case you forgot: I am ridiculously proud of you. I love the person you are, the person you're becoming, and even the weird little parts you think are too much. You are never too much for me."]
};
document.querySelectorAll(".letter:not(.locked)").forEach(card=>card.addEventListener("click",()=>{
 const [title,body]=letterData[card.dataset.letter]; document.getElementById("letterTitle").textContent=title;document.getElementById("letterBody").textContent=body;document.getElementById("letterModal").classList.add("show");
}));