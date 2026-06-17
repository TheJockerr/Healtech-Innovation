package com.healthtech.controller;

import com.healthtech.dto.ResourceRequest;
import com.healthtech.model.Resource;
import com.healthtech.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping("/projects/{projectId}/resources")
    public ResponseEntity<List<Resource>> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(resourceService.getByProject(projectId));
    }

    @PostMapping("/resources")
    public ResponseEntity<Resource> create(@Valid @RequestBody ResourceRequest request) {
        return ResponseEntity.ok(resourceService.create(request));
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
