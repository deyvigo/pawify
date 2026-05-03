admins = [
  {
    "username": "useradmin",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "88694321"
  },
  {
    "username": "useradmin1",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "88697867"
  },
  {
    "username": "useradmin2",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "12345678"
  },
  {
    "username": "useradmin3",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "98765432"
  },
  {
    "username": "useradmin4",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "11111111"
  },
  {
    "username": "useradmin5",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "22222222"
  },
  {
    "username": "useradmin6",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "33333333"
  },
  {
    "username": "useradmin7",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "44444444"
  },
  {
    "username": "useradmin8",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "55555555"
  },
  {
    "username": "useradmin9",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "66666666"
  },
  {
    "username": "useradmin10",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "77777777"
  },
  {
    "username": "useradmin11",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "88888888"
  },
  {
    "username": "useradmin12",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "99999999"
  },
  {
    "username": "useradmin13",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "11111222"
  },
  {
    "username": "useradmin14",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "11112222"
  },
  {
    "username": "useradmin15",
    "password": "password",
    "first_name": "User",
    "last_name": "Admin",
    "dni_number": "33344444"
  }
]

import os
import dotenv
import json
import requests
dotenv.load_dotenv(dotenv_path=".env")

API_URL = os.getenv("API_URL")

def create_admin(admin):
  r = requests.post(f"{API_URL}/auth/register/admin", json=admin)
  return r.json()

if __name__ == "__main__":
  print("Creating admins...")
  for admin in admins:
    print("-" * 30)
    response = create_admin(admin)
    print(json.dumps(response, indent=2, ensure_ascii=False))