package com.example.pawify.dto.out;

import java.util.List;

public record Page<T>(
    List<T> content,
    boolean hasNext,
    Long nextCursor
) {}
