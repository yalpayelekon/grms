# Generated by Django 5.0.1 on 2024-04-21 12:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0004_mekanikdata_bloknumarasi_mekanikdata_katnumarasi'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mekanikdata',
            name='blokNumarasi',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='mekanikdata',
            name='katNumarasi',
            field=models.CharField(max_length=200),
        ),
    ]