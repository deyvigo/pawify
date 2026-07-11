package com.example.pawify.service;

import com.example.pawify.dto.in.address.AddressCreateRequestDTO;
import com.example.pawify.dto.out.address.AddressResponseDTO;
import com.example.pawify.model.BuyerEntity;

import java.util.List;

// Servicio de gestion de direcciones de envio del comprador
public interface AddressService {

    // Crea una nueva direccion de envio para un comprador
    AddressResponseDTO createAddress(AddressCreateRequestDTO addressCreateRequestDTO, BuyerEntity buyerEntity);

    // Lista las direcciones activas de un comprador
    List<AddressResponseDTO> getAddressesByBuyer(BuyerEntity buyerEntity);

    // Desactiva una direccion validando que el comprador sea el propietario
    void deactivateAddress(Long addressId, BuyerEntity buyerEntity);

    // Actualiza los datos de una direccion validando propiedad
    AddressResponseDTO updateAddressByBuyer(Long addressId, AddressCreateRequestDTO addressCreateRequestDTO, BuyerEntity buyerEntity);
}
