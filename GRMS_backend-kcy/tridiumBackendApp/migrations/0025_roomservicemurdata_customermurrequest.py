# Generated by Django 5.0.1 on 2024-07-04 20:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0024_roomservicemurdata'),
    ]

    operations = [
        migrations.AddField(
            model_name='roomservicemurdata',
            name='customerMurRequest',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]