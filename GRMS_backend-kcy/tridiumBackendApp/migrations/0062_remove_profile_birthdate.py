# Generated by Django 5.0.1 on 2024-12-08 19:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0061_profile'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='birthdate',
        ),
    ]
