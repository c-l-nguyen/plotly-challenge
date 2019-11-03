function buildGauge(wfreq){

  // pie chart converted to gauge chart
  let traceGauge = {
    type: 'pie',
    showlegend: false,
    hole: 0.4,
    rotation: 90,
    values: [180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180],
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

  // the dot where the needle "originates"
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

  // the needle (triangular version)
  let degrees = 180-(20 * wfreq);
  let radius = .5;
  let radians = degrees * Math.PI / 180;
  let aX = 0.025 * Math.cos((radians) * Math.PI / 180);
  let aY = 0.025 * Math.sin((radians) * Math.PI / 180);
  let bX = -0.025 * Math.cos((radians) * Math.PI / 180);
  let bY = -0.025 * Math.sin((radians) * Math.PI / 180);
  let cX = radius * Math.cos(radians);
  let cY = radius * Math.sin(radians);

  let path = 'M ' + aX + ' ' + aY +
            ' L ' + bX + ' ' + bY +
            ' L ' + cX + ' ' + cY +
            ' Z';

  let gaugeLayout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '#850000',
        line: {
          color: '#850000'
        }
      }],
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot("gauge", [traceGauge, dot], gaugeLayout);
}

async function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  const url = "/metadata/" + sample;
  let data = await d3.json(url);

  // Use d3 to select the panel with id of `#sample-metadata`
  let panel = d3.select('#sample-metadata');

  // Use `.html("") to clear any existing metadata
  panel.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  let data_pairs = Object.entries(data);
  data_pairs.forEach(pair => panel.append("text").text(pair[0] + ": " + pair[1] + "\n").append("br"));

  // BONUS: Build the Gauge Chart
  buildGauge(data.WFREQ);
  
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
