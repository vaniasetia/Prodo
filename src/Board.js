// Import necessary React hooks and styles
import React, { useState, useRef, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './index.css';

const Board = () => {
  // Initialize tasks state with some default tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Get groceries', status: 'todo' },
    { id: 2, title: 'Feed the dogs', status: 'todo' },
    { id: 3, title: 'Mow the lawn', status: 'todo' },
    { id: 4, title: 'Clean the house', status: 'doing' },
    { id: 5, title: 'Binge 80 hours of Game of Thrones', status: 'doing' },
    { id: 6, title: 'Read a book', status: 'done' },
  ]);

  // State for new task input
  const [newTask, setNewTask] = useState('');
  // Ref for tracking the currently dragged item
  const dragItem = useRef(null);

  // State for managing the Pomodoro timer
  const [timerState, setTimerState] = useState({
    mode: 'focus',
    time: 1500,
    isRunning: false,
  });

  // Effect hook for managing the timer countdown
  useEffect(() => {
    let intervalId;
    if (timerState.isRunning && timerState.time > 0) {
      intervalId = setInterval(() => {
        setTimerState(prev => ({ ...prev, time: prev.time - 1 }));
      }, 1000);
    } else if (timerState.time === 0) {
      // Reset timer when it reaches 0
      setTimerState(prev => ({
        mode: 'focus',
        time: 1500,
        isRunning: false,
      }));
    }
    // Clean up interval on component unmount or when timer stops
    return () => clearInterval(intervalId);
  }, [timerState.isRunning, timerState.time]);

  // Function to format seconds into MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Handler for drag start event
  const handleDragStart = (e, task) => {
    dragItem.current = task;
  };

  // Handler for drop event
  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setTasks(tasks.map(task => 
      task.id === dragItem.current.id ? { ...task, status: targetStatus } : task
    ));
    dragItem.current = null;
  };

  // Handler for adding a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTask, status: 'todo' }]);
      setNewTask('');
    }
  };

  // Function to set the timer mode
  const setTimerMode = (mode, time) => {
    setTimerState({ mode, time, isRunning: false });
  };

  // Function to toggle the timer start/pause
  const toggleTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  // Function to reset the timer
  const resetTimer = () => {
    setTimerState(prev => ({ ...prev, time: getInitialTime(prev.mode), isRunning: false }));
  };

  // Function to get the initial time for each timer mode
  const getInitialTime = (mode) => {
    const times = { focus: 1500, short: 300, long: 900 };
    return times[mode] || 1500;
  };

  // Update renderTasks function
  const renderTasks = (status) => (
    <TransitionGroup>
      {tasks.filter(task => task.status === status).map(task => (
        <CSSTransition key={task.id} timeout={300} classNames="fade">
          <div
            className="task fade-in"
            draggable
            onDragStart={(e) => handleDragStart(e, task)}
          >
            {task.title}
          </div>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );

  return (
    <div className="board">
      <h1>Prodo</h1>
      {/* Form for adding new tasks */}
      <form id="todo-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Add a new task..."
          id="todo-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Task board with swim lanes */}
      <div className="lanes">
        {['todo', 'doing', 'done'].map(status => (
          <div 
            key={status}
            className="swim-lane fade-in" 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, status)}
          >
            <h3 className="heading">{status.toUpperCase()}</h3>
            {renderTasks(status)}
          </div>
        ))}
      </div>

      {/* Pomodoro timer section */}
      <div className="container fade-in">
        <h2>Pomodoro Timer</h2>
        <div className="section-container">
          {['focus', 'short', 'long'].map(mode => (
            <button 
              key={mode}
              onClick={() => setTimerMode(mode, getInitialTime(mode))} 
              className={`btn ${timerState.mode === mode ? 'btn-focus' : ''}`}
            >
              {mode === 'short' ? 'Short Break' : mode === 'long' ? 'Long Break' : 'Focus'}
            </button>
          ))}
        </div>
        <div className="time-btn-container">
          <span id="time">{formatTime(timerState.time)}</span>
          <div className="btn-container">
            <button onClick={toggleTimer}>
              {timerState.isRunning ? 'Pause' : 'Start'}
            </button>
            {timerState.isRunning && (
              <button onClick={resetTimer}>
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;