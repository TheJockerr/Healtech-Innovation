package com.healthtech.service;

import com.healthtech.dto.ResourceRequest;
import com.healthtech.model.Resource;
import com.healthtech.repository.ProjectRepository;
import com.healthtech.repository.ResourceRepository;
import com.healthtech.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<Resource> getByProject(Long projectId) {
        return resourceRepository.findByProjectId(projectId);
    }

    public Resource create(ResourceRequest request) {
        Resource resource = new Resource();
        resource.setUser(userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")));
        resource.setProject(projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado")));
        resource.setRolEnProyecto(request.getRolEnProyecto());
        resource.setCargaTrabajo(request.getCargaTrabajo());
        return resourceRepository.save(resource);
    }

    public void delete(Long id) {
        resourceRepository.deleteById(id);
    }
}
