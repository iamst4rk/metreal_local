import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { SketchPicker } from 'react-color';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  colorPickerContainer: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
}));

const StockTable = () => {
  const classes = useStyles();
  const [stocks, setStocks] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [colorMap, setColorMap] = useState({});

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stock/items');
        setStocks(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStocks();
  }, []);

  const handleDetailChange = (event) => {
    setSelectedDetail(event.target.value);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };

  const applyColor = () => {
    setColorMap({ ...colorMap, [selectedDetail]: selectedColor });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Текущие остатки на складе</Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Выберите деталь</InputLabel>
        <Select value={selectedDetail} onChange={handleDetailChange}>
          {stocks.map((stock) => (
            <MenuItem key={stock['Типоразмер изделия']} value={stock['Типоразмер изделия']}>
              {stock['Типоразмер изделия']}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={classes.colorPickerContainer}>
        <SketchPicker color={selectedColor} onChangeComplete={handleColorChange} />
        <Button variant="contained" color="primary" onClick={applyColor}>
          Применить цвет
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Типоразмер изделия</TableCell>
            <TableCell>Потребность</TableCell>
            <TableCell>Вырезано</TableCell>
            <TableCell>Заклепано</TableCell>
            <TableCell>Покрашено/Передано</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.id} style={{ backgroundColor: colorMap[stock['Типоразмер изделия']] || 'white' }}>
              <TableCell>{stock['Типоразмер изделия']}</TableCell>
              <TableCell>{stock['Потребность']}</TableCell>
              <TableCell>{stock['Вырезано']}</TableCell>
              <TableCell>{stock['Заклепано']}</TableCell>
              <TableCell>{stock['Покрашено/Передано']}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default StockTable;
