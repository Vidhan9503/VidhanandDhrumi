# Generated manually for the digital scrapbook.
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("relationship", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ScrapbookPage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("page_number", models.PositiveIntegerField(unique=True)),
                ("title", models.CharField(default="A little memory", max_length=200)),
                ("subtitle", models.CharField(blank=True, max_length=300)),
                ("date", models.DateField(blank=True, null=True)),
                ("note", models.TextField(blank=True)),
                ("paper", models.CharField(choices=[("blush", "Blush"), ("cream", "Cream"), ("butter", "Butter"), ("sky", "Sky"), ("lilac", "Lilac"), ("sage", "Sage")], default="cream", max_length=20)),
                ("doodle", models.CharField(blank=True, default="♡", max_length=50)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["page_number"]},
        ),
        migrations.CreateModel(
            name="ScrapbookPhoto",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slot", models.PositiveSmallIntegerField(choices=[(1, "Photo slot 1"), (2, "Photo slot 2"), (3, "Photo slot 3"), (4, "Photo slot 4")], default=1)),
                ("photo", models.ImageField(upload_to="scrapbook/")),
                ("caption", models.CharField(blank=True, max_length=240)),
                ("sticker", models.CharField(blank=True, help_text="Optional little sticker/emoji", max_length=30)),
                ("rotation", models.DecimalField(decimal_places=1, default=0, max_digits=4)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("page", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="photos", to="relationship.scrapbookpage")),
            ],
            options={"ordering": ["slot"]},
        ),
        migrations.AddConstraint(
            model_name="scrapbookphoto",
            constraint=models.UniqueConstraint(fields=("page", "slot"), name="unique_scrapbook_page_slot"),
        ),
    ]
