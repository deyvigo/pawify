package com.example.pawify.controller;

import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.claim.MessageResponseDTO;
import com.example.pawify.model.UserEntity;
import com.example.pawify.service.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/message")
@AllArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/{claimId}")
    public ResponseEntity<Page<MessageResponseDTO>> getMessagesFromClaimId(
        @AuthenticationPrincipal UserEntity user,
        @PathVariable Long claimId,
        @RequestParam(required = false) String cursor,
        @RequestParam(required = false, defaultValue = "15") Integer size
    ) {
        return ResponseEntity.ok(messageService.getMessageByClaim(user, claimId, cursor, size));
    }
}
