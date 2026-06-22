#!/usr/bin/env python3
"""
Seed Test Users for The Forge
Creates 5 test accounts for beta testing.
"""

import sys
sys.path.insert(0, "/var/www/zaylegend/api")

from forge_db import create_user, list_users

TEST_USERS = [
    {"username": "tester1", "password": "forge2026", "display_name": "Tester One"},
    {"username": "tester2", "password": "forge2026", "display_name": "Tester Two"},
    {"username": "tester3", "password": "forge2026", "display_name": "Tester Three"},
    {"username": "tester4", "password": "forge2026", "display_name": "Tester Four"},
    {"username": "tester5", "password": "forge2026", "display_name": "Tester Five"},
]

def seed_users():
    print("Creating test users for The Forge...")
    print("-" * 40)

    created = 0
    for user_data in TEST_USERS:
        result = create_user(
            username=user_data["username"],
            password=user_data["password"],
            display_name=user_data["display_name"]
        )

        if result:
            print(f"Created: {user_data['username']} (ID: {result['id'][:8]}...)")
            created += 1
        else:
            print(f"Skipped: {user_data['username']} (already exists)")

    print("-" * 40)
    print(f"Created {created} new users")

    # Show all users
    print("\nAll Forge Users:")
    print("-" * 40)
    users = list_users()
    for user in users:
        print(f"  {user['username']:12} | Level {user.get('level', 1):2} | {user.get('total_xp', 0):5} XP | {user['display_name']}")

    print("-" * 40)
    print("\nTest Credentials:")
    print("  Username: tester1, tester2, tester3, tester4, tester5")
    print("  Password: forge2026")

if __name__ == "__main__":
    seed_users()
