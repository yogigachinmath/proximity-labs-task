import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const formatDate = (date) => {
  const diffInSec = (new Date().getTime() - date.getTime()) / 1000;
  if (diffInSec < 60) return diffInSec;
  else if (diffInSec >= 60 && diffInSec < 120) return 'A minute ago';
  else if (diffInSec < 60 * 60) return `${parseInt(diffInSec / 60)} minutes ago`;
  else return;
};

const getAqiColor = (aqi) => {
  let aqiColor = 'black';
  if (aqi <= 50) aqiColor = '#55a84f';
  else if (aqi <= 100) aqiColor = '#a3c853';
  else if (aqi <= 200) aqiColor = '#e8851b';
  else if (aqi <= 300) aqiColor = '#f29c33';
  else if (aqi <= 400) aqiColor = '#e93f33';
  else if (aqi <= 500) aqiColor = '#af2d24';
  return {
    backgroundColor: aqiColor,
    fontWeight: 'bold',
  };
};

let timer;

function AQITable({ aqiData, isSocketClosed }) {
  const classes = useStyles();
  const [count, setCount] = useState(0);

  useEffect(() => {
      if(isSocketClosed) {
        timer = setInterval(() => {
           setCount((count) => count+1);
        }, 1000 * 60);
      } else {
        clearInterval(timer);
      }
      return () => {
        clearInterval(timer);
      }
  }, [isSocketClosed])

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>City</TableCell>
            <TableCell>Current AQI</TableCell>
            <TableCell>Last updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(aqiData).map((city) => (
            <TableRow key={city}>
              <TableCell component="th" scope="row">
                {city}
              </TableCell>
              <TableCell style={getAqiColor(aqiData[city].aqi)}>
                {aqiData[city].aqi.toFixed(2)}
              </TableCell>
              <TableCell>{formatDate(aqiData[city].date)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AQITable;
