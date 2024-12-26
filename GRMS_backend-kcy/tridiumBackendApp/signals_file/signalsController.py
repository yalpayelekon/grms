# tridiumBackendApp/signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from ..models import BlokKatOdaData, RCUHelvarRouterData



# Yeni bir BlokKatOdaData kaydı oluşturulduğunda veya güncellendiğinde
@receiver(post_save, sender=BlokKatOdaData)
def manage_rcu_helvar_router_data(sender, instance, created, **kwargs):
    # Eğer yeni bir kayıt oluşturulduysa
    if created:
        # Aynı blokNumarasi, katNumarasi ve odaNumarasi ile RCUHelvarRouterData kaydının var olup olmadığını kontrol et
        rcu_helvar_data_exists = RCUHelvarRouterData.objects.filter(
            blokNumarasi=instance.blokKatOda.blokNumarasi,
            katNumarasi=instance.katNumarasi,
            odaNumarasi=instance.odaNumarasi
        ).exists()

        if not rcu_helvar_data_exists:
            # Eğer mevcut bir kayıt yoksa, yeni bir RCUHelvarRouterData kaydı oluştur
            RCUHelvarRouterData.objects.create(
                blokNumarasi=instance.blokKatOda.blokNumarasi,
                katNumarasi=instance.katNumarasi,
                odaNumarasi=instance.odaNumarasi,
                deviceType="ExampleDevice",  # İlgili cihaz türü
                ip=instance.ip,  # IP adresini BlokKatOdaData'dan al
                port=instance.port,  # Örnek port
                comError="0",  # Başlangıçta iletişim hatası yok
                roomOccupied="0",  # Başlangıçta oda boş
                dndActive="0",  # Başlangıçta DND aktif değil
                lndActive="0",  # Başlangıçta LND aktif değil
                murActive="0",  # Başlangıçta MUR aktif değil
                hkInRoom="0",  # Başlangıçta HK odada değil
                doorOpen="0",  # Başlangıçta kapı açık değil
                outputDevices=list()  # Başlangıçta boş çıkış cihazları
            )
    else:
        # Eğer kayıt güncellenmişse, ilgili RCUHelvarRouterData kaydını bul ve güncelle
        try:
            rcu_helvar_data = RCUHelvarRouterData.objects.get(
                blokNumarasi=instance.blokKatOda.blokNumarasi,
                katNumarasi=instance.katNumarasi,
                odaNumarasi=instance.odaNumarasi
            )
            # IP adresini güncelle
            if rcu_helvar_data.ip != instance.ip:
                rcu_helvar_data.ip = instance.ip
                rcu_helvar_data.save()
        except RCUHelvarRouterData.DoesNotExist:
            # Eğer ilgili kayıt yoksa hiçbir şey yapma
            pass


# BlokKatOdaData kaydı silindiğinde, ona bağlı RCUHelvarRouterData kaydının da silinmesi
@receiver(post_delete, sender=BlokKatOdaData)
def delete_rcu_helvar_router_data(sender, instance, **kwargs):
    # BlokKatOdaData silindiğinde, ona bağlı RCUHelvarRouterData kaydını sil
    RCUHelvarRouterData.objects.filter(
        blokNumarasi=instance.blokKatOda.blokNumarasi,
        katNumarasi=instance.katNumarasi,
        odaNumarasi=instance.odaNumarasi
    ).delete()