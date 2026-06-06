package com.healthtech.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResourceRequest {
    @NotNull
    private Long userId;

    @NotNull
    private Long projectId;

    private String rolEnProyecto;
    private Integer cargaTrabajo;
}
