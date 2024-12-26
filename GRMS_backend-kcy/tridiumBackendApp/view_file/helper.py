
from ..models import AppSettings
import logging

# Logger'ı ayarla
""" logging.basicConfig(level=logging.DEBUG, 
                    format='%(asctime)s - %(name)s - %(funcName)s - %(levelname)s - %(message)s',
                    filename="kcy_views.log",
                    filemode="a") """
logging.basicConfig(level=logging.DEBUG, 
                    format='%(asctime)s - %(name)s - %(funcName)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def getAppSettings():

    dashboardReqResponceTimeUpperLimit = 30  # dakika
    dashboardServiceResponceTimeUpperLimit = 60  # dakika
    murDelayThreshold = 60  # dakika
    lndDelayThreshold = 120  # dakika
    cleanedRoomDisplayTimeThreshold = 60  # dakika
    fixedAlarmDisplayTimeThreshold = 45  # dakika

    try:
        settings = AppSettings.objects.first()  # program başlatıldığı zaman 1 kere okur, her seferinde database'i meşgul etmemek için buraya eklenmiştir.
        if settings:
            dashboardReqResponceTimeUpperLimit = settings.dashboardReqResponceTimeUpperLimit
            dashboardServiceResponceTimeUpperLimit = settings.dashboardServiceResponceTimeUpperLimit
            murDelayThreshold = settings.murDelayThreshold
            lndDelayThreshold = settings.lndDelayThreshold
            cleanedRoomDisplayTimeThreshold = settings.cleanedRoomDisplayTimeThreshold
            fixedAlarmDisplayTimeThreshold = settings.fixedAlarmDisplayTimeThreshold

        logger.debug(f"dashboardReqResponceTimeUpperLimit: {dashboardReqResponceTimeUpperLimit}, dashboardServiceResponceTimeUpperLimit: {dashboardServiceResponceTimeUpperLimit}, murDelayThreshold: {murDelayThreshold}, lndDelayThreshold: {lndDelayThreshold}, cleanedRoomDisplayTimeThreshold: {cleanedRoomDisplayTimeThreshold}, fixedAlarmDisplayTimeThreshold: {fixedAlarmDisplayTimeThreshold}")
    
    except Exception as e:
        logger.error(f"An error occurred while getting settings: {e}")
        return dashboardReqResponceTimeUpperLimit, dashboardServiceResponceTimeUpperLimit, murDelayThreshold, lndDelayThreshold, cleanedRoomDisplayTimeThreshold, fixedAlarmDisplayTimeThreshold

    return dashboardReqResponceTimeUpperLimit, dashboardServiceResponceTimeUpperLimit, murDelayThreshold, lndDelayThreshold, cleanedRoomDisplayTimeThreshold, fixedAlarmDisplayTimeThreshold

def getUtcToTrShift():
    return 3