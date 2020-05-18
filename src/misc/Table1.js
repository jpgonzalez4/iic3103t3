import React from 'react';
import { Table, TableCell, TableRow, TableBody } from '@material-ui/core'


function totalTradeVolume(ticker, buy, sell)
{
  let totalBuy = buy.filter((stock) => stock.ticker === ticker).reduce((a, b) => a + b.volume, 0)
  let totalSell = sell.filter((stock) => stock.ticker === ticker).reduce((a, b) => a + b.volume, 0)
  return totalBuy + totalSell;
}

function getMax(data)
{
  let values = data.map((update) => update.value);
  return Math.max(...values);
}

function getMin(data)
{
  let values = data.map((update) => update.value);
  return Math.min(...values);
}

function percentVariation(data)
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
        <TableRow key='volumen total transado'>
          <TableCell component="th" scope="row">
            Volumen Transado
          </TableCell>
          <TableCell align="right">{stock? totalTradeVolume(stock.ticker, buy, sell): 0}</TableCell>
        </TableRow>
        <TableRow key='alto historico'>
          <TableCell component="th" scope="row">
            Alto Histórico
          </TableCell>
          <TableCell align="right">{update && update.length > 0 ? getMax(update) : 0}</TableCell>
        </TableRow>
        <TableRow key='bajo historico'>
          <TableCell component="th" scope="row">
            Bajo Histórico
          </TableCell>
          <TableCell align="right">{update && update.length > 0 ? getMin(update) : 0}</TableCell>
        </TableRow>
        <TableRow key='ultimo precio'>
          <TableCell component="th" scope="row">
            Último precio
          </TableCell>
          <TableCell align="right">{update && update.length > 0 ? update[update.length - 1].value : 0}</TableCell>
        </TableRow>
        <TableRow key='variacion porcentual'>
          <TableCell component="th" scope="row">
            Variación Porcentual
          </TableCell>
          <TableCell align="right">{update && update.length > 1 ? percentVariation(update): 0}%</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    )
}

export default Table1;
