# from django.http import HttpResponse, HttpRequest, JsonResponse
# import requests 
# from rest_framework import viewsets, status
# from .models import MekanikData, RCUHelvarRouterData, BlokKatOdaData, AppSettings, RoomServiceMURData, AlarmsData, PMSData, Account, BlokKatOda
# from .serializers import MekanikDataSerializer, RCUHelvarRouterDataSerializer
# from rest_framework.response import Response
# from django.shortcuts import get_object_or_404
# import json
# from django.core.serializers import serialize
# from rest_framework.renderers import JSONRenderer
# from django.views.decorators.csrf import csrf_exempt
# from .tasks import setControllerActualLevel, setRCUModbus
# from datetime import datetime, timedelta
# from django.utils import timezone
# import logging
# from django.db.models import Q, Count
# import re
# import copy
# import http.client
# from django.contrib.auth import authenticate, login, logout

# from rest_framework.decorators import api_view
# def getAppSettings():

#     dashboardReqResponceTimeUpperLimit = 30  # dakika
#     dashboardServiceResponceTimeUpperLimit = 60  # dakika
#     murDelayThreshold = 60  # dakika
#     lndDelayThreshold = 120  # dakika
#     cleanedRoomDisplayTimeThreshold = 60  # dakika
#     fixedAlarmDisplayTimeThreshold = 45  # dakika

#     try:
#         settings = AppSettings.objects.first()  # program başlatıldığı zaman 1 kere okur, her seferinde database'i meşgul etmemek için buraya eklenmiştir.
#         if settings:
#             dashboardReqResponceTimeUpperLimit = settings.dashboardReqResponceTimeUpperLimit
#             dashboardServiceResponceTimeUpperLimit = settings.dashboardServiceResponceTimeUpperLimit
#             murDelayThreshold = settings.murDelayThreshold
#             lndDelayThreshold = settings.lndDelayThreshold
#             cleanedRoomDisplayTimeThreshold = settings.cleanedRoomDisplayTimeThreshold
#             fixedAlarmDisplayTimeThreshold = settings.fixedAlarmDisplayTimeThreshold

#         logger.debug(f"dashboardReqResponceTimeUpperLimit: {dashboardReqResponceTimeUpperLimit}, dashboardServiceResponceTimeUpperLimit: {dashboardServiceResponceTimeUpperLimit}, murDelayThreshold: {murDelayThreshold}, lndDelayThreshold: {lndDelayThreshold}, cleanedRoomDisplayTimeThreshold: {cleanedRoomDisplayTimeThreshold}, fixedAlarmDisplayTimeThreshold: {fixedAlarmDisplayTimeThreshold}")
    
#     except Exception as e:
#         logger.error(f"An error occurred while getting settings: {e}")
#         return dashboardReqResponceTimeUpperLimit, dashboardServiceResponceTimeUpperLimit, murDelayThreshold, lndDelayThreshold, cleanedRoomDisplayTimeThreshold, fixedAlarmDisplayTimeThreshold

#     return dashboardReqResponceTimeUpperLimit, dashboardServiceResponceTimeUpperLimit, murDelayThreshold, lndDelayThreshold, cleanedRoomDisplayTimeThreshold, fixedAlarmDisplayTimeThreshold

# # Logger'ı ayarla
# """ logging.basicConfig(level=logging.DEBUG, 
#                     format='%(asctime)s - %(name)s - %(funcName)s - %(levelname)s - %(message)s',
#                     filename="kcy_views.log",
#                     filemode="a") """
# logging.basicConfig(level=logging.DEBUG, 
#                     format='%(asctime)s - %(name)s - %(funcName)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# dashboardReqResponceTimeUpperLimit, dashboardServiceResponceTimeUpperLimit, murDelayThreshold, lndDelayThreshold, cleanedRoomDisplayTimeThreshold, fixedAlarmDisplayTimeThreshold = getAppSettings()

# utc_to_tr_shift = 3 # 3 hours

# # Latitude and longitude belek
# lat = 36.86281810
# lon = 31.05500930

# blokKatAlarmNumberData = {
#         "A": {'1': 0, '2': 0, '3': 0, '4': 0},
#         "F": {'1': 0, '2': 0, '3': 0, '4': 0},
#         "Owner Villalar": {'Zemin': 0},
#         "5000": {'Zemin': 0},
#         "5100": {'Zemin': 0},
#         "5200 Batı": {'Zemin': 0},
#         "5200 Doğu": {'Zemin': 0},
#         "5300": {'Zemin': 0},
#         "5800": {'Zemin': 0},
#         "5900": {'Zemin': 0},
#         "A-F Yatak Kat Koridor": {'Zemin': 0, '1': 0, '2': 0, '3': 0},
#         "Çevre Aydınlatma": {'Zemin': 0},
#     }

# @csrf_exempt
# def postAlarmsAckData(request):
#     if request.method == 'POST':

#         # suanki zamani al
#         now = timezone.now()
#         logger.debug(f"Current time: {now}")

#         try:
#             # JSON veriyi al
#             data = json.loads(request.body.decode('utf-8'))
#             logger.debug(f"data: {data}")

#             # JSON verisinde oda numarasını al
#             blokNumarasi = data.get('blokNumarasi')
#             katNumarasi = data.get('katNumarasi')
#             odaNumarasi = data.get('odaNumarasi')
#             alarmType = data.get('alarmType')

#             address = data.get('address')

#             logger.debug(f"data: {data}")

#             if odaNumarasi:
#                 # `roomId`'ye göre veriyi bul
#                 if address != "":
#                     room_data = AlarmsData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, alarmType=alarmType, address=address)
#                 else:
#                     room_data = AlarmsData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, alarmType=alarmType)

#                 # Eğer veriler bulunduysa, güncelle
#                 if room_data.exists():
#                     room_data.update(ackStatus='1')
#                     room_data.update(ackTime=now)
#                     return JsonResponse({'status': 'success'}, status=200)
#                 else:
#                     return JsonResponse({'error': 'No data found for the given roomId or status not match'}, status=404)
#             else:
#                 return JsonResponse({'error': 'Missing roomId'}, status=400)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)
#     else:
#         return JsonResponse({'error': 'Method not allowed'}, status=405)
    
# @csrf_exempt
# def postRoomServicesAckData(request):
#     if request.method == 'POST':

#         # suanki zamani al
#         now = timezone.now()
#         logger.debug(f"Current time: {now}")

#         try:
#             # JSON veriyi al
#             data = json.loads(request.body.decode('utf-8'))
#             logger.debug(f"data: {data}")
#             # JSON verisinde oda numarasını al
#             blokNumarasi = data.get('blokNumarasi')
#             katNumarasi = data.get('katNumarasi')
#             room_id = data.get('roomId')

#             if room_id:
#                 # `roomId`'ye göre veriyi bul
#                 room_data = RoomServiceMURData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=room_id, status__in=['0', '2'])

#                 # Eğer veriler bulunduysa, güncelle
#                 if room_data.exists():
#                     room_data.update(ackStatus='1')
#                     room_data.update(ackTime=now)
#                     return JsonResponse({'status': 'success'}, status=200)
#                 else:
#                     return JsonResponse({'error': 'No data found for the given roomId or status not match'}, status=404)
#             else:
#                 return JsonResponse({'error': 'Missing roomId'}, status=400)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)
#     else:
#         return JsonResponse({'error': 'Method not allowed'}, status=405)

# def find_actual_level(data, desired_address):
#     for item in data['list_address_actual_level']:
#         if item['address'] == desired_address:
#             return item['actualLevel']
#     return None  # Adres bulunamazsa None döndürür

# def check_if_delayed(start, end, delayThreshold = 3600):
#     # Tarih formatı tanımı (örneğin: 'YYYY-MM-DD HH:MM:SS')
#     date_format = "%Y-%m-%d %H:%M:%S"

#     delayed = "0"
#     try:
#         # Tarih ve saat bilgilerini datetime nesnelerine dönüştürme
#         start_time = datetime.strptime(start, date_format)
#         end_time = datetime.strptime(end, date_format)

#         # İki tarih arasındaki farkı hesaplama
#         time_difference = end_time - start_time

#         # Farkın bir saatten fazla olup olmadığını kontrol etme
#         if time_difference.total_seconds() > delayThreshold:
#             delayed = "1"
#         else:
#             delayed = "0"

#     except ValueError:
#         # Tarih formatında bir hata varsa, delayed'ı varsayılan bir değere ayarlama
#         delayed = "0"
#         print("check_if_delayed Tarih formatında bir hata oluştu. Lütfen 'YYYY-MM-DD HH:MM:SS' formatını kullanın.")

#     return delayed

# @csrf_exempt
# def getRoomDetailsData(request, blokNumarasi, katNumarasi, odaNumarasi):
#     global utc_to_tr_shift
#     logger.debug(f"blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}")

#     # Veritabanında sorgulama
#     room_services = RoomServiceMURData.objects.filter(
#         blokNumarasi=blokNumarasi,
#         katNumarasi=katNumarasi,
#         odaNumarasi=odaNumarasi,
#         status__in=["0", "2", "3"]  # Status alanını filtreleme
#     )
    
#     # Boş bir liste oluştur
#     room_details_data = []

#     # RoomServiceMURData verileri üzerinde döngü
#     for service in room_services:

#         service_status = "n/a"
#         if service.status == "0":
#             service_status = "Active"
#             if service.isDelayed == "1":
#                 service_status = "Delay"
#         elif service.status == "2":
#             service_status = "Cleaning"
#         elif service.status == "3":
#             service_status = "Cleaned"

#         # Time string'i datetime formatına dönüştür
#         time_str = service.requestResponceTime
#         if time_str:
#             try:
#                 time_obj = datetime.strptime(time_str, "%H:%M:%S.%f")
#             except ValueError:
#                 # Eğer saat kısmı yoksa, örneğin "03:59.220504", onu işlemek için
#                 time_obj = datetime.strptime(time_str, "%M:%S.%f")

#             # Toplam süreyi timedelta olarak hesapla
#             total_seconds = time_obj.hour * 3600 + time_obj.minute * 60 + time_obj.second + time_obj.microsecond / 1_000_000

#             # Saat ve dakika kısmını hesapla
#             hours, remainder = divmod(total_seconds, 3600)
#             minutes, seconds = divmod(remainder, 60)

#             # Formatı oluştur
#             duration = ""
#             if hours > 0:
#                 duration = f"{int(hours)} h. {int(minutes)} m."
#             else:
#                 duration = f"{int(minutes)} m."
#         else: duration = ""
    
#         dummy_dict = {
#             "id": service.id,
#             "date": (service.customerRequestTime+ timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d") if service.customerRequestTime else "",
#             "status": service_status, # "Active", "Delay", "Cleaning", "Cleaned"
#             "requestTime": (service.customerRequestTime + timedelta(hours=utc_to_tr_shift)).strftime("%H:%M") if service.customerRequestTime else "",
#             "operationStart": (service.serviceStartTime + timedelta(hours=utc_to_tr_shift)).strftime("%H:%M") if service.serviceStartTime else "",
#             "operationEnd": (service.serviceEndTime + timedelta(hours=utc_to_tr_shift)).strftime("%H:%M") if service.serviceEndTime else "",
#             "duration": duration, 
#             "employee": service.employee if service.employee else "",
#             "odaNumarasi": odaNumarasi
#         }
        
#         room_details_data.append(dummy_dict)
    
#     logger.debug(f"room_details_data: {room_details_data}")
#     return JsonResponse({"roomDetail": room_details_data})

# @csrf_exempt
# def getRoomServicesData(request):
#     # Ayarları al
#     global blokKatAlarmNumberData
#     global murDelayThreshold, lndDelayThreshold, cleanedRoomDisplayTimeThreshold
    
#     # suanki zamani al
#     now = timezone.now()
#     # logger.debug(f"Current time: {now}")

#     # Tüm RoomServiceMURData verilerini al
#     room_services = RoomServiceMURData.objects.all()

#     # Boş bir liste oluştur
#     room_service_data = []

#     # RoomServiceMURData verileri üzerinde döngü
#     for service in room_services:    
        
#         service_customerRequestTime = ""
#         if service.customerRequestTime != None:
#             service_customerRequestTime = (service.customerRequestTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") # tr saatine cevir
        
