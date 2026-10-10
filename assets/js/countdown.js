(function () {
  const raw = window.RELATIONSHIP_START || "2023-10-25T21:41:00+05:30";
  const relationshipStart = new Date(raw);

  function updateCounter() {
    const ids = ["years", "days", "hours", "minutes"];
    if (Number.isNaN(relationshipStart.getTime())) {
      ids.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = "00"; });
      return;
    }

    const diff = Math.max(0, Date.now() - relationshipStart.getTime());
    const totalMinutes = Math.floor(diff / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Calendar-aware years/month remainder: stable and avoids NaN/rounding glitches.
    const now = new Date();
    let years = now.getFullYear() - relationshipStart.getFullYear();
    const anniversary = new Date(relationshipStart);
    anniversary.setFullYear(relationshipStart.getFullYear() + years);
    if (anniversary > now) years -= 1;
    const anchor = new Date(relationshipStart);
    anchor.setFullYear(relationshipStart.getFullYear() + years);
    const remainder = Math.max(0, now.getTime() - anchor.getTime());
    const days = Math.floor(remainder / 86400000);
    const hours = Math.floor((remainder % 86400000) / 3600000);
    const minutes = Math.floor((remainder % 3600000) / 60000);

    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(value).padStart(2, "0");
    };
    set("years", years);
    set("days", days);
    set("hours", hours);
    set("minutes", minutes);
  }

  updateCounter();
  setInterval(updateCounter, 30000);
})();
