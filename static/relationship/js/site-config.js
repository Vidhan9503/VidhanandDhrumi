/* Site settings. These replace the values that used to live in Django's settings.py
   and in the "Site gate settings" admin page. */
window.SITE = {
  name: "Us",
  relationshipStart: "2023-10-25T21:41:00+05:30",
  birthday: "2026-10-20",        // YYYY-MM-DD (India time). The site stays shut until this day.
  anniversary: "2026-10-27",

  // Password gate. Only a hash is stored here, not the number itself.
  // To change the password, run in a browser console:  SiteCore.hash("1234")
  // and paste the result below.
  passwordHash: "d8bae14f6223977d2bbfd86aaeb75f291507aefdd79311455b3735361ecfa803",
  requireBirthday: true,         // false = the right password opens the site immediately

  // Lockscreen options
  lockscreenVariant: "birthday", // "birthday" or "minimal"
  showQuestions: true,          // the playful questions before the keypad
  showCountdown: true,
  showGifs: true,
  passwordHint: "Wanna go somewhere nice on weekend?"
};
