# Generated by Django 5.0.1 on 2024-06-20 12:09

import django.contrib.postgres.fields
import jsonfield.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0006_rename_conforttempreature_mekanikdata_conforttemperature'),
    ]

    operations = [
        migrations.CreateModel(
            name='MyModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('add65', django.contrib.postgres.fields.ArrayField(base_field=jsonfield.fields.JSONField(), blank=True, default=list, size=None)),
                ('add66', django.contrib.postgres.fields.ArrayField(base_field=jsonfield.fields.JSONField(), blank=True, default=list, size=None)),
            ],
        ),
    ]
