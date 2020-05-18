import React from 'react';
import { Table, TableCell, TableRow, TableBody } from '@material-ui/core'


function volume(ticker, buy, sell)
{
  let resultado_1 = buy.filter((stock) => stock.ticker === ticker).reduce((a, b) => a + b.volume, 0)
  let resultado_2 = sell.filter((stock) => stock.ticker === ticker).reduce((a, b) => a + b.volume, 0)
  return resultado_1 + resultado_2;
}

function minimum(data)
{
  let resultado = data.map((update) => update.value);
  return Math.min(...resultado);
}

function maximum(data)
{
  let resultado = data.map((update) => update.value);
  return Math.max(...resultado);
}

function variation(data)
{
  let last = data[data.length - 1].value;
  let penultimate = data[data.length - 2].value;
  let result = (last - penultimate)/penultimate * 100;
  return result.toFixed(4);
}

function Table1(props)
{
  const { stock, buy, sell, update } = props;

  return (
    <Table aria-label="simple table">
      <TableBody>
        <TableRow key='volumen transado'>
          <TableCell component="th" scope="row">
            Volumen Transado
          </TableCell>
          <TableCell align="right">{stock? volume(stock.ticker, buy, sell): 0}</TableCell>
        </TableRow>
        <TableRow key='minimo historico'>
          <TableCell component="th" scope="row">
            Mínimo Histórico
          </TableCell>
          <TableCell align="right">{update && update.length > 0 ? minimum(update) : 0}</TableCell>
        </TableRow>
        <TableRow key='maximo historico'>
          <TableCell component="th" scope="row">
            Máximo Histórico
          </TableCell>
          <TableCell align="right">{update && update.length > 0 ? maximum(update) : 0}</TableCell>
        </TableRow>
        <TableRow key='precio'>
          <TableCell component="th" scope="row">
            Precio
          </TableCell>
          <TableCell align="right">{update && update.length > 0 ? update[update.length - 1].value : 0}</TableCell>
        </TableRow>
        <TableRow key='variacion porcentual'>
          <TableCell component="th" scope="row">
            Variación Porcentual
          </TableCell>
          <TableCell align="right">{update && update.length > 1 ? variation(update): 0}%</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    )
}

export default Table1;
