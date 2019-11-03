async function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  const url = "/metadata/" + sample;
  let data = await d3.json(url);

  // Use d3 to select the panel with id of `#sample-metadata`
  let panel = d3.select('#sample-metadata');

  // Use `.html("") to clear any existing metadata
  panel.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  let data_pairs = Object.entries(data);
  // panel.append("text").text("a")
  // data_pairs.forEach(pair => console.log(pair[0] + ": " + pair[1]))
  // data_pairs.forEach(pair => panel.append(`$pair[0]: $pair[1]`));
  data_pairs.forEach(pair => panel.append("text").text(pair[0] + ": " + pair[1] + "\n").append("br"));

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
  let wfreq = data.WFREQ;

  let gauge_data = {
    domain: { x: [0, 1], y: [0, 1] },
    gauge: { axis: { range: [null, 9] } },
		value: wfreq,
    title: { text: "Scrubs Per Week" },
		type: "indicator",
		mode: "gauge+number"
  }

  let traceGauge = {
    type: 'pie',
    showlegend: false,
    hole: 0.4,
    rotation: 90,
    values: [ 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180],
    text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
    direction: 'clockwise',
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      colors: ['#F8F3EC','#F4F1E5','#E9E6CA','#E2E4B1','#D5E49D','#B7CC92','#8CBF88','#8ABB8F','#85B48A','white'],
      labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9',''],
      hoverinfo: "label"
    }
  }

  // needle
  let degrees = 20, radius = .5
  let radians = degrees * Math.PI / 180 * wfreq
  let x = -1 * radius * Math.cos(radians) 
  let y = radius * Math.sin(radians)

  let gaugeLayout = {
    shapes: [{
      type: 'line',
      x0: 0,
      y0: 0,
      x1: x,
      y1: y,
      line: {
        color: '#850000',
        width: 3
      }
    }],
    title: 'Scrubs Per Week',
    xaxis: {visible: false, range: [-1, 1]},
    yaxis: {visible: false, range: [-1, 1]}
  }

  let dot = {
    type: 'scatter',
    x:[0],
    y:[0],
    marker: {
      size: 14,
      color:'#850000'
    },
    showlegend: false
}

  // Plotly.newPlot("gauge", [gauge_data]);
  Plotly.newPlot("gauge", [traceGauge, dot], gaugeLayout);
}

async function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  const url = "/samples/" + sample;
  let data = await d3.json(url);

  // Build a Pie Chart using top 10 values for sample_values, 
  // otu_ids, and labels (10 each).
  let sample_values = data.sample_values;
  let otu_ids = data.otu_ids;
  let otu_labels = data.otu_labels;

  let pie_data = {
    values: sample_values.slice(0,10),
    labels: otu_ids.slice(0,10),
    type: 'pie',
    hovertext: otu_labels.slice(0,10)
  }

  Plotly.newPlot("pie", [pie_data]);
  
  // Build a Bubble Chart using the sample data
  let bubble_data = {
    x: otu_ids,
    y: sample_values,
    mode: 'markers',
    marker: {
              color: otu_ids, 
              size: sample_values
            },
    text: otu_labels
  }

  Plotly.newPlot("bubble", [bubble_data]);

}

function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
