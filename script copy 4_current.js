

    
// Scrollama setup
let chartDrawn = false;


var container = d3.select("#scroll");
var figure = container.select(".image-wrapper"); // Updated to match new image container
var article = container.select("article");
var step = article.selectAll(".step");

var scroller = scrollama();


// 1. Swap Images with Crossfade
const imageA = document.getElementById("image-a");
const imageB = document.getElementById("image-b");

function swapImages(newSrc) {
	const current = imageA.classList.contains("show") ? imageA : imageB;
	const next = current === imageA ? imageB : imageA;

	if (current.src.includes(newSrc)) {

		return;
	}

	next.src = newSrc;
	next.classList.add("show");
	current.classList.remove("show");
}

// Hides the interactive chart when not in use
function hideChart() {
  const chart = document.getElementById("data-chart");
  if (chart) chart.classList.remove("show");
}


// This function swaps the images in the image-wrapper
function swapElements(elementID, newSrc="") {
  let current;
  let next;
if (imageA?.classList.contains("show")) {
  current = imageA;
  next = document.getElementById(elementID);
}
else if (imageB?.classList.contains("show")) {
  current = imageB;
  next = document.getElementById(elementID);
}
else {
  current = document.getElementById(elementID);
  next = imageA;
}
if (newSrc) {
  next.src = newSrc;
}
  next?.classList.add("show");
  current?.classList.remove("show");
}


