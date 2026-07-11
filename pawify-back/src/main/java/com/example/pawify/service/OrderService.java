package com.example.pawify.service;

import com.example.pawify.dto.in.order.OrderCreateRequestDTO;
import com.example.pawify.dto.out.order.OrderResponseDTO;
import com.example.pawify.model.BuyerEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

/**
 * Service interface for managing customer orders.
 *
 * <p>Provides operations for creating orders with stock validation,
 * retrieving paginated order histories for buyers, and looking up
 * individual orders by their unique tracking code.</p>
 */
public interface OrderService {

    /**
     * Creates a new order for the specified buyer.
     *
     * <p>Validates product stock availability, deducts stock,
     * generates a unique tracking code, and persists the order
     * with its line items. Duplicate product entries in the request
     * are merged by summing quantities. This operation is transactional.</p>
     *
     * @param buyerEntity the buyer placing the order
     * @param orderCreateRequestDTO the data transfer object containing order details and line items
     * @return the response DTO with the created order information
     * @throws com.example.pawify.exception.ResourceNotFoundException if any referenced product is not found
     * @throws com.example.pawify.exception.NotEnoughStockException if a product has insufficient stock
     */
    OrderResponseDTO createOrder(BuyerEntity buyerEntity, OrderCreateRequestDTO orderCreateRequestDTO);

    /**
     * Retrieves a paginated slice of orders for the specified buyer.
     *
     * @param buyerEntity the buyer whose orders are to be retrieved
     * @param pageable the pagination and sorting parameters
     * @return a {@link Slice} of order response DTOs
     */
    Slice<OrderResponseDTO> getOrdersByBuyer(BuyerEntity buyerEntity, Pageable pageable);

    /**
     * Retrieves a single order by its unique tracking code.
     *
     * @param trackingCode the unique tracking code of the order
     * @return the response DTO with the order information
     * @throws com.example.pawify.exception.ResourceNotFoundException if no order matches the given tracking code
     */
    OrderResponseDTO getOrderByTrackingCode(String trackingCode);
}
