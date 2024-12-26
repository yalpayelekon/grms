from django.http import JsonResponse
from ..models import RoomServiceMURData, AlarmsData
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from .helper import logger, getUtcToTrShift

utc_to_tr_shift = getUtcToTrShift()

@csrf_exempt
def getReportsData(request, dateRange, reportName):
    logger.debug(f"dateRange: {dateRange}, reportName: {reportName}")

    # dateRange formatı: 'Sun Jun 30 2024 00:00:00 GMT+0300 (GMT+03:00),Wed Jul 03 2024 00:00:00 GMT+0300 (GMT+03:00)'
    start_date_str, end_date_str = dateRange.split(',')
    end_date_str = end_date_str[:-1]  # En sonda istenmeyen '}' karakteri varsa temizleme
    logger.debug(f"start_date_str: {start_date_str}, end_date_str: {end_date_str}")

    # Zaman dilimi bilgisini çıkartma
    start_date_clean = start_date_str.split(' GMT')[0]
    end_date_clean = end_date_str.split(' GMT')[0]
    logger.debug(f"start_date_clean: {start_date_clean}, end_date_clean: {end_date_clean}")

    # Tarih formatlarını datetime nesnesine çevirme
    start_date = datetime.strptime(start_date_clean, "%a %b %d %Y %H:%M:%S")
    end_date = datetime.strptime(end_date_clean, "%a %b %d %Y %H:%M:%S")
    logger.debug(f"start_date: {start_date}, end_date: {end_date}")

    next_day = end_date + timedelta(days=1)

    reportsData = []
    if "alarmReport" in reportName:

        # AlarmsData'dan alarmStartTime, start_date ve end_date arasında olan verileri çekme
        alarms = AlarmsData.objects.filter(alarmStartTime__gte=start_date, alarmStartTime__lte=next_day)

        for alarm in alarms:
            alarm_data = {
                "blokNumarasi": alarm.blokNumarasi,
                "katNumarasi": alarm.katNumarasi,
                "odaNumarasi": alarm.odaNumarasi,
                "alarmType": alarm.alarmType,
                "alarmStatus": alarm.alarmStatus,
                "rcuAlarmDetails": alarm.rcuAlarmDetails["ip"] if alarm.rcuAlarmDetails else [],
                "helvarAlarmDetails": alarm.helvarAlarmDetails,
                "hvacAlarmDetails": alarm.hvacAlarmDetails,
                "lightingAlarmDetails": alarm.lightingAlarmDetails,
                "doorSystAlarmDetails": alarm.doorSystAlarmDetails,
                "alarmStartTime": (alarm.alarmStartTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if alarm.alarmStartTime else "",
                "alarmEndTime": (alarm.alarmEndTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if alarm.alarmEndTime else "",
                "ackStatus": alarm.ackStatus,
                "ackTime": (alarm.ackTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if alarm.ackTime else "",
            }
            reportsData.append(alarm_data)
    elif "serviceReport" in reportName:
        services = RoomServiceMURData.objects.filter(customerRequestTime__gte=start_date, customerRequestTime__lte=next_day)

        for service in services:
            service_data = {
                "blokNumarasi": service.blokNumarasi,
                "katNumarasi": service.katNumarasi,
                "odaNumarasi": service.odaNumarasi,
                "status": service.status,
                "customerRequest": service.customerRequest,
                "customerRequestTime": (service.customerRequestTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if service.customerRequestTime else "",
                "serviceStartTime": (service.serviceStartTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if service.serviceStartTime else "",
                "serviceEndTime": (service.serviceEndTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if service.serviceEndTime else "",
                "serviceResponceTime": service.serviceResponceTime,
                "requestResponceTime": service.requestResponceTime,
                "employee": service.employee,
                "ackStatus": service.ackStatus,
                "ackTime": (service.ackTime + timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d %H:%M:%S") if service.ackTime else "",
                "isDelayed": service.isDelayed,
            }
            reportsData.append(service_data)

    logger.debug(f"reportsData: {reportsData}")
    return JsonResponse({"reportsData": reportsData})