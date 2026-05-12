import os
import dotenv
import json
import requests
dotenv.load_dotenv(dotenv_path=".env")
import random

API_URL = os.getenv("API_URL")

def create_admin(admin):
  r = requests.post(f"{API_URL}/auth/register/admin", json=admin)
  return r.json()

def login(username, password):
  credentials = {
    "username": username,
    "password": password
  }
  r = requests.post(f"{API_URL}/auth/login", json=credentials)
  return r.json() # { "token": "string", refresh_token: "string" }

def create_product(jwt_token, product):
  files = []
  file_handles = []
  
  try:
    payload = {
      "name": product["name"],
      "description": product["description"],
      "price": product["price"],
      "stock": product["stock"],
      "category": product["category"],
      "sub_category": product["sub_category"],
      "brand": product["brand"],
    }

    files.append((
      "data",
      (None, json.dumps(payload), "application/json")
    ))

    for img in product["images"]:
      f = open(img, 'rb')
      file_handles.append(f)
      files.append(("images", (img, f)))

    headers = {
      "Authorization": f"Bearer {jwt_token}"
    }

    r = requests.post(
      url=f"{API_URL}/product",
      files=files,
      headers=headers
    )

    return r.json()
  finally:
    for f in file_handles:
      f.close()

def create_order(jwt_token, product_ids):
  products_to_order = random.sample(product_ids, random.randint(1, 3))
  payload = {
    "details": [
      {
        "product_id": product_id,
        "quantity": random.choice([1, 2, 3]) 
      }
      for product_id in products_to_order
    ]
  }

  response = requests.post(
    url=f"{API_URL}/order",
    json=payload,
    headers={
      "Authorization": f"Bearer {jwt_token}"
    }
  )

  return response.json() # { "id": number, "details": [ { "id": number } ] }

def create_buyer(buyer):
  r = requests.post(f"{API_URL}/auth/register/buyer", json=buyer)
  return r.json()

def create_review(jwt_token, detail_id, review_content):
  review_images = [
    "./images/review/review_1.webp",
    "./images/review/review_2.jpg",
    "./images/review/review_3.jpg",
    "./images/review/review_4.jpg"
  ]

  files = []
  file_handles = []
  review_data = {
    "content": review_content["content"],
    "rating": review_content["rating"],
    "detail_id": detail_id
  }

  files.append((
    "data",
    (None, json.dumps(review_data), "application/json")
  ))

  have_image = random.choice([True, False])
  if have_image:
    image_path = random.choice(review_images)
    f = open(image_path, 'rb')
    file_handles.append(f)
    files.append(("images", (image_path, f)))

  response = requests.post(
    url=f"{API_URL}/review",
    files=files,
    headers={
      "Authorization": f"Bearer {jwt_token}"
    }
  )

  for f in file_handles:
    f.close()

  return response.json()

def create_tracking_history(jwt_token, order_id, statuses):
  tracking_history_response = []
  for status in statuses["statuses"]:
    tracking_history_data = {
      "order_id": order_id,
      "title": status["title"],
      "description": status["description"]
    }

    response = requests.post(
      url=f"{API_URL}/trackingstatus",
      json=tracking_history_data,
      headers={
        "Authorization": f"Bearer {jwt_token}"
      }
    )
    tracking_history_response.append(response.json())

  return tracking_history_response
