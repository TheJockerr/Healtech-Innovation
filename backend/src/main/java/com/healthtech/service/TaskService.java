package com.healthtech.service;

import com.healthtech.dto.TaskRequest;
import com.healthtech.model.Task;
import com.healthtech.repository.ProjectRepository;
import com.healthtech.repository.TaskRepository;
import com.healthtech.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<Task> getByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Task getById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
    }

    public Task create(TaskRequest request) {
        Task task = new Task();
        task.setTitulo(request.getTitulo());
        task.setDescripcion(request.getDescripcion());
        task.setPrioridad(request.getPrioridad());
        task.setProject(projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado")));
        if (request.getAssigneeId() != null) {
            task.setAssignee(userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado")));
        }
        return taskRepository.save(task);
    }

    public Task update(Long id, TaskRequest request) {
        Task task = getById(id);
        task.setTitulo(request.getTitulo());
        task.setDescripcion(request.getDescripcion());
        task.setPrioridad(request.getPrioridad());
        if (request.getAssigneeId() != null) {
            task.setAssignee(userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado")));
        }
        return taskRepository.save(task);
    }

    public Task updateEstado(Long id, String estado) {
        Task task = getById(id);
        task.setEstado(Task.Estado.valueOf(estado));
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}
