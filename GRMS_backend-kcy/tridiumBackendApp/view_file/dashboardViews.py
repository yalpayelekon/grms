from django.http import JsonResponse
from ..models import MekanikData, RCUHelvarRouterData, BlokKatOdaData, RoomServiceMURData, AlarmsData
import re
from django.views.decorators.csrf import csrf_exempt
from datetime import timedelta
from django.db.models import Q
from .helper import getAppSettings, logger

dashboardReqResponceTimeUpperLimit, dashboardServiceResponceTimeUpperLimit, _, _, _, _ = getAppSettings()

def parse_time(time_str):
    """Zaman damgası formatını (örneğin '2 days, 10:36:25.974798' veya '0:12:41.208289') timedelta'ya dönüştür."""
    if not time_str:
        return timedelta()
    
    # 'days' kelimesi var mı kontrol et
    days_match = re.match(r'(\d+) days?, (\d+):(\d+):(\d+)\.(\d+)', time_str)
    if days_match:
        days, hours, minutes, seconds, microseconds = map(int, days_match.groups())
        return timedelta(days=days, hours=hours, minutes=minutes, seconds=seconds, microseconds=microseconds)
    
    # Gün yoksa saat:dk:saniye.milisaniye formatını kontrol et
    time_match = re.match(r'(\d+):(\d+):(\d+)\.(\d+)', time_str)
    if time_match:
        hours, minutes, seconds, microseconds = map(int, time_match.groups())
        return timedelta(hours=hours, minutes=minutes, seconds=seconds, microseconds=microseconds)
    
    return timedelta()

@csrf_exempt
def getDashboardHVACStatusData(request):
        
    on_onof_count = MekanikData.objects.filter(onOf='1').count()
    of_onof_count = MekanikData.objects.filter(onOf='0').count()

    odaSayisi = on_onof_count + of_onof_count
    logger.debug(f"on_onof_count: {on_onof_count}, of_onof_count: {of_onof_count}, odaSayisi: {odaSayisi}")

    heating_mode_count = MekanikData.objects.filter(onOf='1', mode='0').count()
    cooling_mode_count = MekanikData.objects.filter(onOf='1', mode='1').count()
    fan_mode_count = MekanikData.objects.filter(onOf='1', mode='2').count()
    auto_mode_count = MekanikData.objects.filter(onOf='1', mode='3').count()
    logger.debug(f"heating_mode_count: {heating_mode_count}, cooling_mode_count: {cooling_mode_count}, fan_mode_count: {fan_mode_count}, auto_mode_count:{auto_mode_count}")

    dummy_dict =  {
        "hvacCoolingNumber": cooling_mode_count + fan_mode_count + auto_mode_count,
        "hvacHeatingNumber": heating_mode_count,
        "hvacOffNumber": of_onof_count,
        "odaSayisi": odaSayisi
    },
    logger.debug(f"dummy_dict: {dummy_dict}")
    return JsonResponse({"hvacStatus": dummy_dict})


