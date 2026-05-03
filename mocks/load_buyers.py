buyers = [
  {
    "username": "userbuyer1",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example1@gmail.com",
    "dni_number": "12367823"
  },
  {
    "username": "userbuyer2",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example2@gmail.com",
    "dni_number": "48572930"
  },
  {
    "username": "userbuyer3",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example3@gmail.com",
    "dni_number": "39940392"
  },
  {
    "username": "userbuyer4",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example4@gmail.com",
    "dni_number": "39485043"
  },
  {
    "username": "userbuyer5",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example5@gmail.com",
    "dni_number": "04958374"
  },
  {
    "username": "userbuyer6",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example6@gmail.com",
    "dni_number": "75894058"
  },
  {
    "username": "userbuyer7",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example7@gmail.com",
    "dni_number": "95837489"
  },
  {
    "username": "userbuyer8",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example8@gmail.com",
    "dni_number": "87462932"
  },
  {
    "username": "userbuyer9",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example9@gmail.com",
    "dni_number": "94856152"
  },
  {
    "username": "userbuyer10",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example10@gmail.com",
    "dni_number": "13849248"
  },
  {
    "username": "userbuyer11",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example11@gmail.com",
    "dni_number": "03942739"
  },
  {
    "username": "userbuyer12",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example12@gmail.com",
    "dni_number": "94726372"
  },
  {
    "username": "userbuyer13",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example13@gmail.com",
    "dni_number": "74857945"
  },
  {
    "username": "userbuyer14",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example14@gmail.com",
    "dni_number": "83749203"
  },
  {
    "username": "userbuyer15",
    "password": "password",
    "first_name": "User",
    "last_name": "Buyer",
    "email": "example15@gmail.com",
    "dni_number": "88372832"
  }
]

import os
import dotenv
import json
import requests
dotenv.load_dotenv(dotenv_path=".env")

API_URL = os.getenv("API_URL")

def create_buyer(buyer):
  r = requests.post(f"{API_URL}/auth/register/buyer", json=buyer)
  return r.json()

if __name__ == "__main__":
  print("Creating buyers...")
  for buyer in buyers:
    print("-" * 30)
    response = create_buyer(buyer)
    print(json.dumps(response, indent=2, ensure_ascii=False))