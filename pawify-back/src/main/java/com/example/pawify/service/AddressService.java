package com.example.pawify.service;

import com.example.pawify.dto.in.address.AddressCreateRequestDTO;
import com.example.pawify.dto.out.address.AddressResponseDTO;
import com.example.pawify.model.BuyerEntity;

import java.util.List;

/**
 * Service interface for managing buyer delivery addresses.
 *
 * <p>Provides operations for creating, retrieving, deactivating, and
 * updating addresses. Only the address owner may deactivate or update
 * an address.</p>
 */
public interface AddressService {

    /**
     * Creates a new delivery address for the specified buyer.
     *
     * @param addressCreateRequestDTO the data transfer object containing address details
     * @param buyerEntity the buyer to whom the address belongs
     * @return the response DTO with the created address information
     */
    AddressResponseDTO createAddress(AddressCreateRequestDTO addressCreateRequestDTO, BuyerEntity buyerEntity);

    /**
     * Retrieves all active delivery addresses for the specified buyer.
     *
     * @param buyerEntity the buyer whose addresses are to be retrieved
     * @return an immutable list of active address response DTOs
     */
    List<AddressResponseDTO> getAddressesByBuyer(BuyerEntity buyerEntity);

    /**
     * Deactivates a delivery address by its identifier.
     *
     * <p>Validates that the requesting buyer is the owner of the address.
     * If the address is already inactive, no action is taken.</p>
     *
     * @param addressId the unique identifier of the address to deactivate
     * @param buyerEntity the authenticated buyer entity
     * @throws com.example.pawify.exception.ResourceNotFoundException if the address is not found
     * @throws com.example.pawify.exception.UnauthorizedRequestException if the buyer is not the address owner
     */
    void deactivateAddress(Long addressId, BuyerEntity buyerEntity);

    /**
     * Updates an existing delivery address's details.
     *
     * <p>Validates that the requesting buyer is the owner of the address
     * before applying the changes.</p>
     *
     * @param addressId the unique identifier of the address to update
     * @param addressCreateRequestDTO the data transfer object containing the updated address details
     * @param buyerEntity the authenticated buyer entity
     * @return the response DTO with the updated address information
     * @throws com.example.pawify.exception.ResourceNotFoundException if the address is not found
     * @throws com.example.pawify.exception.UnauthorizedRequestException if the buyer is not the address owner
     */
    AddressResponseDTO updateAddressByBuyer(Long addressId, AddressCreateRequestDTO addressCreateRequestDTO, BuyerEntity buyerEntity);
}
