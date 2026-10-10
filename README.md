# VidhanDhrumi — GitHub Pages version

This folder is a static-site conversion of the supplied Django project for GitHub Pages. Publish the contents of this folder (not the outer ZIP) using **Settings → Pages → Deploy from a branch → main → /(root)**.

## Included
- Password gate with weekend hint, birthday countdown, remembered password, and session-only unlock (asks again after closing the browser session).
- Home, scrapbook, three-chapter cinema page, and Open When letters.
- Existing CSS/JS assets copied into `assets/`; initial letter and scrapbook page records exported from the provided SQLite database.
- Add/edit/delete/search letters; date-locked letters; add scrapbook entries and up to four images. Browser-side additions persist in that browser via localStorage.

## Important hosting limitations
GitHub Pages serves static files only. It does **not** run Django, Python views, sessions, SQLite, admin, or file uploads. So this version replaces those operations with browser-side JavaScript and localStorage. New letters, scrapbook notes, and uploaded images are saved only in the browser/device that created them; they do not sync between devices and can be lost if browser storage is cleared. The four-digit password is visible in `app.js`, so this is a playful gate, **not real security**. Do not put genuinely private content in a GitHub Pages repository; public repository files are public.

The uploaded project also defines routes for story, memories, play, future, places, capsule, and secret, but the ZIP did not include their HTML templates, and several corresponding database tables are empty. Those routes therefore could not be faithfully exported from this ZIP. The Django source and migrations are intentionally not part of the published static root.

## Media
Put `movie-01.mp4`, `movie-02.mp4`, and `movie-03.mp4` in `assets/videos/` (or adjust `cinema.html`). The supplied ZIP did not contain the actual movie files or the scrapbook image files referenced by the database.

## To deploy
1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root.
3. Open **Settings → Pages** and enable deployment from `main` / root.
4. Wait for GitHub Pages to publish; open the URL shown there.

If you need secure passwords, cross-device data, an admin panel, and shared uploads, keep Django and deploy it to a Python host (e.g. Render) while using GitHub for source control; GitHub Pages cannot provide those backend capabilities.
