# Generated by Django 5.0.1 on 2024-04-21 13:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0005_alter_mekanikdata_bloknumarasi_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='mekanikdata',
            old_name='confortTempreature',
            new_name='confortTemperature',
        ),
    ]
