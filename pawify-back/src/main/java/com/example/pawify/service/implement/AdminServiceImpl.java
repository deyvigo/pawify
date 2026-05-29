package com.example.pawify.service.implement;

import com.example.pawify.dto.in.admin.ChangeOrderStatusShipmentRequestDTO;
import com.example.pawify.dto.out.admin.AdminResponseSimpleDTO;
import com.example.pawify.dto.out.admin.OrderSimpleResponseDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import com.example.pawify.dto.out.product.ProductResponseSimpleDTO;
import com.example.pawify.exception.BadRequestException;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.mapper.AdminMapper;
import com.example.pawify.mapper.BuyerMapper;
import com.example.pawify.mapper.OrderMapper;
import com.example.pawify.mapper.ProductMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.AdminRepository;
import com.example.pawify.repository.BuyerRepository;
import com.example.pawify.repository.OrderRepository;
import com.example.pawify.repository.ProductRepository;
import com.example.pawify.service.AdminService;
import com.example.pawify.specifications.ProductSpecification;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@AllArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final BuyerRepository buyerRepository;
    private final BuyerMapper buyerMapper;
    private final AdminRepository adminRepository;
    private final AdminMapper adminMapper;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public Slice<BuyerResponseSimpleDTO> getAllBuyers(Pageable pageable) {
        Page<BuyerEntity> page = buyerRepository.findAll(pageable);
        return new SliceImpl<>(
            page.map(buyerMapper::toResponseSimpleDTO).getContent(),
            pageable,
            page.hasNext()
        );
    }

    @Override
    public Slice<AdminResponseSimpleDTO> getAllAdmins(Pageable pageable) {
        Page<AdminEntity> page = adminRepository.findAll(pageable);
        return new SliceImpl<>(
            page.map(adminMapper::toResponseSimpleDTO).getContent(),
            pageable,
            page.hasNext()
        );
    }

    @Override
    public void changeOrderStatusByOrderId(ChangeOrderStatusShipmentRequestDTO requestDTO, String trackingCode) {
        OrderEntity orderEntity = orderRepository.findByTrackingCode(trackingCode)
            .orElseThrow(() -> new ResourceNotFoundException("order not found"));

        ShippingStatus newStatus = requestDTO.shippingStatus();

        if (!orderEntity.getShippingStatus().isValidNextStatus(newStatus)) {
            throw new BadRequestException("invalid shipping status transition");
        }

        orderEntity.setShippingStatus(newStatus);
        orderRepository.save(orderEntity);
    }

    @Override
    public Page<OrderSimpleResponseDTO> getAllOrders(Pageable pageable, String trackingCode) {
        Page<OrderEntity> page = orderRepository.findAllWithTrackingCodeFilter(pageable, trackingCode);
        return page.map(orderMapper::fromEntityToSimpleDTO);
    }

    @Override
    public AdminResponseSimpleDTO getAdmin(AdminEntity adminEntity) {
        AdminEntity admin = adminRepository.findById(adminEntity.getId())
            .orElseThrow(() -> new ResourceNotFoundException("admin not found"));

        return adminMapper.toResponseSimpleDTO(admin);
    }

    @Override
    public Page<ProductResponseSimpleDTO> getProducts(
        String search,
        String brand,
        String category,
        String subCategory,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Pageable pageable
    ) {
        Specification<ProductEntity> specs = Specification.unrestricted();

        if (search != null) {
            specs = specs.and(ProductSpecification.nameContains(search));
        }
        if (brand != null) {
            specs = specs.and(ProductSpecification.hasBrand(brand));
        }
        if (category != null) {
            specs = specs.and(ProductSpecification.hasCategory(category));
        }
        if (subCategory != null) {
            specs = specs.and(ProductSpecification.hasSubCategory(subCategory));
        }
        if (minPrice != null || maxPrice != null) {
            specs = specs.and(ProductSpecification.priceBetween(minPrice, maxPrice));
        }

        Page<ProductEntity> page = productRepository.findAll(specs, pageable);
        return page.map(productMapper::toResponseDTO);
    }
}
