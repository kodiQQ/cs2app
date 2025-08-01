# Generated by Django 5.2.4 on 2025-07-09 16:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Case',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('price', models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='CaseItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('rarity', models.CharField(choices=[('common', 'Common'), ('rare', 'Rare'), ('legendary', 'Legendary')], max_length=10)),
                ('weight', models.PositiveIntegerField()),
                ('case', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='cases.case')),
            ],
        ),
        migrations.CreateModel(
            name='InventoryItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('obtained_at', models.DateTimeField(auto_now_add=True)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cases.caseitem')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OpenHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('opened_at', models.DateTimeField(auto_now_add=True)),
                ('case', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cases.case')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cases.caseitem')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Wallet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('balance', models.PositiveIntegerField(default=100)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
