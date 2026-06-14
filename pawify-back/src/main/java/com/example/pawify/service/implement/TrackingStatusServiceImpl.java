package com.example.pawify.service.implement;

import com.example.pawify.dto.CursorInternalDTO;
import com.example.pawify.dto.in.order.TrackingStatusCreateRequestDTO;
import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.order.TrackingStatusResponseDTO;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.mapper.TrackingStatusMapper;
import com.example.pawify.model.OrderEntity;
import com.example.pawify.model.TrackingStatusEntity;
import com.example.pawify.repository.OrderRepository;
import com.example.pawify.repository.TrackingStatusRepository;
import com.example.pawify.service.TrackingStatusService;
import com.example.pawify.utils.CursorUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TrackingStatusServiceImpl implements TrackingStatusService {
    private final OrderRepository orderRepository;
    private final TrackingStatusMapper trackingStatusMapper;
    private final TrackingStatusRepository trackingStatusRepository;
    private final CursorUtil cursorUtil;

    @Override
    public TrackingStatusResponseDTO createTrackingStatus(TrackingStatusCreateRequestDTO requestDTO) {
        OrderEntity orderEntity = orderRepository.findById(requestDTO.orderId())
            .orElseThrow(() -> new ResourceNotFoundException("order_ir not found"));

        TrackingStatusEntity trackingStatusEntity = trackingStatusMapper.fromDTORequestToEntity(requestDTO);
        trackingStatusEntity.setOrder(orderEntity);
        return trackingStatusMapper.fromEntityToDTO(trackingStatusRepository.save(trackingStatusEntity));
    }

    @Override
    public Page<TrackingStatusResponseDTO> getAllByTrackingCode(String trackingCode, String cursor, Integer size) {
        OrderEntity orderEntity = orderRepository.findByTrackingCode(trackingCode)
            .orElseThrow(() -> new ResourceNotFoundException("order_ir not found"));

        CursorInternalDTO cursorInternal = cursor == null ? null : cursorUtil.decode(cursor);

        List<TrackingStatusEntity> trackings = trackingStatusRepository.getTrackingStatusByTrackingCode(
            trackingCode, cursorInternal, size + 1
        );

        boolean hasNext = trackings.size() > size;
        if (hasNext) {
            trackings.removeLast();
        }

        String nextCursor = hasNext
            ? cursorUtil.encode(new CursorInternalDTO(trackings.getLast().getTimestamp(), trackings.getLast().getId()))
            : null;

        return new Page<>(
            trackings.stream().map(trackingStatusMapper::fromEntityToDTO).toList(),
            hasNext,
            nextCursor
        );
    }
}
