import { Task } from '../types';
import { useContext, useState } from 'react';
import {TasksContext} from '../context';
import axios from 'axios';

type TaskItemProps = {
  task: Task;
};
const TaskItem = ({ task }: TaskItemProps) => {
  const {tasks, setTasks }= useContext(TasksContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(''+task.content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (newContent.trim().length === 0)
        return ;
    const updatedTasks: Task[] = tasks.map(t => 
      t.id === task.id ? { ...t, content: newContent } : t
    );

    axios.put(`http://localhost:5001/tasks/${task.id}`,
      {content: newContent}
    )
    .then((response) => {
      const updatedTask = response.data;

        console.log('updated successfully :', updatedTask);
        setTasks(updatedTasks);
        setIsEditing(false);
    })
    .catch((error)=>
    {
      console.log('cannot do the update request', error);
    })
  };

  const handleCancel = () => {
    setIsEditing(false);
  };


  const setTaskAsCompleted = async (taskId: string) => {
    const updatedTasks: Task[] = tasks.map((task) => 
      task.id === taskId ? {...task, is_completed: true} : task
    );

    axios.put(`http://localhost:5001/tasks/${task.id}`,
      {is_completed: true}
    )
    .then((response) => {
      const updatedTask = response.data;
      console.log('delete done successfully :', updatedTask);
      setTasks(updatedTasks);
    })
    .catch((error)=>
    {
      console.log('cannot do the delete', error);
    })
  }
  const removeTask = async (taskId: string) => {
    const updatedTasks: Task[] = tasks.filter((task) => 
      task.id !== taskId);
    try {
      const response = await fetch(`http://localhost:5001/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.ok)
      {
        const deletedTask = await response.json();
        console.log('deleted successffully : ', deletedTask);
      }
      else {
        console.log('cannot delete', response);
      }
    }
    catch (error)
    {
      console.log('failed to fetch ', error);
    }
  setTasks(updatedTasks);

}

  return (
    <div 
      key={task.id}
      className='flex flex-row p-2 border rounder bg-gray-200 space-x-3'
    >
      <div className='flex-1'>
      {isEditing ? (
          <input 
            type="text" 
            value={newContent !== null ? newContent : ''} 
            onChange={(e) => setNewContent(e.target.value)} 
            className="border rounded p-2 w-full flex-1 "
          />
          ) : (
            <div>
              <h3 className='font-bold capitalize text-xl'>{task.content}</h3>
            </div>
          )
        }
        <p
          onClick={()=>{setTaskAsCompleted(task.id)}}
        >Status: {task.is_completed ? "Completed" : "In progress"}</p>
      </div>
      <div className='flex space-x-2'>
        {isEditing ? (
          <>
            <button className='border rounded bg-green-300 p-2' onClick={handleSave}>Save</button>
            <button className='border rounded bg-gray-400 p-2' onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <>
             {
                task.is_completed === false &&
                <button 
                  className='border rounded bg-green-300 p-2 hover-pointer w-24'
                  onClick={()=>{setTaskAsCompleted(task.id)}}
                >
                    set as completed
                  </button>
              }
            <button 
              className='border rounded bg-yellow-400 p-2' 
              onClick={handleEdit}
            >Edit</button>
            <button 
              className='border rounded bg-red-500 p-2 hover-pointer' 
              onClick={()=>{removeTask(task.id)}}
            >Remove</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;