from django.http import JsonResponse
from ..models import RoomServiceMURData
import json
from django.views.decorators.csrf import csrf_exempt
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count
import copy
from .helper import getAppSettings, logger, getUtcToTrShift

utc_to_tr_shift = getUtcToTrShift()

_, _, murDelayThreshold, lndDelayThreshold, cleanedRoomDisplayTimeThreshold, _ = getAppSettings()

blokKatAlarmNumberData = {
        "A": {'1': 0, '2': 0, '3': 0, '4': 0},
        "F": {'1': 0, '2': 0, '3': 0, '4': 0},
        "Owner Villalar": {'Zemin': 0},
        "5000": {'Zemin': 0},
        "5100": {'Zemin': 0},
        "5200 Batı": {'Zemin': 0},
        "5200 Doğu": {'Zemin': 0},
        "5300": {'Zemin': 0},
        "5800": {'Zemin': 0},
        "5900": {'Zemin': 0},
        "A-F Yatak Kat Koridor": {'Zemin': 0, '1': 0, '2': 0, '3': 0},
        "Çevre Aydınlatma": {'Zemin': 0},
    }

@csrf_exempt
def getRoomServicesData(request):
    # Ayarları al
    global blokKatAlarmNumberData
    global murDelayThreshold, lndDelayThreshold, cleanedRoomDisplayTimeThreshold
    
    # suanki zamani al
    now = timezone.now()
    # logger.debug(f"Current time: {now}")

    # Tüm RoomServiceMURData verilerini al
    room_services = RoomServiceMURData.objects.all()

    # Boş bir liste oluştur
    room_service_data = []

    # RoomServiceMURData verileri üzerinde döngü
    for service in room_services:    
        
        service_customerRequestTime = ""
        if service.customerRequestTime != None:
            service_customerRequestTime = (service.customerRequestTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") # tr saatine cevir
        
        service_status_time = ""
        if service.serviceEndTime != None:
            service_status_time = (service.serviceEndTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") # tr saatine cevir

        # logger.debug(f"isDelayed: {service.isDelayed}, service.status: {service.status}")
        if service.isDelayed == "1": # gecikme var
            if service.status == "0" or service.status == "2" : # musteri mur talep etti veya hk cleaning
                service_acknowledgement = "Waiting Ack."
                service_ackTime = ""
                service_status = "None"
                if service.ackStatus != None:
                    if service.ackStatus == "0": # ack yapilmadi
                        service_acknowledgement = "Waiting Ack."
                        service_ackTime = ""
                        service_status = "None"
                    elif service.ackStatus == "1": # ack yapildi
                        service_acknowledgement = "Acknowledged"
                        service_ackTime = (service.ackTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") # tr saatine cevir
                        service_status = "Waiting Resp."
                    else: logger.debug(f"ackStatus hatasi")

                service_delay_duration = now - service.customerRequestTime
                service_delay_duration_minutes = str(int(service_delay_duration.total_seconds() / 60))
                # logger.debug(f"service_delay_duration: {service_delay_duration}, service_delay_duration_minutes: {service_delay_duration_minutes} dakika")

                dummy_dict =  {
                        "id": service.id,
                        "blokNumarasi": service.blokNumarasi,
                        "katNumarasi": service.katNumarasi,
                        "roomId": service.odaNumarasi,
                        "activation": service_customerRequestTime,
                        "delayCategory": "MUR",
                        "delayDuration": service_delay_duration_minutes,
                        "acknowledgement": service_acknowledgement,
                        "ackTime": service_ackTime,
                        "status": service_status,
                        "statusTime": service_status_time,
                }
                # logger.debug(f"dummy_dict: {dummy_dict}")
                # Bu sözlüğü data listesine ekle
                room_service_data.append(dummy_dict)
            elif service.status == "3": # hk cleaned
                cleanedRoomDisplayTime = int((now-service.serviceEndTime).total_seconds() / 60)
                # logger.debug(f"cleanedRoomDisplayTime: {cleanedRoomDisplayTime}")
                if cleanedRoomDisplayTime <= cleanedRoomDisplayTimeThreshold:
                    service_acknowledgement = "None"
                    service_ackTime = ""
                    service_status = "Cleaned"
                    if service.ackStatus == "0": # ack yapilmadi
                        service_ackTime = ""
                    elif service.ackStatus == "1": # ack yapildi
                        service_ackTime = (service.ackTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") # tr saatine cevir
                    else: logger.debug(f"ackStatus hatasi")

                    service_delay_duration_minutes = ""
                    if service.requestResponceTime != None:
                        service_delay_duration = service.requestResponceTime
                        # Stringi saat, dakika ve saniyeye böl
                        # logger.debug(f"service_delay_duration: {service_delay_duration}")
                        if "days" in service_delay_duration:
                            # Gün bilgisini ve saat bilgisini ayır
                            days_part, time_part = service_delay_duration.split(', ')
                            # Gün bilgisinden "days" kelimesini temizle
                            days = int(days_part.split(' ')[0])
                            # Saat, dakika ve saniye bilgilerini ayır
                            hours, minutes, seconds = time_part.split(':')
                        else: 
                            days = 0
                            hours, minutes, seconds = service_delay_duration.split(':')
                        # Saatleri, dakikaları ve saniyeleri dakikaya çevir
                        service_delay_duration_minutes = int(int(days) * 24 * 60 + int(hours) * 60 + int(minutes) + float(seconds) / 60)
                        # logger.debug(f"service_delay_duration_minutes: {service_delay_duration_minutes} dakika")

                    dummy_dict =  {
                            "id": service.id,
                            "blokNumarasi": service.blokNumarasi,
                            "katNumarasi": service.katNumarasi,
                            "roomId": service.odaNumarasi,
                            "activation": service_customerRequestTime,
                            "delayCategory": "MUR",
                            "delayDuration": service_delay_duration_minutes,
                            "acknowledgement": service_acknowledgement,
                            "ackTime": service_ackTime,
                            "status": service_status,
                            "statusTime": service_status_time,
                    }
                    # logger.debug(f"dummy_dict: {dummy_dict}")
                    # Bu sözlüğü data listesine ekle
                    room_service_data.append(dummy_dict)
                else: logger.debug(f"service.odaNumarasi: {service.odaNumarasi} room service gosterim suresini gecti.") 
        else:
            if service.status == "0" or service.status == "2": 
                # serviste gecikme olup olmadigini hesapla
                service_delay_duration = now - service.customerRequestTime
                service_delay_duration_minutes = int(service_delay_duration.total_seconds() / 60)
                logger.debug(f"service_delay_duration_minutes: {service_delay_duration_minutes}")
                if service_delay_duration_minutes >= murDelayThreshold:
                    logger.debug(f"Gecikme var")
                    service.isDelayed = "1"
                    service.save()
                    logger.debug(f"Service ID {service.id}, service.odaNumarasi: {service.odaNumarasi} isDelayed updated to 1")

    # ----------------------------------------- Blok ve katlar icin geciken room service sayilarinin hesaplanmasi -----------------------------------------
    # geciken, musteri talebi olan ve temizligi devam eden room servisleri filtrele
    service_delayed_and_incomplete = RoomServiceMURData.objects.filter(isDelayed="1", status__in=["0", "2"])

    # Toplam geciken room servis sayisi
    roomServiceAlarmNumber = service_delayed_and_incomplete.count()

    # Alarmları blokNumarasi ve katNumarasi bazında gruplayıp say
    service_counts = service_delayed_and_incomplete.values('blokNumarasi', 'katNumarasi').annotate(count=Count('id'))
    # logger.debug(f"alarm_counts: {alarm_counts}")

    # Sonuçları dictionary'e doldur
    logger.debug(f"blokKatAlarmNumberData: {blokKatAlarmNumberData}")
    dummy_blokKatDelayedRoomServiceNumberData = copy.deepcopy(blokKatAlarmNumberData)

    # Alınan sonuçları blokKatAlarmNumberData dictionary'sine yerleştir
    for service in service_counts:
        blok = service['blokNumarasi']
        kat = service['katNumarasi']
        count = service['count']
        
        if blok in dummy_blokKatDelayedRoomServiceNumberData and kat in dummy_blokKatDelayedRoomServiceNumberData[blok]:
            dummy_blokKatDelayedRoomServiceNumberData[blok][kat] = count

    logger.debug(f"dummy_blokKatDelayedRoomServiceNumberData: {dummy_blokKatDelayedRoomServiceNumberData}")
    logger.debug(f"room_service_data: {room_service_data}")
    logger.debug(f"roomServiceAlarmNumber: {roomServiceAlarmNumber}")
    return JsonResponse({"roomService": room_service_data, "roomServiceAlarmNumber":roomServiceAlarmNumber, "blokKatDelayedRoomServiceNumberData":dummy_blokKatDelayedRoomServiceNumberData})


@csrf_exempt
def postRoomServicesAckData(request):
    if request.method == 'POST':

        # suanki zamani al
        now = timezone.now()
        logger.debug(f"Current time: {now}")

        try:
            # JSON veriyi al
            data = json.loads(request.body.decode('utf-8'))
            logger.debug(f"data: {data}")
            # JSON verisinde oda numarasını al
            blokNumarasi = data.get('blokNumarasi')
            katNumarasi = data.get('katNumarasi')
            room_id = data.get('roomId')

            if room_id:
                # `roomId`'ye göre veriyi bul
                room_data = RoomServiceMURData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=room_id, status__in=['0', '2'])

                # Eğer veriler bulunduysa, güncelle
                if room_data.exists():
                    room_data.update(ackStatus='1')
                    room_data.update(ackTime=now)
                    return JsonResponse({'status': 'success'}, status=200)
                else:
                    return JsonResponse({'error': 'No data found for the given roomId or status not match'}, status=404)
            else:
                return JsonResponse({'error': 'Missing roomId'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)