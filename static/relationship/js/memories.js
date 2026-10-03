const memories = [
  "The first time we realised this was becoming a real thing.",
  "That completely ordinary day that turned into one of my favourites.",
  "The longest call we definitely should not have stayed awake for.",
  "A photo neither of us liked at the time but now somehow love.",
  "The moment distance felt a little less annoying.",
  "That one inside joke that stopped making sense to everyone else."
];
const randomBtn = document.getElementById("randomBtn");
if(randomBtn) randomBtn.addEventListener("click",()=>{
  document.getElementById("randomMemory").textContent = memories[Math.floor(Math.random()*memories.length)];
});