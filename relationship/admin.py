from django.contrib import admin
from .models import (
    Memory, Milestone, Letter, BucketListItem,
    InsideJoke, Place, TimeCapsule, ScrapbookPage, ScrapbookPhoto
)


@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    list_display = ("title", "date", "location", "featured")
    list_filter = ("featured",)
    search_fields = ("title", "caption", "location")


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ("title", "date")
    search_fields = ("title", "description")


@admin.register(Letter)
class LetterAdmin(admin.ModelAdmin):
    list_display = ("title", "trigger", "unlock_date")
    search_fields = ("title", "trigger", "content")


@admin.register(BucketListItem)
class BucketListItemAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "completed")
    list_filter = ("category", "completed")
    search_fields = ("title", "description")


@admin.register(InsideJoke)
class InsideJokeAdmin(admin.ModelAdmin):
    list_display = ("word", "emoji")
    search_fields = ("word", "meaning", "origin")


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ("name", "date", "latitude", "longitude")
    search_fields = ("name", "description")


@admin.register(TimeCapsule)
class TimeCapsuleAdmin(admin.ModelAdmin):
    list_display = ("title", "unlock_date", "sealed_on")
    search_fields = ("title", "message")


class ScrapbookPhotoInline(admin.TabularInline):
    model = ScrapbookPhoto
    extra = 1
    fields = ("slot", "photo", "caption", "sticker", "rotation")
    max_num = 4


@admin.register(ScrapbookPage)
class ScrapbookPageAdmin(admin.ModelAdmin):
    list_display = ("page_number", "title", "date", "paper")
    list_display_links = ("page_number", "title")
    ordering = ("page_number",)
    search_fields = ("title", "subtitle", "note")
    list_filter = ("paper",)
    inlines = [ScrapbookPhotoInline]


@admin.register(ScrapbookPhoto)
class ScrapbookPhotoAdmin(admin.ModelAdmin):
    list_display = ("page", "slot", "caption", "created_at")
    list_filter = ("page",)
    search_fields = ("caption", "sticker")
