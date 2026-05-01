import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Plus, Users, ArrowLeft, UserMinus, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { usersApi } from '../api/services'
import useProjectStore from '../store/projectStore'
import useAuthStore from '../store/authStore'
import { Button, Modal, Badge, Spinner, Avatar } from '../components/ui'
import TaskCard from '../components/ui/TaskCard'
import TaskFormModal from '../components/ui/TaskFormModal'

const COLUMNS = [
  { key: 'TODO',        label: 'To Do',       color: 'var(--blue)',  bg: 'rgba(124,158,245,0.08)' },
  { key: 'IN_PROGRESS', label: 'In Progress',  color: 'var(--gold)',  bg: 'rgba(232,162,58,0.08)' },
  { key: 'DONE',        label: 'Done',         color: 'var(--green)', bg: 'rgba(52,201,138,0.08)' },
]

function MemberSearch({ existingMemberIds, onAdd }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const timer = useRef(null)

  const handleSearch = (val) => {
    setQuery(val)
    clearTimeout(timer.current)
    if (val.length < 3) { setResults([]); return }
    timer.current = setTimeout(async () => {
      setSearching(true)
      try {
        const { data } = await usersApi.search(val)
        setResults(data.data.users.filter(u => !existingMemberIds.includes(u.id)))
      } catch {} finally { setSearching(false) }
    }, 350)
  }

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <Search size={13} style={{
          position: 'absolute', left: 11, top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-soft)',
        }} />
        <input
          className="field"
          placeholder="Search by email or name..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          style={{ paddingLeft: 32 }}
        />
        {searching && (
          <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
            <Spinner size={12} />
          </div>
        )}
      </div>

      {results.map(u => (
        <div key={u.id} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 4px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={u.fullName} size="sm" />
            <div>
              <p style={{ fontSize: 13, fontWeight: 500 }}>{u.fullName}</p>
              <p style={{ fontSize: 11, color: 'var(--text-soft)' }}>{u.email}</p>
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => { onAdd(u); setQuery(''); setResults([]) }}>Add</Button>
        </div>
      ))}

      {query.length >= 3 && !searching && results.length === 0 && (
        <p style={{ fontSize: 12, color: 'var(--text-soft)', padding: '12px 0', textAlign: 'center' }}>
          No users found
        </p>
      )}
    </div>
  )
}

