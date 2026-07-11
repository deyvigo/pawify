package com.example.pawify.service;

import com.example.pawify.dto.in.admin.ChangeOrderStatusShipmentRequestDTO;
import com.example.pawify.dto.out.admin.AdminResponseSimpleDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

/**
 * Service interface for administrator operations.
 *
 * <p>Provides operations for retrieving paginated lists of buyers and
 * admins, as well as changing the shipping status of orders. This service
 * is intended to be used exclusively by users with the ADMIN role.</p>
 */
public interface AdminService {

    /**
     * Retrieves a paginated slice of all registered buyers.
     *
     * @param pageable the pagination and sorting parameters
     * @return a {@link Slice} of buyer response DTOs
     */
    Slice<BuyerResponseSimpleDTO> getAllBuyers(Pageable pageable);

    /**
     * Retrieves a paginated slice of all registered admins.
     *
     * @param pageable the pagination and sorting parameters
     * @return a {@link Slice} of admin response DTOs
     */
    Slice<AdminResponseSimpleDTO> getAllAdmins(Pageable pageable);

    /**
     * Changes the shipping status of an order identified by its tracking code.
     *
     * <p>Validates that the requested status transition is allowed based on the
     * current shipping status of the order before applying the change.</p>
     *
     * @param newShippingStatus the data transfer object containing the new shipping status
     * @param trackingCode the unique tracking code of the order to update
     * @throws com.example.pawify.exception.ResourceNotFoundException if no order matches the tracking code
     * @throws com.example.pawify.exception.BadRequestException if the status transition is not allowed
     */
    void changeOrderStatusByOrderId(ChangeOrderStatusShipmentRequestDTO newShippingStatus, String trackingCode);
}