#         service_status_time = ""
#         if service.serviceEndTime != None:
#             service_status_time = (service.serviceEndTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") # tr saatine cevir

#         # logger.debug(f"isDelayed: {service.isDelayed}, service.status: {service.status}")
#         if service.isDelayed == "1": # gecikme var
#             if service.status == "0" or service.status == "2" : # musteri mur talep etti veya hk cleaning
#                 service_acknowledgement = "Waiting Ack."
#                 service_ackTime = ""
#                 service_status = "None"
#                 if service.ackStatus != None:
#                     if service.ackStatus == "0": # ack yapilmadi
#                         service_acknowledgement = "Waiting Ack."
#                         service_ackTime = ""
#                         service_status = "None"
#                     elif service.ackStatus == "1": # ack yapildi
#                         service_acknowledgement = "Acknowledged"
#                         service_ackTime = (service.ackTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") # tr saatine cevir
#                         service_status = "Waiting Resp."
#                     else: logger.debug(f"ackStatus hatasi")

#                 service_delay_duration = now - service.customerRequestTime
#                 service_delay_duration_minutes = str(int(service_delay_duration.total_seconds() / 60))
#                 # logger.debug(f"service_delay_duration: {service_delay_duration}, service_delay_duration_minutes: {service_delay_duration_minutes} dakika")

#                 dummy_dict =  {
#                         "id": service.id,
#                         "blokNumarasi": service.blokNumarasi,
#                         "katNumarasi": service.katNumarasi,
#                         "roomId": service.odaNumarasi,
#                         "activation": service_customerRequestTime,
#                         "delayCategory": "MUR",
#                         "delayDuration": service_delay_duration_minutes,
#                         "acknowledgement": service_acknowledgement,
#                         "ackTime": service_ackTime,
#                         "status": service_status,
#                         "statusTime": service_status_time,
#                 }
#                 # logger.debug(f"dummy_dict: {dummy_dict}")
#                 # Bu sözlüğü data listesine ekle
#                 room_service_data.append(dummy_dict)
#             elif service.status == "3": # hk cleaned
#                 cleanedRoomDisplayTime = int((now-service.serviceEndTime).total_seconds() / 60)
#                 # logger.debug(f"cleanedRoomDisplayTime: {cleanedRoomDisplayTime}")
#                 if cleanedRoomDisplayTime <= cleanedRoomDisplayTimeThreshold:
#                     service_acknowledgement = "None"
#                     service_ackTime = ""
#                     service_status = "Cleaned"
#                     if service.ackStatus == "0": # ack yapilmadi
#                         service_ackTime = ""
#                     elif service.ackStatus == "1": # ack yapildi
#                         service_ackTime = (service.ackTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") # tr saatine cevir
#                     else: logger.debug(f"ackStatus hatasi")

#                     service_delay_duration_minutes = ""
#                     if service.requestResponceTime != None:
#                         service_delay_duration = service.requestResponceTime
#                         # Stringi saat, dakika ve saniyeye böl
#                         # logger.debug(f"service_delay_duration: {service_delay_duration}")
#                         if "days" in service_delay_duration:
#                             # Gün bilgisini ve saat bilgisini ayır
#                             days_part, time_part = service_delay_duration.split(', ')
#                             # Gün bilgisinden "days" kelimesini temizle
#                             days = int(days_part.split(' ')[0])
#                             # Saat, dakika ve saniye bilgilerini ayır
#                             hours, minutes, seconds = time_part.split(':')
#                         else: 
#                             days = 0
#                             hours, minutes, seconds = service_delay_duration.split(':')
#                         # Saatleri, dakikaları ve saniyeleri dakikaya çevir
#                         service_delay_duration_minutes = int(int(days) * 24 * 60 + int(hours) * 60 + int(minutes) + float(seconds) / 60)
#                         # logger.debug(f"service_delay_duration_minutes: {service_delay_duration_minutes} dakika")

#                     dummy_dict =  {
#                             "id": service.id,
#                             "blokNumarasi": service.blokNumarasi,
#                             "katNumarasi": service.katNumarasi,
#                             "roomId": service.odaNumarasi,
#                             "activation": service_customerRequestTime,
#                             "delayCategory": "MUR",
#                             "delayDuration": service_delay_duration_minutes,
#                             "acknowledgement": service_acknowledgement,
#                             "ackTime": service_ackTime,
#                             "status": service_status,
#                             "statusTime": service_status_time,
#                     }
#                     # logger.debug(f"dummy_dict: {dummy_dict}")
#                     # Bu sözlüğü data listesine ekle
#                     room_service_data.append(dummy_dict)
#                 else: logger.debug(f"service.odaNumarasi: {service.odaNumarasi} room service gosterim suresini gecti.") 
#         else:
#             if service.status == "0" or service.status == "2": 
#                 # serviste gecikme olup olmadigini hesapla
#                 service_delay_duration = now - service.customerRequestTime
#                 service_delay_duration_minutes = int(service_delay_duration.total_seconds() / 60)
#                 logger.debug(f"service_delay_duration_minutes: {service_delay_duration_minutes}")
#                 if service_delay_duration_minutes >= murDelayThreshold:
#                     logger.debug(f"Gecikme var")
#                     service.isDelayed = "1"
#                     service.save()
#                     logger.debug(f"Service ID {service.id}, service.odaNumarasi: {service.odaNumarasi} isDelayed updated to 1")

#     # ----------------------------------------- Blok ve katlar icin geciken room service sayilarinin hesaplanmasi -----------------------------------------
#     # geciken, musteri talebi olan ve temizligi devam eden room servisleri filtrele
#     service_delayed_and_incomplete = RoomServiceMURData.objects.filter(isDelayed="1", status__in=["0", "2"])

#     # Toplam geciken room servis sayisi
#     roomServiceAlarmNumber = service_delayed_and_incomplete.count()

#     # Alarmları blokNumarasi ve katNumarasi bazında gruplayıp say
#     service_counts = service_delayed_and_incomplete.values('blokNumarasi', 'katNumarasi').annotate(count=Count('id'))
#     # logger.debug(f"alarm_counts: {alarm_counts}")

#     # Sonuçları dictionary'e doldur
#     dummy_blokKatDelayedRoomServiceNumberData = copy.deepcopy(blokKatAlarmNumberData)

#     # Alınan sonuçları blokKatAlarmNumberData dictionary'sine yerleştir
#     for service in service_counts:
#         blok = service['blokNumarasi']
#         kat = service['katNumarasi']
#         count = service['count']
        
#         if blok in dummy_blokKatDelayedRoomServiceNumberData and kat in dummy_blokKatDelayedRoomServiceNumberData[blok]:
#             dummy_blokKatDelayedRoomServiceNumberData[blok][kat] = count

#     logger.debug(f"dummy_blokKatDelayedRoomServiceNumberData: {dummy_blokKatDelayedRoomServiceNumberData}")
#     logger.debug(f"room_service_data: {room_service_data}")
#     logger.debug(f"roomServiceAlarmNumber: {roomServiceAlarmNumber}")
#     return JsonResponse({"roomService": room_service_data, "roomServiceAlarmNumber":roomServiceAlarmNumber, "blokKatDelayedRoomServiceNumberData":dummy_blokKatDelayedRoomServiceNumberData})

# @csrf_exempt
# def getAlarmsData(request): # Navbarda bulunan Alarms sayfasi ve Blok-Kat alarm sayilarini olusturma icin kullaniliyor 

#     logger.debug(f"getAlarmsData")
#     global blokKatAlarmNumberData
#     global fixedAlarmDisplayTimeThreshold
#     # logger.debug(f"fixedAlarmDisplayTimeThreshold: {fixedAlarmDisplayTimeThreshold}")

#     # Şu anki zamanı alın
#     now = timezone.now()
#     # logger.debug(f"now: {now}")

#     # fixedAlarmDisplayTimeThreshold dakika önceki zamanı hesaplayın
#     time_threshold = now - timedelta(minutes=fixedAlarmDisplayTimeThreshold)
#     # logger.debug(f"time_threshold: {time_threshold}")

#     # ----------------------------------------- NAVBAR da bulunan Alarms icin gerekli olan listenin olusturulmasi ----------------------------------------- 
#     # alarmStatus == "1" veya alarmStatus="0" ve alarmEndTime fixedAlarmDisplayTimeThreshold dakika gecmemis veriyi al
#     query = Q(alarmStatus="1") | (Q(alarmStatus="0") & Q(alarmEndTime__gte=time_threshold))
#     alarms = AlarmsData.objects.filter(query)

#     alarms_data = []
#     for alarm in alarms:
#         # logger.debug(f"alarm: {alarm}, alarmEndTime: {alarm.alarmEndTime}")

#         acknowledgement = "Waiting Ack."
#         if alarm.ackStatus == "1": 
#             acknowledgement = "Acknowledged"

#         status = "None"
#         if alarm.alarmStatus == "0": # eger alarm giderildiyse
#             status = "Fixed"
#             acknowledgement = "None"
#         elif alarm.alarmStatus == "1": # eger alarm giderilmediyse
#             if alarm.ackStatus == "1": # alarm bildirildiyse
#                 status = "Waiting Repair/Control"

#         dict_dummy = {
#             "id": alarm.id,
#             "blokNumarasi": alarm.blokNumarasi,
#             "katNumarasi": alarm.katNumarasi,
#             "odaNumarasi": alarm.odaNumarasi,
#             "malfunction": alarm.odaNumarasi,
#             "incidentTime": (alarm.alarmStartTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") if alarm.alarmStartTime else "",
#             "category": alarm.alarmType,
#             "acknowledgement": acknowledgement,
#             "ackTime": (alarm.ackTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") if alarm.ackTime else "",
#             "status": status,
#             "statusTime": (alarm.alarmEndTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M") if alarm.alarmEndTime else "",
#             "rcuAlarmDetails": alarm.rcuAlarmDetails,
#             "lightingAlarmDetails": alarm.lightingAlarmDetails,
#             "address": alarm.address
#         }
#         alarms_data.append(dict_dummy)

#     # ----------------------------------------- Blok ve katlar icin alarm sayilarinin hesaplanmasi -----------------------------------------
#     # Alarmları filtrele
#     alarms_1 = AlarmsData.objects.filter(alarmStatus="1")

#     # Toplam alarm sayısını hesapla
#     totalAlarmsNumber = alarms_1.count()

#     # Alarmları blokNumarasi ve katNumarasi bazında gruplayıp say
#     alarm_counts = alarms_1.values('blokNumarasi', 'katNumarasi').annotate(count=Count('id'))
#     # logger.debug(f"alarm_counts: {alarm_counts}")

#     # Sonuçları dictionary'e doldur
#     dummy_blokKatAlarmNumberData = copy.deepcopy(blokKatAlarmNumberData)

#     # Alınan sonuçları blokKatAlarmNumberData dictionary'sine yerleştir
#     for alarm in alarm_counts:
#         blok = alarm['blokNumarasi']
#         kat = alarm['katNumarasi']
#         count = alarm['count']
        
#         if blok in dummy_blokKatAlarmNumberData and kat in dummy_blokKatAlarmNumberData[blok]:
#             dummy_blokKatAlarmNumberData[blok][kat] = count

#     """ logger.debug(f"dummy_blokKatAlarmNumberData: {dummy_blokKatAlarmNumberData}")
#     logger.debug(f"alarms_data: {alarms_data}")
#     logger.debug(f"totalAlarmsNumber: {totalAlarmsNumber}") """
#     return JsonResponse({"alarms": alarms_data, "totalAlarmsNumber":totalAlarmsNumber, "blokKatAlarmNumberData": dummy_blokKatAlarmNumberData})

# @csrf_exempt
# def getDashboardAlarmStatusData(request): # Frontend de bulunan dashboard alarm status icin get metodu

#     alarmNumber = []
#     ackNumber = []
#     list_alarmType = ["RCU", "Helvar", "HVAC", "Door Syst.", "Lighting", "PMS", "Emergency"]
#     for alarmType in list_alarmType:
#         # alarmType ve alarmStatus "1" olan verilerin sayısını hesaplayın
#         alarmNumber.append(AlarmsData.objects.filter(alarmType=alarmType, alarmStatus="1").count())
#         # alarmType, alarmStatus "1" ve ackStatus "1" olan verilerin sayısını hesaplayın
#         ackNumber.append(AlarmsData.objects.filter(alarmType=alarmType, alarmStatus="1", ackStatus="1").count())
#     logger.debug(f"alarmType: {list_alarmType}, alarmNumber: {alarmNumber}, ackNumber: {ackNumber}")

