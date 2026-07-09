package com.example.pawify.service.implement;

import com.example.pawify.dto.CursorInternalDTO;
import com.example.pawify.dto.in.order.DetailCreateRequestDTO;
import com.example.pawify.dto.in.order.OrderCreateRequestDTO;
import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.order.OrderResponseDTO;
import com.example.pawify.exception.NotEnoughStockException;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.mapper.OrderMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.OrderRepository;
import com.example.pawify.repository.ProductRepository;
import com.example.pawify.service.CodeGenerator;
import com.example.pawify.service.OrderService;
import com.example.pawify.utils.CursorUtil;
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
    private final CodeGenerator codeGenerator;
    private final CursorUtil cursorUtil;

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

        String trackingCode;
        do {
            trackingCode = codeGenerator.generateCode(16);
        } while (orderRepository.existsByTrackingCode(trackingCode));

        order.setDetails(details);
        order.setTotalPrice(total);
        order.setTrackingCode(trackingCode);
        OrderEntity savedOrder = orderRepository.save(order);

        return orderMapper.toResponseDTO(savedOrder);
    }

//    @Override
//    public Slice<OrderResponseDTO> getOrdersByBuyer(BuyerEntity buyerEntity, Pageable pageable) {
//        Page<OrderEntity> page = orderRepository.findAllByBuyer(buyerEntity, pageable);
//        return new SliceImpl<>(
//            page.map(orderMapper::toResponseDTO).getContent(),
//            pageable,
//            page.hasNext()
//        );
//    }

    @Override
    public OrderResponseDTO getOrderByTrackingCode(String trackingCode) {
        OrderEntity orderEntity = orderRepository.findByTrackingCode(trackingCode)
            .orElseThrow(() -> new ResourceNotFoundException("tracking_code not found"));

        return orderMapper.toResponseDTO(orderEntity);
    }

    @Override
    public void updateOrderStatusByOrderId(Long orderId, OrderStatus orderStatus) {
        OrderEntity orderToModify = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("order_id not found: " + orderId));

        orderToModify.setOrderStatus(orderStatus);
        orderRepository.save(orderToModify);
    }

    @Override
    public Page<OrderResponseDTO> getOrdersWithFilters(
        String cursor, BuyerEntity buyer, Integer size, String status, String trackingCode
    ) {
        CursorInternalDTO internalCursor = cursor != null ? cursorUtil.decode(cursor) : null;

        List<OrderEntity> orderEntities = orderRepository.findAllWithFilters(
            internalCursor, buyer, size + 1, status, trackingCode
        );

        boolean hasNext = orderEntities.size() > size;
        if (hasNext) {
            orderEntities.removeLast();
        }

        String nextCursor = null;
        if (!orderEntities.isEmpty() && hasNext) {
            OrderEntity last = orderEntities.getLast();
            nextCursor = cursorUtil.encode(new CursorInternalDTO(last.getOrderAt(), last.getId()));
        }

        return new Page<>(
            orderEntities.stream().map(orderMapper::toResponseDTO).toList(),
            hasNext,
            nextCursor
        );
    }
}
