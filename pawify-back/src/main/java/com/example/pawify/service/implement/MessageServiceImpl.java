package com.example.pawify.service.implement;

import com.example.pawify.dto.CursorInternalDTO;
import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.claim.MessageResponseDTO;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.exception.UnauthorizedRequestException;
import com.example.pawify.mapper.MessageMapper;
import com.example.pawify.model.ClaimEntity;
import com.example.pawify.model.MessageEntity;
import com.example.pawify.model.UserEntity;
import com.example.pawify.repository.ClaimRepository;
import com.example.pawify.repository.MessageRepository;
import com.example.pawify.service.MessageService;
import com.example.pawify.utils.CursorUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final CursorUtil cursorUtil;
    private final ClaimRepository claimRepository;
    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;

    @Override
    public Page<MessageResponseDTO> getMessageByClaim(UserEntity user, Long claimId, String cursor, int size) {
        ClaimEntity claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new ResourceNotFoundException("claim id not found"));

        Long userId = user.getId();

        if (!(claim.getAdmin().getId().equals(userId) || claim.getBuyer().getId().equals(userId))) {
            throw new UnauthorizedRequestException("You are not allowed to view this message");
        }

        CursorInternalDTO cursorInternal = cursor == null ? null : cursorUtil.decode(cursor);

        List<MessageEntity> messages = messageRepository.findMessagesByClaimId(claimId, size + 1, cursorInternal);

        boolean hasNext = messages.size() > size;
        if (hasNext) {
            messages.removeLast();
        }

        String nextCursor = hasNext
            ? cursorUtil.encode(new CursorInternalDTO(messages.getLast().getSendAt(), messages.getLast().getId()))
            : null;

        return new Page<>(
            messages.stream().map(messageMapper::fromEntityToDTO).toList(),
            hasNext,
            nextCursor
        );
    }
}
