# Generated by Django 5.0.1 on 2024-07-31 10:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0053_mekanikdata_pmscomerror'),
    ]

    operations = [
        migrations.AddField(
            model_name='alarmsdata',
            name='address',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]