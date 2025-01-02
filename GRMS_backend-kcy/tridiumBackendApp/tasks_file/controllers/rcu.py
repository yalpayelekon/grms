import socket
import time
import logging

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RCUClass:
    def __init__(self, ip, port, blokNumarasi, katNumarasi, oda):
        self.name = "rcu"
        self.ip = ip
        self.port = port
        self.blokNumarasi = blokNumarasi
        self.katNumarasi = katNumarasi
        self.odaNumarasi = oda
        self.periyodicTaskVariables = [0, 5]
        self.responceDataList = []
        self.murPrevState = "temizlik_baslamadi"
        self.comErrorPrevState = "0"

        self.sock = None
        self.is_connected = False

    def connect(self):
        """Soket bağlantısı kurma."""
        try:
            if not self.is_connected:
                self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                self.sock.settimeout(2)  # 1 saniye zaman aşımı
                self.sock.connect((self.ip, self.port))
                self.is_connected = True
                logger.info(f"Connected to {self.ip}:{self.port}")
                return True
        except socket.error as e:
            logger.error(f"Connection failed to {self.ip}:{self.port} - {e}")
            return False
        
    def check_heartbeat(self):
        pass

    def close(self):
        """Soket bağlantısını kapatma."""
        if self.sock:
            self.sock.close()
            self.is_connected = False
            logger.info(f"Connection to {self.ip}:{self.port} closed.")
