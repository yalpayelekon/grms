from django.http import JsonResponse
from ..models import  Account
import json
from django.views.decorators.csrf import csrf_exempt
from .helper import logger
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view

# Login view
@api_view(["POST"])
@csrf_exempt  # Eğer sadece API üzerinden kullanılacaksa ve CSRF koruması istemiyorsanız @csrf_exempt kullanabilirsiniz
def loginView(request):
    logger.info("start")

    if request.method == "POST":
        try:
            # JSON formatındaki veriyi alıyoruz
            data = json.loads(request.body)
            logger.info(f"Login işlemi başlatıldı {data}")
            username = data.get('username')
            password = data.get('password')

            # Kullanıcıyı authenticate etme
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                logger.info(f"Login işlemi basarili")

                # Kullanıcıya ait Account kaydını almak
                try:
                    account = Account.objects.get(user=user)
                    logger.info(f"dashboardAccess: {account.dashboard} "
                                f"roomStatusAccess: {account.roomStatus} "
                                f"roomServicesAccess: {account.roomServices} "
                                f"alarmsAccess: {account.alarms} "
                                f"reportsAccess: {account.reports}")
                    
                    return JsonResponse({"message": True, 
                                         "username": user.username,
                                         "dashboardAccess":account.dashboard,
                                         "roomStatusAccess":account.roomStatus,
                                         "roomServicesAccess":account.roomServices,
                                         "alarmsAccess":account.alarms,
                                         "reportsAccess":account.reports})
                except Account.DoesNotExist:
                    logger.error(f"Kullanıcı {user.username} için Account kaydı bulunamadı!")
                    return JsonResponse({f"Kullanıcı {user.username} için Account kaydı bulunamadı!"}, status=400)
            else:
                return JsonResponse({"message": "Geçersiz kullanıcı adı veya şifre!"}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"message": "Geçersiz JSON formatı!"}, status=400)
    else:
        return JsonResponse({"message": "Yalnızca POST istekleri kabul edilir."}, status=405)


