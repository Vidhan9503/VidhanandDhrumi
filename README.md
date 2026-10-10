# Our Little World: static (GitHub Pages) version

Plain HTML/CSS/JS. No Django or server needed.

## Deploy
1. Create a GitHub repo and upload everything in this folder (keep the folder structure and the `.nojekyll` file).
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → branch `main`, folder `/ (root)`.
3. Your site appears at `https://<user>.github.io/<repo>/` after a minute.

## Add your images and videos (same names as before)
| What | Where |
|---|---|
| Home photo | `static/relationship/img/home.jpg` |
| Scrapbook cover photo (optional) | `static/relationship/img/cover.jpg` |
| Scrapbook photos | `media/scrapbook/<filename>` (names are listed in `data/scrapbook-data.js`) |
| Movie chapters | `static/relationship/videos/movie-01.mp4`, `movie-02.mp4`, `movie-03.mp4` |

GitHub rejects single files over 100 MB, so compress the videos if needed.

## Settings
`static/relationship/js/site-config.js`: password hash, birthday/unlock date, anniversary, relationship start, lockscreen options.

## Content (replaces Django Admin)
- `data/scrapbook-data.js`: pages and photos. Add an entry (and the image file) to publish it for everyone.
- `data/letters-data.js`: open-when letters, with optional `unlock_date`.

## What "Add Memory" and letter editing do now
There is no server, so anything added through the site's forms (new scrapbook memories/photos, new/edited/deleted letters) is saved **in that browser only**. To make something permanent for everyone, add it to the data files above.

## Privacy
GitHub Pages cannot hide anything: the password gate is a courtesy lock, and every file in the repo (photos, letters, data files) is publicly readable. Use a private repo only if your plan supports private Pages.
