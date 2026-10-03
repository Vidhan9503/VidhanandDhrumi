from django.db import models


class Memory(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField(null=True, blank=True)
    caption = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    photo = models.ImageField(upload_to="memories/", blank=True, null=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return self.title


class Milestone(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    photo = models.ImageField(upload_to="milestones/", blank=True, null=True)

    class Meta:
        ordering = ["date"]

    def __str__(self):
        return self.title


class Letter(models.Model):
    title = models.CharField(max_length=200)
    trigger = models.CharField(max_length=200, help_text="Example: when you miss me")
    content = models.TextField()
    unlock_date = models.DateField(null=True, blank=True)
    emoji = models.CharField(max_length=20, default="💌")
    locked_message = models.CharField(max_length=300, blank=True)

    class Meta:
        ordering = ["unlock_date", "id"]

    def __str__(self):
        return self.title


class BucketListItem(models.Model):
    CATEGORY_CHOICES = [
        ("dream", "Dream"),
        ("trip", "Trip"),
        ("ordinary", "Ordinary"),
        ("big", "Big plan"),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="dream")
    completed = models.BooleanField(default=False)

    class Meta:
        ordering = ["completed", "id"]

    def __str__(self):
        return self.title


class InsideJoke(models.Model):
    word = models.CharField(max_length=100)
    meaning = models.TextField()
    origin = models.TextField(blank=True)
    emoji = models.CharField(max_length=20, default="😂")

    def __str__(self):
        return self.word


class Place(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    date = models.DateField(null=True, blank=True)
    photo = models.ImageField(upload_to="places/", blank=True, null=True)

    class Meta:
        ordering = ["date", "name"]

    def __str__(self):
        return self.name


class TimeCapsule(models.Model):
    title = models.CharField(max_length=200)
    message = models.TextField()
    unlock_date = models.DateField()
    sealed_on = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["unlock_date"]

    def __str__(self):
        return self.title


class ScrapbookPage(models.Model):
    PAPER_CHOICES = [
        ("blush", "Blush"),
        ("cream", "Cream"),
        ("butter", "Butter"),
        ("sky", "Sky"),
        ("lilac", "Lilac"),
        ("sage", "Sage"),
    ]

    page_number = models.PositiveIntegerField(unique=True)
    title = models.CharField(max_length=200, default="A little memory")
    subtitle = models.CharField(max_length=300, blank=True)
    date = models.DateField(null=True, blank=True)
    note = models.TextField(blank=True)
    paper = models.CharField(max_length=20, choices=PAPER_CHOICES, default="cream")
    doodle = models.CharField(max_length=50, default="♡", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["page_number"]

    def __str__(self):
        return f"Page {self.page_number}: {self.title}"

    @property
    def theme_index(self):
        return ((self.page_number - 1) % 8) + 1


class ScrapbookPhoto(models.Model):
    SLOT_CHOICES = [
        (1, "Photo slot 1"),
        (2, "Photo slot 2"),
        (3, "Photo slot 3"),
        (4, "Photo slot 4"),
    ]

    page = models.ForeignKey(
        ScrapbookPage,
        on_delete=models.CASCADE,
        related_name="photos",
    )
    slot = models.PositiveSmallIntegerField(choices=SLOT_CHOICES, default=1)
    photo = models.ImageField(upload_to="scrapbook/")
    caption = models.CharField(max_length=240, blank=True)
    sticker = models.CharField(max_length=30, blank=True, help_text="Optional little sticker/emoji")
    rotation = models.DecimalField(max_digits=4, decimal_places=1, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["slot"]
        constraints = [
            models.UniqueConstraint(fields=["page", "slot"], name="unique_scrapbook_page_slot")
        ]

    def __str__(self):
        return f"{self.page} — slot {self.slot}"
