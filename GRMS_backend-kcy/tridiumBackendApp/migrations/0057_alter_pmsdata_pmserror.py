# Generated by Django 5.0.1 on 2024-08-01 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0056_pmsdata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pmsdata',
            name='pmsError',
            field=models.CharField(blank=True, default='0', max_length=200),
        ),
    ]