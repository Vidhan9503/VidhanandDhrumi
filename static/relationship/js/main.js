document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => btn.closest(".modal").classList.remove("show"));
  });
  document.querySelectorAll(".modal").forEach(m => {
    m.addEventListener("click", e => { if(e.target === m) m.classList.remove("show"); });
  });

  const surprise = document.getElementById("surpriseBtn");
  const modal = document.getElementById("surpriseModal");
  const texts = [
    "You are my favourite notification. ♡",
    "I would choose you in every universe.",
    "This is your official reminder that I adore you.",
    "Three years and you still make me smile at my phone.",
    "Plot twist: you're still my favourite person."
  ];
  if(surprise) surprise.addEventListener("click", () => {
    document.getElementById("surpriseText").textContent = texts[Math.floor(Math.random()*texts.length)];
    modal.classList.add("show");
  });

  const secret = document.getElementById("secretCard");
  if(secret) secret.addEventListener("click", () => {
    alert("👀 You found it. Your reward: one extremely dramatic kiss. 💋");
  });
});