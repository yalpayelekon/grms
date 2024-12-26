# Generated by Django 5.0.1 on 2024-06-22 17:33

import jsonfield.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0009_alter_rcudeneme_add65_alter_rcudeneme_add66'),
    ]

    operations = [
        migrations.CreateModel(
            name='RCUData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blokNumarasi', models.CharField(max_length=200)),
                ('katNumarasi', models.CharField(max_length=200)),
                ('odaNumarasi', models.CharField(max_length=200)),
                ('ip', models.CharField(max_length=200)),
                ('port', models.CharField(max_length=200)),
                ('comError', models.CharField(max_length=200)),
                ('onboardInputDevices', jsonfield.fields.JSONField(blank=True, default=list)),
                ('onboardOutputDevices', jsonfield.fields.JSONField(blank=True, default=list)),
            ],
        ),
        migrations.DeleteModel(
            name='RCUDeneme',
        ),
    ]
