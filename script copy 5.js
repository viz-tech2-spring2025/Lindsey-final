
// Scrollama setup
const container = d3.select("#scroll");
const figure = container.select(".image-wrapper");
const article = container.select("article");
const step = article.selectAll(".step");
const scroller = scrollama();

// Image swap setup
const imageA = document.getElementById("image-a");
const imageB = document.getElementById("image-b");

function swapImages(newSrc) {
  const current = imageA.classList.contains("show") ? imageA : imageB;
  const next = current === imageA ? imageB : imageA;

  if (current.src.includes(newSrc)) return;

  next.src = newSrc;
  next.classList.add("show");
  current.classList.remove("show");
}

function hideChart() {
  document.getElementById("data-chart").classList.remove("show");
}

// ✅ Reusable function to draw the chart for any year
function drawStormChart(data, year, container, width, height, margin) {
  d3.select("#data-chart svg").remove();

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#data-chart")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  const filteredData = data.filter(d => d["Start Year"] === year.toString());
  const allMonths = d3.range(1, 13);
  const allSubregions = Array.from(new Set(data.map(d => d["Subregion"])));

  const x = d3.scaleBand()
    .range([0, innerWidth])
    .domain(allMonths)
    .padding(0.1);

  const y = d3.scaleBand()
    .range([innerHeight, 0])
    .domain(allSubregions)
    .padding(0.1);

  svg.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickFormat(d => d3.timeFormat("%b")(new Date(2000, d - 1))))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  svg.append("g").call(d3.axisLeft(y));

  svg.selectAll("circle")
    .data(filteredData)
    .enter()
    .append("circle")
      .attr("cx", d => x(+d["Start Month"]) + x.bandwidth() / 2)
      .attr("cy", d => y(d["Subregion"]) + y.bandwidth() / 2)
      .attr("r", 6)
      .attr("fill", "orange")
      .attr("opacity", 0.7);
}

// Handle scroll-based step activation
let chartDrawn = false;
function handleStepEnter(response) {
  console.log(response);

  step.classed("is-active", (d, i) => i === response.index);

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
  document.getElementById("data-chart").classList.add("show");

  const step12 = document.querySelector("[data-step='12']");
  step12.style.position = "relative";

    if (!chartDrawn) {
      chartDrawn = true;

      const container = document.getElementById("data-chart");
      const width = container.clientWidth;
      const height = container.clientHeight;
      const margin = { top: 20, right: 30, bottom: 60, left: 90 };

      d3.csv("storm-data-subregion-filter.csv").then(function(data) {
        // Draw initial chart
        drawStormChart(data, 2000, container, width, height, margin);

        // Set up year buttons
        document.querySelectorAll("#year-buttons button").forEach(button => {
          button.addEventListener("click", () => {
            document.querySelectorAll("#year-buttons button").forEach(b => b.classList.remove("active"));
            button.classList.add("active");

            const year = +button.dataset.year;
            drawStormChart(data, year, container, width, height, margin);
          });
        });
      });
    }
  } else {
    hideChart(); // fallback
  }

  // Background color change
  if (response.index >= 5) {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
  } else {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
  }
}

// Handle screen resize
function handleResize() {
  const stepHeight = Math.floor(window.innerHeight * 0.75);
  step.style("height", stepHeight + "px");

  const figureHeight = Math.floor(window.innerHeight * 0.63);
  figure.style("height", figureHeight + "px");

  scroller.resize();
}

// Initialize Scrollama
function init() {
  handleResize();

  scroller
    .setup({
      step: "article .step",
      offset: 0.6,
      debug: false
    })
    .onStepEnter(handleStepEnter);

  window.addEventListener("resize", handleResize);
}

window.addEventListener("DOMContentLoaded", () => {
  swapImages("images/01-globe.svg");
});

init();
