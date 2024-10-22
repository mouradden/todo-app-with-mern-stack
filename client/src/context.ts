import { createContext } from "react";
import {Task} from './types';
export const TasksContext = createContext({
    tasks: [] as Task[],
    setTasks: (tasks: Task[]) => {},
    setNewTask: (input: string) => {},
    addTask: () => {},
});
