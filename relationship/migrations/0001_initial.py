from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Memory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("date", models.DateField(blank=True, null=True)),
                ("caption", models.TextField(blank=True)),
                ("location", models.CharField(blank=True, max_length=200)),
                ("photo", models.ImageField(blank=True, null=True, upload_to="memories/")),
                ("featured", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["-date", "-created_at"]},
        ),
        migrations.CreateModel(
            name="Milestone",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("date", models.DateField(blank=True, null=True)),
                ("description", models.TextField(blank=True)),
                ("photo", models.ImageField(blank=True, null=True, upload_to="milestones/")),
            ],
            options={"ordering": ["date"]},
        ),
        migrations.CreateModel(
            name="Letter",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("trigger", models.CharField(help_text="Example: when you miss me", max_length=200)),
                ("content", models.TextField()),
                ("unlock_date", models.DateField(blank=True, null=True)),
                ("emoji", models.CharField(default="💌", max_length=20)),
                ("locked_message", models.CharField(blank=True, max_length=300)),
            ],
            options={"ordering": ["unlock_date", "id"]},
        ),
        migrations.CreateModel(
            name="BucketListItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField(blank=True)),
                ("category", models.CharField(choices=[("dream", "Dream"), ("trip", "Trip"), ("ordinary", "Ordinary"), ("big", "Big plan")], default="dream", max_length=20)),
                ("completed", models.BooleanField(default=False)),
            ],
            options={"ordering": ["completed", "id"]},
        ),
        migrations.CreateModel(
            name="InsideJoke",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("word", models.CharField(max_length=100)),
                ("meaning", models.TextField()),
                ("origin", models.TextField(blank=True)),
                ("emoji", models.CharField(default="😂", max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name="Place",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("description", models.TextField(blank=True)),
                ("latitude", models.DecimalField(decimal_places=6, max_digits=9)),
                ("longitude", models.DecimalField(decimal_places=6, max_digits=9)),
                ("date", models.DateField(blank=True, null=True)),
                ("photo", models.ImageField(blank=True, null=True, upload_to="places/")),
            ],
            options={"ordering": ["date", "name"]},
        ),
        migrations.CreateModel(
            name="TimeCapsule",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("message", models.TextField()),
                ("unlock_date", models.DateField()),
                ("sealed_on", models.DateField(auto_now_add=True)),
            ],
            options={"ordering": ["unlock_date"]},
        ),
    ]
