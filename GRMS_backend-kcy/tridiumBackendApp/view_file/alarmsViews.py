from django.http import JsonResponse
from ..models import AlarmsData
import json
from django.views.decorators.csrf import csrf_exempt
from datetime import timedelta
from django.utils import timezone
from django.db.models import Q, Count
import copy

from .helper import getAppSettings, logger, getUtcToTrShift

_, _, _, _, _, fixedAlarmDisplayTimeThreshold = getAppSettings()

utc_to_tr_shift = getUtcToTrShift()

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
def getAlarmsData(request): # Navbarda bulunan Alarms sayfasi ve Blok-Kat alarm sayilarini olusturma icin kullaniliyor 

    global blokKatAlarmNumberData
    global fixedAlarmDisplayTimeThreshold
    # logger.debug(f"fixedAlarmDisplayTimeThreshold: {fixedAlarmDisplayTimeThreshold}")

    # Şu anki zamanı alın
    now = timezone.now()
    # logger.debug(f"now: {now}")

    # fixedAlarmDisplayTimeThreshold dakika önceki zamanı hesaplayın
    time_threshold = now - timedelta(minutes=fixedAlarmDisplayTimeThreshold)
    # logger.debug(f"time_threshold: {time_threshold}")

    # ----------------------------------------- NAVBAR da bulunan Alarms icin gerekli olan listenin olusturulmasi ----------------------------------------- 
    # alarmStatus == "1" veya alarmStatus="0" ve alarmEndTime fixedAlarmDisplayTimeThreshold dakika gecmemis veriyi al
    query = Q(alarmStatus="1") | (Q(alarmStatus="0") & Q(alarmEndTime__gte=time_threshold))
    alarms = AlarmsData.objects.filter(query)

    alarms_data = []
    for alarm in alarms:
        # logger.debug(f"alarm: {alarm}, alarmEndTime: {alarm.alarmEndTime}")

        acknowledgement = "Waiting Ack."
        if alarm.ackStatus == "1": 
            acknowledgement = "Acknowledged"

        status = "None"
        if alarm.alarmStatus == "0": # eger alarm giderildiyse
            status = "Fixed"
            acknowledgement = "None"
        elif alarm.alarmStatus == "1": # eger alarm giderilmediyse
            if alarm.ackStatus == "1": # alarm bildirildiyse
                status = "Waiting Repair/Control"

        dict_dummy = {
            "id": alarm.id,
            "blokNumarasi": alarm.blokNumarasi,
            "katNumarasi": alarm.katNumarasi,
            "odaNumarasi": alarm.odaNumarasi,
            "malfunction": alarm.odaNumarasi,
            "incidentTime": (alarm.alarmStartTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") if alarm.alarmStartTime else "",
            "category": alarm.alarmType,
            "acknowledgement": acknowledgement,
            "ackTime": (alarm.ackTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") if alarm.ackTime else "",
            "status": status,
            "statusTime": (alarm.alarmEndTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") if alarm.alarmEndTime else "",
            "rcuAlarmDetails": alarm.rcuAlarmDetails,
            "lightingAlarmDetails": alarm.lightingAlarmDetails,
            "address": alarm.address
        }
        alarms_data.append(dict_dummy)

    # ----------------------------------------- Blok ve katlar icin alarm sayilarinin hesaplanmasi -----------------------------------------
    # Alarmları filtrele
    alarms_1 = AlarmsData.objects.filter(alarmStatus="1")

    # Toplam alarm sayısını hesapla
    totalAlarmsNumber = alarms_1.count()

    # Alarmları blokNumarasi ve katNumarasi bazında gruplayıp say
    alarm_counts = alarms_1.values('blokNumarasi', 'katNumarasi').annotate(count=Count('id'))
    # logger.debug(f"alarm_counts: {alarm_counts}")

    # Sonuçları dictionary'e doldur
    dummy_blokKatAlarmNumberData = copy.deepcopy(blokKatAlarmNumberData)

    # Alınan sonuçları blokKatAlarmNumberData dictionary'sine yerleştir
    for alarm in alarm_counts:
        blok = alarm['blokNumarasi']
        kat = alarm['katNumarasi']
        count = alarm['count']
        
        if blok in dummy_blokKatAlarmNumberData and kat in dummy_blokKatAlarmNumberData[blok]:
            dummy_blokKatAlarmNumberData[blok][kat] = count

    """ logger.debug(f"dummy_blokKatAlarmNumberData: {dummy_blokKatAlarmNumberData}")
    logger.debug(f"alarms_data: {alarms_data}")
    logger.debug(f"totalAlarmsNumber: {totalAlarmsNumber}") """
    return JsonResponse({"alarms": alarms_data, "totalAlarmsNumber":totalAlarmsNumber, "blokKatAlarmNumberData": dummy_blokKatAlarmNumberData})


@csrf_exempt
def postAlarmsAckData(request):
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
            odaNumarasi = data.get('odaNumarasi')
            alarmType = data.get('alarmType')

            address = data.get('address')

            logger.debug(f"data: {data}")

            if odaNumarasi:
                # `roomId`'ye göre veriyi bul
                if address != "":
                    room_data = AlarmsData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, alarmType=alarmType, address=address)
                else:
                    room_data = AlarmsData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, alarmType=alarmType)

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

