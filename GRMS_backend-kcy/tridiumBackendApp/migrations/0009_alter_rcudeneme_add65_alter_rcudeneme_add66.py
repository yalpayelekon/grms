# Generated by Django 5.0.1 on 2024-06-20 12:17

import jsonfield.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0008_rename_mymodel_rcudeneme'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rcudeneme',
            name='add65',
            field=jsonfield.fields.JSONField(blank=True, default=list),
        ),
        migrations.AlterField(
            model_name='rcudeneme',
            name='add66',
            field=jsonfield.fields.JSONField(blank=True, default=list),
        ),
    ]
