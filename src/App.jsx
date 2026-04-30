import './App.css'
import { useState, useEffect, useRef } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilterState] = useState('all')
  const isFirstRender = useRef(true)

  // Carregar tarefas do localStorage ao montar o componente
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Salvar tarefas no localStorage sempre que mudarem
  // (ignora a primeira renderização para não sobrescrever com lista vazia)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleAddTask = () => {
    const input = document.getElementById('taskInput')
    if (input.value.trim() === '') return
    setTasks([...tasks, { text: input.value, done: false }])
    input.value = ''
  }

  const toggleTask = (index) => {
    const newTasks = [...tasks]
    newTasks[index].done = !newTasks[index].done
    setTasks(newTasks)
  }

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index)
    setTasks(newTasks)
  }

  const handleFilterChange = (filterType) => {
    setFilterState(filterType)
  }

  const getFilteredTasks = () => {
    switch(filter) {
      case 'pending':
        return tasks.filter(t => !t.done)
      case 'done':
        return tasks.filter(t => t.done)
      default:
        return tasks
    }
  }

  const progress = tasks.length > 0 ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0
  const filteredTasks = getFilteredTasks()

  const emptyMessage = filteredTasks.length === 0
    ? filter === 'all'
      ? 'Ainda não há tarefas cadastradas.'
      : filter === 'pending'
        ? 'Nenhuma tarefa pendente.'
        : 'Nenhuma tarefa concluída.'
    : ''

  return (
    <>
      <h1><span>Task</span>Hub</h1>
      <div className="progress-card">
        <div className="progress-info">
          <div className="progress-label">PROGRESSO_GERAL</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" id="progressBar" style={{width: `${progress}%`}}></div>
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div className="progress-count" id="progressPct">
            {progress}%
            <div className="progress-subtext">concluído</div>
          </div>
          <div className="progress-pct" id="progressLabel">{tasks.filter(t => t.done).length} / {tasks.length} tarefas</div>
        </div>
      </div>
      
      <div className="input-row">
        <input className="task-input" id="taskInput" type="text" placeholder='Nova tarefa... Pressione Adicionar' />
        <button className="add-button" onClick={handleAddTask}>+ Adicionar</button>
      </div>

      <div className="filters">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilterChange('all')}>todas</button>
        <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => handleFilterChange('pending')}>pendentes</button>
        <button className={`filter-btn ${filter === 'done' ? 'active' : ''}`} onClick={() => handleFilterChange('done')}>concluídas</button>
      </div>

      <div className="task-list" id="taskList">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">{emptyMessage}</div>
        ) : (
          filteredTasks.map((task, index) => {
            const realIndex = tasks.indexOf(task)
            return (
              <div key={index} className={`task-item ${task.done ? 'done' : ''}`}>
                <div className="task-checkbox" onClick={() => toggleTask(realIndex)}>
                  {task.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"></polyline></svg>}
                </div>
                <div className="task-text">{task.text}</div>
                <button className="task-delete" onClick={() => handleDeleteTask(realIndex)}>×</button>
              </div>
            )
          })
        )}
      </div>
 
      <div className="divider"></div>
    </>
  )
}

export default App