from django.db import migrations


PAGE_TITLES = [
    (1, "The Beginning", "where our little story starts", "The first page of a very long, very lovely story."),
    (2, "The First Hello", "that tiny moment that mattered", "Some beginnings are quiet. Ours became everything."),
    (3, "Tiny Moments", "the ordinary days I want to keep", "It is the little things that become the big things."),
    (4, "Our First Adventure", "somewhere new, together", "A blank space for the first adventure we want to remember forever."),
    (5, "Laughing Too Much", "proof that we are ridiculous", "For the jokes that make absolutely no sense to anyone else."),
    (6, "A Favourite Day", "one for the memory box", "A day worth replaying in my head."),
    (7, "Food Dates", "love, but make it delicious", "For the meals, midnight snacks and 'what should we eat?' debates."),
    (8, "Little Celebrations", "tiny reasons to be happy", "Birthdays, wins, surprises and everything in between."),
    (9, "Us Being Us", "no explanation necessary", "The photos that need zero context."),
    (10, "A Rainy Day", "soft days and slow hours", "For cosy weather, warm drinks and staying close."),
    (11, "Our People", "the ones around our story", "Friends, family and the people who make our world bigger."),
    (12, "Places We Love", "little pins on our map", "Every place feels different when we are there together."),
    (13, "Movie Night", "two seats, one blanket", "For cinema dates, comfort movies and snacks we pretend to share."),
    (14, "The Silly Page", "serious memories only", "Absolutely no serious memories allowed here."),
    (15, "Things I Love About You", "a page I could never finish", "One reason per photo. Then another. Then another."),
    (16, "A Perfectly Ordinary Day", "nothing special — everything special", "Because being with you is enough of a reason to keep a day."),
    (17, "Our Little Traditions", "things that became ours", "For routines, rituals and tiny traditions we accidentally created."),
    (18, "Sunsets & Slow Evenings", "golden-hour us", "For the moments that made time feel a little slower."),
    (19, "Future Memories", "leave some room", "A few empty corners for things we have not lived yet."),
    (20, "One Day We Will", "dreaming together", "Trips, places, plans and all the 'somedays'."),
    (21, "The Photo Dump", "zero organisation required", "Put the favourites here. Rules are optional."),
    (22, "A Letter in Pictures", "things I cannot say in one photo", "Let the photos do the talking."),
    (23, "Still Growing", "more pages, more us", "The story is nowhere near finished."),
    (24, "To Be Continued…", "there is always another page", "Leave this one open for the next beautiful chapter."),
]


def seed_pages(apps, schema_editor):
    ScrapbookPage = apps.get_model("relationship", "ScrapbookPage")
    for number, title, subtitle, note in PAGE_TITLES:
        ScrapbookPage.objects.get_or_create(
            page_number=number,
            defaults={
                "title": title,
                "subtitle": subtitle,
                "note": note,
                "doodle": ["♡", "✿", "✦", "☾", "❀", "♥"][number % 6],
                "paper": ["blush", "cream", "butter", "sky", "lilac", "sage"][number % 6],
            },
        )


def remove_seed_pages(apps, schema_editor):
    ScrapbookPage = apps.get_model("relationship", "ScrapbookPage")
    ScrapbookPage.objects.filter(page_number__in=range(1, 25)).delete()


class Migration(migrations.Migration):
    dependencies = [("relationship", "0002_scrapbook")]
    operations = [migrations.RunPython(seed_pages, remove_seed_pages)]
