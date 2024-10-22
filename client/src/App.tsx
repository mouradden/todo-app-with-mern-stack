import React, { useState, useEffect, useId } from 'react';
import './index.css';
import { Task } from './types';
import TaskItem from './components/TaskItem'
import {TasksContext} from './context'
import axios from 'axios';

interface DataElement {
  todo: string;
  completed: boolean;
  id: number,
}
interface SavedElement {
  content: string;
  is_completed: boolean;
  _id: number,
}
function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [actualSection, setActualSection] = useState<string>('all');
  
  const [suggestedTask, setSuggestedTask] = useState<string>('What to do?');
  const id = useId();
  const addTask = async () => {
    if (newTask.length === 0)
        return;
    const task: Task = {
      id : id,
      content: newTask,
      is_completed: false,    
    }

    const newTaskToAdd = { id : task.id, content: task.content, is_completed: task.is_completed};
    axios.post('http://localhost:5001/tasks', newTaskToAdd)
    .then((response)=>{
       const createdTask = response.data;
         console.log("new Task created ", createdTask);
         setTasks((prevTasks) => [...prevTasks, newTaskToAdd]);
        setNewTask('');
     })
     .catch ((error)=> {
       console.error('Error adding task:', error);
     })
  }
  
  const completedTasks = tasks.filter(task => task.is_completed);
  const incompletedTasks = tasks.filter(task => !task.is_completed);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(`https://dummyjson.com/todos/${Math.floor(Math.random() * 30) + 1}`)
      .then((response) => {
        const data: DataElement = response.data;
        setSuggestedTask(data.todo);

      })
      .catch((error) => console.error("Error fetching todos:", error));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5001/tasks')
    .then((response) => {
      const data: SavedElement[] =  response.data;
      const newTasks = data.map((element) => ({
              id: String(element._id),
              content: element.content,
              is_completed: element.is_completed,
            }));
            setTasks(newTasks);
    })
    .catch((error) => console.error('Error fetching tasks:', error));
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center h-full md:px-12 lg:px-24 xl:32">
      <TasksContext.Provider value={{tasks, setTasks, setNewTask, addTask}}>
        <div className="flex items-center justify-center gap-2 border-black top-24 rounded w-full h-64">
          <input 
            type="text" 

            placeholder={suggestedTask || "Enter a task..."}
            className="border rounded p-2"
            value={newTask}
            onChange={(e)=>{
              setNewTask(e.target.value);
            }}
          />
          <button 
            className="border rounded bg-green-500 p-1"
            onClick={addTask}
          >
            Add
          </button>
        </div>
        <div className="flex-1 w-full p-2 space-y-3">
          {tasks.length && 
            <div className='flex items-center justify-between p-2'>
              <button 
                onClick={()=>{setActualSection('all')}}
                className={`${actualSection === 'all' ? 'bg-green-200 hover:bg-green-300' : ''} w-1/3 border rounded-tr-lg hover:bg-gray-200 p-2`}>All Tasks</button>
              <button 
                onClick={()=>{setActualSection('completed')}}
                className={`${actualSection === 'completed' ? 'bg-green-200 hover:bg-green-300' : ''} border rounded-tr-lg hover:bg-gray-200 p-2 flex-1`}>Completed Taks</button>
              <button 
                onClick={()=>{setActualSection('incompleted')}}
                className={`${actualSection === 'incompleted' ? 'bg-green-200 hover:bg-green-300' : ''} border rounded-tr-lg hover:bg-gray-200 p-2 flex-1`}>Incompleted Tasks</button>
            </div>
          }
          {
          actualSection === 'all' ?
            tasks.map((task) => (
              <TaskItem task={task}/>
            )) 
            :
            actualSection === 'completed' ?
            completedTasks.map((task) => (
              <TaskItem task={task}/>
            )) 
            :
            incompletedTasks.map((task) => (
              <TaskItem task={task}/>
            )) 
          }
        </div>
      </TasksContext.Provider>
    </div>

  );
}

export default App;
