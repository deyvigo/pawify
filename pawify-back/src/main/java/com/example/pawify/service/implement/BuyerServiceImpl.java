package com.example.pawify.service.implement;

import com.example.pawify.dto.in.buyer.UpdateBuyerRequestDTO;
import com.example.pawify.dto.out.user.BuyerImageResponseDTO;
import com.example.pawify.dto.out.user.BuyerResponseSimpleDTO;
import com.example.pawify.dto.out.user.UpdateBuyerResponseDTO;
import com.example.pawify.exception.ImagesNotProvidedException;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.mapper.BuyerMapper;
import com.example.pawify.mapper.BuyerProfileMapper;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.BuyerImageEntity;
import com.example.pawify.repository.BuyerRepository;
import com.example.pawify.service.BuyerService;
import com.example.pawify.service.CloudinaryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@AllArgsConstructor
public class BuyerServiceImpl implements BuyerService {
    private final BuyerRepository buyerRepository;
    private final BuyerMapper buyerMapper;
    private final CloudinaryService cloudinaryService;
    private final BuyerProfileMapper buyerProfileMapper;

    @Override
    public BuyerResponseSimpleDTO getBuyer(BuyerEntity buyerEntity) {
        BuyerEntity buyerFromDb = buyerRepository.findById(buyerEntity.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        return buyerMapper.toResponseSimpleDTO(buyerFromDb);
    }

    @Override
    public BuyerImageResponseDTO createOrUpdateImage(BuyerEntity buyerEntity, MultipartFile image) {
        BuyerEntity buyerFromDb = buyerRepository.findById(buyerEntity.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        if (image.isEmpty()) {
            throw new ImagesNotProvidedException("Image not provided");
        }

        String path = cloudinaryService.uploadImage(image);

        BuyerImageEntity buyerImageEntity = buyerFromDb.getProfile();
        if (buyerImageEntity == null) {
            buyerImageEntity = new BuyerImageEntity();
            buyerImageEntity.setBuyer(buyerFromDb);
            buyerFromDb.setProfile(buyerImageEntity);
        }

        buyerImageEntity.setUrl(path);
        BuyerEntity saved = buyerRepository.save(buyerFromDb);
        return buyerProfileMapper.toDTO(saved.getProfile());
    }

    @Override
    public UpdateBuyerResponseDTO updateBuyer(BuyerEntity buyerEntity, UpdateBuyerRequestDTO dto) {
        BuyerEntity buyerFromDb = buyerRepository.findById(buyerEntity.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        buyerFromDb.setEmail(dto.email());
        buyerFromDb.setFirstName(dto.firstName());
        buyerFromDb.setLastName(dto.lastName());
        buyerFromDb.setDniNumber(dto.dniNumber());

        return buyerMapper.toUpdateBuyerResponseDTO(buyerRepository.save(buyerFromDb));
    }
}
