package com.example.pawify.service.implement;

import com.example.pawify.dto.out.user.BuyerResponseSimpleDTO;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.mapper.BuyerMapper;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.repository.BuyerRepository;
import com.example.pawify.service.BuyerService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class BuyerServiceImpl implements BuyerService {
    private final BuyerRepository buyerRepository;
    private final BuyerMapper buyerMapper;

    @Override
    public BuyerResponseSimpleDTO getBuyer(BuyerEntity buyerEntity) {
        BuyerEntity buyerFromDb = buyerRepository.findById(buyerEntity.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        return buyerMapper.toResponseSimpleDTO(buyerFromDb);
    }
}
