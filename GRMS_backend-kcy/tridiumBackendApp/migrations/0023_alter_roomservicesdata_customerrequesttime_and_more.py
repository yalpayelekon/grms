# Generated by Django 5.0.1 on 2024-07-03 23:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0022_rename_lndcustumerrequesttime_rcuhelvarrouterdata_islndactive_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='roomservicesdata',
            name='customerRequestTime',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='roomservicesdata',
            name='serviceEndTime',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='roomservicesdata',
            name='serviceResponceTime',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='roomservicesdata',
            name='serviceStartTime',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