#     rcuAlarmNumber, helvarAlarmNumber, hvacAlarmNumber, doorSystemAlarmNumber, lightingAlarmNumber, pmsAlarmNumber, emergencyAlarmNumber = alarmNumber
#     rcuAckNumber, helvarAckNumber, hvacAckNumber, doorAckNumber, lightingAckNumber, pmsAckNumber, emergencyAckNumber = ackNumber
    
#     try:
#         numberOfHVAC = MekanikData.objects.count()
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         numberOfHVAC = 0  # Hata durumunda varsayılan bir değer atanabilir

#     try:
#         numberOfHelvar = RCUHelvarRouterData.objects.filter(deviceType="Helvar Router").count()
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         numberOfHelvar = 0  # Hata durumunda varsayılan bir değer atanabilir

#     try:
#         numberOfRCU = RCUHelvarRouterData.objects.filter(deviceType="Elekon RCU").count()
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         numberOfRCU = 0  # Hata durumunda varsayılan bir değer atanabilir

#     dummy_dict =  {
#                     "lightingAlarmNumber": lightingAlarmNumber,
#                     "hvacAlarmNumber": hvacAlarmNumber,
#                     "rcuAlarmNumber": rcuAlarmNumber,
#                     "helvarAlarmNumber": helvarAlarmNumber,
#                     "controllerAlarmNumber": rcuAlarmNumber + helvarAlarmNumber, 
#                     "doorSystemAlarmNumber": doorSystemAlarmNumber,
#                     "pmsAlarmNumber": pmsAlarmNumber,
#                     "emergencyAlarmNumber": emergencyAlarmNumber,
#                     "lightingAckNumber": lightingAckNumber, 
#                     "hvacAckNumber": hvacAckNumber, 
#                     "rcuAckNumber": rcuAckNumber, 
#                     "helvarAckNumber": helvarAckNumber,
#                     "controllerAckNumber": rcuAckNumber + helvarAckNumber, 
#                     "doorAckNumber": doorAckNumber, 
#                     "pmsAckNumber": pmsAckNumber, 
#                     "emergencyAckNumber": emergencyAckNumber,
#                     "numberOfRCU": str(numberOfRCU),
#                     "numberOfHelvar": str(numberOfHelvar),
#                     "numberOfHVAC": str(numberOfHVAC)
#     }
#     logger.debug(f"dummy_dict: {dummy_dict}")
#     return JsonResponse({"alarmStatus": dummy_dict})

# @csrf_exempt
# def updateAlarmsData(request):
#     try:
#         data = json.loads(request.body)
#         data = data[0]
#         logger.debug(f"input data: {data}")

#         blokNumarasi = data.get("blokNumarasi")
#         katNumarasi = data.get("katNumarasi")
#         odaNumarasi = data.get("odaNumarasi")
#         alarmType = data.get("alarmType") # "Lighting", "RCU", "HVAC", "Helvar", "Emergency" (Open Door)
        
#         logger.debug(f"blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, alarmType: {alarmType}")

#         now = timezone.now()
#         # logger.debug(f"Current time: {now}")

#         if alarmType == "RCU" or alarmType == "Helvar":

#             alarmStatus = data.get("alarmStatus")

#             rcuAlarmDetails = {'ip': data.get("ip")}  # rcuAlarmDetails'e ip ekle
#             if alarmStatus == "1": # gelen veride alarm varsa
#                 # Veritabanında eşleşen veri olup olmadığını kontrol et
#                 exists = AlarmsData.objects.filter(
#                     blokNumarasi=blokNumarasi,
#                     katNumarasi=katNumarasi,
#                     odaNumarasi=odaNumarasi,
#                     alarmType=alarmType,
#                     alarmStatus=alarmStatus
#                 ).exists()

#                 if not exists: # Eğer eşleşen veri yoksa yeni bir veri oluştur
#                     AlarmsData.objects.create(
#                         blokNumarasi=blokNumarasi,
#                         katNumarasi=katNumarasi,
#                         odaNumarasi=odaNumarasi,
#                         alarmType=alarmType,
#                         alarmStatus=alarmStatus,
#                         rcuAlarmDetails=rcuAlarmDetails, 
#                         alarmStartTime=now,
#                     )
#                     logger.debug(f"New alarm is added. {data}")
#                     return JsonResponse({'status': 'success', 'new data created': True})
#                 else: # eger eslesen bir veri varsa
#                     logger.debug(f"This alarm was already created. {data}")
#                     return JsonResponse({'status': 'success', 'new data created.': False})
#             elif alarmStatus == "0": # gelen veride alarm yoksa yani alarm duzeltildiyse
#                 try:
#                     alarm = AlarmsData.objects.get( # Veritabanında eşleşen veri olup olmadığını kontrol et
#                         blokNumarasi=blokNumarasi,
#                         katNumarasi=katNumarasi,
#                         odaNumarasi=odaNumarasi,
#                         alarmType=alarmType,
#                         alarmStatus="1" # onceden verilen bir alarm var mi
#                     )
#                     if alarm: # eger alarmStatus = 0 geldiyse ve onceden alarmStatus degeri 1 olan bir veri varsa, veriyi fixed olarak guncelle
#                         alarm.alarmStatus = "0"
#                         alarm.alarmEndTime = now
#                         alarm.save()
#                         logger.debug(f"Existing alarm fixed. {data}")
#                         return JsonResponse({'status': 'success', 'Existing alarm fixed.': True})
#                 except AlarmsData.DoesNotExist:
#                     logger.debug(f"Boyle bir alarm yok. {data}")
#                     return JsonResponse({'status': 'success', 'message': "Boyle bir alarm yok."})
#             else: logger.debug(f"Alarm kodu yanlis. {data}")
        
#         elif alarmType == "Emergency" or alarmType == "HVAC" or alarmType == "PMS" :
            
#             alarmStatus = data.get("alarmStatus")

#             if alarmStatus == "1": # gelen veride alarm varsa
#                 # Veritabanında eşleşen veri olup olmadığını kontrol et
#                 exists = AlarmsData.objects.filter(
#                     blokNumarasi=blokNumarasi,
#                     katNumarasi=katNumarasi,
#                     odaNumarasi=odaNumarasi,
#                     alarmType=alarmType,
#                     alarmStatus=alarmStatus
#                 ).exists()

#                 if not exists: # Eğer eşleşen veri yoksa yeni bir veri oluştur
#                     AlarmsData.objects.create(
#                         blokNumarasi=blokNumarasi,
#                         katNumarasi=katNumarasi,
#                         odaNumarasi=odaNumarasi,
#                         alarmType=alarmType,
#                         alarmStatus=alarmStatus,
#                         alarmStartTime=now,
#                     )
#                     logger.debug(f"New alarm is added. {data}")
#                     return JsonResponse({'status': 'success', 'new data created': True})
#                 else: # eger eslesen bir veri varsa
#                     logger.debug(f"This alarm was already created. {data}")
#                     return JsonResponse({'status': 'success', 'new data created.': False})
#             elif alarmStatus == "0": # gelen veride alarm yoksa yani alarm duzeltildiyse
#                 try:
#                     alarm = AlarmsData.objects.get( # Veritabanında eşleşen veri olup olmadığını kontrol et
#                         blokNumarasi=blokNumarasi,
#                         katNumarasi=katNumarasi,
#                         odaNumarasi=odaNumarasi,
#                         alarmType=alarmType,
#                         alarmStatus="1" # onceden verilen bir alarm var mi
#                     )
#                     if alarm: # eger alarmStatus = 0 geldiyse ve onceden alarmStatus degeri 1 olan bir veri varsa, veriyi fixed olarak guncelle
#                         alarm.alarmStatus = "0"
#                         alarm.alarmEndTime = now
#                         alarm.save()
#                         logger.debug(f"Existing alarm fixed. {data}")
#                         return JsonResponse({'status': 'success', 'Existing alarm fixed.': True})
#                 except AlarmsData.DoesNotExist:
#                     logger.debug(f"Boyle bir alarm yok. {data}")
#                     return JsonResponse({'status': 'success', 'message': "Boyle bir alarm yok."})
#             else: logger.debug(f"Alarm kodu yanlis. {data}")
#         elif alarmType == "Lighting":
            
#             list_alarmStatusLighting = data.get("alarmStatusLighting")
#             logger.debug(f"list_alarmStatusLighting: {list_alarmStatusLighting}")

#             for i in list_alarmStatusLighting:
#                 address = i["address"]
#                 alarmStatus = i["status"]
#                 lightingName = i["name"]
#                 lightingDeviceType = i["deviceType"]
#                 controllerType = i["controllerType"]

#                 logger.debug(f"address: {address}, alarmStatus: {alarmStatus}") 
#                 if alarmStatus == "1": # gelen veride alarm varsa
#                     # Veritabanında eşleşen veri olup olmadığını kontrol et
#                     exists = AlarmsData.objects.filter(
#                         blokNumarasi=blokNumarasi,
#                         katNumarasi=katNumarasi,
#                         odaNumarasi=odaNumarasi,
#                         address=address,
#                         alarmType=alarmType,
#                         alarmStatus=alarmStatus
#                     ).exists()

#                     if not exists: # Eğer eşleşen veri yoksa yeni bir veri oluştur
#                         AlarmsData.objects.create(
#                             blokNumarasi=blokNumarasi,
#                             katNumarasi=katNumarasi,
#                             odaNumarasi=odaNumarasi,
#                             address=address,
#                             alarmType=alarmType,
#                             alarmStatus=alarmStatus,
#                             alarmStartTime=now,
#                             lightingAlarmDetails={"address":address, "name":lightingName, "deviceType": lightingDeviceType, "controllerType":controllerType}
#                         )
#                         logger.debug(f"New alarm is added. {data}")
#                     else: # eger eslesen bir veri varsa
#                         logger.debug(f"This alarm was already created. {data}")
#                 elif alarmStatus == "0": # gelen veride alarm yoksa yani alarm duzeltildiyse
#                     try:
#                         alarm = AlarmsData.objects.get( # Veritabanında eşleşen veri olup olmadığını kontrol et
#                             blokNumarasi=blokNumarasi,
#                             katNumarasi=katNumarasi,
#                             odaNumarasi=odaNumarasi,
#                             address=address,
#                             alarmType=alarmType,
#                             alarmStatus="1" # onceden verilen bir alarm var mi
#                         )
#                         if alarm: # eger alarmStatus = 0 geldiyse ve onceden alarmStatus degeri 1 olan bir veri varsa, veriyi fixed olarak guncelle
#                             alarm.alarmStatus = "0"
#                             alarm.alarmEndTime = now
#                             alarm.save()
#                             logger.debug(f"Existing alarm fixed. {data}")
#                     except AlarmsData.DoesNotExist:
#                         logger.debug(f"Boyle bir alarm yok. {data}")
#                 else: logger.debug(f"Alarm kodu yanlis. {data}")
#             return JsonResponse({'status': 'success'})
#         else:
#             return JsonResponse({'status': 'error', 'message': 'Invalid alarm type'}, status=400)
        
#     except json.JSONDecodeError:
#         return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
#     except Exception as e:
#         logger.error(f"An error occurred: {str(e)}")
#         return JsonResponse({'status': 'error', 'message': 'An internal error occurred'}, status=500)
    
# @csrf_exempt
# def updateRoomServicesMURData(request):

#     try:
#         data = json.loads(request.body)
#         logger.debug(f"data: {data}")

#         blokNumarasi = data.get("blokNumarasi")
#         katNumarasi = data.get("katNumarasi")
#         odaNumarasi = data.get("odaNumarasi")
#         eventType = data.get("eventType") # 0 -> musteri mur talebi, 1 -> musteri mur iptal, 2 -> HK oda temizligi basladi, 3 -> HK oda temizligi bitti
#         logger.debug(f"blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, eventType: {eventType}")

#         now = timezone.now()
#         logger.debug(f"Current time: {now}")

#         mur_data_instance = RoomServiceMURData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
#         logger.debug(f"mur_data_instance: {mur_data_instance}")