export default function ProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const { currentProject, tasks, isLoadingTasks, fetchProject, fetchTasks, createTask, updateTask, deleteTask, updateMembers } = useProjectStore()

  const [loadingProject, setLoadingProject] = useState(true)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showMembers, setShowMembers] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')

  const isAdmin = currentProject?.myRole === 'ADMIN'

  useEffect(() => {
    const load = async () => {
      try { await fetchProject(id) }
      catch { toast.error('Project not found'); navigate('/projects') }
      finally { setLoadingProject(false) }
    }
    load()
  }, [id])

  useEffect(() => {
    if (currentProject) fetchTasks(id, statusFilter ? { status: statusFilter } : {})
  }, [currentProject, statusFilter])

  const handleCreateTask = async (payload) => {
    try { await createTask(id, payload); toast.success('Task created') }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); throw err }
  }

  const handleEditTask = async (payload) => {
    try { await updateTask(editTask.id, payload); toast.success('Task updated') }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); throw err }
  }

  const handleDeleteTask = async () => {
    try { await deleteTask(deleteTarget.id); toast.success('Task deleted'); setDeleteTarget(null) }
    catch { toast.error('Failed to delete task') }
  }

  const handleStatusChange = async (taskId, status) => {
    try { await updateTask(taskId, { status }) }
    catch { toast.error('Could not update status') }
  }

  const handleAddMember = async (targetUser) => {
    try { await updateMembers(id, { action: 'add', userId: targetUser.id, role: 'MEMBER' }); toast.success(`${targetUser.fullName} added`) }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleRemoveMember = async (memberId, name) => {
    try { await updateMembers(id, { action: 'remove', userId: memberId }); toast.success(`${name} removed`) }
    catch { toast.error('Failed to remove member') }
  }

  const byStatus = {
    TODO:        tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE:        tasks.filter(t => t.status === 'DONE'),
  }

  if (loadingProject) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Spinner size={28} />
    </div>
  )
  if (!currentProject) return null

  const existingMemberIds = currentProject.members?.map(m => m.userId) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      <div style={{
        padding: '22px 30px 16px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <Link
          to="/projects"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, color: 'var(--text-soft)', textDecoration: 'none',
            marginBottom: 10, transition: 'color 0.12s',
          }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--text-dim)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-soft)'}
        >
          <ArrowLeft size={11} /> Back to projects
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em' }}>
                {currentProject.name}
              </h1>
              <Badge variant={isAdmin ? 'admin' : 'member'}>{isAdmin ? 'Admin' : 'Member'}</Badge>
            </div>
            {currentProject.description && (
              <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{currentProject.description}</p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setShowMembers(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
                borderRadius: 8, border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-dim)', cursor: 'pointer', fontSize: 12,
                fontFamily: 'inherit', transition: 'all 0.12s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-hi)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)' }}
            >
              <div style={{ display: 'flex', marginRight: -2 }}>
                {currentProject.members?.slice(0, 3).map(m => (
                  <div key={m.userId} style={{ marginRight: -6 }}>
                    <Avatar name={m.user.fullName} size="sm" />
                  </div>
                ))}
              </div>
              <Users size={12} />
              {currentProject.members?.length} members
            </button>
            {isAdmin && (
              <Button onClick={() => setShowCreateTask(true)}>
                <Plus size={13} /> Add task
              </Button>
            )}
          </div>
        </div>
      </div>


      <div style={{
        padding: '10px 30px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-soft)', marginRight: 6 }}>Filter:</span>
        {[
          { value: '', label: 'All' },
          { value: 'TODO', label: 'To Do' },
          { value: 'IN_PROGRESS', label: 'In Progress' },
          { value: 'DONE', label: 'Done' },
        ].map(opt => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            style={{
              padding: '4px 11px', borderRadius: 99, border: 'none', cursor: 'pointer',
              fontSize: 12, fontFamily: 'inherit', transition: 'all 0.12s',
              background: statusFilter === opt.value ? 'rgba(232,162,58,0.12)' : 'transparent',
              color: statusFilter === opt.value ? 'var(--gold)' : 'var(--text-soft)',
              fontWeight: statusFilter === opt.value ? 500 : 400,
            }}
          >
            {opt.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-soft)' }}>
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>


      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden' }}>
        {isLoadingTasks ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Spinner size={28} />
          </div>
        ) : (
          <div style={{
            display: 'flex', gap: 14, padding: '20px 30px',
            height: '100%', minWidth: 'max-content',
          }}>
            {COLUMNS.map(col => (
              <div key={col.key} style={{ width: 300, display: 'flex', flexDirection: 'column', height: '100%' }}>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: 9, marginBottom: 10,
                  background: col.bg,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: col.color }}>
                      {col.label}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: col.color, opacity: 0.7, fontFamily: 'monospace' }}>
                    {byStatus[col.key].length}
                  </span>
                </div>


                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {byStatus[col.key].length === 0 ? (
                    <div style={{
                      border: '1px dashed var(--border)', borderRadius: 10,
                      padding: '28px 0', textAlign: 'center',
                    }}>
                      <p style={{ fontSize: 12, color: 'var(--text-soft)' }}>Nothing here</p>
                    </div>
                  ) : byStatus[col.key].map((task, i) => (
                    <div key={task.id} className={`anim-rise delay-${Math.min(i + 1, 5)}`}>
                      <TaskCard
                        task={task}
                        isAdmin={isAdmin}
                        isAssignee={task.assigneeId === user?.id}
                        onEdit={t => setEditTask(t)}
                        onDelete={setDeleteTarget}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                  ))}

                  {isAdmin && col.key === 'TODO' && (
                    <button
                      onClick={() => setShowCreateTask(true)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '9px 12px', borderRadius: 10,
                        border: '1px dashed var(--border)', background: 'transparent',
                        color: 'var(--text-soft)', cursor: 'pointer', fontSize: 12,
                        fontFamily: 'inherit', transition: 'all 0.12s', marginTop: 2,
                      }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-hi)'; e.currentTarget.style.color = 'var(--text-dim)' }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-soft)' }}
                    >
                      <Plus size={12} /> Add task
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <Modal isOpen={showMembers} onClose={() => setShowMembers(false)} title="Team members">
        <div>
          <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 16 }}>
            {currentProject.members?.map(m => (
              <div
                key={m.userId}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 4px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={m.user.fullName} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{m.user.fullName}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-soft)' }}>{m.user.email}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge variant={m.role === 'ADMIN' ? 'admin' : 'member'}>
                    {m.role}
                  </Badge>
                  {isAdmin && m.userId !== user?.id && (
                    <button
                      onClick={() => handleRemoveMember(m.userId, m.user.fullName)}
                      title="Remove member"
                      style={{
                        width: 26, height: 26, borderRadius: 6, border: 'none',
                        background: 'transparent', color: 'var(--text-soft)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.12s',
                      }}
                      onMouseOver={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'rgba(232,96,74,0.08)' }}
                      onMouseOut={e => { e.currentTarget.style.color = 'var(--text-soft)'; e.currentTarget.style.background = 'transparent' }}
                    >
                      <UserMinus size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isAdmin && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                Add member
              </p>
              <MemberSearch existingMemberIds={existingMemberIds} onAdd={handleAddMember} />
            </div>
          )}
        </div>
      </Modal>


      <TaskFormModal
        isOpen={showCreateTask || !!editTask}
        onClose={() => { setShowCreateTask(false); setEditTask(null) }}
        onSubmit={editTask ? handleEditTask : handleCreateTask}
        task={editTask}
        members={currentProject.members}
        isAdmin={isAdmin}
      />


      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete task?">
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 20 }}>
            Delete <strong style={{ color: 'var(--text)' }}>"{deleteTarget?.title}"</strong>? This can't be undone.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} style={{ flex: 1 }}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteTask} style={{ flex: 1 }}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
