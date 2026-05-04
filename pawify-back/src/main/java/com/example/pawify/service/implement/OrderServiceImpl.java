package com.example.pawify.service.implement;

import com.example.pawify.dto.in.order.DetailCreateRequestDTO;
import com.example.pawify.dto.in.order.OrderCreateRequestDTO;
import com.example.pawify.dto.out.order.OrderResponseDTO;
import com.example.pawify.exception.NotEnoughStockException;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.mapper.DetailMapper;
import com.example.pawify.mapper.OrderMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.OrderRepository;
import com.example.pawify.repository.ProductRepository;
import com.example.pawify.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final DetailMapper detailMapper;

    @Override
    @Transactional
    public OrderResponseDTO createOrder(BuyerEntity buyerEntity, OrderCreateRequestDTO dto) {
        Map<Long, Integer> grouped = new HashMap<>();
        for (DetailCreateRequestDTO d: dto.details()) {
            grouped.merge(d.productId(), d.quantity(), Integer::sum);
        }

        OrderEntity order = new OrderEntity();
        order.setBuyer(buyerEntity);
        BigDecimal total = BigDecimal.ZERO;

        List<DetailEntity> details = new ArrayList<>();

        Map<Long, ProductEntity> products = productRepository
            .findAllByIdForUpdate(new ArrayList<>(grouped.keySet()))
            .stream()
            .collect(Collectors.toMap(ProductEntity::getId, p -> p));

        // check for products not found
        for (Long productId : grouped.keySet()) {
            if (!products.containsKey(productId)) {
                throw new ResourceNotFoundException("Product not found: " + productId);
            }
        }

        for (Map.Entry<Long, Integer> e: grouped.entrySet()) {
            ProductEntity product = products.get(e.getKey());

            int stock = product.getStock();
            Integer quantity = e.getValue();

            if (stock < quantity) {
                throw new NotEnoughStockException("Stock is lower than quantity");
            }

            BigDecimal subTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
            DetailEntity detail = new DetailEntity();
            detail.setProduct(product);
            detail.setQuantity(quantity);
            detail.setTotal(subTotal);
            detail.setOrder(order);
            details.add(detail);

            product.setStock(stock - quantity);

            total = total.add(subTotal);
        }

        order.setDetails(details);
        order.setTotalPrice(total);
        OrderEntity savedOrder = orderRepository.save(order);

        return orderMapper.toResponseDTO(savedOrder);
    }
}