#         if mur_data_instance.exists():
#             all_status_cleaned_or_cancelled = all(item.status in ["3", "4"] for item in mur_data_instance) 
#             logger.debug(f"all_status_cleaned_or_cancelled: {all_status_cleaned_or_cancelled}")
#             if all_status_cleaned_or_cancelled: # Eğer tüm status değerleri "3" cleaned veya "4" cancelled ise yeni veri ekle
#                 if eventType == "0": # 0 -> musteri mur talebi
#                     new_mur_data = RoomServiceMURData.objects.create(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status="0", customerRequest="1", customerRequestTime=now, ackStatus = "0", isDelayed = "0")
#                     logger.debug(f"New room service data created: {new_mur_data}")
#             else:
#                 logger.debug("Not all statuses are '3'. No new data created.")
#                 if eventType == "1": # 1 -> musteri mur iptal
#                     RoomServiceMURData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status__in=["0"]).update(status="4", customerRequest="0")
#                     logger.debug(f"Customer mur iptal etti. eventType: {eventType}")
#                 elif eventType == "2": # 2 -> HK oda temizligi basladi
#                     RoomServiceMURData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status__in=["0"]).update(status="2", serviceStartTime=now)
#                     logger.debug(f"HK oda temizligi basladi eventType: {eventType}")
#                 elif eventType == "3": # 3 -> HK oda temizligi bitti
#                     dummy_serviceStartTime = get_object_or_404(RoomServiceMURData, blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status__in=["0", "2"]).serviceStartTime
#                     logger.debug(f"dummy_serviceStartTime: {dummy_serviceStartTime}")

#                     if dummy_serviceStartTime is not None: # serviceResponceTime hesapla
#                         serviceResponceTime = now - dummy_serviceStartTime
#                     else: 
#                         logger.debug("Temizlik başlamadan (hk temizlik basladi event i gelmeden) temizlik tamamlandı.")
#                         serviceResponceTime = now - now
#                     logger.debug(f"serviceResponceTime: {serviceResponceTime}")

#                     dummy_customerRequestTime = get_object_or_404(RoomServiceMURData, blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status__in=["0", "2"]).customerRequestTime
#                     logger.debug(f"dummy_customerRequestTime: {dummy_customerRequestTime}")
#                     if dummy_customerRequestTime is not None: # requestResponceTime hesapla
#                         requestResponceTime = now - dummy_customerRequestTime
#                     else: 
#                         logger.debug("Temizlik başlamadan (hk temizlik basladi event i gelmeden) temizlik tamamlandı.")
#                         requestResponceTime = now - now
#                     logger.debug(f"requestResponceTime: {requestResponceTime}")
#                     RoomServiceMURData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status__in=["0", "2"]).update(status="3", serviceEndTime=now, customerRequest="0", serviceResponceTime=str(serviceResponceTime), requestResponceTime=str(requestResponceTime))
#                     logger.debug(f"HK oda temizligi bitti eventType: {eventType}")
#         else:
#             if eventType == "0": # 0 -> musteri mur talebi
#                 new_mur_data = RoomServiceMURData.objects.create(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status="0", customerRequest="1", customerRequestTime=now, ackStatus = "0", isDelayed = "0")
#                 logger.debug(f"New mur data created: {new_mur_data}")

#         return JsonResponse({"updateRoomServicesMURData": True})

#     except json.JSONDecodeError as e:
#         logger.error(f"JSON decode error: {e}")
#         return JsonResponse({"error": "Invalid JSON format"}, status=400)

#     except RoomServiceMURData.DoesNotExist as e:
#         logger.error(f"RoomServiceMURData does not exist: {e}")
#         return JsonResponse({"error": "Room service data not found"}, status=404)

#     except Exception as e:
#         logger.error(f"An error occurred: {e}")
#         return JsonResponse({"error": "An unexpected error occurred"}, status=500)

# def parse_time(time_str):
#     """Zaman damgası formatını (örneğin '2 days, 10:36:25.974798' veya '0:12:41.208289') timedelta'ya dönüştür."""
#     if not time_str:
#         return timedelta()
    
#     # 'days' kelimesi var mı kontrol et
#     days_match = re.match(r'(\d+) days?, (\d+):(\d+):(\d+)\.(\d+)', time_str)
#     if days_match:
#         days, hours, minutes, seconds, microseconds = map(int, days_match.groups())
#         return timedelta(days=days, hours=hours, minutes=minutes, seconds=seconds, microseconds=microseconds)
    
#     # Gün yoksa saat:dk:saniye.milisaniye formatını kontrol et
#     time_match = re.match(r'(\d+):(\d+):(\d+)\.(\d+)', time_str)
#     if time_match:
#         hours, minutes, seconds, microseconds = map(int, time_match.groups())
#         return timedelta(hours=hours, minutes=minutes, seconds=seconds, microseconds=microseconds)
    
#     return timedelta()

# @csrf_exempt
# def getDashboardServiceRequestData(request):
        
#     # Ayarları al
#     global dashboardReqResponceTimeUpperLimit, dashboardServiceResponceTimeUpperLimit
    
#     # mevcut mur sayisi: status -> (0 mur istegi var), (1 mur iptal), (2 cleaning), (3 cleaned)
#     # mur sayisi icin status = 0 ve 2 alacagim
#     mur_status_count_0_2 = RoomServiceMURData.objects.filter(Q(status='0') | Q(status='2')).count()
#     logger.debug(f"mur_status_count_0_2: {mur_status_count_0_2}")
#     # mur overdue (statusu 0 veya 2 olan veride isDelayed = 1 ise) ve in progress (statusu 0 veya 2 olan veride isDelayed = 0 ise) hesapla
#     mur_overdue_count = RoomServiceMURData.objects.filter(Q(status='0') | Q(status='2'),isDelayed="1").count()

#     mur_in_progress_count = RoomServiceMURData.objects.filter(Q(status='0') | Q(status='2'),isDelayed="0").count()

#     # lnd sayisi icin rcuhelvar verisi icinden lndActive sayalim
#     lnd_status_count_0_2 = RCUHelvarRouterData.objects.filter(lndActive='1').count()

#     # average responce time hesaplamak icin mur verisinin status=3 olanlarin requestResponceTime değerinin ortalamasını al, dakika cinsinden goster
#     records = RoomServiceMURData.objects.filter(status='3')
    
#     request_responce_total_time = timedelta()
#     service_responce_total_time = timedelta()
#     count_request_time = 0
#     count_service_time = 0
#     for record in records:
#         if record.requestResponceTime:
#             try:
#                 # Zaman damgasını timedelta'ya dönüştür
#                 time_delta = parse_time(record.requestResponceTime)
#                 request_responce_total_time += time_delta
#                 count_request_time += 1
#             except ValueError:
#                 # Hatalı değerleri yoksay
#                 continue
#         if record.serviceResponceTime:
#             try:
#                 # Zaman damgasını timedelta'ya dönüştür
#                 time_delta = parse_time(record.serviceResponceTime)
#                 service_responce_total_time += time_delta
#                 count_service_time += 1
#             except ValueError:
#                 # Hatalı değerleri yoksay
#                 continue

#     if count_request_time > 0:
#         # Toplam süreyi saniye cinsinden hesapla
#         average_time_seconds = request_responce_total_time.total_seconds() / count_request_time
#         # Ortalama süreyi dakika cinsinden hesapla
#         average_time_minutes = average_time_seconds / 60
#         average_request_responce_time = int(average_time_minutes) # hk oda temizliği bitirme saati - musteri request saati
#     else:
#         average_request_responce_time = 0
    
#     if count_service_time > 0:
#         # Toplam süreyi saniye cinsinden hesapla
#         average_time_seconds = service_responce_total_time.total_seconds() / count_service_time
#         # Ortalama süreyi dakika cinsinden hesapla
#         average_time_minutes = average_time_seconds / 60
#         average_request_service_time = int(average_time_minutes) # hk oda temizliği bitirme saati - hk oda temizligi baslama saati
#     else:
#         average_request_service_time = 0

#     dummy_dict =  {
#                 "murNumber": mur_status_count_0_2,
#                 "murOverdue": mur_overdue_count,
#                 "murInProgress": mur_in_progress_count,
#                 "lndNumber": lnd_status_count_0_2,
#                 "lndOverdue": -1,
#                 "lndInProgress": -1,
#                 "averageResponceTime": average_request_responce_time, # dakika
#                 "averageServiceTime": average_request_service_time, # dakika
#                 "dashboardReqResponceTimeUpperLimit": dashboardReqResponceTimeUpperLimit, # dakika
#                 "dashboardServiceResponceTimeUpperLimit": dashboardServiceResponceTimeUpperLimit # dakika
#     },

#     logger.debug(f"dummy_dict: {dummy_dict}")
#     return JsonResponse({"serviceRequest": dummy_dict})

# @csrf_exempt
# def getDashboardOccupancyRateData(request):
        
#     odaSayisi = BlokKatOdaData.objects.values('odaNumarasi').distinct().count()
#     logger.debug(f"odaSayisi: {odaSayisi}")

#     # Fidelio değeri 1 olan odaların numaralarını al (rented)
#     fidelio_1_oda_numaralari = MekanikData.objects.filter(fidelio='1').values_list('odaNumarasi', flat=True)
#     logger.debug(f"fidelio_1_oda_numaralari: {fidelio_1_oda_numaralari}")
    
#     # roomOccupied değeri 1 olan ve hkInroom degeri 0 olan odaların numaralarını al (occupancy)
#     musteri_odada = RCUHelvarRouterData.objects.filter(roomOccupied='1', hkInRoom = "0" ).values_list('odaNumarasi', flat=True)
#     logger.debug(f"musteri_odada: {musteri_odada}")
#     rented_and_occupied_oda_numaralari = set(fidelio_1_oda_numaralari).intersection(musteri_odada)
#     logger.debug(f"rented_and_occupied_oda_numaralari: {rented_and_occupied_oda_numaralari}")
#     # Kaç adet rented ve occupied oda olduğunu bul
#     rented_and_occupied_count = len(rented_and_occupied_oda_numaralari)
#     logger.debug(f"rented_and_occupied_count: {rented_and_occupied_count}")

#     # roomOccupied değeri 0 olan odaların numaralarını al (vacant)
#     roomOccupied_0_da_numaralari = RCUHelvarRouterData.objects.filter(roomOccupied='0').values_list('odaNumarasi', flat=True)

#     # roomOccupied=1 ve hkInRoom=1 olan oda numaralarını filtreleme
#     roomOccupied_1_ve_hkInRoom_1_da_numaralari = RCUHelvarRouterData.objects.filter(
#         Q(roomOccupied='1') & Q(hkInRoom='1')
#     ).values_list('odaNumarasi', flat=True)

#     # Her iki durumda da boş olan oda numaralarını birleştirme
#     bos_oda_numaralari = set(roomOccupied_0_da_numaralari).union(roomOccupied_1_ve_hkInRoom_1_da_numaralari)

#     # Boş ve kiralanmış odaların kesişimini bulma
#     rented_and_vacant_oda_numaralari = set(fidelio_1_oda_numaralari).intersection(bos_oda_numaralari)

#     logger.debug(f"rented_and_vacant_oda_numaralari: {rented_and_vacant_oda_numaralari}")

#     # Kaç adet rented ve vacant oda olduğunu bul
#     rented_and_vacant_count = len(rented_and_vacant_oda_numaralari)
#     logger.debug(f"rented_and_vacant_count: {rented_and_vacant_count}")

#     # Fidelio değeri 0 olan odaların numaralarını al (unrented)
#     fidelio_0_oda_numaralari = MekanikData.objects.filter(fidelio='0').count()
#     logger.debug(f"fidelio_0_oda_numaralari: {fidelio_0_oda_numaralari}")
#     dummy_dict =  {
#         "rentedOccupied": rented_and_occupied_count,
#         "rentedVacant": rented_and_vacant_count,
#         "odaSayisi": odaSayisi,
#         "unrented":fidelio_0_oda_numaralari
#     },

#     logger.debug(f"dummy_dict: {dummy_dict}")
#     return JsonResponse({"occupancyRate": dummy_dict})

# @csrf_exempt
# def getDashboardHVACStatusData(request):
        
#     on_onof_count = MekanikData.objects.filter(onOf='1').count()
#     of_onof_count = MekanikData.objects.filter(onOf='0').count()

