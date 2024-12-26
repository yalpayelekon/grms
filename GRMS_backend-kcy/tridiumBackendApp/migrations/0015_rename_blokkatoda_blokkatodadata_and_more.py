# Generated by Django 5.0.1 on 2024-07-01 11:35

import jsonfield.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0014_blokkatoda_ishvacconnected_blokkatoda_isrcuconnected'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='blokKatOda',
            new_name='blokKatOdaData',
        ),
        migrations.AddField(
            model_name='rcudata',
            name='daliInputDevices',
            field=jsonfield.fields.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='rcudata',
            name='daliOutputDevices',
            field=jsonfield.fields.JSONField(blank=True, default=list),
        ),
    ]