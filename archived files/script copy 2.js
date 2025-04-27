

    
    // Scrollama setup
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
		// Already showing the correct image
		return;
	}

	next.src = newSrc;
	next.classList.add("show");
	current.classList.remove("show");
}


//Swap Elements
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



// 2. Handle scroll-based events
function handleStepEnter(response) {
  console.log(response);

  // Highlight active step
  step.classed("is-active", function (d, i) {
    return i === response.index;
  });

  // Hide image wrapper for fullscreen image step
  // if (response.index === 5) {
  //   figure.style("opacity", 1);
  // } else {
  //   figure.style("opacity", 1);
  // }

  // Swap images
  if (response.index === 0) {
    swapImages("images/01-globe.svg");
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
  // } else if (response.index === 9) {
  //   swapImages("images/09-2005-small.svg");
  //   document.querySelector("[data-step='9']").style.position = "sticky";
  //   document.querySelector("[data-step='9']").style.top = "0px";
  // } else if (response.index === 10) {
  //   swapImages("images/10-2005-impact.svg");
  // } else if (response.index === 11) {
  //   swapImages("images/11-2005-deaths.svg");
  // } else if (response.index === 12) {
  //   swapImages("images/12-chart.svg");
  //   document.querySelector("[data-step='9']").style.position = "relative";
  // } else if (response.index === 13) {
  //   swapImages("images/13-chart-labels.svg");
  // }

} else if (response.index === 9) {
  swapImages("images/09-2005-small.svg");

  // Make step 9 sticky
  const step9 = document.querySelector("[data-step='9']");
  step9.style.position = "sticky";
  step9.style.top = "0px";

  // Just in case it was unset earlier
  const step12 = document.querySelector("[data-step='12']");
  step12.style.position = "relative";

} else if (response.index === 10) {
  swapImages("images/10-2005-impact.svg");

} else if (response.index === 11) {
  swapImages("images/11-2005-deaths.svg");

} else if (response.index === 12) {
  swapImages("images/12-chart.svg");

  // Unstick step 9
  const step9 = document.querySelector("[data-step='9']");
  step9.style.position = "relative";

  // Make step 12 sticky
  const step12 = document.querySelector("[data-step='12']");
  step12.style.position = "sticky";
  step12.style.top = "0px";

} else if (response.index === 13) {
  swapImages("images/13-chart-labels.svg");


} else if (response.index === 14) {
  swapElements("#data-chart");

  // Unstick step 12
  const step12 = document.querySelector("[data-step='12']");
  step12.style.position = "relative";
}


  

  // Change body background color after specified step
  if (response.index >= 5) {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
  } else {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
  }
}


// 3. Resize handler
function handleResize() {
	var stepHeight = Math.floor(window.innerHeight * 0.75);
	step.style("height", stepHeight + "px");

	var figureHeight = Math.floor(window.innerHeight * 0.63);
	figure.style("height", figureHeight + "px");

	scroller.resize();
}

// 4. Initialize Scrollama
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
  // Show initial image
  swapImages("images/01-globe.svg");

  // D3 CHART SETUP
  let width = document.getElementById("data-chart").clientWidth;
  let height = document.getElementById("data-chart").clientHeight;
  let margin = { top: 0, right: 30, bottom: 150, left: 90 };

  let svg = d3.select("#data-chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("storm-data-subregion-filter.csv").then(function(data) {
    let filteredData = data
      .filter(d => d["Start Year"] === "2000")
      .sort((a, b) => Number(a["Start Month"]) - Number(b["Start Month"]));

    let x = d3.scaleBand()
      .range([0, width])
      .domain(filteredData.map(d => Number(d["Start Month"])))
      .padding(1);

    svg.append("g")
      .attr("transform", "translate(0," + (height - 200) + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    let y = d3.scaleBand()
      .domain(data.map(d => d["Subregion"]))
      .range([height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y));
  });
});


// Start it all
init();


let width =  document.getElementsByClassName("image-wrapper")[0].clientWidth;
let height = document.getElementsByClassName("image-wrapper")[0].clientHeight;
let margin = {top: 0, right: 30, bottom: 150, left: 90};

// append the svg object to the body of the page
var svg = d3.select("#data-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("storm-data-subregion-filter.csv").then(function(data) {
  let filteredData = data
    .filter(d => d["Start Year"] === "2000")
    .sort((a, b) => Number(a["Start Month"]) - Number(b["Start Month"]));

  // X axis
  var x = d3.scaleBand()
    .range([0, width])
    .domain(filteredData.map(d => Number(d["Start Month"])))
    .padding(1);
  
  svg.append("g")
    .attr("transform", "translate(0," + (height - 200) + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .domain(data.map(d => d["Subregion"]))
    .range([height, 0]);

  svg.append("g")
    .call(d3.axisLeft(y));
});