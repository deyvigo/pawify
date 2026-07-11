package com.example.pawify.service;

import com.example.pawify.dto.in.buyer.UpdateBuyerRequestDTO;
import com.example.pawify.dto.out.buyer.BuyerImageResponseDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import com.example.pawify.dto.out.buyer.UpdateBuyerResponseDTO;
import com.example.pawify.model.BuyerEntity;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for managing buyer profile information.
 *
 * <p>Provides operations for retrieving buyer details, uploading or
 * updating a profile image, and updating personal information such
 * as name, email, and DNI number.</p>
 */
public interface BuyerService {

    /**
     * Retrieves the profile information of the specified buyer.
     *
     * @param buyerEntity the authenticated buyer entity
     * @return the response DTO with the buyer's profile information
     * @throws com.example.pawify.exception.ResourceNotFoundException if the buyer is not found in the database
     */
    BuyerResponseSimpleDTO getBuyer(BuyerEntity buyerEntity);

    /**
     * Creates or updates the profile image for the specified buyer.
     *
     * <p>Uploads the image to Cloudinary and associates the resulting URL
     * with the buyer's profile. If no profile image exists, a new one is created.</p>
     *
     * @param buyerEntity the authenticated buyer entity
     * @param image the image file to upload (must not be empty)
     * @return the response DTO with the profile image information
     * @throws com.example.pawify.exception.ResourceNotFoundException if the buyer is not found in the database
     * @throws com.example.pawify.exception.ImagesNotProvidedException if the image file is empty
     */
    BuyerImageResponseDTO createOrUpdateImage(BuyerEntity buyerEntity, MultipartFile image);

    /**
     * Updates the personal information of the specified buyer.
     *
     * <p>Updates the buyer's email, first name, last name, and DNI number.</p>
     *
     * @param buyerEntity the authenticated buyer entity
     * @param updateBuyerRequestDTO the data transfer object containing the updated personal details
     * @return the response DTO with the updated buyer information
     * @throws com.example.pawify.exception.ResourceNotFoundException if the buyer is not found in the database
     */
    UpdateBuyerResponseDTO updateBuyer(BuyerEntity buyerEntity, UpdateBuyerRequestDTO updateBuyerRequestDTO);
}
