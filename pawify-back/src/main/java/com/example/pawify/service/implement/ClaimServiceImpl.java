package com.example.pawify.service.implement;

import com.example.pawify.dto.CursorInternalDTO;
import com.example.pawify.dto.in.claim.ClaimCreateRequestDTO;
import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.claim.ClaimResponseDTO;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.mapper.ClaimMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.AdminRepository;
import com.example.pawify.repository.ClaimRepository;
import com.example.pawify.repository.DetailRepository;
import com.example.pawify.service.ClaimService;
import com.example.pawify.utils.CursorUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
@AllArgsConstructor
public class ClaimServiceImpl implements ClaimService {
    private final AdminRepository adminRepository;
    private final DetailRepository detailRepository;
    private final ClaimRepository claimRepository;
    private final ClaimMapper claimMapper;
    private final CursorUtil cursorUtil;

    @Override
    @Transactional
    public ClaimResponseDTO createClaim(BuyerEntity buyer, ClaimCreateRequestDTO claimRequest) {
        DetailEntity detailEntity = detailRepository.findById(claimRequest.detailId())
            .orElseThrow(() -> new ResourceNotFoundException("detail id not found"));

        if (!detailEntity.getOrder().getBuyer().getId().equals(buyer.getId())) {
            throw new ResourceNotFoundException("detail id not exist");
        }

        ClaimEntity saved = claimRepository.findByDetail_Id(detailEntity.getId())
            .orElseGet(() -> {
                ClaimEntity claimEntity = new ClaimEntity();
                claimEntity.setDetail(detailEntity);
                claimEntity.setBuyer(detailEntity.getOrder().getBuyer());
                claimEntity.setAdmin(getRandomAdmin());
                return claimRepository.save(claimEntity);
            });

        return claimMapper.fromEntityToDTO(saved);
    }

    @Override
    public Page<ClaimResponseDTO> getClaims(UserEntity user, int size, String cursorEncoded) {
        CursorInternalDTO cursor = cursorEncoded != null ? cursorUtil.decode(cursorEncoded) : null;

        List<ClaimEntity> claims = claimRepository.findClaimsByUserId(user, size + 1, cursor);

        boolean hasNext = claims.size() > size;

        if (hasNext) {
            claims.removeLast();
        }

        String nextCursor = hasNext
            ? cursorUtil.encode(new CursorInternalDTO(claims.getLast().getLastModified(), claims.getLast().getId()))
            : null;

        return new Page<>(
            claims.stream().map(claimMapper::fromEntityToDTO).toList(),
            hasNext,
            nextCursor
        );
    }

    public AdminEntity getRandomAdmin() {
        List<AdminEntity> admins = adminRepository.findAll();
        int index = new Random().nextInt(admins.size());
        return admins.get(index);
    }
}
