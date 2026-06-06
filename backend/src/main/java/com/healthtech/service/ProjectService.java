package com.healthtech.service;

import com.healthtech.dto.ProjectRequest;
import com.healthtech.model.Project;
import com.healthtech.model.User;
import com.healthtech.repository.ProjectRepository;
import com.healthtech.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<Project> getAll() {
        return projectRepository.findAll();
    }

    public Project getById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
    }

    public Project create(ProjectRequest request) {
        User owner = getCurrentUser();
        Project project = new Project();
        project.setNombre(request.getNombre());
        project.setDescripcion(request.getDescripcion());
        project.setFechaInicio(request.getFechaInicio());
        project.setFechaFin(request.getFechaFin());
        project.setOwner(owner);
        return projectRepository.save(project);
    }

    public Project update(Long id, ProjectRequest request) {
        Project project = getById(id);
        project.setNombre(request.getNombre());
        project.setDescripcion(request.getDescripcion());
        project.setFechaInicio(request.getFechaInicio());
        project.setFechaFin(request.getFechaFin());
        return projectRepository.save(project);
    }

    public Project updateEstado(Long id, String estado) {
        Project project = getById(id);
        project.setEstado(Project.Estado.valueOf(estado));
        return projectRepository.save(project);
    }

    public void delete(Long id) {
        projectRepository.deleteById(id);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
