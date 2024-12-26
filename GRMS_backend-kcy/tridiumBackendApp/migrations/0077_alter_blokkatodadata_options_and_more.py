# Generated by Django 5.0.1 on 2024-12-22 10:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tridiumBackendApp', '0076_blokkatoda'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='blokkatodadata',
            options={'ordering': ['blokKatOda', 'katNumarasi', 'odaNumarasi'], 'verbose_name': 'Blok Kat Oda Verisi', 'verbose_name_plural': 'Blok Kat Oda Verileri'},
        ),
        migrations.RemoveField(
            model_name='blokkatodadata',
            name='blokNumarasi',
        ),
        migrations.AddField(
            model_name='blokkatodadata',
            name='blokKatOda',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='odaVerileri', to='tridiumBackendApp.blokkatoda', verbose_name='Blok Kat Oda'),
        ),
        migrations.AlterField(
            model_name='blokkatodadata',
            name='ip',
            field=models.GenericIPAddressField(blank=True, null=True, verbose_name='IP Adresi'),
        ),
        migrations.AlterField(
            model_name='blokkatodadata',
            name='isHKServiceConnected',
            field=models.CharField(default='0', max_length=1, verbose_name='HK Servis Bağlantılı mı?'),
        ),
        migrations.AlterField(
            model_name='blokkatodadata',
            name='isHVACConnected',
            field=models.CharField(default='0', max_length=1, verbose_name='HVAC Bağlantılı mı?'),
        ),
        migrations.AlterField(
            model_name='blokkatodadata',
            name='isHelvarConnected',
            field=models.CharField(default='0', max_length=1, verbose_name='Helvar Bağlantılı mı?'),
        ),
        migrations.AlterField(
            model_name='blokkatodadata',
            name='isRCUConnected',
            field=models.CharField(default='0', max_length=1, verbose_name='RCU Bağlantılı mı?'),
        ),
        migrations.AlterField(
            model_name='blokkatodadata',
            name='katNumarasi',
            field=models.CharField(blank=True, max_length=200, verbose_name='Kat Numarası'),
        ),
        migrations.AlterField(
            model_name='blokkatodadata',
            name='odaNumarasi',
            field=models.CharField(blank=True, max_length=200, verbose_name='Oda Numarası'),
        ),
    ]