import { Button, Container, Typography, Box } from '@mui/material';

export default function LoginPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Workspace Automation Suite</Typography>
        <Button
          fullWidth
          variant="contained"
          href={process.env.NEXT_PUBLIC_API_URL + '/auth/google'}
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In with Google
        </Button>
      </Box>
    </Container>
  );
}