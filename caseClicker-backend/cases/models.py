import uuid
from django.conf import settings
from django.db import models

class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    balance = models.PositiveIntegerField(default=100)
    def __str__(self): return f"{self.user.username}: {self.balance} coins"

class Case(models.Model):
    name = models.CharField(max_length=100)
    price = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    def __str__(self): return self.name

class CaseItem(models.Model):
    RARITY_CHOICES = [
        ('common', 'Common'),
        ('rare', 'Rare'),
        ('legendary', 'Legendary'),
    ]
    case = models.ForeignKey(Case, related_name='items', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    rarity = models.CharField(max_length=10, choices=RARITY_CHOICES)
    weight = models.PositiveIntegerField()
    def __str__(self): return f"{self.name} ({self.rarity})"

class InventoryItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item = models.ForeignKey(CaseItem, on_delete=models.CASCADE)
    obtained_at = models.DateTimeField(auto_now_add=True)

class OpenHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    case = models.ForeignKey(Case, on_delete=models.CASCADE)
    item = models.ForeignKey(CaseItem, on_delete=models.CASCADE)
    opened_at = models.DateTimeField(auto_now_add=True)