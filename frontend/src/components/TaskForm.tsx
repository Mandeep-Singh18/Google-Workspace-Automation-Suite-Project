import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import api from '@/utils/api';

interface TaskFormProps {
  onTaskCreated: () => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post('/tasks', { title });
      setTitle('');
      onTaskCreated();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 4 }}>
      <TextField fullWidth label="New Task Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button type="submit" variant="contained">Add</Button>
    </Box>
  );
}