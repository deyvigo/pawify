package com.example.pawify.service.implement;

import com.example.pawify.dto.out.admin.AdminResponseSimpleDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import com.example.pawify.mapper.AdminMapper;
import com.example.pawify.mapper.BuyerMapper;
import com.example.pawify.model.AdminEntity;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.repository.AdminRepository;
import com.example.pawify.repository.BuyerRepository;
import com.example.pawify.service.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final BuyerRepository buyerRepository;
    private final BuyerMapper buyerMapper;
    private final AdminRepository adminRepository;
    private final AdminMapper adminMapper;

    @Override
    public Slice<BuyerResponseSimpleDTO> getAllBuyers(Pageable pageable) {
        Page<BuyerEntity> page = buyerRepository.findAll(pageable);
        return new SliceImpl<>(
            page.map(buyerMapper::toResponseSimpleDTO).getContent(),
            pageable,
            page.hasNext()
        );
    }

    @Override
    public Slice<AdminResponseSimpleDTO> getAllAdmins(Pageable pageable) {
        Page<AdminEntity> page = adminRepository.findAll(pageable);
        return new SliceImpl<>(
            page.map(adminMapper::toResponseSimpleDTO).getContent(),
            pageable,
            page.hasNext()
        );
    }
}
