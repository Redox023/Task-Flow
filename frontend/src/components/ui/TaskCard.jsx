import { useState } from 'react'
import { Calendar, Pencil, Trash2, MoreVertical } from 'lucide-react'
import { format, isPast, isToday } from 'date-fns'
import { Badge, Avatar } from '../ui'

const PRIORITY = {
  HIGH:   { label: 'High',   variant: 'high'   },
  MEDIUM: { label: 'Medium', variant: 'medium' },
  LOW:    { label: 'Low',    variant: 'low'    },
}
const STATUS = {
  TODO:        { label: 'To Do',       variant: 'todo'        },
  IN_PROGRESS: { label: 'In Progress', variant: 'in-progress' },
  DONE:        { label: 'Done',        variant: 'done'        },
}

export default function TaskCard({ task, isAdmin, isAssignee, onEdit, onDelete, onStatusChange }) {
  const [menu, setMenu] = useState(false)

  const p = PRIORITY[task.priority] || PRIORITY.MEDIUM
  const s = STATUS[task.status]   || STATUS.TODO
  const isDone    = task.status === 'DONE'
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isDone
  const isToday_  = task.dueDate && isToday(new Date(task.dueDate)) && !isDone

  const nextStatus = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO' }[task.status]
  const canChangeStatus = isAdmin || isAssignee

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${isOverdue ? 'rgba(232,96,74,0.25)' : 'var(--border)'}`,
      borderRadius: 12,
      padding: '14px 16px',
      transition: 'border-color 0.12s',
      opacity: isDone ? 0.65 : 1,
      position: 'relative',
    }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>

        {canChangeStatus && (
          <button
            onClick={() => onStatusChange(task.id, nextStatus)}
            title={`Mark as ${STATUS[nextStatus]?.label}`}
            style={{
              width: 16, height: 16, borderRadius: 5, flexShrink: 0, marginTop: 1,
              border: isDone ? '1.5px solid var(--green)' : '1.5px solid var(--border-hi)',
              background: isDone ? 'var(--green)' : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.12s', color: 'var(--bg)',
            }}
          >
            {isDone && <span style={{ fontSize: 9, fontWeight: 800, lineHeight: 1 }}>✓</span>}
          </button>
        )}

        <h4 style={{
          flex: 1, fontSize: 13, fontWeight: 500, lineHeight: 1.5,
          color: isDone ? 'var(--text-soft)' : 'var(--text)',
          textDecoration: isDone ? 'line-through' : 'none',
          minWidth: 0,
        }}>
          {task.title}
        </h4>


        {isAdmin && (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setMenu(v => !v)}
              style={{
                width: 24, height: 24, borderRadius: 6, border: 'none',
                background: 'transparent', color: 'var(--text-soft)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.1s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--raised)'; e.currentTarget.style.color = 'var(--text-dim)' }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-soft)' }}
            >
              <MoreVertical size={13} />
            </button>

            {menu && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                  onClick={() => setMenu(false)}
                />
                <div style={{
                  position: 'absolute', right: 0, top: 28, zIndex: 20,
                  background: 'var(--raised)',
                  border: '1px solid var(--border-hi)',
                  borderRadius: 10, padding: '4px 0',
                  minWidth: 130, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }} className="anim-pop">
                  <button
                    onClick={() => { onEdit(task); setMenu(false) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 14px', border: 'none', background: 'transparent',
                      color: 'var(--text-dim)', cursor: 'pointer', fontSize: 12,
                      fontFamily: 'inherit', transition: 'all 0.1s', textAlign: 'left',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text)' }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-dim)' }}
                  >
                    <Pencil size={11} />
                    Edit task
                  </button>
                  <button
                    onClick={() => { onDelete(task); setMenu(false) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 14px', border: 'none', background: 'transparent',
                      color: 'var(--red)', cursor: 'pointer', fontSize: 12,
                      fontFamily: 'inherit', transition: 'all 0.1s', textAlign: 'left',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(232,96,74,0.08)' }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <Trash2 size={11} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>


      {task.description && (
        <p style={{
          fontSize: 11, color: 'var(--text-soft)', lineHeight: 1.55,
          marginBottom: 12, display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {task.description}
        </p>
      )}


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Badge variant={p.variant}>{p.label}</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {task.dueDate && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 3, fontSize: 11,
              color: isOverdue ? 'var(--red)' : isToday_ ? 'var(--gold)' : 'var(--text-soft)',
            }}>
              <Calendar size={10} />
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
          {task.assignee ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Avatar name={task.assignee.fullName} size="sm" />
              <span style={{ fontSize: 11, color: 'var(--text-soft)' }}>
                {task.assignee.fullName.split(' ')[0]}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: 11, color: 'var(--text-soft)' }}>Unassigned</span>
          )}
        </div>
      </div>
    </div>
  )
}