@csrf_exempt
def getDashboardOccupancyRateData(request):
        
    odaSayisi = BlokKatOdaData.objects.values('odaNumarasi').distinct().count()
    logger.debug(f"odaSayisi: {odaSayisi}")

    # Fidelio değeri 1 olan odaların numaralarını al (rented)
    fidelio_1_oda_numaralari = MekanikData.objects.filter(fidelio='1').values_list('odaNumarasi', flat=True)
    logger.debug(f"fidelio_1_oda_numaralari: {fidelio_1_oda_numaralari}")
    
    # roomOccupied değeri 1 olan ve hkInroom degeri 0 olan odaların numaralarını al (occupancy)
    musteri_odada = RCUHelvarRouterData.objects.filter(roomOccupied='1', hkInRoom = "0" ).values_list('odaNumarasi', flat=True)
    logger.debug(f"musteri_odada: {musteri_odada}")
    rented_and_occupied_oda_numaralari = set(fidelio_1_oda_numaralari).intersection(musteri_odada)
    logger.debug(f"rented_and_occupied_oda_numaralari: {rented_and_occupied_oda_numaralari}")
    # Kaç adet rented ve occupied oda olduğunu bul
    rented_and_occupied_count = len(rented_and_occupied_oda_numaralari)
    logger.debug(f"rented_and_occupied_count: {rented_and_occupied_count}")

    # roomOccupied değeri 0 olan odaların numaralarını al (vacant)
    roomOccupied_0_da_numaralari = RCUHelvarRouterData.objects.filter(roomOccupied='0').values_list('odaNumarasi', flat=True)

    # roomOccupied=1 ve hkInRoom=1 olan oda numaralarını filtreleme
    roomOccupied_1_ve_hkInRoom_1_da_numaralari = RCUHelvarRouterData.objects.filter(
        Q(roomOccupied='1') & Q(hkInRoom='1')
    ).values_list('odaNumarasi', flat=True)

    # Her iki durumda da boş olan oda numaralarını birleştirme
    bos_oda_numaralari = set(roomOccupied_0_da_numaralari).union(roomOccupied_1_ve_hkInRoom_1_da_numaralari)

    # Boş ve kiralanmış odaların kesişimini bulma
    rented_and_vacant_oda_numaralari = set(fidelio_1_oda_numaralari).intersection(bos_oda_numaralari)

    logger.debug(f"rented_and_vacant_oda_numaralari: {rented_and_vacant_oda_numaralari}")

    # Kaç adet rented ve vacant oda olduğunu bul
    rented_and_vacant_count = len(rented_and_vacant_oda_numaralari)
    logger.debug(f"rented_and_vacant_count: {rented_and_vacant_count}")

    # Fidelio değeri 0 olan odaların numaralarını al (unrented)
    fidelio_0_oda_numaralari = MekanikData.objects.filter(fidelio='0').count()
    logger.debug(f"fidelio_0_oda_numaralari: {fidelio_0_oda_numaralari}")
    dummy_dict =  {
        "rentedOccupied": rented_and_occupied_count,
        "rentedVacant": rented_and_vacant_count,
        "odaSayisi": odaSayisi,
        "unrented":fidelio_0_oda_numaralari
    },

    logger.debug(f"dummy_dict: {dummy_dict}")
    return JsonResponse({"occupancyRate": dummy_dict})

@csrf_exempt
def getDashboardServiceRequestData(request):
        
    # Ayarları al
    global dashboardReqResponceTimeUpperLimit, dashboardServiceResponceTimeUpperLimit
    
    # mevcut mur sayisi: status -> (0 mur istegi var), (1 mur iptal), (2 cleaning), (3 cleaned)
    # mur sayisi icin status = 0 ve 2 alacagim
    mur_status_count_0_2 = RoomServiceMURData.objects.filter(Q(status='0') | Q(status='2')).count()
    logger.debug(f"mur_status_count_0_2: {mur_status_count_0_2}")
    # mur overdue (statusu 0 veya 2 olan veride isDelayed = 1 ise) ve in progress (statusu 0 veya 2 olan veride isDelayed = 0 ise) hesapla
    mur_overdue_count = RoomServiceMURData.objects.filter(Q(status='0') | Q(status='2'),isDelayed="1").count()

    mur_in_progress_count = RoomServiceMURData.objects.filter(Q(status='0') | Q(status='2'),isDelayed="0").count()

    # lnd sayisi icin rcuhelvar verisi icinden lndActive sayalim
    lnd_status_count_0_2 = RCUHelvarRouterData.objects.filter(lndActive='1').count()

    # average responce time hesaplamak icin mur verisinin status=3 olanlarin requestResponceTime değerinin ortalamasını al, dakika cinsinden goster
    records = RoomServiceMURData.objects.filter(status='3')
    
    request_responce_total_time = timedelta()
    service_responce_total_time = timedelta()
    count_request_time = 0
    count_service_time = 0
    for record in records:
        if record.requestResponceTime:
            try:
                # Zaman damgasını timedelta'ya dönüştür
                time_delta = parse_time(record.requestResponceTime)
                request_responce_total_time += time_delta
                count_request_time += 1
            except ValueError:
                # Hatalı değerleri yoksay
                continue
        if record.serviceResponceTime:
            try:
                # Zaman damgasını timedelta'ya dönüştür
                time_delta = parse_time(record.serviceResponceTime)
                service_responce_total_time += time_delta
                count_service_time += 1
            except ValueError:
                # Hatalı değerleri yoksay
                continue

    if count_request_time > 0:
        # Toplam süreyi saniye cinsinden hesapla
        average_time_seconds = request_responce_total_time.total_seconds() / count_request_time
        # Ortalama süreyi dakika cinsinden hesapla
        average_time_minutes = average_time_seconds / 60
        average_request_responce_time = int(average_time_minutes) # hk oda temizliği bitirme saati - musteri request saati
    else:
        average_request_responce_time = 0
    
    if count_service_time > 0:
        # Toplam süreyi saniye cinsinden hesapla
        average_time_seconds = service_responce_total_time.total_seconds() / count_service_time
        # Ortalama süreyi dakika cinsinden hesapla
        average_time_minutes = average_time_seconds / 60
        average_request_service_time = int(average_time_minutes) # hk oda temizliği bitirme saati - hk oda temizligi baslama saati
    else:
        average_request_service_time = 0

    dummy_dict =  {
                "murNumber": mur_status_count_0_2,
                "murOverdue": mur_overdue_count,
                "murInProgress": mur_in_progress_count,
                "lndNumber": lnd_status_count_0_2,
                "lndOverdue": -1,
                "lndInProgress": -1,
                "averageResponceTime": average_request_responce_time, # dakika
                "averageServiceTime": average_request_service_time, # dakika
                "dashboardReqResponceTimeUpperLimit": dashboardReqResponceTimeUpperLimit, # dakika
                "dashboardServiceResponceTimeUpperLimit": dashboardServiceResponceTimeUpperLimit # dakika
    },

    logger.debug(f"dummy_dict: {dummy_dict}")
    return JsonResponse({"serviceRequest": dummy_dict})


