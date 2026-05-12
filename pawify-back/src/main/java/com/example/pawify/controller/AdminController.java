package com.example.pawify.controller;

import com.example.pawify.dto.in.admin.ChangePasswordByAdminRequestDTO;
import com.example.pawify.dto.out.admin.AdminResponseSimpleDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import com.example.pawify.service.AdminService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/buyers")
    public ResponseEntity<Slice<BuyerResponseSimpleDTO>> getAllBuyers(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllBuyers(pageable));
    }

    @GetMapping("/admins")
    public ResponseEntity<Slice<AdminResponseSimpleDTO>> getAllAdmins(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllAdmins(pageable));
    }

    @PostMapping("/{username}/password")
    public ResponseEntity<Void> changePasswordByUsername(
        @PathVariable String username,
        @Valid @RequestBody ChangePasswordByAdminRequestDTO changePasswordByAdminRequestDTO
    ) {
        adminService.changePasswordFromAnyUser(username, changePasswordByAdminRequestDTO);
        return ResponseEntity.noContent().build();
    }
}
