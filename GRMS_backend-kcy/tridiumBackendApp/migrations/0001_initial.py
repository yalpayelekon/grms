# Generated by Django 5.0.1 on 2024-04-15 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MekanikData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('odaNumarasi', models.CharField(max_length=200)),
                ('onOf', models.CharField(max_length=200)),
                ('roomTemperature', models.CharField(max_length=200)),
                ('setPoint', models.CharField(max_length=200)),
                ('mode', models.CharField(max_length=200)),
                ('fanMode', models.CharField(max_length=200)),
                ('confortTempreature', models.CharField(max_length=200)),
                ('lowerSetpoint', models.CharField(max_length=200)),
                ('upperSetpoint', models.CharField(max_length=200)),
                ('keylockFunction', models.CharField(max_length=200)),
                ('occupancyInput', models.CharField(max_length=200)),
                ('runningstatus', models.CharField(max_length=200)),
                ('comError', models.CharField(max_length=200)),
            ],
        ),
    ]
