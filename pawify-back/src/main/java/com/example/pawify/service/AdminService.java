package com.example.pawify.service;

import com.example.pawify.dto.out.admin.AdminResponseSimpleDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface AdminService {
    Slice<BuyerResponseSimpleDTO> getAllBuyers(Pageable pageable);
    Slice<AdminResponseSimpleDTO> getAllAdmins(Pageable pageable);
}
