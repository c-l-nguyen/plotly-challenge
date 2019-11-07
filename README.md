# plotly-challenge
A Plotly dashboard within a Flask app deployed to Heroku at https://cnguyen-belly-button-diversity.herokuapp.com/. This dashboard was created to visualize the [Belly Button Diversity Dataset](http://robdunnlab.com/projects/belly-button-biodiversity/). This full stack application was created using a SQLite/Flask/Python backend combined with an HTML frontend and Javascript as a middle layer to connect the two ends. Users can select a sample number from the drop down menu to select the participant in the study and view the dashboard changing with respect to the participant's measurements. 

The following plots are included in the dashboard using the Plotly.js framwork:
* A pie chart to view the proportion of the top 10 samples and their OTU ID and bacteria info on hover
* A bubble chart to see OTU_IDs vs. the sample value with the size of the bubble determined by the sample value
* A gauge chart to show the amount of belly button scrubs per week for the participant sample

## Sources for creating gauge chart
* https://stackoverflow.com/questions/53211506/calculating-adjusting-the-needle-in-gauge-chart-plotly-js
* https://code.tutsplus.com/tutorials/create-interactive-charts-using-plotlyjs-pie-and-gauge-charts--cms-29216
* https://com2m.de/blog/technology/gauge-charts-with-plotly/
