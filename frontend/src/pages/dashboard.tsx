import { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { Task } from '@/types/tasks';
import api from '@/utils/api';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user.name}
        </Typography>
        <TaskForm onTaskCreated={fetchTasks} />
        <TaskList tasks={tasks} onTaskDeleted={fetchTasks} />
      </Box>
    </Container>
  );
}