#     odaSayisi = on_onof_count + of_onof_count
#     logger.debug(f"on_onof_count: {on_onof_count}, of_onof_count: {of_onof_count}, odaSayisi: {odaSayisi}")

#     heating_mode_count = MekanikData.objects.filter(onOf='1', mode='0').count()
#     cooling_mode_count = MekanikData.objects.filter(onOf='1', mode='1').count()
#     fan_mode_count = MekanikData.objects.filter(onOf='1', mode='2').count()
#     auto_mode_count = MekanikData.objects.filter(onOf='1', mode='3').count()
#     logger.debug(f"heating_mode_count: {heating_mode_count}, cooling_mode_count: {cooling_mode_count}, fan_mode_count: {fan_mode_count}, auto_mode_count:{auto_mode_count}")

#     dummy_dict =  {
#         "hvacCoolingNumber": cooling_mode_count + fan_mode_count + auto_mode_count,
#         "hvacHeatingNumber": heating_mode_count,
#         "hvacOffNumber": of_onof_count,
#         "odaSayisi": odaSayisi
#     },
#     logger.debug(f"dummy_dict: {dummy_dict}")
#     return JsonResponse({"hvacStatus": dummy_dict})

# @csrf_exempt
# def getTemperatureData(request):
    
#     global lat, lon

#     # OpenWeatherMap API key
#     api_key = 'efd4f5bf93258dc063ae4a5a703804dd'

#     url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    
#     try:
#         response = requests.get(url)
#         data = response.json()
    
#         if response.status_code == 200:
#             temperature = data['main']['temp']
#             logger.debug(f"temperature: {temperature}")

#             response_data = {
#                 'temperature': str(int(temperature))
#             }
#             logger.debug(f"response_data: {response_data}")
#             return JsonResponse(response_data)
#         else:
#             logger.debug(f"Temperature verisi almada bir hata olustu.")
#             response_data = {
#                 'temperature': "25"
#             }
#             logger.debug(f"response_data: {response_data}")
#             return JsonResponse(response_data)
#     except Exception as e:
#         logger.error(f"An error occurred: {e}")
#         return JsonResponse({'error': 'An error occurred while processing your request.'}, status=500)
    
# @csrf_exempt
# def getSeaTemperatureData(request):
    
#     global lat, lon

#     try:
#         conn = http.client.HTTPSConnection("sea-surface-temperature.p.rapidapi.com")

#         headers = {
#             'x-rapidapi-key': "feb012aad0mshf17432e0ab736e7p1a94e0jsn3ac3602fcbaf",
#             'x-rapidapi-host': "sea-surface-temperature.p.rapidapi.com"
#         }
        
#         conn.request("GET", f"/current?latlon={lat}%2C{lon}", headers=headers)

#         res = conn.getresponse()
#         data = res.read()

#         data_decoded = data.decode("utf-8")
#         logger.debug(f"data_decoded: {data_decoded}")

#         try:
#             # Parse JSON data
#             json_data = json.loads(data_decoded)

#             # Extract tempC values
#             tempC = json_data[0]["tempC"]
#             date = json_data[0]["date"]

#             logger.debug(f"date: {date}, sea tempC: {tempC}")

#             response_data = {
#                 'seaTemperature': str(int(tempC))
#             }
#         except (KeyError, IndexError, json.JSONDecodeError) as e:
#             logger.error(f"Error extracting temperature data: {e}")
#             response_data = {
#                 'seaTemperature': "25"
#             }

#     except Exception as e:
#         logger.error(f"Error connecting to API: {e}")
#         response_data = {
#             'seaTemperature': "25"
#         }

#     logger.debug(f"response_data: {response_data}")
#     return JsonResponse(response_data)
        
# @csrf_exempt
# def getRoomStatusData(request, blokNumarasi, katNumarasi):
        
#     logger.debug(f"blokNumarasi={blokNumarasi}, katNumarasi={katNumarasi}")

#     blokkatodaInstance = BlokKatOda.objects.filter(blokNumarasi=blokNumarasi).first()

#     # Eğer sonuç varsa, isGenelMahal değerini al
#     if blokkatodaInstance:
#         isGenelMahal = blokkatodaInstance.isGenelMahal
#     else:
#         isGenelMahal = None  # Veya varsayılan bir değer döndürebilirsiniz

#     # Filtreleme işlemi
#     blokKatOdaDataInstance = BlokKatOdaData.objects.filter(
#         blokKatOda__blokNumarasi=blokNumarasi,  # blokKatOda'dan blokNumarasi'ni kullanıyoruz
#         katNumarasi=katNumarasi                 # ve katNumarasi'ne göre filtreliyoruz
#     )

#     # logger.debug(f"blokKatOdaDataInstance: {blokKatOdaDataInstance}, BlokKatOdaData_instance_len: {len(blokKatOdaDataInstance)}")

#     room_status_data = []
#     rented_occupied_number, rented_hk_number, rented_vacant_number, unrented_hk_number, unrented_vacant_number, malfunction_number = 0,0,0,0,0,0
#     try:
#         for instance in blokKatOdaDataInstance.iterator():
#             odaNumarasi = instance.odaNumarasi
#             logger.debug(f"odaNumarasi: {odaNumarasi}")

#             MekanikData_instance = MekanikData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
#             logger.debug(f"MekanikData_instance: {MekanikData_instance}")

#             isHvacActive = "0"
#             # print(f"getRoomStatusData hvac onOf: {MekanikData_instance.onOf}")
#             if MekanikData_instance.onOf == "1": # hvac on
#                 if MekanikData_instance.mode == "0": # tridiumdan gelen veri heat ise 
#                     isHvacActive = "2" # hvac heating 
#                 elif MekanikData_instance.mode == "1": # tridiumdan gelen veri cool ise
#                     isHvacActive = "1" # hvac cooling
#                 elif MekanikData_instance.mode == "2": # tridiumdan gelen veri Fan Only ise
#                     isHvacActive = "1" # hvac cooling
#                 elif MekanikData_instance.mode == "3": # tridiumdan gelen veri Auto ise
#                     isHvacActive = "1" # hvac cooling
#                 else: pass
#             elif MekanikData_instance.onOf == "0": # hvac of 
#                 isHvacActive = "0" # hvac kapali
#             else: logger.debug("Error MekanikData_instance.onOf")
#             # print(f"getRoomStatusData isHvacActive: {isHvacActive}")

#             RCUData_instance = RCUHelvarRouterData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
#             # print(f"getRoomStatusData RCUData_instance: {RCUData_instance}")

#             anyLightingActive = "0" # oda icerisinde herhangi bir armatur aktif degil
#             for oDevice in RCUData_instance.outputDevices:
#                 if oDevice["name"] != "":
#                     if int(oDevice["actualLevel"]) != 0:
#                         anyLightingActive = "1"
#                         break

#             dndActive = "0" # oda icerisinde DND aktif degil
#             if RCUData_instance.dndActive == "0":
#                 dndActive = "0" 
#             elif RCUData_instance.dndActive == "1":
#                 dndActive = "1" # oda icerisinde herhangi bir DND aktif degil
#             else: logger.debug("Error RCUData_instance.dndActive")
#             # print(f"getRoomStatusData dndActive: {dndActive}")
            
#             lndActive = "0" # oda icerisinde Lnd aktif degil
#             if RCUData_instance.lndActive == "0":
#                 lndActive = "0" 
#             elif RCUData_instance.lndActive == "1":
#                 lndActive = "1" # oda icerisinde herhangi bir Lnd aktif degil
#             else: logger.debug("Error RCUData_instance.lndActive")
#             # print(f"getRoomStatusData lndActive: {lndActive}")

#             murActive = "0" # oda icerisinde Lnd aktif degil
#             isMurDelayed = "0"
#             if RCUData_instance.murActive == "0":
#                 murActive = "0" 
#             elif RCUData_instance.murActive == "1":
#                 murActive = "1" # oda icerisinde herhangi bir Lnd aktif degil
#                 room_service_mur_data_instance = RoomServiceMURData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status__in = ["0", "2"])
#                 isMurDelayed = room_service_mur_data_instance.isDelayed
#             else: logger.debug("Error RCUData_instance.murActive")
#             # print(f"getRoomStatusData murActive: {murActive}")
            
#             # room status: roomState
#             roomStateErrorList = []
#             roomState = "0"

#             statusError = "0"
#             # outputDevices listesinde dolaşarak status kontrolü yapma
#             for device in RCUData_instance.outputDevices:
#                 if device["status"] != "No":
#                     statusError = "1"
#                     break  # "1" ayarlandığında döngüden çık

#             if MekanikData_instance.fidelio == "0" and RCUData_instance.roomOccupied == "0" and RCUData_instance.hkInRoom == "0": # unrented and vacant
#                 roomState = "0"
#                 c = 0
#                 if MekanikData_instance.comError == "1":
#                     roomState = "7"
#                     roomStateErrorList.append("HVAC Error")
#                     c += 1
#                 if RCUData_instance.comError == "1":
#                     roomState = "7"
#                     roomStateErrorList.append("Controller Error")
#                     c += 1
#                 if RCUData_instance.doorOpen == "1":
#                     roomState = "7"
#                     roomStateErrorList.append("Emergency: Door Open")
#                     c += 1
#                 if statusError == "1":
#                     roomState = "7"
#                     roomStateErrorList.append("Lighting Error")
#                     c += 1
#                 if c == 0:
#                     unrented_vacant_number += 1 
#             if MekanikData_instance.fidelio == "0" and RCUData_instance.hkInRoom == "1": # unrented and hk
#                 roomState = "1"
#                 c = 0
#                 if MekanikData_instance.comError == "1":
#                     roomState = "8"
#                     roomStateErrorList.append("HVAC Error")
#                     c += 1
#                 if RCUData_instance.comError == "1":
#                     roomState = "8"
#                     roomStateErrorList.append("Controller Error")
#                     c += 1
#                 if RCUData_instance.doorOpen == "1":
#                     roomState = "8"
#                     roomStateErrorList.append("Emergency: Door Open")
#                     c += 1
#                 if statusError == "1":
#                     roomState = "8"
#                     roomStateErrorList.append("Lighting Error")
#                     c += 1
#                 if c == 0:
#                     unrented_hk_number += 1 
#             if MekanikData_instance.fidelio == "1" and RCUData_instance.roomOccupied == "0" and RCUData_instance.hkInRoom == "0": # rented and vacant
#                 roomState = "2"
#                 c = 0
#                 if MekanikData_instance.comError == "1":
#                     roomState = "5"
#                     roomStateErrorList.append("HVAC Error")
#                     c += 1
#                 if RCUData_instance.comError == "1":
#                     roomState = "5"
#                     roomStateErrorList.append("Controller Error")
#                     c += 1
#                 if RCUData_instance.doorOpen == "1":
#                     roomState = "5"
#                     roomStateErrorList.append("Emergency: Door Open")
#                     c += 1
#                 if statusError == "1":
#                     roomState = "5"
#                     roomStateErrorList.append("Lighting Error")
#                     c += 1
#                 if c == 0:
#                     rented_vacant_number += 1 
#             if MekanikData_instance.fidelio == "1" and RCUData_instance.roomOccupied == "1" and RCUData_instance.hkInRoom == "0": # rented and musteri
#                 roomState = "3"
#                 c = 0
#                 if MekanikData_instance.comError == "1":
#                     roomState = "6"
#                     roomStateErrorList.append("HVAC Error")
#                     c += 1
#                 if RCUData_instance.comError == "1":
#                     roomState = "6"
#                     roomStateErrorList.append("Controller Error")
#                     c += 1
#                 if RCUData_instance.doorOpen == "1":
#                     roomState = "6"
#                     roomStateErrorList.append("Emergency: Door Open")
#                     c += 1
#                 if statusError == "1":
#                     roomState = "6"
#                     roomStateErrorList.append("Lighting Error")
#                     c += 1
#                 if c == 0:
#                     rented_occupied_number += 1 
#             if MekanikData_instance.fidelio == "1" and RCUData_instance.hkInRoom == "1": # rented and hk
#                 roomState = "4"
#                 c = 0
#                 if MekanikData_instance.comError == "1":
#                     roomState = "8"
#                     roomStateErrorList.append("HVAC Error")
#                     c += 1
#                 if RCUData_instance.comError == "1":
#                     roomState = "8"
#                     roomStateErrorList.append("RCU Hatası")
#                     c += 1
#                 if RCUData_instance.doorOpen == "1":
#                     roomState = "8"
#                     roomStateErrorList.append("Emergency: Door Open")
#                     c += 1
#                 if statusError == "1":
#                     roomState = "8"
#                     roomStateErrorList.append("Lighting Error")
#                     c += 1
#                 if c == 0:
#                     rented_hk_number += 1 

