import React from 'react';
import './acciones.css';
import io from 'socket.io-client'
import { Autocomplete } from '@material-ui/lab';
import { Container, Button, TextField, Paper, Grid, TableContainer, Divider } from '@material-ui/core'
import Table1 from './misc/Table1'
import Table2 from './misc/Table2'
import { createChart } from 'lightweight-charts';


class acciones extends React.Component {

  constructor(props) {
    super(props);
    this.chart = React.createRef()
    this.state = {
      on: true,
      update: [],
      compra: [],
      venta: [],
      intercambios: [],
      acciones: [],
      sw_Table1: null,
      sw_Table2: null,
    };
    
    this.handleConnectClick = this.handleConnectClick.bind(this);
    this.handleDisconnectClick = this.handleDisconnectClick.bind(this);
  }
  
  componentWillUnmount() {
  }
  
  componentDidMount() {
    this.connectSockets();
    const chart = createChart(this.chart.current, { width: 430, height: 400 });
    this.lineSeries = chart.addLineSeries();
  }

  componentDidUpdate() {
    let { update, sw_Table1 } = this.state;
    if (sw_Table1 && update) {
      let currentStock = update.filter((stock) => stock.ticker === sw_Table1.ticker);
      this.currentStockData = currentStock;
      this.lineSeries.setData(this.currentStockData);
    }
  }
  
  handleConnectClick() {
    this.connectSockets();
    this.setState({on: true});
  }
  
  handleDisconnectClick() {
    this.setState({on: false});
    this.socket.close()
  }
  
  connectSockets = () => {
    this.socket = io('wss://le-18262636.bitzonte.com', {
      path: '/stocks'
    });
    this.socket.on('UPDATE', data => this.setState((prevState) => ({ update: [...prevState.update, data] })))
    this.socket.on('BUY', data => this.setState((prevState) => ({ compra: [...prevState.compra, data] })))
    this.socket.on('SELL', data => this.setState((prevState) => ({ venta: [...prevState.venta, data] })))
    
    this.socket.emit('STOCKS')
    this.socket.emit('EXCHANGES')
    this.socket.on('EXCHANGES', data => this.setState({ intercambios: data }))
    this.socket.on('STOCKS', data => this.setState({ acciones: data, sw_Table1: data[0] }))
  }

  render() {

    const { on } = this.state;

    return (
      <div className='acciones'>
        <Container maxWidth='lg'>
          <Grid container direction='row' alignContent='flex-start' spacing={1} className='button'>
            <Grid item>
            {!on ?
              <Button variant="contained" color='primary' onClick={this.handleConnectClick}>
                Conectar
              </Button>
              :
              <Button variant="contained" color='secondary' onClick={this.handleDisconnectClick}>
                Desconectar
              </Button>
            }
            </Grid>
          </Grid>
          <Grid container spacing={2} justify='space-between'>
            
            <Grid item xs={8}>
              <h3>Búsqueda por Acción</h3>
              <Grid container spacing={5} alignContent="center">
                <Grid item>
                  <Autocomplete
                    id="stock-selector"
                    options={this.state.acciones}
                    value={this.state.sw_Table1}
                    getOptionLabel={(option) => option.ticker}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Acciones" variant="outlined" />}
                    onChange={(event, newValue) => {
                      this.setState({sw_Table1: newValue});
                    }}
                  />
                </Grid>
                <Grid container direction='row' justify='center' spacing={2}>
                  <Grid item xs={7}>
                    <div ref={this.chart} />
                  </Grid>
                  <Grid item xs={5}>
                    <TableContainer component={Paper} variant='outlined'>
                      <h4>{this.state.sw_Table1 && this.state.sw_Table1.ticker}</h4>
                      <p>{this.state.sw_Table1 && this.state.sw_Table1.company_name} - {this.state.sw_Table1 && this.state.sw_Table1.country}</p>
                      <Divider/>
                      <Table1
                        update={this.currentStockData}
                        compra={this.state.compra}
                        venta={this.state.venta}
                        stock={this.state.sw_Table1}
                      />    
                    </TableContainer>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={4}>
              <h3>Búsqueda por Intercambios</h3>
              <Autocomplete
                id="exchanges-selector"
                options={Object.keys(this.state.intercambios)}
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Intercambios" variant="outlined" />}
                onChange={(event, newValue) => {
                  this.setState({sw_Table2: newValue});
                }}
              />
              <Table2
                update={this.currentStockData}
                compra={this.state.compra}
                venta={this.state.venta}
                intercambio={this.state.sw_Table2}
                intercambios={this.state.intercambios}
                acciones={this.state.acciones}
              />
            </Grid>

          </Grid>

          <Grid container></Grid>
        </Container>
      </div>
    );
  }
}
export default acciones;
