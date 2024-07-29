import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

const Board = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Get groceries', status: 'todo' },
    { id: 2, title: 'Feed the dogs', status: 'todo' },
    { id: 3, title: 'Mow the lawn', status: 'todo' },
    { id: 4, title: 'Clean the house', status: 'doing' },
    { id: 5, title: 'Binge 80 hours of Game of Thrones', status: 'doing' },
    { id: 6, title: 'Read a book', status: 'done' },
  ]);

  const [newTask, setNewTask] = useState('');
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const [active, setActive] = useState('focus');
  const [time, setTime] = useState(1500);
  const [paused, setPaused] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (!paused && time > 0) {
      const id = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      setIntervalId(id);
    } else if (time === 0) {
      clearInterval(intervalId);
      setActive('focus');
      setTime(1500);
      setPaused(true);
    }

    return () => clearInterval(intervalId);
  }, [paused, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleDragStart = (e, task) => {
    dragItem.current = task;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const updatedTasks = tasks.map((task) => {
      if (task.id === dragItem.current.id) {
        return { ...task, status: targetStatus };
      }
      return task;
    });
    setTasks(updatedTasks);
    dragItem.current = null;
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const newTaskObj = { id: tasks.length + 1, title: newTask, status: 'todo' };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
    }
  };

  const handleFocus = () => {
    setActive('focus');
    setTime(1500);
    setPaused(true);
  };

  const handleShortBreak = () => {
    setActive('short');
    setTime(300);
    setPaused(true);
  };

  const handleLongBreak = () => {
    setActive('long');
    setTime(900);
    setPaused(true);
  };

  const handleStart = () => {
    setPaused(false);
  };

  const handlePause = () => {
    setPaused(true);
  };

  const handleReset = () => {
    setPaused(true);
    switch (active) {
      case 'long':
        setTime(900);
        break;
      case 'short':
        setTime(300);
        break;
      default:
        setTime(1500);
        break;
    }
  };

  return (
    <div className="board">
      <form id="todo-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="New TODO..."
          id="todo-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">ADD +</button>
      </form>

      <div className="lanes">
        <div 
          className="swim-lane" 
          id="todolane" 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'todo')}
        >
          <h3 className="heading">TODO</h3>
          {tasks.filter((task) => task.status === 'todo').map((task) => (
            <div
              key={task.id}
              className="task"
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
            >
              {task.title}
            </div>
          ))}
        </div>

        <div 
          className="swim-lane" 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'doing')}
        >
          <h3 className="heading">Doing</h3>
          {tasks.filter((task) => task.status === 'doing').map((task) => (
            <div
              key={task.id}
              className="task"
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
            >
              {task.title}
            </div>
          ))}
        </div>

        <div 
          className="swim-lane" 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'done')}
        >
          <h3 className="heading">Done</h3>
          {tasks.filter((task) => task.status === 'done').map((task) => (
            <div
              key={task.id}
              className="task"
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="section-container">
          <button onClick={handleFocus} className={`btn ${active === 'focus' ? 'btn-focus' : ''}`}>
            Focus
          </button>
          <button onClick={handleShortBreak} className={`btn ${active === 'short' ? 'btn-focus' : ''}`}>
            Short Break
          </button>
          <button onClick={handleLongBreak} className={`btn ${active === 'long' ? 'btn-focus' : ''}`}>
            Long Break
          </button>
        </div>
        <div className="time-btn-container">
          <span id="time">{formatTime(time)}</span>
          <div className="btn-container">
            <button id="btn-start" className={paused ? 'show' : 'hide'} onClick={handleStart}>
              Start
            </button>
            <button id="btn-pause" className={paused ? 'hide' : 'show'} onClick={handlePause}>
              Pause
            </button>
            <button id="btn-reset" className={paused ? 'hide' : 'show'} onClick={handleReset}>
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
