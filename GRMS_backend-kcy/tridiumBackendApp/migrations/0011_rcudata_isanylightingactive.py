# Generated by Django 5.0.1 on 2024-06-23 11:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0010_rcudata_delete_rcudeneme'),
    ]

    operations = [
        migrations.AddField(
            model_name='rcudata',
            name='isAnyLightingActive',
            field=models.CharField(default=2, max_length=200),
            preserve_default=False,
        ),
    ]
