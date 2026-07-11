import { api } from './api';

/**
 * Builds an initial tracking event list for an order based on its shipping and order status.
 * Used to generate mock tracking data when real tracking data is unavailable.
 *
 * @param {Object} order - The order object to build trackings for.
 * @param {number} order.id - The order's unique identifier.
 * @param {string} order.shipping_status - The current shipping status (e.g., 'IN_TRANSIT', 'DELIVERED', 'CANCELED').
 * @param {string} order.order_status - The current order status (e.g., 'PAID', 'FAILED').
 * @param {string} order.order_at - The ISO timestamp when the order was placed.
 * @returns {Object[]} An array of tracking event objects, each with id, title, description, and timestamp.
 *
 * @example
 * const trackings = buildInitialTrackings({
 *   id: 1, shipping_status: 'DELIVERED', order_status: 'PAID', order_at: '2026-05-12T12:16:33'
 * });
 * // Returns: [{ id: 101, title: 'IN_TRANSIT', ... }, { id: 201, title: 'DELIVERED', ... }]
 */
function buildInitialTrackings(order) {
  const trackings = [];

  if (order.shipping_status === 'DELIVERED' || order.shipping_status === 'CANCELED') {
    trackings.push({
      id: 100 + order.id,
      title: 'IN_TRANSIT',
      description: 'Pedido creado y en tránsito',
      timestamp: order.order_at
    });

    const eventTime = new Date(new Date(order.order_at).getTime() + 86400000).toISOString();

    if (order.shipping_status === 'DELIVERED') {
      trackings.push({
        id: 200 + order.id,
        title: 'DELIVERED',
        description: 'Pedido entregado al comprador',
        timestamp: eventTime
      });
    } else {
      trackings.push({
        id: 200 + order.id,
        title: 'CANCELED',
        description: 'Pedido cancelado',
        timestamp: eventTime
      });
    }
  } else if (order.shipping_status === 'IN_TRANSIT' && order.order_status === 'FAILED') {
    trackings.push({
      id: 100 + order.id,
      title: 'IN_TRANSIT',
      description: 'Pedido creado y en tránsito',
      timestamp: order.order_at
    });
    trackings.push({
      id: 200 + order.id,
      title: 'FAILED',
      description: 'El pago del pedido falló',
      timestamp: new Date(new Date(order.order_at).getTime() + 3600000).toISOString()
    });
  } else {
    trackings.push({
      id: 100 + order.id,
      title: order.shipping_status || 'IN_TRANSIT',
      description: 'Pedido creado y en tránsito',
      timestamp: order.order_at
    });
  }

  return trackings;
}

