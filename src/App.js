import { Button, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import AQITable from './components/AQITable';
import Chart from './components/Chart';
import { connectSocket, closeSocketConnection } from './config/socket';
import './App.css';

const useStyles = makeStyles({
  tableAndChartWrapper: {
    display: 'flex',
  },
  chartContainer: {
    width: '50%',
    marginLeft: '2rem',
    display: 'flex',
    alignItems: 'center'
  },
  toggleButton: {
    display: 'flex',
    justifyContent: 'center',
    margin: '2rem'
  },
  TableContainer: {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: 'max-content',
    width: '50%',
  }
});

function App() {
  const [aqiData, setAqiData] = useState({});
  const [isSocketClosed, setIsSocketClosed] = useState(false);

  const classes = useStyles();

  const makeConnection = () => {
    connectSocket((updatedAqiData) => {
      setAqiData((aqiData) => {
        for (const cityData of updatedAqiData) {
          if (!aqiData[cityData.city]) aqiData[cityData.city] = {};
          aqiData[cityData.city].aqi = cityData.aqi;
          aqiData[cityData.city].date = new Date();
          if(!aqiData[cityData.city].previousData) aqiData[cityData.city].previousData = [];
          aqiData[cityData.city].previousData.push(cityData.aqi);
        }
        return {...aqiData} ;
      });
    })
  }

  useEffect(() => {
    makeConnection();
    return () => {
      closeSocketConnection();
    };
  }, []);

  function handleClick() {
    if(!isSocketClosed) closeSocketConnection();
    else makeConnection();
    setIsSocketClosed(!isSocketClosed);
  }

  return (
    <div className="App">
      <h1>Realtime AQI Index Dashboard</h1>
      <div className={classes.tableAndChartWrapper}>
        <div className = {classes.TableContainer}>
          <AQITable aqiData = {aqiData} isSocketClosed={isSocketClosed}/>
        </div>
        <div className = {classes.chartContainer}>
          <Chart aqiData={aqiData}/>
        </div>
      </div>
      <div className={classes.toggleButton}>
        <Button color="primary" variant="contained" onClick= {() => handleClick()}>Toggle socket connection</Button>
      </div>
    </div>
  );
}

export default App;
