import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const DataInput = () => {
  const [action, setAction] = useState('');
  const [file, setFile] = useState(null);
  const [nomenclature, setNomenclature] = useState('');
  const [quantity, setQuantity] = useState('');
  const [nomenclatures, setNomenclatures] = useState([]);

  useEffect(() => {
    // Получение списка номенклатур из базы данных
    const fetchNomenclatures = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stock/nomenclature');
        setNomenclatures(response.data);
      } catch (error) {
        console.error('Error fetching nomenclatures:', error);
      }
    };

    fetchNomenclatures();
  }, []);

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNomenclatureChange = (event) => {
    setNomenclature(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('nomenclature', nomenclature);
    formData.append('quantity', parseInt(quantity, 10)); // Преобразование quantity в число
  
    try {
      if (action === 'add_to_needs') {
        await axios.post('http://localhost:5000/api/stock/add-needs', formData);
      } else if (action === 'add_to_cut') {
        await axios.post('http://localhost:5000/api/stock/add-cut', { nomenclature, quantity: parseInt(quantity, 10) });
      } else if (action === 'add_to_riveted') {
        await axios.post('http://localhost:5000/api/stock/add-riveted', { nomenclature, quantity: parseInt(quantity, 10) });
      } else if (action === 'add_to_painted_transferred') {
        await axios.post('http://localhost:5000/api/stock/add-painted-transferred', { nomenclature, quantity: parseInt(quantity, 10) });
      }
      alert('Data submitted successfully');
    } catch (error) {
      console.error('Error submitting data', error);
      alert('Error submitting data');
    }
  };
  

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Ввод данных</Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Выберите действие</InputLabel>
        <Select value={action} onChange={handleActionChange}>
          <MenuItem value="add_to_needs">Добавить в "Потребность"</MenuItem>
          <MenuItem value="add_to_cut">Добавить в "Вырезано"</MenuItem>
          <MenuItem value="add_to_riveted">Добавить в "Заклепано"</MenuItem>
          <MenuItem value="add_to_painted_transferred">Добавить в "Покрашено/Передано"</MenuItem>
        </Select>
      </FormControl>
      {action === 'add_to_needs' && (
        <FormControl fullWidth margin="normal">
          <input type="file" onChange={handleFileChange} />
        </FormControl>
      )}
      {(action === 'add_to_cut' || action === 'add_to_riveted' || action === 'add_to_painted_transferred') && (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel>Номенклатура</InputLabel>
            <Select value={nomenclature} onChange={handleNomenclatureChange}>
              {nomenclatures.map((item) => (
                <MenuItem key={item['Типоразмер изделия']} value={item['Типоразмер изделия']}>
                  {item['Типоразмер изделия']}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Количество"
            value={quantity}
            onChange={handleQuantityChange}
            fullWidth
            margin="normal"
          />
        </>
      )}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Отправить
      </Button>
    </Container>
  );
};

export default DataInput;
