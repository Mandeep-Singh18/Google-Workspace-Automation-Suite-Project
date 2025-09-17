import { List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '@/types/tasks';
import api from '@/utils/api';

interface TaskListProps {
  tasks: Task[];
  onTaskDeleted: () => void;
}

export default function TaskList({ tasks, onTaskDeleted }: TaskListProps) {
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      onTaskDeleted();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  if (tasks.length === 0) {
    return <Typography>No tasks found. Add one above!</Typography>;
  }

  return (
    <List>
      {tasks.map((task) => (
        <ListItem key={task.id} secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(task.id)}>
            <DeleteIcon />
          </IconButton>
        } divider>
          <ListItemText primary={task.title} secondary={task.status} />
        </ListItem>
      ))}
    </List>
  );
}