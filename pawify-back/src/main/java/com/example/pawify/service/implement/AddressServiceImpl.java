package com.example.pawify.service.implement;

import com.example.pawify.dto.in.address.AddressCreateRequestDTO;
import com.example.pawify.dto.out.address.AddressResponseDTO;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.exception.UnauthorizedRequestException;
import com.example.pawify.mapper.AddressMapper;
import com.example.pawify.model.AddressEntity;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.repository.AddressRepository;
import com.example.pawify.service.AddressService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// Implementacion del servicio de gestion de direcciones de envio
@Service
@AllArgsConstructor
public class AddressServiceImpl implements AddressService {
    private final AddressMapper addressMapper;
    private final AddressRepository addressRepository;

    // Crea una direccion de envio para un comprador
    @Override
    public AddressResponseDTO createAddress(AddressCreateRequestDTO addressCreateRequestDTO, BuyerEntity buyerEntity) {
        AddressEntity addressEntity = addressMapper.toEntity(addressCreateRequestDTO);
        addressEntity.setBuyer(buyerEntity);
        AddressEntity savedAddress = addressRepository.save(addressEntity);
        return addressMapper.toDTO(savedAddress);
    }

    // Lista direcciones activas de un comprador
    @Override
    public List<AddressResponseDTO> getAddressesByBuyer(BuyerEntity buyerEntity) {
        return addressRepository.findAllByBuyerAndActiveTrue(buyerEntity).stream()
            .map(addressMapper::toDTO)
            .toList();
    }

    // Desactiva una direccion validando que el comprador sea el propietario
    @Override
    public void deactivateAddress(Long addressId, BuyerEntity buyerEntity) {
        AddressEntity addressInDb = addressRepository.findById(addressId)
            .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!addressInDb.getBuyer().getId().equals(buyerEntity.getId())) {
            throw new UnauthorizedRequestException("You are not allowed to deactivate this address (not owner)");
        }

        if (!addressInDb.isActive()) return;

        addressInDb.setActive(false);
        addressRepository.save(addressInDb);
    }

    // Actualiza datos de direccion validando propiedad
    @Override
    public AddressResponseDTO updateAddressByBuyer(Long addressId, AddressCreateRequestDTO newAddress, BuyerEntity buyerEntity) {
        AddressEntity addressInDb = addressRepository.findById(addressId)
            .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!addressInDb.getBuyer().getId().equals(buyerEntity.getId())) {
            throw new UnauthorizedRequestException("You are not allowed to update this address (not owner)");
        }

        addressInDb.setName(newAddress.name());
        addressInDb.setReference(newAddress.reference());
        addressInDb.setLatitude(newAddress.latitude());
        addressInDb.setLongitude(newAddress.longitude());

        return addressMapper.toDTO(addressRepository.save(addressInDb));
    }
}
