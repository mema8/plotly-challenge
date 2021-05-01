// pull the metadata column
function DataTable(id){
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        var filterdID = metadata.filter(sample => sample.id == id)[0];
        var demoTable = d3.select("#sample-metadata");
        demoTable.html("");
        // get both the key and the value
        Object.entries(filterdID).forEach((key) => {
            // create an "h5" tag to append the demo info to.
            demoTable.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}
function graphs(id) {
    // pull in data
    d3.json("data/samples.json").then((data) => {
        var filterd = data.samples.filter(sample => sample.id == id)[0];
        var otu_ids = filterd.otu_ids;
        var sample_values = filterd.sample_values;
        var labels = filterd.otu_labels;

// create the trace for the bar plot
        var trace = {
            y: otu_ids.slice(0,10).map(d => "OTU " + d).reverse(),
            x:sample_values.slice(0,10).reverse(),
            text: labels.slice(0,10).reverse(),
            marker: {
                color: 'pink'},
            type:"bar",
            orientation: "h",
        };

        var barData = [trace];
// create the layout with margins
        var layout = {
            title:"Top 10 OTUs Based on ID",
            yaxis: {
                tickmode:"linear"
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
        // plot the bar
    Plotly.newPlot("bar",barData,layout )
        // create trace for bubble graph
        var trace1 = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color:otu_ids
            },
            text: labels
        };
        var bubbleData = [trace1];
        // layout for bubble graph
        var layout1 = {
            xaxis:{title:"OTU ID"}
        };
    // plot bubble graph
    Plotly.newPlot("bubble",bubbleData, layout1);

    });
}


// create the initializing page
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("data/samples.json").then((data)=> {
        // console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        graphs(data.names[0]);
        DataTable(data.names[0]);
    });
}

// create function to generate both the fucntion for plots and function for demo info
function optionChanged(id) {
    graphs(id);
    DataTable(id);
}

init();