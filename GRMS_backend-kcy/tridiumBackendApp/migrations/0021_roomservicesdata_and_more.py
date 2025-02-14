# Generated by Django 5.0.1 on 2024-07-03 23:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0020_appsettings'),
    ]

    operations = [
        migrations.CreateModel(
            name='RoomServicesData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blokNumarasi', models.CharField(blank=True, max_length=200)),
                ('katNumarasi', models.CharField(blank=True, max_length=200)),
                ('odaNumarasi', models.CharField(blank=True, max_length=200)),
                ('serviceType', models.CharField(blank=True, max_length=200)),
                ('customerRequestTime', models.CharField(blank=True, max_length=200)),
                ('serviceStartTime', models.CharField(blank=True, max_length=200)),
                ('serviceEndTime', models.CharField(blank=True, max_length=200)),
                ('serviceResponceTime', models.CharField(blank=True, max_length=200)),
                ('isDelayed', models.CharField(blank=True, max_length=200)),
                ('serviceStatus', models.CharField(blank=True, max_length=200)),
            ],
        ),
        migrations.RemoveField(
            model_name='rcuhelvarrouterdata',
            name='isLndActive',
        ),
        migrations.RemoveField(
            model_name='rcuhelvarrouterdata',
            name='isMurActive',
        ),
        migrations.AddField(
            model_name='rcuhelvarrouterdata',
            name='lndCustumerRequestTime',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='rcuhelvarrouterdata',
            name='lndStatus',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='rcuhelvarrouterdata',
            name='murCustumerRequestTime',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='rcuhelvarrouterdata',
            name='murStatus',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