#             dummy_dict = {
#                 "odaNumarasi": odaNumarasi,
#                 "roomStateErrorList": roomStateErrorList,
#                 "roomStatus": {
#                     "isAnyLightingActive": anyLightingActive,
#                     "isHvacActive": isHvacActive,
#                     "isDndActive": dndActive,
#                     "isLndActive": lndActive,
#                     "isMurActive": murActive,
#                     "isLndDelayed": "0",
#                     "isMurDelayed": isMurDelayed,
#                     "roomState": roomState,
#                     "isHVACConnected": instance.isHVACConnected, # HVAC fiziksel olarak var mi, yoksa frontend de gosterilmeyecek
#                     "isLightingConnedted": "1" if instance.isRCUConnected == "1" or instance.isHelvarConnected == "1" else "0", # rcu yada helvar fiziksel olarak var mi, yoksa frontend de gosterilmeyecek
#                     "isHKServiceConnected": instance.isHKServiceConnected, # hk servisi saglaniyor mu, yoksa frontendede gosterilmeyecek
#                 }
#             }
#             # logger.debug(f"dummy_dict: {dummy_dict}")
#             room_status_data.append(dummy_dict) # blok ve kat icin room status data
#         # logger.debug(f"room_status_data: {room_status_data}")

#         malfunction_number = len(blokKatOdaDataInstance) - (rented_occupied_number + rented_hk_number + rented_vacant_number + unrented_hk_number + unrented_vacant_number) 
#         list_roomStateNumber = [str(rented_occupied_number), str(rented_hk_number), str(rented_vacant_number), str(unrented_hk_number), str(unrented_vacant_number), str(malfunction_number)]
#     except MekanikData.DoesNotExist or RCUHelvarRouterData.DoesNotExist:
#         logger.debug(f"not found for blokNumarasi={blokNumarasi}, katNumarasi={katNumarasi}")
    
#     return JsonResponse({ "roomStatusData": room_status_data, "roomStateNumber": list_roomStateNumber, "isGenelMahal":isGenelMahal})

# @csrf_exempt
# def getReportsData(request, dateRange, reportName):
#     logger.debug(f"dateRange: {dateRange}, reportName: {reportName}")

#     # dateRange formatı: 'Sun Jun 30 2024 00:00:00 GMT+0300 (GMT+03:00),Wed Jul 03 2024 00:00:00 GMT+0300 (GMT+03:00)'
#     start_date_str, end_date_str = dateRange.split(',')
#     end_date_str = end_date_str[:-1]  # En sonda istenmeyen '}' karakteri varsa temizleme
#     logger.debug(f"start_date_str: {start_date_str}, end_date_str: {end_date_str}")

#     # Zaman dilimi bilgisini çıkartma
#     start_date_clean = start_date_str.split(' GMT')[0]
#     end_date_clean = end_date_str.split(' GMT')[0]
#     logger.debug(f"start_date_clean: {start_date_clean}, end_date_clean: {end_date_clean}")

#     # Tarih formatlarını datetime nesnesine çevirme
#     start_date = datetime.strptime(start_date_clean, "%a %b %d %Y %H:%M:%S")
#     end_date = datetime.strptime(end_date_clean, "%a %b %d %Y %H:%M:%S")
#     logger.debug(f"start_date: {start_date}, end_date: {end_date}")

#     next_day = end_date + timedelta(days=1)

#     reportsData = []
#     if "alarmReport" in reportName:

#         # AlarmsData'dan alarmStartTime, start_date ve end_date arasında olan verileri çekme
#         alarms = AlarmsData.objects.filter(alarmStartTime__gte=start_date, alarmStartTime__lte=next_day)

#         for alarm in alarms:
#             alarm_data = {
#                 "blokNumarasi": alarm.blokNumarasi,
#                 "katNumarasi": alarm.katNumarasi,
#                 "odaNumarasi": alarm.odaNumarasi,
#                 "alarmType": alarm.alarmType,
#                 "alarmStatus": alarm.alarmStatus,
#                 "rcuAlarmDetails": alarm.rcuAlarmDetails["ip"] if alarm.rcuAlarmDetails else [],
#                 "helvarAlarmDetails": alarm.helvarAlarmDetails,
#                 "hvacAlarmDetails": alarm.hvacAlarmDetails,
#                 "lightingAlarmDetails": alarm.lightingAlarmDetails,
#                 "doorSystAlarmDetails": alarm.doorSystAlarmDetails,
#                 "alarmStartTime": (alarm.alarmStartTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if alarm.alarmStartTime else "",
#                 "alarmEndTime": (alarm.alarmEndTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if alarm.alarmEndTime else "",
#                 "ackStatus": alarm.ackStatus,
#                 "ackTime": (alarm.ackTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if alarm.ackTime else "",
#             }
#             reportsData.append(alarm_data)
#     elif "serviceReport" in reportName:
#         services = RoomServiceMURData.objects.filter(customerRequestTime__gte=start_date, customerRequestTime__lte=next_day)

#         for service in services:
#             service_data = {
#                 "blokNumarasi": service.blokNumarasi,
#                 "katNumarasi": service.katNumarasi,
#                 "odaNumarasi": service.odaNumarasi,
#                 "status": service.status,
#                 "customerRequest": service.customerRequest,
#                 "customerRequestTime": (service.customerRequestTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if service.customerRequestTime else "",
#                 "serviceStartTime": (service.serviceStartTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if service.serviceStartTime else "",
#                 "serviceEndTime": (service.serviceEndTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if service.serviceEndTime else "",
#                 "serviceResponceTime": service.serviceResponceTime,
#                 "requestResponceTime": service.requestResponceTime,
#                 "employee": service.employee,
#                 "ackStatus": service.ackStatus,
#                 "ackTime": (service.ackTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if service.ackTime else "",
#                 "isDelayed": service.isDelayed,
#             }
#             reportsData.append(service_data)

#     logger.debug(f"reportsData: {reportsData}")
#     return JsonResponse({"reportsData": reportsData})

# @csrf_exempt
# def setEventsMURLNDDNDRoomOccupiedOpenDoor(request):
#     # logger.debug(f"request.method: {request.method}")
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)[0]
#             logger.debug(f"data: {data}")

#             blokNumarasi = data.get("blokNumarasi")
#             katNumarasi = data.get("katNumarasi")
#             odaNumarasi = data.get("odaNumarasi")
#             mur = data.get("murActive")
#             lnd = data.get("lndActive")
#             dnd = data.get("dndActive")
#             hkInRoom = data.get("hkInRoom")
#             roomOccupied = data.get("roomOccupied")
#             doorOpen = data.get("doorOpen")

#             record = RCUHelvarRouterData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)

#             if record:
#                 if mur != "-1":
#                     record.murActive = mur
#                 if lnd != "-1":
#                     record.lndActive = lnd
#                 if dnd != "-1":
#                     record.dndActive = dnd
#                 if hkInRoom != "-1":
#                     record.hkInRoom = hkInRoom
#                 if roomOccupied != "-1":
#                     record.roomOccupied = roomOccupied
#                 if doorOpen != "-1":
#                     record.doorOpen = doorOpen
#                 # Kaydet
#                 record.save()
                
#                 logger.info("Veriler başarıyla güncellendi")
#                 return JsonResponse({'setEventsMURLNDDNDRoomOccupiedOpenDoor': True}, status=200)
#             else:
#                 logger.warning("setEventsMURLNDDNDRoomOccupiedOpenDoor: Kayıt bulunamadı")
#                 return JsonResponse({'error': 'No records found to update'}, status=404)

#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
#     else:
#         # Geçersiz metod durumu (örneğin GET isteği)
#         return JsonResponse({'error': 'Unsupported method'}, status=405)

# @csrf_exempt
# def updateRCUModbusTermostatT9600Data(request):
#     logger.debug(f"request.method: {request.method}")
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)[0]
#             logger.debug(f"data: {data}")

#             blokNumarasi = data.get("blokNumarasi")
#             katNumarasi = data.get("katNumarasi")
#             odaNumarasi = data.get("odaNumarasi")
#             fanMode = data.get("fanMode")
#             mode = data.get("mode")
#             onOf = data.get("onOf")
#             runningstatus = data.get("runningstatus")
#             setPoint = data.get("setPoint")
#             roomTemperature = data.get("roomTemperature")  
#             keylockFunction = data.get("keylockFunction")  
#             occupancyInput = data.get("occupancyInput")  
#             lowerSetpoint = data.get("lowerSetpoint")  
#             upperSetpoint = data.get("upperSetpoint")  
#             confortTemperature = data.get("confortTemperature")  

#             record = MekanikData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)

#             if record:
#                 if fanMode != "-1":
#                     record.fanMode = fanMode
#                 if mode != "-1":
#                     record.mode = mode
#                 if onOf != "-1":
#                     record.onOf = onOf
#                 if runningstatus != "-1":
#                     record.runningstatus = runningstatus
#                 if setPoint != "-1":
#                     record.setPoint = setPoint
#                 if roomTemperature != "-1":
#                     record.roomTemperature = roomTemperature
#                 if keylockFunction != "-1":
#                     record.keylockFunction = keylockFunction
#                 if occupancyInput != "-1":
#                     record.occupancyInput = occupancyInput
#                 if lowerSetpoint != "-1":
#                     record.lowerSetpoint = lowerSetpoint
#                 if upperSetpoint != "-1":
#                     record.upperSetpoint = upperSetpoint
#                 if confortTemperature != "-1":
#                     record.confortTemperature = confortTemperature
                    
#                 # Kaydet
#                 record.save()
                
#                 logger.info("Veriler başarıyla güncellendi")
#                 return JsonResponse({'updateRCUModbusTermostatT9600Data': True}, status=200)
#             else:
#                 logger.warning("updateRCUModbusTermostatT9600Data: Kayıt bulunamadı")
#                 return JsonResponse({'error': 'No records found to update'}, status=404)

#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
#     else:
#         # Geçersiz metod durumu (örneğin GET isteği)
#         return JsonResponse({'error': 'Unsupported method'}, status=405)
    
# @csrf_exempt
# def setControllerInitialInformationToDB(request):
#     # logger.debug(f"request.method: {request.method}")
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)[0]
#             logger.debug(f"data: {data}")

#             blokNumarasi = data["blokNumarasi"]
#             katNumarasi = data["katNumarasi"]
#             odaNumarasi = data["odaNumarasi"]

#             deviceType = data["deviceType"]
#             ip = data["ip"]
#             comError = data["comError"]
#             roomOccupied = data["roomOccupied"]
#             dndActive = data["dndActive"]
#             lndActive = data["lndActive"]
#             murActive = data["murActive"]
#             hkInRoom = data["hkInRoom"]
#             doorOpen = data["doorOpen"]
#             # RCUHelvarRouterData modelinden veriyi çek
#             try:
#                 instance = RCUHelvarRouterData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
#                 instance.deviceType = deviceType
#                 instance.comError = comError
#                 instance.ip = ip
#                 instance.roomOccupied = roomOccupied
#                 instance.dndActive = dndActive
#                 instance.lndActive = lndActive
#                 instance.murActive = murActive
#                 instance.hkInRoom = hkInRoom
#                 instance.doorOpen = doorOpen
#                 instance.outputDevices = data.get("list_controller_initial_information", [])
#                 instance.save()
#                 logger.info("Output devices saved to database.")
#                 return JsonResponse({'setControllerInitialInformationToDB': True}, status=200)

#             except RCUHelvarRouterData.DoesNotExist:
#                 return JsonResponse({'error': 'Instance not found for the given IP'}, status=404)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
#     else:
#         # Geçersiz metod durumu (örneğin GET isteği)
#         return JsonResponse({'error': 'Unsupported method'}, status=405)