@csrf_exempt
def getDashboardAlarmStatusData(request): # Frontend de bulunan dashboard alarm status icin get metodu

    alarmNumber = []
    ackNumber = []
    list_alarmType = ["RCU", "Helvar", "HVAC", "Door Syst.", "Lighting", "PMS", "Emergency"]
    for alarmType in list_alarmType:
        # alarmType ve alarmStatus "1" olan verilerin sayısını hesaplayın
        alarmNumber.append(AlarmsData.objects.filter(alarmType=alarmType, alarmStatus="1").count())
        # alarmType, alarmStatus "1" ve ackStatus "1" olan verilerin sayısını hesaplayın
        ackNumber.append(AlarmsData.objects.filter(alarmType=alarmType, alarmStatus="1", ackStatus="1").count())
    logger.debug(f"alarmType: {list_alarmType}, alarmNumber: {alarmNumber}, ackNumber: {ackNumber}")

    rcuAlarmNumber, helvarAlarmNumber, hvacAlarmNumber, doorSystemAlarmNumber, lightingAlarmNumber, pmsAlarmNumber, emergencyAlarmNumber = alarmNumber
    rcuAckNumber, helvarAckNumber, hvacAckNumber, doorAckNumber, lightingAckNumber, pmsAckNumber, emergencyAckNumber = ackNumber
    
    try:
        numberOfHVAC = MekanikData.objects.count()
    except Exception as e:
        print(f"An error occurred: {e}")
        numberOfHVAC = 0  # Hata durumunda varsayılan bir değer atanabilir

    try:
        numberOfHelvar = RCUHelvarRouterData.objects.filter(deviceType="Helvar Router").count()
    except Exception as e:
        print(f"An error occurred: {e}")
        numberOfHelvar = 0  # Hata durumunda varsayılan bir değer atanabilir

    try:
        numberOfRCU = RCUHelvarRouterData.objects.filter(deviceType="Elekon RCU").count()
    except Exception as e:
        print(f"An error occurred: {e}")
        numberOfRCU = 0  # Hata durumunda varsayılan bir değer atanabilir

    dummy_dict =  {
                    "lightingAlarmNumber": lightingAlarmNumber,
                    "hvacAlarmNumber": hvacAlarmNumber,
                    "rcuAlarmNumber": rcuAlarmNumber,
                    "helvarAlarmNumber": helvarAlarmNumber,
                    "controllerAlarmNumber": rcuAlarmNumber + helvarAlarmNumber, 
                    "doorSystemAlarmNumber": doorSystemAlarmNumber,
                    "pmsAlarmNumber": pmsAlarmNumber,
                    "emergencyAlarmNumber": emergencyAlarmNumber,
                    "lightingAckNumber": lightingAckNumber, 
                    "hvacAckNumber": hvacAckNumber, 
                    "rcuAckNumber": rcuAckNumber, 
                    "helvarAckNumber": helvarAckNumber,
                    "controllerAckNumber": rcuAckNumber + helvarAckNumber, 
                    "doorAckNumber": doorAckNumber, 
                    "pmsAckNumber": pmsAckNumber, 
                    "emergencyAckNumber": emergencyAckNumber,
                    "numberOfRCU": str(numberOfRCU),
                    "numberOfHelvar": str(numberOfHelvar),
                    "numberOfHVAC": str(numberOfHVAC)
    }
    logger.debug(f"dummy_dict: {dummy_dict}")
    return JsonResponse({"alarmStatus": dummy_dict})