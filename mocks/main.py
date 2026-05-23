from helper import *

def load_json(path):
  with open(path) as f:
    return json.load(f)

admins = load_json("data/admin.json")
products = load_json("data/products.json")
buyers = load_json("data/buyers.json")
generic_reviews = load_json("data/generic_review.json")
historial_trackings = load_json("data/tracking.json")

review_images = [
  "./images/review/review_1.webp",
  "./images/review/review_2.jpg",
  "./images/review/review_3.jpg",
  "./images/review/review_4.jpg"
]

if __name__ == "__main__":
  print("Creating admin...")
  print("-" * 30)
  for admin in admins:
    response = create_admin(admin)
    print(json.dumps(response, indent=2, ensure_ascii=False))

  response = login(admins[0]["username"], admins[0]["password"])
  print(json.dumps(response, indent=2, ensure_ascii=False))
  admin_token = response["token"]

  print("Creating products...")
  product_ids = []
  print("-" * 30)
  for product in products:
    response = create_product(admin_token, product)
    print(json.dumps(response, indent=2, ensure_ascii=False))
    product_ids.append(response["id"])

  print("Creating buyers...")
  print("-" * 30)
  buyer_tokens = []
  for buyer in buyers:
    response = create_buyer(buyer)
    print(json.dumps(response, indent=2, ensure_ascii=False))

    login_response = login(buyer["username"], buyer["password"])
    token = login_response["token"]
    print(json.dumps(login_response, indent=2, ensure_ascii=False))
    buyer_tokens.append(token)

  print("Creating orders...")
  print("-" * 30)
  order_ids = []
  detail_ids = {}
  for buyer_token in buyer_tokens:
    response = create_order(buyer_token, product_ids)
    print(json.dumps(response, indent=2, ensure_ascii=False))
    order_ids.append(response["id"])
    detail_ids[buyer_token] = [ detail["id"] for detail in response["details"] ]

  print("Creating reviews...")
  print("-" * 30)
  for buyer_token, buyer_detail_ids in detail_ids.items():
    for detail_id in buyer_detail_ids:
      response = create_review(buyer_token, detail_id, random.choice(generic_reviews))
      print(json.dumps(response, indent=2, ensure_ascii=False))

  print("Creating tracking history...")
  print("-" * 30)
  for order_id in order_ids:
    tracking_history_statuses = random.choice(historial_trackings)
    print("*" * 30)
    tracking_history_response = create_tracking_history(
      admin_token, order_id, tracking_history_statuses
    )
    print(json.dumps(tracking_history_response, indent=2, ensure_ascii=False))


