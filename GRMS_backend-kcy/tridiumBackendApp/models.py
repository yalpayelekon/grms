from django.db import models
import jsonfield
from django.contrib.auth.models import User


class AppSettings(models.Model):
    dashboardReqResponceTimeUpperLimit = models.IntegerField(default=30)  # dashboard ->  request time 1. gauge -> gauge upper value of responce time Varsayılan değeri 30 dakika
    dashboardServiceResponceTimeUpperLimit = models.IntegerField(default=60)  # dashboard -> service request time 2. gauge -> gauge upper value of responce time Varsayılan değeri 60 dakika
    murDelayThreshold = models.IntegerField(default=60) # mur gecikmesi var diyebilmemiz icin asilmasi gereken threshold degeri. Varsayılan değeri 60 dakika
    lndDelayThreshold = models.IntegerField(default=120) # lnd gecikmesi var diyebilmemiz icin asilmasi gereken threshold degeri. Varsayılan değeri 120 dakika
    cleanedRoomDisplayTimeThreshold = models.IntegerField(default=60) # room service de alarma dusen bir odanin temizlendikten sonra ne kadar sure alarm sayfasında duracagini ayarlar (default 60dk)
    fixedAlarmDisplayTimeThreshold = models.IntegerField(default=45) # alarms sayfasında fixed edilen bir alarmin ne kadar bu sayfada duracagini ayarlar (default 45dk)

    def __str__(self):
        return f"AppSettings(id={self.id})"
    
class MekanikData(models.Model):

    blokNumarasi = models.CharField(blank=True, max_length=200)
    katNumarasi = models.CharField(blank=True, max_length=200)
    odaNumarasi = models.CharField(blank=True, max_length=200)
    onOf = models.CharField(blank=True, max_length=200)
    roomTemperature = models.CharField(max_length=200)
    setPoint = models.CharField(blank=True, max_length=200)
    mode = models.CharField(blank=True, max_length=200)
    fanMode = models.CharField(blank=True, max_length=200)
    confortTemperature = models.CharField(blank=True, max_length=200)
    lowerSetpoint = models.CharField(blank=True, max_length=200)
    upperSetpoint = models.CharField(blank=True, max_length=200)
    keylockFunction = models.CharField(blank=True, max_length=200)
    occupancyInput = models.CharField(blank=True, max_length=200)
    runningstatus = models.CharField(blank=True, max_length=200)
    comError = models.CharField(blank=True, max_length=200)
    fidelio = models.CharField(blank=True, max_length=200) # musteri otele giris yapti mi -> 1 evet, 0 hayir -- rentedStatus

    def __str__(self):
        return f'Blok: {self.blokNumarasi} - Kat: {self.katNumarasi} - Oda: {self.odaNumarasi}'
    
class RCUHelvarRouterData(models.Model):
    """
        onboardInputDevices: address, name, vairety, instance, instanceBehaviour1, instanceFunction1, instanceBehaviour2, instanceFunction2, groupSettings
        onboardOutputDevices: address, name, vairety, phyMinLevel, targetLevel, actualLevel, lastActiveLevel, status, deviceType, situation, feature ...
                                maxLevel, minLevel, powerOnLevel, failureLevel, fadeTime, scenes, groupSettings
    """

    blokNumarasi = models.CharField(blank=True,max_length=200)
    katNumarasi = models.CharField(blank=True,max_length=200)
    odaNumarasi = models.CharField(blank=True,max_length=200)
    deviceType = models.CharField(blank=True,max_length=200)
    ip = models.CharField(blank=True,max_length=200)
    port = models.CharField(blank=True,max_length=200)
    comError = models.CharField(blank=True,max_length=200) # RCU ile olan communication 1 hata var, 0 hata yok

    roomOccupied = models.CharField(blank=True,max_length=200) # 0 empty, 1 occupied

    dndActive = models.CharField(blank=True,max_length=200) # 0-> aktif degil, 1 aktif
    lndActive = models.CharField(blank=True,max_length=200) # 0-> aktif degil, 1 aktif
    murActive = models.CharField(blank=True,max_length=200) # 0-> aktif degil, 1 aktif

    hkInRoom = models.CharField(blank=True,max_length=200) # 0-> hk odada degil, 1 hk odada

    doorOpen = models.CharField(blank=True,max_length=200) # doorOpenAlarm: 0 alarm yok 1 alarm var

    outputDevices = jsonfield.JSONField(blank=True, default=list)

    def __str__(self):
        return f'Blok: {self.blokNumarasi} - Kat: {self.katNumarasi} - Oda: {self.odaNumarasi} - ip: {self.ip}'

class BlokKatOda(models.Model):
    blokNumarasi = models.CharField(max_length=200, unique=True)
    isGenelMahal = models.CharField(
        max_length=1,
        default='0',  # Varsayılan olarak "0" (Hayır)
    )

    class Meta:
        verbose_name = "Blok Kat Oda"
        verbose_name_plural = "Blok Kat Odalar"
        ordering = ['blokNumarasi']
    
    def __str__(self):
        return self.blokNumarasi  # blokNumarasi burada görünecek


