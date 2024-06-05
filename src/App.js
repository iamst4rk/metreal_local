import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import StockTable from './components/StockTable';
import DataInput from './components/DataInput';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Складской запас
          </Typography>
          <Button color="inherit" href="/">
            Главная
          </Button>
          <Button color="inherit" href="/input">
            Ввод данных
          </Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<StockTable />} />
          <Route path="/input" element={<DataInput />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
