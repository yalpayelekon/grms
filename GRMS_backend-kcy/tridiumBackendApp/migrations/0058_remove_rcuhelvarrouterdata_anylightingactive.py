# Generated by Django 5.0.1 on 2024-08-02 19:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0057_alter_pmsdata_pmserror'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='rcuhelvarrouterdata',
            name='anyLightingActive',
        ),
    ]