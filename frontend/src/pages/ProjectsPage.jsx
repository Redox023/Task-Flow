import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FolderOpen, Users, CheckSquare, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import useProjectStore from '../store/projectStore'
import useAuthStore from '../store/authStore'
import { Button, Card, Modal, Input, Textarea, Badge, EmptyState, Spinner } from '../components/ui'

function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()
  const isAdmin = project.myRole === 'ADMIN'
  const taskCount = project._count?.tasks || 0
  const memberCount = project.members?.length || 0

  return (
    <Card
      style={{ padding: '18px 20px', cursor: 'pointer', transition: 'border-color 0.15s, transform 0.15s' }}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="anim-rise"
      onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-hi)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: 'rgba(232,162,58,0.1)', border: '1px solid rgba(232,162,58,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FolderOpen size={14} style={{ color: 'var(--gold)' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              marginBottom: 2,
            }}>
              {project.name}
            </h3>
            <Badge variant={isAdmin ? 'admin' : 'member'}>{isAdmin ? 'Admin' : 'Member'}</Badge>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(project) }}
            style={{
              width: 28, height: 28, borderRadius: 7, border: 'none', flexShrink: 0,
              background: 'transparent', color: 'var(--text-soft)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'all 0.12s',
            }}
            className="del-btn"
            onMouseOver={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'rgba(232,96,74,0.1)' }}
            onMouseOut={e => { e.currentTarget.style.color = 'var(--text-soft)'; e.currentTarget.style.background = 'transparent' }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {project.description && (
        <p style={{
          fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6,
          marginBottom: 14, display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {project.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: 14, marginTop: project.description ? 0 : 8 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-soft)' }}>
          <Users size={11} />{memberCount} member{memberCount !== 1 ? 's' : ''}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-soft)' }}>
          <CheckSquare size={11} />{taskCount} task{taskCount !== 1 ? 's' : ''}
        </span>
      </div>

      <style>{`.del-btn { opacity: 0; } .card:hover .del-btn { opacity: 1 !important; }`}</style>
    </Card>
  )
}

export default function ProjectsPage() {
  const { projects, isLoadingProjects, fetchProjects, createProject, deleteProject } = useProjectStore()
  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => { fetchProjects() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setIsSubmitting(true)
    try {
      await createProject(form)
      toast.success('Project created')
      setShowCreate(false)
      setForm({ name: '', description: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteProject(deleteTarget.id)
      toast.success('Project deleted')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete project')
    }
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1000 }}>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Projects
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} you're part of
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={14} />
          New project
        </Button>
      </div>


      {isLoadingProjects ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Spinner size={28} />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects yet"
          description="Create your first project to get started. You'll be the admin and can add teammates."
          action={<Button onClick={() => setShowCreate(true)}><Plus size={14} />Create project</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {projects.map((project, i) => (
            <div key={project.id} className={`delay-${Math.min(i + 1, 5)}`}>
              <ProjectCard project={project} onDelete={setDeleteTarget} />
            </div>
          ))}
        </div>
      )}


      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New project">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Project name"
            placeholder="e.g. Website Redesign"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            autoFocus
          />
          <Textarea
            label="Description (optional)"
            placeholder="What's this project about?"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
          />
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <Button variant="secondary" type="button" onClick={() => setShowCreate(false)} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} style={{ flex: 1 }}>
              Create project
            </Button>
          </div>
        </form>
      </Modal>


      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete project?">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.6 }}>
            This will permanently delete <strong style={{ color: 'var(--text)' }}>{deleteTarget?.name}</strong> and all its tasks. This can't be undone.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} style={{ flex: 1 }}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
