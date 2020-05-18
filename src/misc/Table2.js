import React from 'react';
import { Table, TableCell, TableRow } from '@material-ui/core'


function volumen(tickers, trade){
  let totalBuy = 0;
  for(let i = 0; i < tickers.length; i++){
    totalBuy += trade.filter((stock) => stock.ticker === tickers[i]).reduce((a, b) => a + b.volume, 0)  
  }
  return totalBuy;
}

function import_tickers(exchange, exchanges, stocks){
  const companies = exchanges[exchange].listed_companies
  const tickers = stocks.map((stock) => {
    if (companies.includes(stock.company_name)) return stock.ticker;
    return null;
  })
  return tickers.filter(ticker => ticker);
}

function marketShare(exchange, exchanges, stocks, buy, sell, volume){
  let resultado = 0;
  let tickers = [];
  let exchanges_list = Object.keys(exchanges);

  exchanges_list.forEach((aux) => {
    if (aux !== exchange) {
      tickers = import_tickers(aux, exchanges, stocks);
      resultado += volumen(tickers, buy) + volumen(tickers, sell);
      }
  })
  let share = volume/(volume + resultado) * 100;
  return share.toFixed(4);
}

function Table2(props){
  const { exchange, exchanges, stocks, buy, sell } = props;
  let exchangeStocks;
  if (exchange && exchanges && stocks){
    exchangeStocks = import_tickers(exchange, exchanges, stocks);
  }

  const buyVolume = (exchangeStocks && volumen(exchangeStocks, buy)) || 0;
  const sellVolume = (exchangeStocks && volumen(exchangeStocks, sell)) || 0;

  return (
    <Table aria-label="simple table">
      <TableRow key='volumen compra'>
        <TableCell component="th" scope="row">
          Volumen Compra
        </TableCell>
        <TableCell align="right">{buyVolume}</TableCell>
      </TableRow>
      <TableRow key='volumen venta'>
        <TableCell component="th" scope="row">
          Volumen Venta
        </TableCell>
        <TableCell align="right">{sellVolume}</TableCell>
      </TableRow>
      <TableRow key='volumen total'>
        <TableCell component="th" scope="row">
          Volumen Total
        </TableCell>
        <TableCell align="right">{sellVolume + buyVolume}</TableCell>
      </TableRow>
      <TableRow key='cantidad acciones'>
        <TableCell component="th" scope="row">
          Cantidad de Acciones
        </TableCell>
        <TableCell align="right">{(exchangeStocks && exchangeStocks.length) || 0}</TableCell>
      </TableRow>
      <TableRow key='participacion de mercado'>
        <TableCell component="th" scope="row">
          Participación de Mercado
        </TableCell>
        <TableCell align="right">{(exchangeStocks && marketShare(exchange, exchanges, stocks, buy, sell, sellVolume + buyVolume)) || 0}%</TableCell>
      </TableRow>
    </Table>
  )
}
  
export default Table2;