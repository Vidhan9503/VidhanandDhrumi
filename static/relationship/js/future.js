document.querySelectorAll(".bucket-check").forEach(check=>{
  check.parentElement.addEventListener("click",()=>{
    if(check.textContent==="○"){check.textContent="✓";check.parentElement.style.opacity=".55";check.parentElement.style.textDecoration="line-through";}
  });
});
document.querySelector(".add-plan")?.addEventListener("click",()=>{
 const plan=prompt("What should future us do?");
 if(!plan)return;
 const card=document.createElement("div");card.className="bucket-card";
 card.innerHTML=`<div class="bucket-check">○</div><div><b>${plan.replace(/</g,"&lt;")}</b><p>added by present-day us.</p></div><span>new</span>`;
 document.querySelector(".bucket-wrap").insertBefore(card,document.querySelector(".add-plan"));
});