const MOCK_ORDERS = [
  {
    id: 1,
    tracking_code: "hce30e7pqcuaf0n6",
    buyer: { id: 17, username: "userbuyer1", first_name: "Andrea", last_name: "Buyer" },
    total_price: 12.00,
    order_at: "2026-05-12T12:16:33",
    shipping_status: "IN_TRANSIT",
    order_status: "PAID",
    details: [
      { id: 1, product_name: "Snack dental", quantity: 2, price: 6.00, total: 12, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606183/pawify/y78rxk01lavialovi8in.webp" }
    ]
  },
  {
    id: 2,
    tracking_code: "7v0z3jpoe9r1npwd",
    buyer: { id: 17, username: "userbuyer1", first_name: "Andrea", last_name: "Buyer" },
    total_price: 10.00,
    order_at: "2026-05-23T03:35:03",
    shipping_status: "IN_TRANSIT",
    order_status: "PAID",
    details: [
      { id: 2, product_name: "Croquetas", quantity: 1, price: 10.00, total: 10, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606105/pawify/i796vpjkkvgkuk6h0qo8.jpg" }
    ]
  },
  {
    id: 3,
    tracking_code: "x9k2m4n7pqrs5t1v",
    buyer: { id: 18, username: "juancarlosp", first_name: "Juan Carlos", last_name: "Pérez" },
    total_price: 45.50,
    order_at: "2026-05-20T15:30:00",
    shipping_status: "DELIVERED",
    order_status: "PAID",
    details: [
      { id: 3, product_name: "Collar ajustable", quantity: 1, price: 15.50, total: 15, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606120/pawify/nds9f8a7sdflkjh2.webp" },
      { id: 4, product_name: "Correa retráctil", quantity: 1, price: 30.00, total: 30, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606130/pawify/lkjh3g4f5dsa7f8g9.webp" }
    ]
  },
  {
    id: 4,
    tracking_code: "a1b2c3d4e5f6g7h8",
    buyer: { id: 19, username: "marialopez", first_name: "María", last_name: "López" },
    total_price: 89.00,
    order_at: "2026-05-19T09:15:00",
    shipping_status: "IN_TRANSIT",
    order_status: "PAID",
    details: [
      { id: 5, product_name: "Cama para perro mediano", quantity: 1, price: 55.00, total: 55, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606140/pawify/cama_perro_mediano.webp" },
      { id: 6, product_name: "Shampoo antipulgas", quantity: 2, price: 17.00, total: 34, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606150/pawify/shampoo_antipulgas.webp" }
    ]
  },
  {
    id: 5,
    tracking_code: "i9j0k1l2m3n4o5p6",
    buyer: { id: 20, username: "carlosmendoza", first_name: "Carlos", last_name: "Mendoza" },
    total_price: 220.00,
    order_at: "2026-05-18T14:00:00",
    shipping_status: "IN_TRANSIT",
    order_status: "PENDING",
    details: [
      { id: 7, product_name: "Transportadora para mascotas", quantity: 1, price: 120.00, total: 120, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606160/pawify/transportadora.webp" },
      { id: 8, product_name: "Rascador para gatos", quantity: 1, price: 100.00, total: 100, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606170/pawify/rascador_gatos.webp" }
    ]
  },
  {
    id: 6,
    tracking_code: "q7r8s9t0u1v2w3x4",
    buyer: { id: 21, username: "anatorres", first_name: "Ana", last_name: "Torres" },
    total_price: 23.00,
    order_at: "2026-05-17T11:45:00",
    shipping_status: "DELIVERED",
    order_status: "PAID",
    details: [
      { id: 9, product_name: "Bolsas biodegradables", quantity: 3, price: 5.00, total: 15, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606180/pawify/bolsas_bio.webp" },
      { id: 10, product_name: "Snack natural de pollo", quantity: 2, price: 4.00, total: 8, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606190/pawify/snack_pollo.webp" }
    ]
  },
  {
    id: 7,
    tracking_code: "y5z6a7b8c9d0e1f2",
    buyer: { id: 22, username: "pedroramirez", first_name: "Pedro", last_name: "Ramírez" },
    total_price: 67.00,
    order_at: "2026-05-16T16:20:00",
    shipping_status: "IN_TRANSIT",
    order_status: "PAID",
    details: [
      { id: 11, product_name: "Correa doble para paseo", quantity: 1, price: 35.00, total: 35, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606200/pawify/correa_doble.webp" },
      { id: 12, product_name: "Pelota interactiva", quantity: 2, price: 16.00, total: 32, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606210/pawify/pelota_interactiva.webp" }
    ]
  },
  {
    id: 8,
    tracking_code: "g3h4i5j6k7l8m9n0",
    buyer: { id: 23, username: "lauravargas", first_name: "Laura", last_name: "Vargas" },
    total_price: 155.00,
    order_at: "2026-05-15T10:00:00",
    shipping_status: "IN_TRANSIT",
    order_status: "FAILED",
    details: [
      { id: 13, product_name: "Fuente de agua automática", quantity: 1, price: 85.00, total: 85, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606220/pawify/fuente_agua.webp" },
      { id: 14, product_name: "Dispensador de comida", quantity: 1, price: 70.00, total: 70, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606230/pawify/dispensador_comida.webp" }
    ]
  },
  {
    id: 9,
    tracking_code: "o1p2q3r4s5t6u7v8",
    buyer: { id: 24, username: "diegofernandez", first_name: "Diego", last_name: "Fernández" },
    total_price: 32.00,
    order_at: "2026-05-14T08:30:00",
    shipping_status: "DELIVERED",
    order_status: "PAID",
    details: [
      { id: 15, product_name: "Arena para gatos", quantity: 2, price: 10.00, total: 20, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606240/pawify/arena_gatos.webp" },
      { id: 16, product_name: "Cepillo quitapelo", quantity: 1, price: 12.00, total: 12, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606250/pawify/cepillo_quitapelo.webp" }
    ]
  },
  {
    id: 10,
    tracking_code: "w9x0y1z2a3b4c5d6",
    buyer: { id: 25, username: "sofiamartinez", first_name: "Sofía", last_name: "Martínez" },
    total_price: 42.00,
    order_at: "2026-05-13T13:15:00",
    shipping_status: "CANCELED",
    order_status: "CANCELED",
    details: [
      { id: 17, product_name: "Vitaminas para perros", quantity: 1, price: 28.00, total: 28, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606260/pawify/vitaminas_perros.webp" },
      { id: 18, product_name: "Snack dental", quantity: 2, price: 7.00, total: 14, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606183/pawify/y78rxk01lavialovi8in.webp" }
    ]
  },
  {
    id: 11,
    tracking_code: "e7f8g9h0i1j2k3l4",
    buyer: { id: 26, username: "robertosilva", first_name: "Roberto", last_name: "Silva" },
    total_price: 175.00,
    order_at: "2026-05-11T17:00:00",
    shipping_status: "IN_TRANSIT",
    order_status: "PAID",
    details: [
      { id: 19, product_name: "Casita para perros pequeños", quantity: 1, price: 150.00, total: 150, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606270/pawify/casita_perros.webp" },
      { id: 20, product_name: "Juguete mordedor", quantity: 1, price: 25.00, total: 25, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606280/pawify/juguete_mordedor.webp" }
    ]
  },
  {
    id: 12,
    tracking_code: "m5n6o7p8q9r0s1t2",
    buyer: { id: 27, username: "carolinadiaz", first_name: "Carolina", last_name: "Díaz" },
    total_price: 56.00,
    order_at: "2026-05-10T09:45:00",
    shipping_status: "DELIVERED",
    order_status: "PAID",
    details: [
      { id: 21, product_name: "Plato antivoracidad", quantity: 1, price: 28.00, total: 28, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606290/pawify/plato_antivoracidad.webp" },
      { id: 22, product_name: "Comedero doble acero", quantity: 1, price: 28.00, total: 28, product_image: "https://res.cloudinary.com/drpvxaxr2/image/upload/v1778606300/pawify/comedero_doble.webp" }
    ]
  }
];

let mockDb = [...MOCK_ORDERS];

const USE_MOCK = true;

/**
 * Retrieves a paginated list of admin orders.
 * Currently uses mock data when USE_MOCK is true; otherwise fetches from the API.
 *
 * @param {number} [page=0] - The page number to retrieve (0-indexed).
 * @param {number} [size=10] - The number of orders per page.
 * @returns {Promise<Object>} A paginated response object containing:
 * @returns {Object[]} returns.content - Array of order objects with details.
 * @returns {boolean} returns.first - Whether this is the first page.
 * @returns {boolean} returns.last - Whether this is the last page.
 * @returns {number} returns.number - The current page number.
 * @returns {number} returns.number_of_elements - Number of elements in the current page.
 * @returns {number} returns.size - The page size.
 * @returns {boolean} returns.empty - Whether the result set is empty.
 *
 * @example
 * const data = await getAdminOrders(0, 5);
 * console.log(data.content); // Array of order objects
 */
export async function getAdminOrders(page = 0, size = 10) {
  if (USE_MOCK) {
    const start = page * size;
    const content = mockDb.slice(start, start + size);
    return {
      content,
      first: page === 0,
      last: start + size >= mockDb.length,
      number: page,
      number_of_elements: content.length,
      size,
      empty: content.length === 0
    };
  }

  const data = await api.get(`/admin/orders?page=${page}&size=${size}`);
  return data;
}

/**
 * Retrieves a single order by its unique tracking code.
 * Includes tracking event history when using mock data.
 *
 * @param {string} trackingCode - The unique tracking code of the order.
 * @returns {Promise<Object>} The order object with all details and tracking events.
 * @throws {Error} If no order is found with the given tracking code.
 *
 * @example
 * const order = await getAdminOrderByTrackingCode('hce30e7pqcuaf0n6');
 * console.log(order.tracking_code); // 'hce30e7pqcuaf0n6'
 * console.log(order.trackings);     // Array of tracking events
 */
export async function getAdminOrderByTrackingCode(trackingCode) {
  if (USE_MOCK) {
    const order = mockDb.find(o => o.tracking_code === trackingCode);
    if (!order) throw new Error('Pedido no encontrado');

    if (!order.trackings) {
      order.trackings = buildInitialTrackings(order);
    }

    return JSON.parse(JSON.stringify(order));
  }

  return api.get(`/admin/orders/${trackingCode}`);
}

/**
 * Updates the shipping status of an order identified by its tracking code.
 * Valid statuses are 'IN_TRANSIT' and 'DELIVERED'. Appends a new tracking event.
 *
 * @param {string} trackingCode - The unique tracking code of the order to update.
 * @param {string} newStatus - The new shipping status. Must be 'IN_TRANSIT' or 'DELIVERED'.
 * @returns {Promise<Object>} The updated order object with the new tracking event.
 * @throws {Error} If no order is found with the given tracking code.
 * @throws {Error} If the newStatus is not one of the valid statuses.
 *
 * @example
 * const updated = await updateOrderStatus('hce30e7pqcuaf0n6', 'DELIVERED');
 * console.log(updated.shipping_status); // 'DELIVERED'
 */
export async function updateOrderStatus(trackingCode, newStatus) {
  if (USE_MOCK) {
    const order = mockDb.find(o => o.tracking_code === trackingCode);
    if (!order) throw new Error('Pedido no encontrado');

    const validStatuses = ['IN_TRANSIT', 'DELIVERED'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Estado no válido: "${newStatus}". Estados válidos: ${validStatuses.join(', ')}`);
    }

    const oldStatus = order.shipping_status;
    order.shipping_status = newStatus;

    if (!order.trackings) order.trackings = [];
    order.trackings.push({
      id: Date.now(),
      title: newStatus,
      description: `Estado cambiado de "${oldStatus}" a "${newStatus}"`,
      timestamp: new Date().toISOString()
    });

    return order;
  }

  return api.patch(`/admin/orders/${trackingCode}/status`, { shipping_status: newStatus });
}

/**
 * Retrieves the tracking status history for a specific order.
 * Returns paginated tracking events associated with the given tracking code.
 *
 * @param {string} trackingCode - The unique tracking code of the order.
 * @returns {Promise<Object>} A tracking response object containing:
 * @returns {Object[]} returns.content - Array of tracking event objects.
 * @returns {boolean} returns.has_next - Whether there are more pages of tracking data.
 * @returns {string|null} returns.next_cursor - The cursor for the next page, or null if at the end.
 *
 * @example
 * const tracking = await getOrderTrackingStatus('hce30e7pqcuaf0n6');
 * console.log(tracking.content); // [{ id: 101, title: 'IN_TRANSIT', ... }, ...]
 */
export async function getOrderTrackingStatus(trackingCode) {
  if (USE_MOCK) {
    const order = mockDb.find(o => o.tracking_code === trackingCode);
    return {
      content: order?.trackings || [],
      has_next: false,
      next_cursor: null
    };
  }

  return api.get(`/trackingstatus/${trackingCode}?size=10`);
}
