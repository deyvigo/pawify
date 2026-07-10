package com.example.pawify.service;

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
import com.example.pawify.service.implement.OrderServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderMapper orderMapper;

    @Mock
    private DetailMapper detailMapper;

    @Mock
    private CodeGenerator codeGenerator;

    @InjectMocks
    private OrderServiceImpl orderService;

    private BuyerEntity createBuyer() {
        BuyerEntity buyer = new BuyerEntity();
        buyer.setId(1L);
        buyer.setUsername("buyer1");
        buyer.setEmail("buyer@email.com");
        return buyer;
    }

    private ProductEntity createProduct(Long id, String name, BigDecimal price, int stock) {
        ProductEntity product = new ProductEntity();
        product.setId(id);
        product.setName(name);
        product.setPrice(price);
        product.setStock(stock);
        product.setActive(true);
        return product;
    }

    @Nested
    @DisplayName("createOrder tests")
    class CreateOrderTests {

        @Test
        @DisplayName("should throw ResourceNotFoundException when product not found")
        void shouldThrowWhenProductNotFound() {
            BuyerEntity buyer = createBuyer();
            OrderCreateRequestDTO dto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(999L, 1))
            );

            when(productRepository.findAllByIdForUpdate(List.of(999L))).thenReturn(List.of());

            assertThatThrownBy(() -> orderService.createOrder(buyer, dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Product not found: 999");
        }

        @Test
        @DisplayName("should throw NotEnoughStockException when stock is lower than quantity")
        void shouldThrowWhenNotEnoughStock() {
            BuyerEntity buyer = createBuyer();
            ProductEntity product = createProduct(1L, "Product 1", BigDecimal.valueOf(100), 5);
            OrderCreateRequestDTO dto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(1L, 10))
            );

            when(productRepository.findAllByIdForUpdate(List.of(1L)))
                .thenReturn(List.of(product));

            assertThatThrownBy(() -> orderService.createOrder(buyer, dto))
                .isInstanceOf(NotEnoughStockException.class)
                .hasMessage("Stock is lower than quantity");
        }

        @Test
        @DisplayName("should create order successfully with valid data")
        void shouldCreateOrderSuccessfully() {
            BuyerEntity buyer = createBuyer();
            ProductEntity product = createProduct(1L, "Product 1", BigDecimal.valueOf(100), 10);
            OrderEntity savedOrder = new OrderEntity();
            savedOrder.setId(1L);
            savedOrder.setTrackingCode("TRACK123");
            savedOrder.setTotalPrice(BigDecimal.valueOf(200));

            OrderResponseDTO expectedResponse = new OrderResponseDTO(
                1L, BigDecimal.valueOf(200), null, "TRACK123", null, null
            );

            OrderCreateRequestDTO dto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(1L, 2))
            );

            when(productRepository.findAllByIdForUpdate(List.of(1L)))
                .thenReturn(List.of(product));
            when(codeGenerator.generateCode(16)).thenReturn("TRACK123");
            when(orderRepository.existsByTrackingCode("TRACK123")).thenReturn(false);
            when(orderRepository.save(any(OrderEntity.class))).thenReturn(savedOrder);
            when(orderMapper.toResponseDTO(savedOrder)).thenReturn(expectedResponse);

            OrderResponseDTO result = orderService.createOrder(buyer, dto);

            assertThat(result).isNotNull();
            assertThat(result.trackingCode()).isEqualTo("TRACK123");
            assertThat(product.getStock()).isEqualTo(8);
            verify(orderRepository).save(any(OrderEntity.class));
        }

        @Test
        @DisplayName("should group same product ids and sum quantities")
        void shouldGroupSameProductIds() {
            BuyerEntity buyer = createBuyer();
            ProductEntity product = createProduct(1L, "Product 1", BigDecimal.valueOf(50), 20);
            OrderEntity savedOrder = new OrderEntity();
            savedOrder.setId(1L);
            savedOrder.setTrackingCode("TRACK123");
            savedOrder.setTotalPrice(BigDecimal.valueOf(250));

            OrderCreateRequestDTO dto = new OrderCreateRequestDTO(
                List.of(
                    new DetailCreateRequestDTO(1L, 2),
                    new DetailCreateRequestDTO(1L, 3)
                )
            );

            when(productRepository.findAllByIdForUpdate(List.of(1L)))
                .thenReturn(List.of(product));
            when(codeGenerator.generateCode(16)).thenReturn("TRACK123");
            when(orderRepository.existsByTrackingCode("TRACK123")).thenReturn(false);
            when(orderRepository.save(any(OrderEntity.class))).thenReturn(savedOrder);
            when(orderMapper.toResponseDTO(savedOrder)).thenReturn(
                new OrderResponseDTO(1L, BigDecimal.valueOf(250), null, "TRACK123", null, null)
            );

            orderService.createOrder(buyer, dto);

            assertThat(product.getStock()).isEqualTo(15);
        }
    }

    @Nested
    @DisplayName("getOrdersByBuyer tests")
    class GetOrdersByBuyerTests {

        @Test
        @DisplayName("should return orders paginated for buyer")
        void shouldReturnOrdersPaginated() {
            BuyerEntity buyer = createBuyer();
            Pageable pageable = PageRequest.of(0, 10);
            OrderEntity order = new OrderEntity();
            order.setId(1L);

            Page<OrderEntity> page = new PageImpl<>(List.of(order), pageable, 1);
            OrderResponseDTO responseDTO = new OrderResponseDTO(1L, BigDecimal.valueOf(100), null, "TRACK123", null, null);

            when(orderRepository.findAllByBuyer(buyer, pageable)).thenReturn(page);
            when(orderMapper.toResponseDTO(order)).thenReturn(responseDTO);

            Slice<OrderResponseDTO> result = orderService.getOrdersByBuyer(buyer, pageable);

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).trackingCode()).isEqualTo("TRACK123");
        }
    }

    @Nested
    @DisplayName("getOrderByTrackingCode tests")
    class GetOrderByTrackingCodeTests {

        @Test
        @DisplayName("should throw ResourceNotFoundException when order not found")
        void shouldThrowWhenOrderNotFound() {
            when(orderRepository.findByTrackingCode("INVALID")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> orderService.getOrderByTrackingCode("INVALID"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("tracking_code not found");
        }

        @Test
        @DisplayName("should return order when tracking code is valid")
        void shouldReturnOrderWhenValid() {
            OrderEntity order = new OrderEntity();
            order.setId(1L);
            order.setTrackingCode("VALID123");

            OrderResponseDTO responseDTO = new OrderResponseDTO(1L, BigDecimal.valueOf(100), null, "VALID123", null, null);

            when(orderRepository.findByTrackingCode("VALID123")).thenReturn(Optional.of(order));
            when(orderMapper.toResponseDTO(order)).thenReturn(responseDTO);

            OrderResponseDTO result = orderService.getOrderByTrackingCode("VALID123");

            assertThat(result).isNotNull();
            assertThat(result.trackingCode()).isEqualTo("VALID123");
        }
    }
}
