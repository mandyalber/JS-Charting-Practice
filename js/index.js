fetch('https://data.cdc.gov/resource/w9j2-ggv5.csv')
    .then(response => {
        return response.text();
    })
    .then(responseText => {
        let series = csvToSeries(responseText);
        renderChart(series);
    })
    .catch(error => console.log(error))

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

function renderChart(series) {
    JSC.Chart('chartDiv', {
        title_label_text: 'Life Expectancy in the United States',
        annotations: [{
            label_text: 'Source: National Center for Health Statistics',
            position: 'bottom left'
        }],
        legend_visible: false,
        defaultSeries_lastPoint_label_text: '<b>%seriesName</b>',
        xAxis_crosshair_enabled: true,
        defaultPoint_tooltip: '%seriesName <b>%yValue</b> years',
        series: series
    });
}