# tridiumBackendApp/signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from ..models import BlokKatOdaData, MekanikData

# Yeni bir BlokKatOdaData kaydı oluşturulduğunda
@receiver(post_save, sender=BlokKatOdaData)
def create_mechanical_data(sender, instance, created, **kwargs):
    if created:
        # Eğer BlokKatOdaData kaydı yeni oluşturulduysa,
        # aynı blokNumarasi, katNumarasi ve odaNumarasi ile MekanikData kaydının var olup olmadığını kontrol et
        mekanik_data_exists = MekanikData.objects.filter(
            blokNumarasi=instance.blokKatOda.blokNumarasi,
            katNumarasi=instance.katNumarasi,
            odaNumarasi=instance.odaNumarasi
        ).exists()

        if not mekanik_data_exists:
            # Eğer zaten mevcut bir MekanikData kaydı yoksa, yeni bir kaydın oluşturulması
            MekanikData.objects.create(
                blokNumarasi=instance.blokKatOda.blokNumarasi,  # Blok numarasını ilişkilendir
                katNumarasi=instance.katNumarasi,  # Kat numarasını ilişkilendir
                odaNumarasi=instance.odaNumarasi,  # Oda numarasını ilişkilendir
                onOf="0",  # Başlangıçta kapalı
                roomTemperature="22",  # Başlangıçta 22°C
                setPoint="22",  # Başlangıçta setPoint: 22°C
                mode="0",  # Başlangıçta mod: 0
                fanMode="0",  # Başlangıçta fanMode: 0
                confortTemperature="22",  # Başlangıçta comfortTemperature: 22°C
                lowerSetpoint="20",  # Başlangıçta lowerSetpoint: 20°C
                upperSetpoint="24",  # Başlangıçta upperSetpoint: 24°C
                keylockFunction="0",  # Başlangıçta keylockFunction: "0"
                occupancyInput="0",  # Başlangıçta occupancyInput: "0"
                runningstatus="0",  # Başlangıçta runningstatus: 0
                comError="0",  # Başlangıçta comError: "0"
                fidelio="0"  # Başlangıçta fidelio: "0"
            )


# BlokKatOdaData kaydı silindiğinde, ona bağlı MekanikData kaydının da silinmesi
@receiver(post_delete, sender=BlokKatOdaData)
def delete_mechanical_data(sender, instance, **kwargs):
    # BlokKatOdaData silindiğinde, ona bağlı MekanikData kaydını sil
    MekanikData.objects.filter(
        blokNumarasi=instance.blokKatOda.blokNumarasi,
        katNumarasi=instance.katNumarasi,
        odaNumarasi=instance.odaNumarasi
    ).delete()