# @csrf_exempt
# def setControllerComError(request):
#     # logger.debug(f"request.method: {request.method}")
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)[0]
#             logger.debug(f"data: {data}")

#             blokNumarasi = data["blokNumarasi"]
#             katNumarasi = data["katNumarasi"]
#             odaNumarasi = data["odaNumarasi"]

#             # RCUHelvarRouterData modelinden veriyi çek
#             try:
#                 instance = RCUHelvarRouterData.objects.get(blokNumarasi = blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
#                 instance.comError = "1"
#                 instance.save()
#                 logger.debug(f"blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi,} comError: 1")
#                 return JsonResponse({'setControllerComError': True}, status=200)

#             except RCUHelvarRouterData.DoesNotExist:
#                 return JsonResponse({'error': 'Instance not found'}, status=404)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
#     else:
#         # Geçersiz metod durumu (örneğin GET isteği)
#         return JsonResponse({'error': 'Unsupported method'}, status=405)
    
# @csrf_exempt
# def setOutputDeviceActualLevel(request):
#     logger.debug(f"request.method: {request.method}")
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)[0]
#             logger.debug(f"data: {data}")

#             ip = data["ip"]
#             # RCUHelvarRouterData modelinden veriyi çek
#             try:
#                 instance = RCUHelvarRouterData.objects.get(ip=ip)
#                 logger.debug(f"instance: {instance}")
#                 outputDevices = instance.outputDevices
#                 logger.debug(f"outputDevices: {outputDevices}")
                
#                 if len(outputDevices) == 0: # eger bossa
#                     logger.debug("Output devices are empty")
#                     instance.outputDevices = data.get("list_address_actual_level", [])
#                     instance.save()
#                     logger.info("Output devices saved to database.")
#                     return JsonResponse({'setOutputDeviceActualLevel': True}, status=200)

#                 else:
#                     list_new_device = []
#                     for device in outputDevices:
#                         logger.debug(f"device: {device}")
#                         desired_address = device["address"]
#                         changed_actual_level = find_actual_level(data, desired_address)

#                         if changed_actual_level is not None:
#                             logger.debug(f"Address {desired_address} için actual Level değeri: {changed_actual_level}")
#                             device["actualLevel"] = changed_actual_level
#                         else:
#                             logger.debug(f"Adres {desired_address} bulunamadi.")

#                         list_new_device.append(device)

#                     logger.debug(f"list_new_device: {list_new_device}")

#                     # Güncellenecek veriyi hazırla
#                     updated_data = {"outputDevices": list_new_device}
#                     serializer = RCUHelvarRouterDataSerializer(instance, data=updated_data, partial=True)
                    
#                     if serializer.is_valid():
#                         serializer.save()
#                         print("setOutputDeviceActualLevel Veri alani başariyla güncellendi.")
#                         # JSON formatında serialize edilmiş veriyi al
#                         # serialized_data = JSONRenderer().render(serializer.data)
#                         # print(serialized_data)
#                         return JsonResponse({'setOutputDeviceActualLevel': True}, status=200)
#                     else:
#                         print("setOutputDeviceActualLevel Veri doğrulamasi başarisiz:", serializer.errors)
#                         return JsonResponse(serializer.errors, status=400)              
#             except RCUHelvarRouterData.DoesNotExist:
#                 return JsonResponse({'error': 'Instance not found for the given IP'}, status=404)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
#     else:
#         # Geçersiz metod durumu (örneğin GET isteği)
#         return JsonResponse({'error': 'Unsupported method'}, status=405)

# @csrf_exempt
# def getOnboardOutputAddress(request):
#     print(f"request.method: {request.method}")
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             print("getOnboardOutputAddress data: ", data)

#             ip = data["ip"]
#             list_onboard_event_input_address = data["onboard_event_input_address"]
#             # RCUHelvarRouterData modelinden veriyi çek
#             try:
#                 instance = RCUHelvarRouterData.objects.get(ip=ip)
                
#                 # onboardInputDevices içinde address'e göre arama yaparak groupSettings'i bul
#                 onboard_input_devices = instance.onboardInputDevices
#                 print(f"onboard_input_devices: {onboard_input_devices}")
                
#                 list_onboard_input_group_settings = []
#                 for in_device in onboard_input_devices:
#                     if in_device.get('address') in list_onboard_event_input_address:
#                         print(f"Device is found: {in_device}")
#                         list_onboard_input_group_settings = list_onboard_input_group_settings + in_device["groupSettings"]
#                 print(f"list_onboard_input_group_settings: {list_onboard_input_group_settings}")

#                 onboard_output_devices = instance.onboardOutputDevices
#                 list_onboard_output_address = []
#                 for out_device in onboard_output_devices:
#                     for out_device_group in out_device["groupSettings"]:
#                         if out_device_group in list_onboard_input_group_settings:
#                             if out_device["address"] not in list_onboard_output_address:
#                                 list_onboard_output_address.append(out_device["address"])
#                 print(f"list_onboard_output_address: {list_onboard_output_address}")

#                 if len(list_onboard_output_address) != 0:
#                     return JsonResponse({'onboardOutputAddress': list_onboard_output_address})
#                 else:
#                     return JsonResponse({'onboardOutputAddress': []})
            
#             except RCUHelvarRouterData.DoesNotExist:
#                 return JsonResponse({'error': 'Instance not found for the given IP'}, status=404)
            
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
    
#     return JsonResponse({'error': 'Unsupported method'}, status=405)
    
# """ @csrf_exempt
# def setOnboardTargetLevel(request):
#     try:
#         logger.info("setOnboardTargetLevel")
#         response = setOnboardTargetLevelTask.delay('10.11.10.115', 5556)
#         logger.info(f"setOnboardTargetLevel response: {response}")
#         if response == True:
#             logger.info("setOnboardTargetLevel islem gerceklesi")
#             return JsonResponse({'done': 'islem gerceklesi'}, status=200)
#         else:
#             logger.error("setOnboardTargetLevel hata olustu")
#             return JsonResponse({'error': 'hata olustu'}, status=405)
#     except Exception as e:
#         logger.error(f"Exception in setOnboardTargetLevel view: {e}")
#         return HttpResponse("Done") """

# def getData(request, odaNumarasi):
#     print("---------------------------getData")

#     # operations
#     url = f"http://localhost:3000/mekanik/getdata/{odaNumarasi}"
#     response = requests.get(url)
#     if response.status_code == 200:
#         print("Alinan veri:", response.json())
#     else:
#         print("Veri alinmadi. Hata kodu:", response.status_code)
#     return HttpResponse("getData Done")

# def getRoomStatusHVACData(request, blokNumarasi, katNumarasi, odaNumarasi):
#         print(f"getRoomStatusHVACData: blokNumarasi={blokNumarasi}, katNumarasi={katNumarasi}, odaNumarasi={odaNumarasi}")

#         # Initialize an empty dictionary to store results
#         room_data = {}

#         try:
#             # Query MekanikData objects based on blokNumarasi, katNumarasi, and odaNumarasi
#             mekanik_data = MekanikData.objects.get(
#                 blokNumarasi=blokNumarasi,
#                 katNumarasi=katNumarasi,
#                 odaNumarasi=odaNumarasi
#             )

#             # Populate the dictionary with other fields
#             room_data = {
#                 'onOf': mekanik_data.onOf,
#                 'roomTemperature': mekanik_data.roomTemperature,
#                 'setPoint': mekanik_data.setPoint,
#                 'mode': mekanik_data.mode,
#                 'fanMode': mekanik_data.fanMode,
#                 'confortTemperature': mekanik_data.confortTemperature,
#                 'lowerSetpoint': mekanik_data.lowerSetpoint,
#                 'upperSetpoint': mekanik_data.upperSetpoint,
#                 'keylockFunction': mekanik_data.keylockFunction,
#                 'occupancyInput': mekanik_data.occupancyInput,
#                 'runningstatus': mekanik_data.runningstatus,
#                 'comError': mekanik_data.comError
#             }

#         except MekanikData.DoesNotExist:
#             print(f"getRoomStatusHVACData not found for blokNumarasi={blokNumarasi}, katNumarasi={katNumarasi}, odaNumarasi={odaNumarasi}")
#             # Handle the case where no data is found, e.g., return None or raise an exception

#         # Print or return the dictionary
#         print("HVAC Modal Data:", room_data)
        
#         return JsonResponse({"odaNumarasi": odaNumarasi, "roomStatusHVACData": room_data})

# # @csrf_exempt
# # def putRoomStatusHVACData(request, blokNumarasi, katNumarasi, odaNumarasi):
    
# #     logger.debug(f"putRoomStatusHVACData blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}")
    
# #     try:
# #         instance = MekanikData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
# #     except MekanikData.DoesNotExist:
# #         return JsonResponse({"error": "Instance not found"}, status=status.HTTP_404_NOT_FOUND)
    
# #     logger.debug(f"putRoomStatusHVACData: request.body: {request.body}")
# #     try:
# #         request_data = json.loads(request.body)
# #     except json.JSONDecodeError:
# #         return JsonResponse({"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST)

# #     request_data["blokNumarasi"] = instance.blokNumarasi
# #     request_data["katNumarasi"] = instance.katNumarasi
# #     request_data["odaNumarasi"] = instance.odaNumarasi

# #     serializer = MekanikDataSerializer(instance, data=request_data)
# #     if serializer.is_valid():
# #         serializer.save()
# #         return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
# #     return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @csrf_exempt
# def putRoomStatusHVACData(request, blokNumarasi, katNumarasi, odaNumarasi):
#     """
#         modbus eklentisi icin yapildi
#     """
#     logger.debug(f"putRoomStatusHVACData blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}")
    
#     # Mevcut instance'ı al veya 404 döndür
#     try:
#         instance = MekanikData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
#     except MekanikData.DoesNotExist:
#         return JsonResponse({"error": "Instance not found"}, status=status.HTTP_404_NOT_FOUND)
    
#     try:
#         request_data = json.loads(request.body)
#         logger.debug(f"putRoomStatusHVACData: request_data: {request_data}")
#     except json.JSONDecodeError:
#         return JsonResponse({"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST)
    
#     # Gelen veri ile veritabanındaki veriyi karşılaştırarak yalnızca değişiklikleri sakla
#     updated_data = {}
#     for field, new_value in request_data.items():
#         current_value = getattr(instance, field, None)
#         if str(current_value) != str(new_value):  # Karakter string karşılaştırması yapılır
#             updated_data[field] = new_value  # Değişiklik varsa updated_data'ya ekle
    
#     # updated_data'yi ekrana bastır
#     logger.debug(f"putRoomStatusHVACData: Updated fields (only changes): {updated_data}")
    
#     # Eğer güncellenecek alan yoksa
#     if not updated_data:
#         return JsonResponse({"message": "No changes detected"}, status=status.HTTP_200_OK)
    
#     else:
#         # Yalnızca değişen alanları güncelle
#         for field, value in updated_data.items():
#             setattr(instance, field, value)
        
#         if setRCUModbus.delay(blokNumarasi, katNumarasi, odaNumarasi, updated_data):
#             logger.debug(f"putRoomStatusHVACData: rcu ya modbus verisi gonderildi")
#         # Güncellemeyi kaydet
#         instance.save()
        
#         # Güncellenmiş veriyi döndür
#         return JsonResponse({"message": "Data updated successfully", "updated_fields": updated_data}, status=status.HTTP_200_OK)

# @csrf_exempt
# def putControllerActualLevelData(request, blokNumarasi, katNumarasi, odaNumarasi, ip):
    
#     logger.info(f"blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, ip: {ip}")
        
#     try:
#         data = json.loads(request.body)
#         logger.info(f"data: {data}")
#         # Burada JSON verisini işleyip gerekli işlemleri yapabilirsiniz
#         # İşlem başarılıysa:
#         address = data["address"]
#         actualLevel = data["actualLevel"]
#         setControllerActualLevelResult = setControllerActualLevel.delay(ip, address, actualLevel).get(timeout=100)
#         logger.info(f"setControllerActualLevelResult: {setControllerActualLevelResult}")

#         if setControllerActualLevelResult:
#             logger.info(f"ip: {ip } address: {address}, actualLevel: {actualLevel} verisi cihaza gonderildi.")
#             instance = RCUHelvarRouterData.objects.get( blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
                
