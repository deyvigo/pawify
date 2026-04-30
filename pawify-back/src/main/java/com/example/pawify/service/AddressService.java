package com.example.pawify.service;

import com.example.pawify.dto.in.address.AddressCreateRequestDTO;
import com.example.pawify.dto.out.address.AddressResponseDTO;
import com.example.pawify.model.BuyerEntity;

import java.util.List;

public interface AddressService {
    AddressResponseDTO createAddress(AddressCreateRequestDTO addressCreateRequestDTO, BuyerEntity buyerEntity);
    List<AddressResponseDTO> getAddressesByBuyer(BuyerEntity buyerEntity);
    void deactivateAddress(Long addressId, BuyerEntity buyerEntity);
    AddressResponseDTO updateAddressByBuyer(Long addressId, AddressCreateRequestDTO addressCreateRequestDTO, BuyerEntity buyerEntity);
}
