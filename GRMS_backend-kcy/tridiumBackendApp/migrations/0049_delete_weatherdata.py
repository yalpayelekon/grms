# Generated by Django 5.0.1 on 2024-07-22 11:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0048_rename_opendooralarmdetails_alarmsdata_doorsystalarmdetails'),
    ]

    operations = [
        migrations.DeleteModel(
            name='WeatherData',
        ),
    ]
