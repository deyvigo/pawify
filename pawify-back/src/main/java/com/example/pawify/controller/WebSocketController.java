package com.example.pawify.controller;

import com.example.pawify.dto.in.claim.MessageRequestDTO;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.mapper.MessageMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.ClaimRepository;
import com.example.pawify.repository.MessageRepository;
import com.example.pawify.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.Instant;
import java.util.Objects;

@RestController
@RequestMapping("/websocket")
@AllArgsConstructor
public class WebSocketController {
    private final ClaimRepository claimRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final UserRepository userRepository;

    @Transactional
    @MessageMapping("/claim.send")
    public void sendMessage(
        Principal principal,
        @Valid @Payload MessageRequestDTO message
    ) {
        UserEntity user = userRepository.findByUsername(principal.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ClaimEntity claimEntity = claimRepository.findById(message.claimId())
            .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        UserEntity admin = claimEntity.getAdmin();
        UserEntity buyer = claimEntity.getBuyer();

        System.out.println(message.claimId() + " " + user.getId() + " " + admin.getId() + " " + buyer.getId());

        if (!user.getId().equals(admin.getId()) && !user.getId().equals(buyer.getId())) {
            throw new AccessDeniedException("You are not part of this claim");
        }

        Instant now = Instant.now();

        MessageEntity messageEntity = new MessageEntity();
        messageEntity.setClaim(claimEntity);
        messageEntity.setContent(message.content());
        messageEntity.setSender(user);
        messageEntity.setSendAt(now);

        MessageEntity saved = messageRepository.save(messageEntity);

        claimEntity.setLastMessage(message.content());
        claimEntity.setLastMessageSender(user.getRole().getRole().equals(RoleEnum.ADMIN)? LastMessageSender.ADMIN : LastMessageSender.BUYER);
        claimEntity.setLastModified(now);


        simpMessagingTemplate.convertAndSendToUser(
            admin.getUsername(),
            "/queue/claim",
            messageMapper.fromEntityToDTO(saved)
        );

        simpMessagingTemplate.convertAndSendToUser(
            buyer.getUsername(),
            "/queue/claim",
            messageMapper.fromEntityToDTO(saved)
        );
    }
}
