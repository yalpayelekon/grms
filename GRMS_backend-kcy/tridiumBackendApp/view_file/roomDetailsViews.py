from django.http import JsonResponse
from ..models import RoomServiceMURData
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from .helper import logger, getUtcToTrShift

utc_to_tr_shift = getUtcToTrShift()

@csrf_exempt
def getRoomDetailsData(request, blokNumarasi, katNumarasi, odaNumarasi):
    global utc_to_tr_shift
    logger.debug(f"blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}")

    # Veritabanında sorgulama
    room_services = RoomServiceMURData.objects.filter(
        blokNumarasi=blokNumarasi,
        katNumarasi=katNumarasi,
        odaNumarasi=odaNumarasi,
        status__in=["0", "2", "3"]  # Status alanını filtreleme
    )
    
    # Boş bir liste oluştur
    room_details_data = []

    # RoomServiceMURData verileri üzerinde döngü
    for service in room_services:

        service_status = "n/a"
        if service.status == "0":
            service_status = "Active"
            if service.isDelayed == "1":
                service_status = "Delay"
        elif service.status == "2":
            service_status = "Cleaning"
        elif service.status == "3":
            service_status = "Cleaned"

        # Time string'i datetime formatına dönüştür
        time_str = service.requestResponceTime
        if time_str:
            try:
                time_obj = datetime.strptime(time_str, "%H:%M:%S.%f")
            except ValueError:
                # Eğer saat kısmı yoksa, örneğin "03:59.220504", onu işlemek için
                time_obj = datetime.strptime(time_str, "%M:%S.%f")

            # Toplam süreyi timedelta olarak hesapla
            total_seconds = time_obj.hour * 3600 + time_obj.minute * 60 + time_obj.second + time_obj.microsecond / 1_000_000

            # Saat ve dakika kısmını hesapla
            hours, remainder = divmod(total_seconds, 3600)
            minutes, seconds = divmod(remainder, 60)

            # Formatı oluştur
            duration = ""
            if hours > 0:
                duration = f"{int(hours)} h. {int(minutes)} m."
            else:
                duration = f"{int(minutes)} m."
        else: duration = ""
    
        dummy_dict = {
            "id": service.id,
            "date": (service.customerRequestTime+ timedelta(hours=utc_to_tr_shift)).strftime("%Y-%m-%d") if service.customerRequestTime else "",
            "status": service_status, # "Active", "Delay", "Cleaning", "Cleaned"
            "requestTime": (service.customerRequestTime + timedelta(hours=utc_to_tr_shift)).strftime("%H:%M") if service.customerRequestTime else "",
            "operationStart": (service.serviceStartTime + timedelta(hours=utc_to_tr_shift)).strftime("%H:%M") if service.serviceStartTime else "",
            "operationEnd": (service.serviceEndTime + timedelta(hours=utc_to_tr_shift)).strftime("%H:%M") if service.serviceEndTime else "",
            "duration": duration, 
            "employee": service.employee if service.employee else "",
            "odaNumarasi": odaNumarasi
        }
        
        room_details_data.append(dummy_dict)
    
    logger.debug(f"room_details_data: {room_details_data}")
    return JsonResponse({"roomDetail": room_details_data})