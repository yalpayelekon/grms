# Generated by Django 5.0.1 on 2024-07-07 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0033_rename_uppergecikmelimiti_appsettings_dashboardservicereqresponcetimeupperlimit'),
    ]

    operations = [
        migrations.AddField(
            model_name='appsettings',
            name='lndDelayThreshold',
            field=models.IntegerField(default=7200),
        ),
        migrations.AddField(
            model_name='appsettings',
            name='murDelayThreshold',
            field=models.IntegerField(default=7200),
        ),
    ]
