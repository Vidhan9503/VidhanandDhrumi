from datetime import date
from django.conf import settings
from django.shortcuts import render, redirect

from .models import (
    Memory, Milestone, Letter, BucketListItem,
    InsideJoke, Place, TimeCapsule, ScrapbookPage, ScrapbookPhoto
)


def base_context():
    return {
        "relationship_name": getattr(settings, "RELATIONSHIP_NAME", "Us"),
        "relationship_start": getattr(settings, "RELATIONSHIP_START_DATE", "2023-10-14"),
        "birthday_date": getattr(settings, "BIRTHDAY_DATE", "2026-01-01"),
        "anniversary_date": getattr(settings, "ANNIVERSARY_DATE", "2026-10-14"),
    }


def indexpage(request):
    context = base_context()
    context.update({
        "featured_memories": Memory.objects.filter(featured=True)[:6],
        "places": Place.objects.all(),
    })
    return render(request, "relationship/index.html", context)


def story(request):
    context = base_context()
    context["milestones"] = Milestone.objects.all()
    return render(request, "relationship/story.html", context)


def memories(request):
    context = base_context()
    context["memories"] = Memory.objects.all()
    return render(request, "relationship/memories.html", context)


def play(request):
    context = base_context()
    context["jokes"] = InsideJoke.objects.all()
    return render(request, "relationship/play.html", context)


def letters(request):
    today = date.today()
    context = base_context()
    context["letters"] = Letter.objects.all()
    context["today"] = today
    return render(request, "relationship/letters.html", context)


def future(request):
    context = base_context()
    context["bucket_items"] = BucketListItem.objects.all()
    context["capsules"] = TimeCapsule.objects.all()
    return render(request, "relationship/future.html", context)


def places(request):
    context = base_context()
    context["places"] = Place.objects.all()
    return render(request, "relationship/places.html", context)


def cinema(request):
    return render(request, "relationship/cinema.html", base_context())


def jokes(request):
    context = base_context()
    context["jokes"] = InsideJoke.objects.all()
    return render(request, "relationship/jokes.html", context)


def capsule(request):
    today = date.today()
    context = base_context()
    context["capsules"] = TimeCapsule.objects.all()
    context["today"] = today
    return render(request, "relationship/capsule.html", context)

def places(request):
    place_qs = Place.objects.all()
    places_json = [
        {
            "name": p.name,
            "lat": float(p.latitude) if p.latitude is not None else None,
            "lng": float(p.longitude) if p.longitude is not None else None,
            "desc": p.description or "",
        }
        for p in place_qs
    ]
    return render(request, 'relationship/places.html', {
        'places': place_qs,
        'places_json': places_json,
    })

def scrapbook(request):
    context = base_context()
    context["scrapbook_pages"] = ScrapbookPage.objects.prefetch_related("photos").all()
    return render(request, "relationship/scrapbook.html", context)


def add_scrapbook_memory(request):
    if request.method != "POST":
        return redirect("relationship:scrapbook")

    title = (request.POST.get("title") or "A new little memory").strip()[:200]
    subtitle = (request.POST.get("subtitle") or "a moment worth keeping").strip()[:300]
    note = (request.POST.get("note") or "").strip()
    date_value = request.POST.get("date") or None

    last_page = ScrapbookPage.objects.order_by("-page_number").first()
    page_number = (last_page.page_number + 1) if last_page else 1
    paper = ["blush", "cream", "butter", "sky", "lilac", "sage"][page_number % 6]
    doodles = ["♡", "✿", "✦", "☾", "❀", "♥", "✧", "❋"]

    page = ScrapbookPage.objects.create(
        page_number=page_number,
        title=title,
        subtitle=subtitle,
        date=date_value or None,
        note=note,
        paper=paper,
        doodle=doodles[page_number % len(doodles)],
    )

    photos = request.FILES.getlist("photos")[:4]
    for slot, uploaded in enumerate(photos, start=1):
        caption = (request.POST.get(f"caption_{slot}") or "").strip()[:240]
        sticker = (request.POST.get(f"sticker_{slot}") or "").strip()[:30]
        ScrapbookPhoto.objects.create(
            page=page, slot=slot, photo=uploaded, caption=caption, sticker=sticker,
            rotation=[-2.5, 1.7, -1.2, 2.2][slot - 1],
        )

    return redirect(f"/scrapbook/?page={page_number}")