/// 1. Draw the interactive chart
function drawCycloneChart() {
  const margin = { top: 20, right: 30, bottom: 70, left: 210 };
  const width = 1000 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

// Select the existing SVG element and clear any previous drawings
const chartSvg = d3.select("#chart");
chartSvg.selectAll("*").remove(); // Clear the SVG in case it's redrawn

// Append a group element for chart content
const svg = chartSvg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);


  const tooltip = d3.select("#tooltip");

  const subregionFilter = new Set([
    "Latin America and the Caribbean",
    "Southeastern Asia",
    "Eastern Asia",
    "Southern Asia",
    "Sub-Saharan Africa",
    "Northern America",
    "Melanesia"
  ]);

  // Define the month names for the x-axis labels
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /// Load the data
  d3.csv("tropical_cyclones_filtered.csv", d3.autoType).then(data => {
    data = data.filter(d => subregionFilter.has(d["Subregion"]));
    const yearsToShow = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
    const dataByYear = d3.group(data, d => d["Start Year"]);
    const validYears = yearsToShow.filter(y => dataByYear.has(y));
    const allSubregions = Array.from(subregionFilter);

    // Set up scales
    const x = d3.scaleLinear().domain([1, 12]).range([0, width]);
    const y = d3.scaleBand().domain(allSubregions).range([0, height]).padding(0.3);

    const rScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d["Total Affected"] || 1000)])
      .range([15, 125]);

   
    ///Format the chart
    // Tick lines
    svg.selectAll(".tick-line")
      .data(d3.range(1, 13))
      .join("line")
      .attr("class", "tick-line")
      .attr("x1", d => x(d))
      .attr("x2", d => x(d))
      .attr("y1", 0)
      .attr("y2", height);

    // X-axis labels
    svg.selectAll(".month-label")
      .data(d3.range(1, 13))
      .join("text")
      .attr("class", "month-label")
      .attr("x", d => x(d))
      .attr("y", height + 15)
      .attr("text-anchor", "middle")
      .text(d => monthNames[d - 1]);

    // Y-axis labels
    svg.selectAll(".y-label")
      .data(allSubregions)
      .join("text")
      .attr("class", "y-label")
      .attr("x", -40)
      .attr("y", d => y(d) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .text(d => d);

    
    /// Legend
    const rScaleLegend = d3.scaleSqrt().domain([1000, 1000000]).range([10, 60]);
    const legendSvg = d3.select("#legend");
    const legendVals = [10000, 100000, 500000, 1000000];
    const xCircle = 80, xLabel = 160, yCircle = 200;

    //Legend title
    legendSvg.append("text")
      .attr("x", 10)
      .attr("y", 40)
      .style("fill", "white")
      .style("font-size", "18px")
      .text("Total Affected");

    // Legend circles
    legendSvg.selectAll("legend-circle")
      .data(legendVals)
      .enter().append("circle")
      .attr("cx", xCircle)
      .attr("cy", d => yCircle - rScaleLegend(d))
      .attr("r", d => rScaleLegend(d))
      .style("fill", "none")
      .attr("stroke", "red");

    // Legend lines
    legendSvg.selectAll("legend-line")
      .data(legendVals)
      .enter().append("line")
      .attr("x1", d => xCircle + rScaleLegend(d))
      .attr("x2", xLabel)
      .attr("y1", d => yCircle - rScaleLegend(d))
      .attr("y2", d => yCircle - rScaleLegend(d))
      .attr("stroke", "white")
      .style("stroke-dasharray", ("2,2")); // Dashed line

    // Legend labels
    legendSvg.selectAll("legend-text")
      .data(legendVals)
      .enter().append("text")
      .attr("x", xLabel + 5)
      .attr("y", d => yCircle - rScaleLegend(d))
      .text(d => `${d / 1000}k`)
      .style("fill", "white")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");

    
    /// Buttons
    const buttonGroup = d3.select("#buttons");
    validYears.forEach((year, i) => {
      const btn = buttonGroup.append("button")
        .attr("class", "year-button")
        .text(year)
        .on("click", () => {
          d3.selectAll(".year-button").classed("selected", false);
          btn.classed("selected", true);
          update(year);
        });
    });

    // Initial button state
    function update(year) {
      const yearData = dataByYear.get(year) || [];

      // Update the chart with the selected year's data
      svg.selectAll(".circle-solid")
        .data(yearData, (d, i) => d["Subregion"] + d["Start Month"] + i)
        .join(
          enter => enter.append("circle")
            .attr("class", "circle-solid")
            .attr("cx", d => x(d["Start Month"]))
            .attr("cy", d => y(d["Subregion"]) + y.bandwidth() / 2) // Center the circle vertically
            .attr("r", 10)
            .on("mouseover", (event, d) => { // Show tooltip on hover
              tooltip.transition().duration(200).style("opacity", 1);
              tooltip.html(`
                <strong>Subregion:</strong> ${d["Subregion"]}<br/>
                <strong>Month:</strong> ${monthNames[d["Start Month"] - 1]}<br/>
                <strong>Total Affected:</strong> ${d["Total Affected"] || "N/A"}
              `)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 28}px`);
            })
            // Hide tooltip on mouseout
            .on("mouseout", () => tooltip.transition().duration(300).style("opacity", 0)),
          update => update.transition().duration(500)
            .attr("cx", d => x(d["Start Month"]))
            .attr("cy", d => y(d["Subregion"]) + y.bandwidth() / 2),
          exit => exit.remove()
        );

      // Update the outline circles
      svg.selectAll(".circle-outline")
        .data(yearData.filter(d => d["Total Affected"] != null), d => d["Subregion"] + d["Start Month"])
        .join(
          enter => enter.append("circle") // Add outline circles
            .attr("class", "circle-outline")
            .attr("cx", d => x(d["Start Month"]))
            .attr("cy", d => y(d["Subregion"]) + y.bandwidth() / 2)
            .attr("r", d => rScale(d["Total Affected"]))
            .on("mouseover", (event, d) => {
              tooltip.transition().duration(200).style("opacity", 1); // Show tooltip on hover
              tooltip.html(`
                <strong>Subregion:</strong> ${d["Subregion"]}<br/>
                <strong>Month:</strong> ${monthNames[d["Start Month"] - 1]}<br/>
                <strong>Total Affected:</strong> ${d["Total Affected"]}
              `)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", () => tooltip.transition().duration(300).style("opacity", 0)),
          update => update.transition().duration(500)
          // Update existing outline circles
            .attr("cx", d => x(d["Start Month"]))
            .attr("cy", d => y(d["Subregion"]) + y.bandwidth() / 2)
            .attr("r", d => rScale(d["Total Affected"])),
          exit => exit.remove()
        );
    }

    // Initial update with the first year
    d3.selectAll(".year-button").filter((d, i) => i === 0).classed("selected", true); // Highlight the first button
    update(validYears[0]); // Call update with the first year
  });
}


/// 2. Handle scroll-based events
function handleStepEnter(response) {
  console.log(response);

  // Highlight active step
  step.classed("is-active", function (d, i) {
    return i === response.index;
  });


  /// Swap images!!
  if (response.index === 0) {
    swapImages("images/01-globe-labels.png");

  } else if (response.index === 1) {
    swapImages("images/02-hurricane-scale.svg");

  } else if (response.index === 2) {
    swapImages("images/03-reacecar.svg");

  } else if (response.index === 3) {
    swapImages("images/04-jet.svg");

  } else if (response.index === 4) {
    swapImages("images/05-surge.svg");

  } else if (response.index === 5) {
    swapImages("images/06-1970-deaths.svg");

  } else if (response.index === 6) {
    swapImages("images/06-1970-deaths.svg");

  } else if (response.index === 7) {
    swapImages("images/07-1970-impact.svg");

  } else if (response.index === 8) {
    swapImages("images/08-1970-highlight.svg");

} else if (response.index === 9) {
  swapImages("images/09-2005-small.svg");

  // Make text for step 9 sticky
  const step9 = document.querySelector("[data-step='9']");
  step9.style.position = "sticky";
  step9.style.top = "0px";

  // Make text for step 9 unsticky
  // const step12 = document.querySelector("[data-step='12']");
  // step12.style.position = "relative";

} else if (response.index === 10) {
  swapImages("images/10-2005-impact.svg");

} else if (response.index === 11) {
  swapImages("images/11-2005-deaths.svg");

} else if (response.index === 12) {
  swapImages("images/12-financials.svg");

  // Unstick step 9
  const step9 = document.querySelector("[data-step='9']");
  step9.style.position = "relative";

  // Make step 12 sticky
  const step12 = document.querySelector("[data-step='12']");
  step12.style.position = "sticky";
  step12.style.top = "0px";

} else if (response.index === 13) {
  swapImages("images/13-financials-labels.svg");

} else if (response.index === 14) {
  swapImages("images/text-23.svg");

  const step12 = document.querySelector("[data-step='12']");
  step12.style.position = "relative";

}else if (response.index === 15) {
  swapImages("images/text-24.svg");

}else if (response.index === 16) {
  swapImages("images/text-25.svg");

}else if (response.index === 17) {
  swapImages("images/text-26.svg");

} else if (response.index === 18) {
  // Hide image crossfade elements
  imageA.classList.remove("show");
  imageB.classList.remove("show");

  // Show the chart and buttons
  document.getElementById("cyclone-chart-wrapper").style.display = "flex";
  document.getElementById("cyclone-buttons").style.display = "block";

  if (!chartDrawn) {
    chartDrawn = true;
    drawCycloneChart(); // your full D3 chart code
  }

} else {
  // Hide the chart and buttons for all other steps
  document.getElementById("cyclone-chart-wrapper").style.display = "none";
  document.getElementById("cyclone-buttons").style.display = "none";
}
if (response.index === 19) {
  swapImages("images/white.png");

}else if (response.index === 20) {
  swapImages("images/18-list.svg");
  const step20 = document.querySelector("[data-step='20']");
  step20.style.position = "sticky";
  step20.style.top = "0px";

}else if (response.index === 21) {
  swapImages("images/19-checked-list.svg");

}else if (response.index === 22) {
  swapImages("images/gauguin.svg");

  const step20 = document.querySelector("[data-step='20']");
  step20.style.position = "relative";
}

  

  // Change body background color after specified step
  if (response.index >= 5 && response.index <= 13 ||
    response.index === 18 ||
    response.index === 22) {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
  } else {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
  }
}


/// 3. Resize handler
function handleResize() {
	var stepHeight = Math.floor(window.innerHeight * 0.75);
	step.style("height", stepHeight + "px");

	var figureHeight = Math.floor(window.innerHeight * 0.63);
	figure.style("height", figureHeight + "px");

	scroller.resize();
}

/// 4. Initialize Scrollama
function init() {
	handleResize();

	scroller
		.setup({
			step: "article .step",
			offset: 0.6, // triggers earlier for better UX
			debug: false
		})
		.onStepEnter(handleStepEnter);

	window.addEventListener("resize", handleResize);
}

window.addEventListener("DOMContentLoaded", () => {
  swapImages("images/01-globe-labels.png");

});



// Start it all
init();

