import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { AlertTriangle, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { dashboardApi } from '../api/services'
import useProjectStore from '../store/projectStore'
import { Card, Badge, Avatar, Spinner } from '../components/ui'

function StatBox({ label, value, sub, color = 'var(--gold)', dimColor = 'rgba(232,162,58,0.1)' }) {
  return (
    <Card style={{ padding: '18px 20px' }} className="anim-rise">
      <p style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 32, fontWeight: 700,
        letterSpacing: '-0.025em',
        color, marginBottom: 4,
      }}>
        {value}
      </p>
      <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: sub ? 4 : 0 }}>{label}</p>
      {sub && <p style={{ fontSize: 11, color: 'var(--text-soft)' }}>{sub}</p>}
    </Card>
  )
}

function Bar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{label}</span>
        <span style={{ fontSize: 12, color: 'var(--text-soft)', fontFamily: 'monospace' }}>
          {value} ({pct}%)
        </span>
      </div>
      <div style={{ height: 5, background: 'var(--raised)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: color,
          width: `${pct}%`,
          transition: 'width 0.7s cubic-bezier(.2,.8,.4,1)',
        }} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { projects, fetchProjects } = useProjectStore()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState('')

  useEffect(() => { fetchProjects() }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await dashboardApi.get(selectedProject || null)
        setData(res.data.data)
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedProject])

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1000 }}>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            Overview of task progress across your team
          </p>
        </div>

        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          className="field"
          style={{ width: 'auto', minWidth: 160 }}
        >
          <option value="">All projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Spinner size={28} />
        </div>
      ) : !data ? null : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatBox label="Total tasks" value={data.totalTasks} color="var(--text)" />
            <StatBox
              label="Completion rate"
              value={`${data.completionRate}%`}
              sub={`${data.byStatus.DONE} of ${data.totalTasks} done`}
              color="var(--green)"
            />
            <StatBox label="In progress" value={data.byStatus.IN_PROGRESS} color="var(--gold)" />
            <StatBox
              label="Overdue"
              value={data.overdueTasks.length}
              color={data.overdueTasks.length > 0 ? 'var(--red)' : 'var(--green)'}
            />
          </div>


          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card style={{ padding: '20px 22px' }} className="anim-rise delay-1">
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 18 }}>
                Tasks by status
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Bar label="To Do"       value={data.byStatus.TODO}        total={data.totalTasks} color="var(--blue)"  />
                <Bar label="In Progress" value={data.byStatus.IN_PROGRESS} total={data.totalTasks} color="var(--gold)"  />
                <Bar label="Done"        value={data.byStatus.DONE}        total={data.totalTasks} color="var(--green)" />
              </div>


            </Card>

            <Card style={{ padding: '20px 22px' }} className="anim-rise delay-2">
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 18 }}>
                Tasks by priority
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Bar label="High"   value={data.byPriority.HIGH}   total={data.totalTasks} color="var(--red)"   />
                <Bar label="Medium" value={data.byPriority.MEDIUM} total={data.totalTasks} color="var(--gold)"  />
                <Bar label="Low"    value={data.byPriority.LOW}    total={data.totalTasks} color="var(--green)" />
              </div>
            </Card>
          </div>


          <Card style={{ padding: '20px 22px' }} className="anim-rise delay-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Users size={14} style={{ color: 'var(--text-soft)' }} />
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600 }}>
                Tasks by team member
              </h2>
            </div>
            {data.byAssignee.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--text-soft)' }}>No assigned tasks.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {data.byAssignee
                  .sort((a, b) => b.tasks.length - a.tasks.length)
                  .map(({ assignee, tasks: mt }) => {
                    const done = mt.filter(t => t.status === 'DONE').length
                    const total = mt.length
                    const pct = total > 0 ? Math.round((done / total) * 100) : 0

                    return (
                      <div key={assignee.id || 'unassigned'} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 0',
                        borderBottom: '1px solid var(--border)',
                      }}>
                        <Avatar name={assignee.fullName} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{assignee.fullName}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-soft)', fontFamily: 'monospace' }}>
                              {done}/{total} done
                            </span>
                          </div>
                          <div style={{ height: 4, background: 'var(--raised)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', background: 'var(--green)', borderRadius: 99,
                              width: `${pct}%`, transition: 'width 0.7s cubic-bezier(.2,.8,.4,1)',
                            }} />
                          </div>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-soft)', fontFamily: 'monospace', width: 36, textAlign: 'right', flexShrink: 0 }}>
                          {pct}%
                        </span>
                      </div>
                    )
                  })}
              </div>
            )}
          </Card>


          {data.overdueTasks.length > 0 && (
            <Card
              style={{ padding: '20px 22px', borderColor: 'rgba(232,96,74,0.2)', background: 'rgba(232,96,74,0.03)' }}
              className="anim-rise delay-4"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <AlertTriangle size={14} style={{ color: 'var(--red)' }} />
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600 }}>
                  Overdue tasks
                </h2>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                  background: 'rgba(232,96,74,0.12)', color: 'var(--red)',
                }}>
                  {data.overdueTasks.length}
                </span>
              </div>
              <div>
                {data.overdueTasks.map(task => (
                  <div key={task.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0', borderBottom: '1px solid rgba(232,96,74,0.1)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      {task.assignee && <Avatar name={task.assignee.fullName} size="sm" />}
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {task.title}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-soft)' }}>{task.project?.name}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <Badge variant={task.priority.toLowerCase()}>{task.priority}</Badge>
                      <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'monospace' }}>
                        {format(new Date(task.dueDate), 'MMM d')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
