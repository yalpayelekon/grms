# Generated by Django 5.0.1 on 2024-08-01 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0055_remove_mekanikdata_pmscomerror'),
    ]

    operations = [
        migrations.CreateModel(
            name='PMSData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pmsError', models.CharField(blank=True, max_length=200)),
            ],
        ),
    ]