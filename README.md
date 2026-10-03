# Our Little World — Django v2

This version keeps the original scrapbook aesthetic but adds a real Django content layer.

## Added
- Dynamic memories/photo scrapbook through Django Admin
- Anniversary montage / mini cinema page
- Places map using Leaflet + OpenStreetMap
- Inside-joke dictionary with search
- Relationship counter
- Next-meeting countdown hook
- Hidden clickable objects
- Birthday mode
- Open-when letters with unlock dates
- Future bucket list
- Time capsules with unlock dates
- Milestone timeline
- Admin models for all of the above

## First setup

From the folder containing `manage.py`:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Then open:
- http://127.0.0.1:8000/
- http://127.0.0.1:8000/admin/

## Important configuration

Edit `VidhanDhrumi/settings.py`:

```python
RELATIONSHIP_START_DATE = "YYYY-MM-DD"
BIRTHDAY_DATE = "YYYY-MM-DD"
ANNIVERSARY_DATE = "YYYY-MM-DD"
```

Edit `static/relationship/js/countdown.js` when you know the next meeting:

```javascript
window.NEXT_MEETING = "YYYY-MM-DDTHH:MM:SS";
```

## Photos and video

Upload photos from Django Admin for Memories, Milestones and Places.

For the anniversary movie, put:

`anniversary-montage.mp4`

inside:

`static/relationship/videos/`

Optional poster:

`movie-poster.jpg`

inside:

`static/relationship/photos/`

## Seed placeholders

A placeholder fixture is included at:

`relationship/initial_data.json`

Load it with:

```bash
python manage.py loaddata relationship/initial_data.json
```

You can delete/replace the placeholder records from Admin.

## Next privacy step

For a truly private deployed site, add Django authentication/password protection before putting it on the public internet. The current version is a development/private-project build, not a security boundary.


## Digital scrapbook book

The `/scrapbook/` page is a page-based digital scrapbook designed to grow over time.

- Create `Scrapbook Page` records in Django Admin.
- Give each page a page number, title, date, paper color and handwritten note.
- Add up to four `Scrapbook Photo` records per page using the inline photo slots.
- Photos appear as taped-on polaroids with captions and optional stickers.
- Navigate pages with the arrows, keyboard arrow keys, or swipe on mobile.
- Existing Memories remain available as the original gallery at `/memories/`.

The scrapbook uses the existing `MEDIA_ROOT`/`MEDIA_URL` setup, so uploaded scrapbook photos are stored under `media/scrapbook/`.
