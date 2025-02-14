# Generated by Django 5.0.1 on 2024-06-23 12:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0011_rcudata_isanylightingactive'),
    ]

    operations = [
        migrations.AddField(
            model_name='rcudata',
            name='isDndActive',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='rcudata',
            name='isLndActive',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='rcudata',
            name='isLndDelayed',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='rcudata',
            name='isMurActive',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='rcudata',
            name='isMurDelayed',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='rcudata',
            name='blokNumarasi',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='rcudata',
            name='comError',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='rcudata',
            name='ip',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='rcudata',
            name='katNumarasi',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='rcudata',
            name='odaNumarasi',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='rcudata',
            name='port',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
