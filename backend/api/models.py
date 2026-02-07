from django.db import models

class Equipment(models.Model):
    # Field names matching the CSV columns for the screening task
    name = models.CharField(max_length=255)
    equipment_type = models.CharField(max_length=100)
    flowrate = models.FloatField()
    pressure = models.FloatField()
    temperature = models.FloatField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

class UploadHistory(models.Model):
    # To satisfy Requirement #4: History Management
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    total_count = models.IntegerField()
    avg_flowrate = models.FloatField()
    avg_pressure = models.FloatField()
    avg_temperature = models.FloatField()

    class Meta:
        # Orders by newest first so we can easily keep the last 5
        ordering = ['-uploaded_at']