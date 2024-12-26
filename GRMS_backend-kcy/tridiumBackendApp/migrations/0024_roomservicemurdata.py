# Generated by Django 5.0.1 on 2024-07-04 20:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0023_alter_roomservicesdata_customerrequesttime_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='RoomServiceMURData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blokNumarasi', models.CharField(blank=True, max_length=200)),
                ('katNumarasi', models.CharField(blank=True, max_length=200)),
                ('odaNumarasi', models.CharField(blank=True, max_length=200)),
                ('status', models.CharField(blank=True, max_length=200)),
                ('customerRequestTime', models.DateTimeField(blank=True, null=True)),
                ('serviceStartTime', models.DateTimeField(blank=True, null=True)),
                ('serviceEndTime', models.DateTimeField(blank=True, null=True)),
                ('serviceResponceTime', models.DateTimeField(blank=True, null=True)),
                ('employee', models.CharField(blank=True, max_length=200)),
            ],
        ),
    ]
