import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProject,
  getProjectTasks,
  createTask,
  updateTaskEstado,
  deleteTask,
  getProjectResources,
  createResource,
  deleteResource,
  getUsers,
  updateProjectEstado,
} from '../services/projectService';

const TASK_ESTADOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'BLOQUEADA'];
const PROJECT_ESTADOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADO', 'CANCELADO'];
const ESTADO_BADGE = {
  PENDIENTE: 'secondary', EN_PROGRESO: 'primary', COMPLETADA: 'success',
  COMPLETADO: 'success', BLOQUEADA: 'danger', CANCELADO: 'danger',
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ titulo: '', descripcion: '', prioridad: 'MEDIA', assigneeId: '' });
  const [resourceForm, setResourceForm] = useState({ userId: '', rolEnProyecto: '', cargaTrabajo: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadAll();
  }, [id]);

  const loadAll = async () => {
    try {
      const [p, t, r, u] = await Promise.all([
        getProject(id),
        getProjectTasks(id),
        getProjectResources(id),
        getUsers(),
      ]);
      setProject(p);
      setTasks(t);
      setResources(r);
      setUsers(u);
    } catch {
      setError('Error al cargar datos del proyecto');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask({
        titulo: taskForm.titulo,
        descripcion: taskForm.descripcion,
        prioridad: taskForm.prioridad,
        projectId: parseInt(id),
        assigneeId: taskForm.assigneeId ? parseInt(taskForm.assigneeId) : null,
      });
      setTaskForm({ titulo: '', descripcion: '', prioridad: 'MEDIA', assigneeId: '' });
      setShowTaskForm(false);
      loadAll();
    } catch {
      setError('Error al crear tarea');
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      await createResource({
        userId: parseInt(resourceForm.userId),
        projectId: parseInt(id),
        rolEnProyecto: resourceForm.rolEnProyecto,
        cargaTrabajo: resourceForm.cargaTrabajo ? parseInt(resourceForm.cargaTrabajo) : null,
      });
      setResourceForm({ userId: '', rolEnProyecto: '', cargaTrabajo: '' });
      setShowResourceForm(false);
      loadAll();
    } catch {
      setError('Error al asignar recurso');
    }
  };

  if (!project) return <div className="text-center p-5">Cargando...</div>;

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-primary px-4">
        <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <span className="navbar-brand fw-bold mx-auto">{project.nombre}</span>
        <span />
      </nav>

      <div className="container py-4">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card mb-4 p-3">
          <div className="row align-items-center">
            <div className="col-md-8">
              <p className="mb-1 text-muted">{project.descripcion || 'Sin descripción'}</p>
              {project.fechaInicio && <small className="text-muted">Inicio: {project.fechaInicio} | </small>}
              {project.fechaFin && <small className="text-muted">Fin: {project.fechaFin}</small>}
            </div>
            <div className="col-md-4 text-end">
              <label className="form-label small me-2">Estado:</label>
              <select
                className="form-select form-select-sm d-inline-block w-auto"
                value={project.estado}
                onChange={async (e) => {
                  await updateProjectEstado(id, e.target.value);
                  loadAll();
                }}
              >
                {PROJECT_ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}>
              Tareas ({tasks.length})
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}>
              Recursos ({resources.length})
            </button>
          </li>
        </ul>

        {activeTab === 'tasks' && (
          <div>
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-primary btn-sm" onClick={() => setShowTaskForm(!showTaskForm)}>
                {showTaskForm ? 'Cancelar' : '+ Nueva Tarea'}
              </button>
            </div>

            {showTaskForm && (
              <div className="card mb-3 p-3">
                <form onSubmit={handleCreateTask}>
                  <div className="row g-2">
                    <div className="col-md-4">
                      <input className="form-control form-control-sm" placeholder="Título *"
                        value={taskForm.titulo} onChange={e => setTaskForm({ ...taskForm, titulo: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <input className="form-control form-control-sm" placeholder="Descripción"
                        value={taskForm.descripcion} onChange={e => setTaskForm({ ...taskForm, descripcion: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                      <select className="form-select form-select-sm"
                        value={taskForm.prioridad} onChange={e => setTaskForm({ ...taskForm, prioridad: e.target.value })}>
                        <option value="ALTA">Alta</option>
                        <option value="MEDIA">Media</option>
                        <option value="BAJA">Baja</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <select className="form-select form-select-sm"
                        value={taskForm.assigneeId} onChange={e => setTaskForm({ ...taskForm, assigneeId: e.target.value })}>
                        <option value="">Sin asignar</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-success btn-sm">Crear Tarea</button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {tasks.length === 0 ? (
              <p className="text-muted text-center py-3">No hay tareas. ¡Crea la primera!</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover bg-white rounded">
                  <thead className="table-light">
                    <tr>
                      <th>Título</th>
                      <th>Prioridad</th>
                      <th>Estado</th>
                      <th>Asignado a</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(task => (
                      <tr key={task.id}>
                        <td>
                          <div>{task.titulo}</div>
                          {task.descripcion && <small className="text-muted">{task.descripcion}</small>}
                        </td>
                        <td><span className={`badge bg-${task.prioridad === 'ALTA' ? 'danger' : task.prioridad === 'MEDIA' ? 'warning text-dark' : 'secondary'}`}>{task.prioridad}</span></td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={task.estado}
                            onChange={async (e) => { await updateTaskEstado(task.id, e.target.value); loadAll(); }}
                          >
                            {TASK_ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td>{task.assignee?.nombre || <span className="text-muted">—</span>}</td>
                        <td>
                          <button className="btn btn-outline-danger btn-sm"
                            onClick={async () => { if (confirm('¿Eliminar tarea?')) { await deleteTask(task.id); loadAll(); } }}>
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div>
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-primary btn-sm" onClick={() => setShowResourceForm(!showResourceForm)}>
                {showResourceForm ? 'Cancelar' : '+ Asignar Recurso'}
              </button>
            </div>

            {showResourceForm && (
              <div className="card mb-3 p-3">
                <form onSubmit={handleCreateResource}>
                  <div className="row g-2">
                    <div className="col-md-4">
                      <select className="form-select form-select-sm"
                        value={resourceForm.userId} onChange={e => setResourceForm({ ...resourceForm, userId: e.target.value })} required>
                        <option value="">Seleccionar usuario *</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.nombre} — {u.email}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <input className="form-control form-control-sm" placeholder="Rol en el proyecto"
                        value={resourceForm.rolEnProyecto} onChange={e => setResourceForm({ ...resourceForm, rolEnProyecto: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                      <input type="number" className="form-control form-control-sm" placeholder="Carga (%)" min="0" max="100"
                        value={resourceForm.cargaTrabajo} onChange={e => setResourceForm({ ...resourceForm, cargaTrabajo: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-success btn-sm">Asignar</button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {resources.length === 0 ? (
              <p className="text-muted text-center py-3">No hay recursos asignados aún.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover bg-white rounded">
                  <thead className="table-light">
                    <tr>
                      <th>Miembro</th>
                      <th>Email</th>
                      <th>Rol en proyecto</th>
                      <th>Carga de trabajo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map(r => (
                      <tr key={r.id}>
                        <td>{r.user?.nombre}</td>
                        <td>{r.user?.email}</td>
                        <td>{r.rolEnProyecto || '—'}</td>
                        <td>{r.cargaTrabajo != null ? `${r.cargaTrabajo}%` : '—'}</td>
                        <td>
                          <button className="btn btn-outline-danger btn-sm"
                            onClick={async () => { if (confirm('¿Quitar recurso?')) { await deleteResource(r.id); loadAll(); } }}>
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
