from django.urls import path
from relationship import views

app_name = "relationship"

urlpatterns = [
    path("", views.indexpage, name="indexpage"),
    path("story/", views.story, name="story"),
    path("memories/", views.memories, name="memories"),
    path("scrapbook/", views.scrapbook, name="scrapbook"),
    path("scrapbook/add/", views.add_scrapbook_memory, name="add_scrapbook_memory"),
    path("play/", views.play, name="play"),
    path("letters/", views.letters, name="letters"),
    path("future/", views.future, name="future"),
    path("places/", views.places, name="places"),
    path("cinema/", views.cinema, name="cinema"),
    path("jokes/", views.jokes, name="jokes"),
    path("capsule/", views.capsule, name="capsule"),
]