class BlokKatOdaData(models.Model):
    blokKatOda = models.ForeignKey(
        BlokKatOda,
        on_delete=models.CASCADE,
        related_name='odaVerileri',
        null=True  # Bu satırı ekleyin
    )
    katNumarasi = models.CharField(blank=True, max_length=200)
    odaNumarasi = models.CharField(blank=True, max_length=200)

    isRCUConnected = models.CharField(
        max_length=1,
        default='0',
    )
    isHelvarConnected = models.CharField(
        max_length=1,
        default='0',
    )
    ip = models.CharField(max_length=100, blank=True, null=True)
    port = models.CharField(max_length=10, blank=True, null=True)
    isHVACConnected = models.CharField(
        max_length=1,
        default='0',
    )
    isHKServiceConnected = models.CharField(
        max_length=1,
        default='0',
    )

    class Meta:
        verbose_name = "Blok Kat Oda Verisi"
        verbose_name_plural = "Blok Kat Oda Verileri"
        ordering = ['blokKatOda', 'katNumarasi', 'odaNumarasi']
        
class RoomServiceMURData(models.Model):

    blokNumarasi = models.CharField(blank=True, max_length=200)
    katNumarasi = models.CharField(blank=True, max_length=200)
    odaNumarasi = models.CharField(blank=True, max_length=200)
    status = models.CharField(blank=True, max_length=200) # 0 aktif, 2 cleaning, 3 cleaned, 4 musteri mur iptal etti  

    customerRequest = models.CharField(blank=True, max_length=200) # 0 customer mur request yapmadi, 1 customer mur request yapti.
    customerRequestTime = models.DateTimeField(null=True, blank=True)
    serviceStartTime = models.DateTimeField(null=True, blank=True)
    serviceEndTime = models.DateTimeField(null=True, blank=True)
    serviceResponceTime = models.CharField(null=True, blank=True , max_length=200)
    requestResponceTime = models.CharField(null=True, blank=True , max_length=200)
    employee = models.CharField(blank=True, max_length=200)

    ackStatus = models.CharField(blank=True, max_length=200)
    ackTime = models.DateTimeField(null=True, blank=True)
    isDelayed = models.CharField(blank=True, max_length=200) 
    
    def __str__(self):
        return f"blokNumarasi: {self.blokNumarasi} - katNumarasi: {self.katNumarasi}, odaNumarasi: {self.odaNumarasi}, status: {self.status}"    
    
class AlarmsData(models.Model):

    blokNumarasi = models.CharField(blank=True, max_length=200)
    katNumarasi = models.CharField(blank=True, max_length=200)
    odaNumarasi = models.CharField(blank=True, max_length=200)
    address = models.CharField(blank=True, max_length=200)

    alarmType = models.CharField(blank=True, max_length=200) # "Lighting", "RCU", "HVAC", "Door Syst." ("Helvar" frontende eklenmedi) 
    alarmStatus = models.CharField(blank=True, max_length=200) # 1 -> alarm devam ediyor, 0 -> alarm giderildi

    rcuAlarmDetails = jsonfield.JSONField(blank=True, default=list) # {ip: ... } 
    helvarAlarmDetails = jsonfield.JSONField(blank=True, default=list) # {ip: ... } 
    hvacAlarmDetails = jsonfield.JSONField(blank=True, default=list) # {odaNumarasi: ...}
    lightingAlarmDetails = jsonfield.JSONField(blank=True, default=list) # {ip: ..., armaturName: ..., armaturAddress: ..., alarmDetail: ...}
    doorSystAlarmDetails = jsonfield.JSONField(blank=True, default=list) # {odaNumarasi: ..., kapiAcikKalmaSuresi: ...}

    alarmStartTime = models.DateTimeField(null=True, blank=True) # alarmin basladigi zaman
    alarmEndTime = models.DateTimeField(null=True, blank=True) # alarmin giderildigi zaman

    ackStatus = models.CharField(blank=True, max_length=200) # frontend den alarm bildirimi yapildi mi? 0 hayir 1 evet
    ackTime = models.DateTimeField(null=True, blank=True) # frontend den alarm bildirimi yapilma zamani
    
    def __str__(self):
        return f"blokNumarasi: {self.blokNumarasi} - katNumarasi: {self.katNumarasi}, odaNumarasi: {self.odaNumarasi}, alarmType: {self.alarmType}, alarmStatus: {self.alarmStatus}"    
    

class PMSData(models.Model):

    pmsError = models.CharField(blank=True,max_length=200, default='0')

    def __str__(self):
        return f'pmsError: {self.pmsError}'
    
class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    dashboard = models.CharField(max_length=15, default="ACCESS", blank=False, null=False, choices=[("ACCESS", "ACCESS"),("NONACCESS","NONACCESS")])
    roomStatus = models.CharField(max_length=15,default="ACCESS", blank=False, null=False, choices=[("ACCESS", "ACCESS"),("NONACCESS","NONACCESS")])
    roomServices = models.CharField(max_length=15,default="ACCESS",  blank=False, null=False, choices=[("ACCESS", "ACCESS"),("NONACCESS","NONACCESS")])
    alarms = models.CharField(max_length=15, default="ACCESS", blank=False, null=False, choices=[("ACCESS", "ACCESS"),("NONACCESS","NONACCESS")])
    reports = models.CharField( max_length=15,default="ACCESS",  blank=False, null=False, choices=[("ACCESS", "ACCESS"),("NONACCESS","NONACCESS")])

    def __str__(self):
        return self.user.username