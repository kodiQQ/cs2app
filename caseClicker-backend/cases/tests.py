# cases/tests_api.py

from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token

from .models import Case, CaseItem, Wallet, InventoryItem, OpenHistory

User = get_user_model()


class APITestCases(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='api_tester', password='pass123')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.assertTrue(Wallet.objects.filter(user=self.user).exists())

        self.case = Case.objects.create(name='Test Case', price=10)
        CaseItem.objects.create(case=self.case, name='Common', rarity='common', weight=80)
        CaseItem.objects.create(case=self.case, name='Rare', rarity='rare', weight=20)

    def test_list_cases(self):
        url = reverse('case-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.assertIsInstance(resp.data, list)
        self.assertEqual(resp.data[0]['id'], self.case.id)

    def test_wallet_endpoint(self):
        url = reverse('wallet')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.assertIn('balance', resp.data)
        self.assertEqual(resp.data['balance'], 100)

    def test_open_case_success(self):
        url = reverse('open-case', args=[self.case.id])
        resp = self.client.post(url)
        self.assertEqual(resp.status_code, 200)

        wallet = Wallet.objects.get(user=self.user)
        self.assertEqual(wallet.balance, 90)

        self.assertTrue(InventoryItem.objects.filter(user=self.user).exists())
        self.assertTrue(OpenHistory.objects.filter(user=self.user).exists())

    def test_open_case_insufficient_balance(self):
        wallet = Wallet.objects.get(user=self.user)
        wallet.balance = 5
        wallet.save()

        url = reverse('open-case', args=[self.case.id])
        resp = self.client.post(url)
        self.assertEqual(resp.status_code, 400)
        self.assertIn('detail', resp.data)

    def test_inventory_list(self):
        item = CaseItem.objects.first()
        InventoryItem.objects.create(user=self.user, item=item)

        url = reverse('inventory')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.assertIsInstance(resp.data, list)
        self.assertEqual(len(resp.data), 1)

    def test_history_list(self):
        item = CaseItem.objects.first()
        OpenHistory.objects.create(user=self.user, case=self.case, item=item)

        url = reverse('history')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.assertIsInstance(resp.data, list)
        self.assertEqual(len(resp.data), 1)
