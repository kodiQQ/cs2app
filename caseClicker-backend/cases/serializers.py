from rest_framework import serializers
from .models import Case, CaseItem, InventoryItem, OpenHistory, Wallet


class CaseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseItem
        fields = ['id', 'name', 'rarity']


class CaseSerializer(serializers.ModelSerializer):
    items = CaseItemSerializer(many=True, read_only=True)

    class Meta:
        model = Case
        fields = ['id', 'name', 'description', 'price', 'items']


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['balance']


class InventoryItemSerializer(serializers.ModelSerializer):
    item = CaseItemSerializer(read_only=True)

    class Meta:
        model = InventoryItem
        fields = ['id', 'item', 'obtained_at']


class OpenHistorySerializer(serializers.ModelSerializer):
    case = serializers.StringRelatedField()
    item = CaseItemSerializer(read_only=True)

    class Meta:
        model = OpenHistory
        fields = ['id', 'case', 'item', 'opened_at']
