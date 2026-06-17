import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject } from '../services/projectService';
import { logout, getUser } from '../services/authService';

const ESTADOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADO', 'CANCELADO'];
const ESTADO_BADGE = {
  PENDIENTE: 'secondary',
  EN_PROGRESO: 'primary',
  COMPLETADO: 'success',
  CANCELADO: 'danger',
};

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', fechaInicio: '', fechaFin: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      setError('Error al cargar proyectos');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProject({
        nombre: form.nombre,
        descripcion: form.descripcion,
        fechaInicio: form.fechaInicio || null,
        fechaFin: form.fechaFin || null,
      });
      setForm({ nombre: '', descripcion: '', fechaInicio: '', fechaFin: '' });
      setShowForm(false);
      loadProjects();
    } catch {
      setError('Error al crear proyecto');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este proyecto?')) return;
    try {
      await deleteProject(id);
      loadProjects();
    } catch {
      setError('Error al eliminar proyecto');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-primary px-4">
        <span className="navbar-brand fw-bold">HealthTech Innovations</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">{user?.nombre}</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Proyectos</h5>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : '+ Nuevo Proyecto'}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {showForm && (
          <div className="card mb-4 p-3">
            <h6 className="mb-3">Nuevo Proyecto</h6>
            <form onSubmit={handleCreate}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Nombre del proyecto *"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Descripción"
                    value={form.descripcion}
                    onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted">Fecha Inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.fechaInicio}
                    onChange={e => setForm({ ...form, fechaInicio: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted">Fecha Fin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.fechaFin}
                    onChange={e => setForm({ ...form, fechaFin: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-success">Crear Proyecto</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p>No hay proyectos aún. ¡Crea el primero!</p>
          </div>
        ) : (
          <div className="row g-3">
            {projects.map(project => (
              <div key={project.id} className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title mb-0">{project.nombre}</h6>
                      <span className={`badge bg-${ESTADO_BADGE[project.estado]}`}>
                        {project.estado}
                      </span>
                    </div>
                    <p className="card-text text-muted small">{project.descripcion || 'Sin descripción'}</p>
                    {project.fechaInicio && (
                      <p className="small text-muted mb-1">Inicio: {project.fechaInicio}</p>
                    )}
                    {project.fechaFin && (
                      <p className="small text-muted">Fin: {project.fechaFin}</p>
                    )}
                  </div>
                  <div className="card-footer d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm flex-grow-1"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      Ver detalle
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
