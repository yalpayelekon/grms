from __future__ import absolute_import,unicode_literals
import os
from celery import Celery

# Django projesinin ayar dosyasını belirtin
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tridiumBackend.settings")
app = Celery("tridiumBackend")

#we are using asia/kolkata time so we are making it False
# app.conf.enable_utc=False
# app.conf.update(timezone='Asia/Kolkata')

# Celery yapılandırmasını Django ayarlarını kullanarak yapın
app.config_from_object("django.conf:settings", namespace="CELERY")

# Tüm uygulamaların tasks.py dosyalarını otomatik olarak yükleyin
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")

beat_schedule = {
    'listen_tcp_connection-10.11.10.114-every-10-second': {
        'task': 'tridiumBackendApp.tasks_file.tasks.listen_tcp_connection_v2',
        'schedule': 10, 
        'args': ('10.11.10.114', 5556),
    },
}
app.conf.beat_schedule.update(beat_schedule)


""" # Birden fazla IP ve port için periyodik görevlerin yapılandırılması
ip_port_pairs = [
    ('10.11.10.115', 5556),
    # Diğer IP ve port çiftleri buraya eklenebilir
]

beat_schedule = {}

for idx, (ip, port) in enumerate(ip_port_pairs, start=1):
    task_name = f'get_rcu_data_periodically_{idx}'
    beat_schedule[task_name] = {
        'task': 'tridiumBackendApp.tasks.getRCUDataPeriodically',
        'schedule': 10.0,  # Her 10 saniyede bir çalışacak şekilde
        'args': (ip, port),  # Görevin parametreleri (IP ve port) burada veriliyor
        # 'options': {'queue': 'your_queue_name'},  # Opsiyonel: Hangi kuyruğa gönderileceği
    }


# Celery beat_schedule'i güncelle
app.conf.beat_schedule.update(beat_schedule) """