#             # outputDevices'ı güncelle
#             output_devices = instance.outputDevices
#             updated = False
#             for device in output_devices:
#                 if device.get("address") == str(address):
#                     device["actualLevel"] = str(actualLevel)
#                     updated = True
#                     break

#             if updated:
#                 # Güncellenmiş outputDevices'ı kaydet
#                 instance.outputDevices = output_devices
#                 instance.save()
#                 return JsonResponse({"message": "Data processed successfully"}, status=status.HTTP_200_OK)
#             else:
#                 return JsonResponse({"error": "Address not found in outputDevices"}, status=404)
#         else:
#             return JsonResponse({"error": "Address not found in outputDevices"}, status=404)
        
#     except json.JSONDecodeError:
#         return JsonResponse({"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST)

# @csrf_exempt
# def getRoomStatusOutputDeviceData(request, blokNumarasi, katNumarasi, odaNumarasi):
#     logger.info(f"blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}")
    
#     # Veritabanından veri alma
#     room_data = get_object_or_404(RCUHelvarRouterData, blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)

#     try:
#         # Verileri al
#         output_devices = room_data.outputDevices

#         # Filtreleme işlemi
#         filtered_devices = [
#             device for device in output_devices
#             if device["actualLevel"] != "" and device["name"] != ""
#         ]

#         response_data = {
#             "blokNumarasi": room_data.blokNumarasi,
#             "katNumarasi": room_data.katNumarasi,
#             "odaNumarasi": room_data.odaNumarasi,
#             "deviceType": room_data.deviceType,
#             "ip": room_data.ip,
#             "outputDevices": filtered_devices
#         }
            
#         logger.debug(f"getRoomStatusOutputDeviceData: {response_data}")
#         return JsonResponse(response_data)
    
#     except Exception as e:
#         logger.error(f"An error occurred: {e}")
#         return JsonResponse({'error': 'An error occurred while processing your request.'}, status=500)

# @csrf_exempt   
# def getDataFromServer(request, odaNumarasi):
#     """
#         tridium serverdan get ediyor
#     """
#     logger.info(f"getDataFromServer: odaNumarasi: {odaNumarasi}")
#     if odaNumarasi is not None:
#         queryset = MekanikData.objects.filter(odaNumarasi=odaNumarasi)

#     serializer = MekanikDataSerializer(queryset, many=True)
#     logger.info(f"getDataFromServer data: {serializer.data[0]}")
#     return JsonResponse(serializer.data[0])


# class ModelViewSetAdi(viewsets.ViewSet):

#     """ def list(self, request, odaNumarasi):
#         logger.debug(f"MekanikData: odaNumarasi: {odaNumarasi}")
#         print("List function is called.")
#         if odaNumarasi is not None:
#             queryset = MekanikData.objects.filter(odaNumarasi=odaNumarasi)

#         serializer = MekanikDataSerializer(queryset, many=True)
#         print("ModelViewSetAdi -> list -> {}".format(serializer.data))
#         return Response(serializer.data[0]) """
    
#     def putDataFromTridiumToDB(self, request, blokNumarasi, katNumarasi, odaNumarasi):
#         logger.info(f"putDataFromTridiumToDB: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}")
#         instance = MekanikData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi).first()
#         # print("instance: ", instance)
#         if not instance:
#             return Response(status=status.HTTP_404_NOT_FOUND)
#         logger.info(f"request.data: {request.data}")

#         # com error
#         com_error = request.data.get("comError", None)
#         if com_error == "1": # com Error var
#             logger.info("hvac comError")
#             if instance.comError == "0":
#                 logger.info("hvac comError 0 di")
#                 # Create a mock request for updateAlarmsData
#                 data = json.dumps([{
#                     'blokNumarasi': blokNumarasi,
#                     'katNumarasi': katNumarasi,
#                     'odaNumarasi': odaNumarasi,
#                     'alarmType': 'HVAC',
#                     'alarmStatus': '1'
#                 }])
#                 # Call updateAlarmsData with a mock request object
#                 class MockRequest:
#                     def __init__(self, body):
#                         self.body = body
#                         self.method = 'POST'
#                         self.content_type = 'application/json'
                
#                 mock_request = MockRequest(data)
#                 response = updateAlarmsData(mock_request)
#         elif com_error == "0": # com Error yok
#             logger.info("hvac comError yok")
#             if instance.comError == "1":
#                 logger.info("hvac comError 1 di")
#                 # Create a mock request for updateAlarmsData
#                 data = json.dumps([{
#                     'blokNumarasi': blokNumarasi,
#                     'katNumarasi': katNumarasi,
#                     'odaNumarasi': odaNumarasi,
#                     'alarmType': 'HVAC',
#                     'alarmStatus': '0'
#                 }])
#                 # Call updateAlarmsData with a mock request object
#                 class MockRequest:
#                     def __init__(self, body):
#                         self.body = body
#                         self.method = 'POST'
#                         self.content_type = 'application/json'
                
#                 mock_request = MockRequest(data)
#                 response = updateAlarmsData(mock_request)


#         # Only update fields that are not empty
#         for field, value in request.data.items():
#             logger.info(f"request.data: field: {field}, value {value}")
#             if value != "" and field != "blokNumarasi":
#                 setattr(instance, field, str(int(float(value))))
#             elif value != "" and field == "blokNumarasi":
#                 setattr(instance, field, str(value))

#         instance.save()

#         return Response(status=status.HTTP_200_OK)
    
#     def putPMSDataFromTridiumToDB(self, request):

#         instance = PMSData.objects.first()
#         if not instance:
#             return Response(status=status.HTTP_404_NOT_FOUND)
        
#         logger.info(f"request.data: {request.data}")

#         # com error
#         pms_error = request.data.get("pmsError", None)
#         if pms_error == "1": # com Error var
#             if instance.pmsError == "0":
#                 # Create a mock request for updateAlarmsData
#                 data = json.dumps([{
#                     'blokNumarasi': "-",
#                     'katNumarasi': "-",
#                     'odaNumarasi': " ",
#                     'alarmType': 'PMS',
#                     'alarmStatus': '1'
#                 }])
#                 # Call updateAlarmsData with a mock request object
#                 class MockRequest:
#                     def __init__(self, body):
#                         self.body = body
#                         self.method = 'POST'
#                         self.content_type = 'application/json'
                
#                 mock_request = MockRequest(data)
#                 response = updateAlarmsData(mock_request)
#         elif pms_error == "0": # pms_error yok
#             if instance.pmsError == "1":

#                 # Create a mock request for updateAlarmsData
#                 data = json.dumps([{
#                     'blokNumarasi': "-",
#                     'katNumarasi': "-",
#                     'odaNumarasi': " ",
#                     'alarmType': 'PMS',
#                     'alarmStatus': '0'
#                 }])
#                 # Call updateAlarmsData with a mock request object
#                 class MockRequest:
#                     def __init__(self, body):
#                         self.body = body
#                         self.method = 'POST'
#                         self.content_type = 'application/json'
                
#                 mock_request = MockRequest(data)
#                 response = updateAlarmsData(mock_request)

#         # Only update fields that are not empty
#         for field, value in request.data.items():
#             logger.info(f"request.data: field: {field}, value {value}")
#             if value != "":
#                 setattr(instance, field, str(int(float(value))))

#         instance.save()

#         return Response(status=status.HTTP_200_OK)

#     def list_for_frontend(self, request):
#         bloklar = []

#         # Tüm HVACSystem nesnelerini al
#         hvac_objects = MekanikData.objects.all()

#         # Her bir HVACSystem nesnesini JSON formatına dönüştür
#         for hvac_object in hvac_objects:
#             blok_no = hvac_object.blokNumarasi
#             kat_no = hvac_object.katNumarasi
#             oda_no = hvac_object.odaNumarasi
#             onOf = hvac_object.onOf
#             roomTemperature = hvac_object.roomTemperature
#             setPoint = hvac_object.setPoint
#             mode = hvac_object.mode
#             fanMode = hvac_object.fanMode
#             confortTemperature = hvac_object.confortTemperature
#             lowerSetpoint = hvac_object.lowerSetpoint
#             upperSetpoint = hvac_object.upperSetpoint
#             keylockFunction = hvac_object.keylockFunction
#             occupancyInput = hvac_object.occupancyInput
#             runningstatus = hvac_object.runningstatus
#             comError = hvac_object.comError

#             mekanik = {
#                 "onOf": onOf,
#                 "roomTemperature": roomTemperature,
#                 "setPoint": setPoint,
#                 "mode": mode,
#                 "fanMode": fanMode,
#                 "confortTemperature": confortTemperature,
#                 "lowerSetpoint": lowerSetpoint,
#                 "upperSetpoint": upperSetpoint,
#                 "keylockFunction": keylockFunction,
#                 "occupancyInput": occupancyInput,
#                 "runningstatus": runningstatus,
#                 "comError": comError
#             }

#             # Blok, kat ve oda numaralarını kontrol ederek yeni bir blok oluştur veya mevcut bloğu güncelle
#             block_exist = False
#             for block in bloklar:
#                 if block["blok_no"] == blok_no:
#                     block_exist = True
#                     kat_exist = False
#                     for kat in block["katlar"]:
#                         if kat["kat_no"] == kat_no:
#                             kat_exist = True
#                             kat["odalar"].append({"oda_no": oda_no, "mekanik": [mekanik]})
#                             break
#                     if not kat_exist:
#                         block["katlar"].append({"kat_no": kat_no, "odalar": [{"oda_no": oda_no, "mekanik": [mekanik]}]})
#                     break
#             if not block_exist:
#                 bloklar.append({"blok_no": blok_no, "katlar": [{"kat_no": kat_no, "odalar": [{"oda_no": oda_no, "mekanik": [mekanik]}]}]})

#         # JSON yanıtı oluştur ve gönder
#         return JsonResponse({"bloklar": bloklar})
    
    

# # Login view
# @api_view(["POST"])
# @csrf_exempt  # Eğer sadece API üzerinden kullanılacaksa ve CSRF koruması istemiyorsanız @csrf_exempt kullanabilirsiniz
# def login_view(request):
#     logger.info("start")

#     if request.method == "POST":
#         try:
#             # JSON formatındaki veriyi alıyoruz
#             data = json.loads(request.body)
#             logger.info(f"Login işlemi başlatıldı {data}")
#             username = data.get('username')
#             password = data.get('password')

#             # Kullanıcıyı authenticate etme
#             user = authenticate(request, username=username, password=password)

#             if user is not None:
#                 login(request, user)
#                 logger.info(f"Login işlemi basarili")

#                 # Kullanıcıya ait Account kaydını almak
#                 try:
#                     account = Account.objects.get(user=user)
#                     logger.info(f"dashboardAccess: {account.dashboard} "
#                                 f"roomStatusAccess: {account.roomStatus} "
#                                 f"roomServicesAccess: {account.roomServices} "
#                                 f"alarmsAccess: {account.alarms} "
#                                 f"reportsAccess: {account.reports}")
                    
#                     return JsonResponse({"message": True, 
#                                          "username": user.username,
#                                          "dashboardAccess":account.dashboard,
#                                          "roomStatusAccess":account.roomStatus,
#                                          "roomServicesAccess":account.roomServices,
#                                          "alarmsAccess":account.alarms,
#                                          "reportsAccess":account.reports})
#                 except Account.DoesNotExist:
#                     logger.error(f"Kullanıcı {user.username} için Account kaydı bulunamadı!")
#                     return JsonResponse({f"Kullanıcı {user.username} için Account kaydı bulunamadı!"}, status=400)
#             else:
#                 return JsonResponse({"message": "Geçersiz kullanıcı adı veya şifre!"}, status=400)
#         except json.JSONDecodeError:
#             return JsonResponse({"message": "Geçersiz JSON formatı!"}, status=400)
#     else:
#         return JsonResponse({"message": "Yalnızca POST istekleri kabul edilir."}, status=405)

# # Logout view
# @csrf_exempt  # CSRF korumasını devre dışı bırakır
# def logout_view(request):
#     logger.info("Çıkış işlemi başlatıldı")

#     if request.user.is_authenticated:
#         logout(request)
#         return JsonResponse({"message": "Başarıyla çıkış yapıldı!"})
#     else:
#         return JsonResponse({"message": "Kullanıcı oturumu açık değil!"}, status=400)
