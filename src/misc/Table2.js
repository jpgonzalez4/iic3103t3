import React from 'react';
import { Table, TableCell, TableRow } from '@material-ui/core'


function tradeVolume(tickers, trade)
{
  let totalBuy = 0;
  for(let i = 0; i < tickers.length; i++){
    totalBuy += trade.filter((stock) => stock.ticker === tickers[i]).reduce((a, b) => a + b.volume, 0)  
  }
  return totalBuy;
}

function getTickers(exchange, exchanges, stocks)
{
  const companies = exchanges[exchange].listed_companies
  const tickers = stocks.map((stock) => {
    if (companies.includes(stock.company_name)) return stock.ticker;
    return null;
  })
  return tickers.filter(ticker => ticker);
}

function marketShare(exchange, exchanges, stocks, buy, sell, volume)
{
  let total = 0;
  let tickers = [];
  let exchanges_list = Object.keys(exchanges);

  exchanges_list.forEach((current_exchange) => 
  {
    if (current_exchange !== exchange) {
      tickers = getTickers(current_exchange, exchanges, stocks);
      total += tradeVolume(tickers, buy) + tradeVolume(tickers, sell);
      }
  })
  console.log('volume', volume)
  console.log('total', total)
  let market_share = volume/(volume + total) * 100;
  return market_share.toFixed(4);
}

function Table2(props)
{
  const { exchange, exchanges, stocks, buy, sell } = props;
  let exchangeStocks;
  if (exchange && exchanges && stocks)
  {
    exchangeStocks = getTickers(exchange, exchanges, stocks);
  }

  const buyVolume = (exchangeStocks && tradeVolume(exchangeStocks, buy)) || 0;
  const sellVolume = (exchangeStocks && tradeVolume(exchangeStocks, sell)) || 0;

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
  