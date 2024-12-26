# Generated by Django 5.0.1 on 2024-12-22 09:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0073_rename_kullanilanmarka_blokkatodadata_ishkserviceconnected'),
    ]

    operations = [
        migrations.CreateModel(
            name='BlokKatOda',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blok_numarasi', models.CharField(max_length=200, unique=True, verbose_name='Blok Numarası')),
                ('is_genel_mahal', models.CharField(default='0', max_length=1, verbose_name='Genel Mahal mi?')),
            ],
            options={
                'verbose_name': 'Blok Kat Oda',
                'verbose_name_plural': 'Blok Kat Odalar',
                'ordering': ['blok_numarasi'],
            },
        ),
    ]
