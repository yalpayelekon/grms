# Generated by Django 5.0.1 on 2024-07-03 21:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0019_rename_rcudata_rcuhelvarrouterdata'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('upperGecikmeLimiti', models.IntegerField(default=7200)),
            ],
        ),
    ]