fetch('https://data.cdc.gov/resource/w9j2-ggv5.csv')
    .then(response => {
        return response.text();
    })
    .then(responseText => {
        let series = csvToSeries(responseText);
        let series2 = csvToSeries2(responseText);
        renderChart('chartDiv', series);
        renderChart('secondChartDiv', series2);
    })
    .catch(error => console.log(error))

//first chart
function csvToSeries(text) {
    const lifeExp = 'average_life_expectancy';
    let male = [];
    let female = [];
    let dataAsJson = JSC.csv2Json(text);

    dataAsJson.forEach(row => {
        if (row.race === 'All Races') {
            if (row.sex === 'Male') {
                male.push({ x: row.year, y: row[lifeExp] });
            }
            else if (row.sex === 'Female') {
                female.push({ x: row.year, y: row[lifeExp] });
            }
        }
    });
    return [
        { name: 'Male', points: male },
        { name: 'Female', points: female }
    ];
}

//second chart
function csvToSeries2(text) {
    const lifeExp = 'average_life_expectancy';
    let white = [];
    let black = [];
    let dataAsJson = JSC.csv2Json(text);

    dataAsJson.forEach(row => {
        if (row.sex === 'Both Sexes') {
            if (row.race === 'White') {
                white.push({ x: row.year, y: row[lifeExp] });
            }
            else if (row.race === 'Black') {
                black.push({ x: row.year, y: row[lifeExp] });
            }
        }
    });
    return [
        { name: 'White', points: white },
        { name: 'Black', points: black }
    ];
}

function renderChart(chartDiv, series) {
    JSC.Chart(chartDiv, {
        title_label_text: 'Life Expectancy in the United States',
        annotations: [{
            label_text: 'Source: National Center for Health Statistics',
            position: 'bottom left'
        }],
        legend_visible: false,
        defaultSeries_firstPoint_label_text: '<b>%seriesName</b>',
        xAxis_crosshair_enabled: true,
        defaultPoint_tooltip: '%seriesName <b>%yValue</b> years',
        series: series
    });
}
