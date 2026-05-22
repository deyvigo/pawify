package com.example.pawify.service;

import com.example.pawify.dto.in.admin.ChangePasswordByAdminRequestDTO;
import com.example.pawify.dto.out.admin.AdminResponseSimpleDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import com.example.pawify.model.AdminEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

public interface AdminService {
    void changePasswordByOwner(
        @AuthenticationPrincipal AdminEntity admin,
        ChangePasswordByAdminRequestDTO changePasswordByAdminRequestDTO
    );
    Slice<BuyerResponseSimpleDTO> getAllBuyers(Pageable pageable);
    Slice<AdminResponseSimpleDTO> getAllAdmins(Pageable pageable);
}
