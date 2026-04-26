import requests
import json

API_URL = "http://localhost:8080"

admin = {
  "username": "useradmin",
  "password": "password",
  "first_name": "User",
  "last_name": "Admin",
  "dni_number": "88697867"
}

admin_login = {
  "username": "useradmin",
  "password": "password"
}

def create_admin():
  r = requests.post(f"{API_URL}/auth/register/admin", json=admin)
  return r.json()

def login_admin():
  r = requests.post(f"{API_URL}/auth/login", json=admin_login)
  return r.json() # { "token": "string", refresh_token: "string" }

products = [
  {
    "name": "Croquetas",
    "description": "Chow Chow",
    "price": 10,
    "stock": 10,
    "category": "Croquetas",
    "brand": "Dog Chow",
    "images": [
      "./images/croquetas_1.webp",
      "./images/croquetas_2.webp",
      "./images/croquetas_3.jpg"
    ]
  },
  {
    "name": "Dispensador de comida",
    "description": "Comida para todos",
    "price": 10,
    "stock": 10,
    "category": "Dispensador",
    "brand": "Angies Boutique",
    "images": [
      "./images/dispensador_1.webp",
      "./images/dispensador_2.jpg",
      "./images/dispensador_3.webp"
    ]
  },
  {
    "name": "Collar ajustable",
    "description": "Collar resistente y cómodo para perros de todas las tallas",
    "price": 8,
    "stock": 25,
    "category": "Accesorios",
    "brand": "PetStyle",
    "images": [
      "./images/collar_ajustable_1.webp",
      "./images/collar_ajustable_2.webp",
      "./images/collar_ajustable_3.webp"
    ]
  },
  {
    "name": "Correa retráctil",
    "description": "Correa extensible hasta 5 metros con sistema de bloqueo",
    "price": 15,
    "stock": 18,
    "category": "Accesorios",
    "brand": "WalkMate",
    "images": [
      "./images/correa_retractil_1.webp",
      "./images/correa_retractil_2.webp",
      "./images/correa_retractil_3.webp"
    ]
  },
  {
    "name": "Juguete mordedor",
    "description": "Juguete de goma resistente para reducir ansiedad y estrés",
    "price": 6,
    "stock": 40,
    "category": "Juguetes",
    "brand": "HappyPet",
    "images": [
      "./images/juguete_mordedor_1.webp",
      "./images/juguete_mordedor_2.webp",
      "./images/juguete_mordedor_3.jpeg"
    ]
  },
  {
    "name": "Cama para perro mediano",
    "description": "Cama acolchada con base antideslizante",
    "price": 25,
    "stock": 12,
    "category": "Descanso",
    "brand": "CozyPaws",
    "images": [
      "./images/cama_para_perro_1.webp",
      "./images/cama_para_perro_2.webp",
      "./images/cama_para_perro_3.webp"
    ]
  },
  {
    "name": "Shampoo antipulgas",
    "description": "Shampoo especial para eliminar pulgas y garrapatas",
    "price": 9,
    "stock": 30,
    "category": "Higiene",
    "brand": "VetCare",
    "images": [
      "./images/shampoo_antipulgas_1.webp",
      "./images/shampoo_antipulgas_2.webp",
      "./images/shampoo_antipulgas_3.webp"
    ]
  },
  {
    "name": "Comedero doble acero inoxidable",
    "description": "Bowl doble para agua y comida, fácil de limpiar",
    "price": 12,
    "stock": 22,
    "category": "Alimentación",
    "brand": "PetKitchen",
    "images": [
      "./images/comedero_acero_1.png",
      "./images/comedero_acero_2.webp",
      "./images/comedero_acero_3.webp"
    ]
  },
  {
    "name": "Transportadora para mascotas",
    "description": "Caja de transporte segura para viajes cortos y largos",
    "price": 35,
    "stock": 8,
    "category": "Transporte",
    "brand": "SafeTravel Pet",
    "images": [
      "./images/transportadora_1.webp",
      "./images/transportadora_2.webp",
      "./images/transportadora_3.jpeg"
    ]
  },
  {
    "name": "Snack natural de pollo",
    "description": "Premios saludables ricos en proteína",
    "price": 5,
    "stock": 50,
    "category": "Snacks",
    "brand": "NatureBites",
    "images": [
      "./images/snack_pollo_1.webp",
      "./images/snack_pollo_2.webp",
      "./images/snack_pollo_3.webp"
    ]
  },
  {
    "name": "Collar LED luminoso",
    "description": "Collar con luz LED para paseos nocturnos seguros",
    "price": 9,
    "stock": 20,
    "category": "Accesorios",
    "brand": "NightPaw",
    "images": [
      "./images/collar_led_1.webp",
      "./images/collar_led_2.webp",
      "./images/collar_led_3.png"
    ]
  },
  {
    "name": "Plato antivoracidad",
    "description": "Comedero diseñado para evitar que el perro coma demasiado rápido",
    "price": 7,
    "stock": 30,
    "category": "Alimentación",
    "brand": "SlowEat Pet",
    "images": [
      "./images/plato_antivoracidad_1.webp",
      "./images/plato_antivoracidad_2.jpg",
      "./images/plato_antivoracidad_3.jpg"
    ]
  },
  {
    "name": "Cepillo quitapelo",
    "description": "Cepillo para eliminar pelo muerto en perros y gatos",
    "price": 6,
    "stock": 35,
    "category": "Higiene",
    "brand": "FurClean",
    "images": [
      "./images/cepillo_quitapelo_1.webp",
      "./images/cepillo_quitapelo_2.webp",
      "./images/cepillo_quitapelo_3.jpg"
    ]
  },
  {
    "name": "Arena para gatos",
    "description": "Arena aglomerante con control de olores",
    "price": 12,
    "stock": 40,
    "category": "Higiene",
    "brand": "CatPure",
    "images": [
      "./images/arena_gato_1.webp",
      "./images/arena_gato_2.webp",
      "./images/arena_gato_3.jpg"
    ]
  },
  {
    "name": "Rascador para gatos",
    "description": "Rascador de cartón resistente para gatos",
    "price": 11,
    "stock": 18,
    "category": "Juguetes",
    "brand": "Scratchy",
    "images": [
      "./images/rascador_gatos_1.webp",
      "./images/rascador_gatos_2.webp",
      "./images/rascador_gatos_3.jpg"
    ]
  },
  {
    "name": "Pelota interactiva",
    "description": "Pelota que rebota irregularmente para estimular el juego",
    "price": 5,
    "stock": 60,
    "category": "Juguetes",
    "brand": "PlayPet",
    "images": [
      "./images/pelota_interactiva_1.webp",
      "./images/pelota_interactiva_2.webp",
      "./images/pelota_interactiva_3.jpg"
    ]
  },
  {
    "name": "Vitaminas para perros",
    "description": "Suplemento vitamínico para mejorar la salud general",
    "price": 14,
    "stock": 25,
    "category": "Salud",
    "brand": "VitaPet",
    "images": [
      "./images/vitaminas_perros_1.webp",
      "./images/vitaminas_perros_2.jpg",
      "./images/vitaminas_perros_3.webp"
    ]
  },
  {
    "name": "Correa doble para paseo",
    "description": "Permite pasear dos perros al mismo tiempo",
    "price": 13,
    "stock": 15,
    "category": "Accesorios",
    "brand": "WalkPro",
    "images": [
      "./images/correa_doble_1.jpg",
      "./images/correa_doble_2.jpg",
      "./images/correa_doble_3.webp"
    ]
  },
  {
    "name": "Casita para perros pequeños",
    "description": "Casa portátil y resistente al clima",
    "price": 28,
    "stock": 10,
    "category": "Descanso",
    "brand": "HomePaw",
    "images": [
      "./images/casa_perro_1.webp",
      "./images/casa_perro_2.webp",
      "./images/casa_perro_3.webp"
    ]
  },
  {
    "name": "Bolsas biodegradables",
    "description": "Bolsas ecológicas para recoger desechos de mascotas",
    "price": 4,
    "stock": 100,
    "category": "Higiene",
    "brand": "EcoPet",
    "images": [
      "./images/bolsa_biodegradable_1.webp",
      "./images/bolsa_biodegradable_2.webp",
      "./images/bolsa_biodegradable_3.webp"
    ]
  },
  {
    "name": "Arnés ajustable",
    "description": "Arnés cómodo para control de perros durante el paseo",
    "price": 11,
    "stock": 22,
    "category": "Accesorios",
    "brand": "ControlDog",
    "images": [
      "./images/arnes_ajustable_1.webp",
      "./images/arnes_ajustable_2.webp",
      "./images/arnes_ajustable_3.webp"
    ]
  },
  {
    "name": "Snack dental",
    "description": "Premios que ayudan a limpiar los dientes del perro",
    "price": 6,
    "stock": 45,
    "category": "Snacks",
    "brand": "DentaPet",
    "images": [
      "./images/snack_dental_1.webp",
      "./images/snack_dental_2.webp",
      "./images/snack_dental_3.webp"
    ]
  },
  {
    "name": "Fuente de agua automática",
    "description": "Dispensador de agua con filtrado continuo",
    "price": 22,
    "stock": 14,
    "category": "Alimentación",
    "brand": "HydraPet",
    "images": [
      "./images/fuente_agua_1.png",
      "./images/fuente_agua_2.webp",
      "./images/fuente_agua_3.webp"
    ]
  }
]

def create_product(jwt_token, product):
  files = []
  file_handles = []
  
  try:
    for img in product["images"]:
      f = open(img, 'rb')
      file_handles.append(f)
      files.append(("images", (img, f)))

    data = {
      "name": product["name"],
      "description": product["description"],
      "price": product["price"],
      "stock": product["stock"],
      "category": product["category"],
      "brand": product["brand"],
    }

    headers = {
      "Authorization": f"Bearer {jwt_token}"
    }

    r = requests.post(
      url=f"{API_URL}/product",
      data=data,
      files=files,
      headers=headers
    )

    return r.json()
  finally:
    for f in file_handles:
      f.close()


if __name__ == "__main__":
  print("Creating admin...")
  admin = create_admin()
  print("-- Admin created!: ", admin)
  print("Login admin...")
  token = login_admin()
  print("-- Admin logged in!")
  print(json.dumps(token, indent=2, ensure_ascii=False))
  print("Creating products...")
  for product in products:
    print("--------------------------------------------------------------------------------")
    product = create_product(token, product)
    print("Product created!: ")
    print(json.dumps(product, indent=2, ensure_ascii=False))
