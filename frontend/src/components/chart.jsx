import React from 'react';
import {Bar, Line} from 'react-chartjs-2';

import 'chart.js/auto';

import STATIONS from "../data/stations.mock";

function getAveragePrices() {
    let Gazoile = 0;
    let SP95 = 0;
    let SP98 = 0;
    let l = 0;
    let j = 0;
    let k = 0;

    for (let i = 0; i < STATIONS.length; i++) {
        STATIONS[i].prix.map(p => {
            if (p._nom.includes("Gazole")) {
                Gazoile += parseFloat(p._valeur);
                l += 1;
            } else if (p._nom.includes("SP95")) {
                SP95 += parseFloat(p._valeur);
                k += 1;
            } else if (p._nom.includes("SP98")) {
                SP98 += parseFloat(p._valeur);
                j += 1;
            }
        })
    }
    Gazoile = Gazoile / l;
    SP98 = SP98 / j;
    SP95 = SP95 / k;
    return [Gazoile, SP98, SP95]
}

const state = {
    labels: ['Gazoile', 'SP98', 'SP95'],
    datasets: [
        {
            label: 'Average Gas prices Euro(€)',
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: getAveragePrices()
        }
    ]
}

function getGazolePrices() {
    let Gazoile = [];
    let dates = [];

    for (let i = 0; i < STATIONS.length; i++) {
        STATIONS[i].prix.map(p => {
            if (p._nom.includes("Gazole")) {
                Gazoile.push(parseFloat(p._valeur));
                dates.push(p._maj)

            }
        })
    }
    return [Gazoile, dates]
}

function getSP95Prices() {
    let Gas = [];
    let dates = [];

    for (let i = 0; i < STATIONS.length; i++) {
        STATIONS[i].prix.map(p => {
            if (p._nom.includes("SP95")) {
                Gas.push(parseFloat(p._valeur));
                dates.push(p._maj)

            }
        })
    }
    return [Gas, dates]
}

const data = {
    labels: getGazolePrices()[1],
    datasets: [
        {
            label: "Gaazole",
            data: getGazolePrices()[0],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
        },
        {
            label: "SP95",
            data: getSP95Prices()[0],
            fill: false,
            borderColor: "#742774"
        }
    ]
};


export default class BarChart extends React.Component {

    render() {
        getGazolePrices();
        return (
            <div style={{height: "100%", width: '100%', overflow: 'scroll', textAlign: 'center'}}>
                <Bar
                    data={state}
                    options={{
                        title: {
                            display: true,
                            text: 'Average Employee Salary per Month',
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }}
                />

                <Line data={data}/>
            </div>
        );
    }
}
