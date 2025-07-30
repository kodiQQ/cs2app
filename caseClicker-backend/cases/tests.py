from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status

from .models import Case, CaseItem, Wallet, InventoryItem, OpenHistory

User = get_user_model()


class APITestCases(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='api_tester', password='pass123')
        self.token = Token.objects.create(user=self.user)
        self.auth_header = {'HTTP_AUTHORIZATION': 'Token ' + self.token.key}

        self.assertTrue(Wallet.objects.filter(user=self.user).exists())

        self.case = Case.objects.create(name='Test Case', price=10)
        CaseItem.objects.create(case=self.case, name='Common', rarity='common', weight=80)
        CaseItem.objects.create(case=self.case, name='Rare', rarity='rare', weight=20)

    def test_list_cases(self):
        url = reverse('case-list')
        resp = self.client.get(url, **self.auth_header)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsInstance(resp.data, list)
        case_data = resp.data[0]
        self.assertEqual(case_data['id'], self.case.id)
        self.assertIn('name', case_data)
        self.assertIn('description', case_data)
        self.assertIn('price', case_data)
        self.assertIsInstance(case_data['items'], list)

    def test_wallet_endpoint(self):
        url = reverse('wallet')
        resp = self.client.get(url, **self.auth_header)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('balance', resp.data)
        self.assertEqual(resp.data['balance'], 100)

    def test_open_case_success(self):
        url = reverse('open-case', args=[self.case.id])
        resp = self.client.post(url, **self.auth_header)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        self.assertIn('item', resp.data)
        self.assertIn('balance', resp.data)
        item = resp.data['item']
        self.assertIn('id', item)
        self.assertIn('name', item)
        self.assertIn('rarity', item)

        wallet = Wallet.objects.get(user=self.user)
        self.assertEqual(wallet.balance, 90)
        self.assertEqual(resp.data['balance'], 90)

        self.assertTrue(InventoryItem.objects.filter(user=self.user).exists())
        self.assertTrue(OpenHistory.objects.filter(user=self.user).exists())

    def test_open_case_insufficient_balance(self):
        wallet = Wallet.objects.get(user=self.user)
        wallet.balance = 5
        wallet.save()

        url = reverse('open-case', args=[self.case.id])
        resp = self.client.post(url, **self.auth_header)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', resp.data)

    def test_open_case_not_found(self):
        url = reverse('open-case', args=[999])
        resp = self.client.post(url, **self.auth_header)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_inventory_list(self):
        item = CaseItem.objects.first()
        InventoryItem.objects.create(user=self.user, item=item)

        url = reverse('inventory')
        resp = self.client.get(url, **self.auth_header)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsInstance(resp.data, list)
        self.assertEqual(len(resp.data), 1)

    def test_history_list(self):
        item = CaseItem.objects.first()
        OpenHistory.objects.create(user=self.user, case=self.case, item=item)

        url = reverse('history')
        resp = self.client.get(url, **self.auth_header)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsInstance(resp.data, list)
        self.assertEqual(len(resp.data), 1)

    def test_protected_endpoints_require_auth(self):
        urls = [
            reverse('case-list'),
            reverse('wallet'),
            reverse('open-case', args=[self.case.id]),
            reverse('inventory'),
            reverse('history'),
        ]
        for url in urls:
            resp = self.client.get(url)
            if url == reverse('case-list'):
                self.assertEqual(resp.status_code, status.HTTP_200_OK)
            else:
                self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthAPITestCases(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('api_token_auth')
        self.user_data = {'email': 'test@example.com', 'password': 'strongpass'}

    def test_register_missing_fields(self):
        resp = self.client.post(self.register_url, {})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', resp.data)

    def test_register_duplicate_email(self):
        User.objects.create_user(username=self.user_data['email'], email=self.user_data['email'], password='x')
        resp = self.client.post(self.register_url, self.user_data)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', resp.data)

    def test_register_success(self):
        resp = self.client.post(self.register_url, self.user_data)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', resp.data)
        self.assertIn('user', resp.data)
        self.assertIn('email', resp.data['user'])
        self.assertIn('id', resp.data['user'])

    def test_login_success_and_failure(self):
        self.client.post(self.register_url, self.user_data)
        resp = self.client.post(self.login_url, self.user_data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('token', resp.data)
        resp = self.client.post(self.login_url, {'username': 'wrong', 'password': 'nope'})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_current_user_endpoint(self):
        reg = self.client.post(self.register_url, self.user_data)
        token = reg.data['token']
        resp = self.client.get(reverse('current_user'), HTTP_AUTHORIZATION='Token ' + token)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('email', resp.data)
        self.assertIn('id', resp.data)

    def test_current_user_unauthorized(self):
        resp = self.client.get(reverse('current_user'))
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
