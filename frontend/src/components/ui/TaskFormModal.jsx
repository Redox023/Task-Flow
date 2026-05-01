import { useState, useEffect } from 'react'
import { Modal, Button, Input, Textarea, Select, Avatar } from '../ui'

const BLANK = { title: '', description: '', dueDate: '', priority: 'MEDIUM', status: 'TODO', assigneeId: '' }

export default function TaskFormModal({ isOpen, onClose, onSubmit, task, members, isAdmin }) {
  const [form, setForm] = useState(BLANK)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title || '',
        description: task.description || '',
        dueDate:     task.dueDate ? task.dueDate.substring(0, 10) : '',
        priority:    task.priority || 'MEDIUM',
        status:      task.status || 'TODO',
        assigneeId:  task.assigneeId || '',
      })
    } else {
      setForm(BLANK)
    }
  }, [task, isOpen])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setIsLoading(true)
    try {
      const payload = {
        title:       form.title,
        description: form.description || null,
        dueDate:     form.dueDate || null,
        priority:    form.priority,
        assigneeId:  form.assigneeId || null,
      }
      if (task) payload.status = form.status
      await onSubmit(payload)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit task' : 'New task'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input
          label="Title *"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={set('title')}
          autoFocus
          required
        />
        <Textarea
          label="Description"
          placeholder="Add some context (optional)"
          value={form.description}
          onChange={set('description')}
          rows={3}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Due date" type="date" value={form.dueDate} onChange={set('dueDate')} />
          <Select label="Priority" value={form.priority} onChange={set('priority')}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Select>
        </div>

        {task && (
          <Select label="Status" value={form.status} onChange={set('status')}>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </Select>
        )}

        {isAdmin && members && (
          <Select label="Assign to" value={form.assigneeId} onChange={set('assigneeId')}>
            <option value="">Unassigned</option>
            {members.map(m => (
              <option key={m.userId} value={m.userId}>{m.user.fullName}</option>
            ))}
          </Select>
        )}

        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <Button variant="secondary" type="button" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
          <Button type="submit" isLoading={isLoading} style={{ flex: 1 }}>
            {task ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
