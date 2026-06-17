package com.healthtech.dto;

import com.healthtech.model.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskRequest {
    @NotBlank
    private String titulo;

    private String descripcion;

    @NotNull
    private Long projectId;

    private Long assigneeId;

    private Task.Prioridad prioridad = Task.Prioridad.MEDIA;
}
