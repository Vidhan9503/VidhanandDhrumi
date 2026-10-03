
document.addEventListener("DOMContentLoaded",()=>{
  // Modal closing
  document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",()=>btn.closest(".modal")?.classList.remove("show")));
  document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("show")}));

  // Surprise
  const surprise=document.getElementById("surpriseBtn"), modal=document.getElementById("surpriseModal");
  const texts=[
    "You are my favourite notification. ♡",
    "I would choose you in every universe.",
    "Official reminder: you are ridiculously loved.",
    "Three years and you still make me smile at my phone.",
    "Plot twist: you're still my favourite person."
  ];
  surprise?.addEventListener("click",()=>{
    document.getElementById("surpriseText").textContent=texts[Math.floor(Math.random()*texts.length)];
    modal?.classList.add("show");
  });

  // Hidden objects
  let secretCount=0;
  const secretMessage=()=>{
    secretCount++;
    if(secretCount>=2){
      secretCount=0;
      alert("You found two hidden things. There are more. Probably. 👀♡");
    }
  };
  document.getElementById("secretHeart")?.addEventListener("click",secretMessage);
  document.getElementById("secretStar")?.addEventListener("click",secretMessage);
  document.getElementById("secretCard")?.addEventListener("click",()=>{
    alert("👀 You found the obvious secret. Your reward: one extremely dramatic kiss. 💋");
  });

  // Birthday mode: only activates on the configured birthday date.
  const overlay=document.getElementById("birthdayOverlay");
  if(overlay && window.BIRTHDAY_DATE){
    const today=new Date().toISOString().slice(0,10);
    if(today===window.BIRTHDAY_DATE){
      overlay.classList.add("show");
      const enter=document.getElementById("enterBirthday");
      enter?.addEventListener("click",()=>{
        overlay.classList.remove("show");
        confettiBurst();
      });
    }
  }

  function confettiBurst(){
    const symbols=["♡","✦","🎀","✨","💗","🌸"];
    for(let i=0;i<55;i++){
      const el=document.createElement("div");
      el.className="confetti";
      el.textContent=symbols[Math.floor(Math.random()*symbols.length)];
      el.style.left=Math.random()*100+"vw";
      el.style.animationDuration=(2.5+Math.random()*3)+"s";
      el.style.fontSize=(14+Math.random()*18)+"px";
      document.body.appendChild(el);
      setTimeout(()=>el.remove(),6000);
    }
  }
});
