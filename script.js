
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

// 2. Handle scroll-based events
function handleStepEnter(response) {
  console.log(response);

  // Highlight active step
  step.classed("is-active", function (d, i) {
    return i === response.index;
  });

  // OPTIONAL: update a step index display if you have a <p> inside figure
  // figure.select("p").text(response.index + 1);

  // // Switch images based on the scroll step
  // if (response.index === 0) {
  // 	swapImages("images/02-hurricane-scale.svg");
  // } else if (response.index === 1) {
  // 	swapImages("images/03-reacecar.svg");
  // } else if (response.index === 2) {
  // 	swapImages("storm-surge.svg");
  // } else if (response.index === 3) {
  // 	swapImages("hurricane-scale.svg");
  // }


  if (response.index === 5) {
	figure.style("opacity", 0);
  } else {
	figure.style("opacity", 1);
  }
  

  // Switch images based on the scroll step
  //console.log("Current step index:", response.index);
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
	} else if (response.index === 6) {
    swapImages("images/06-1970-deaths.svg");


  }
}

// 3. Resize handler
function handleResize() {
	var stepHeight = Math.floor(window.innerHeight * 0.75);
	step.style("height", stepHeight + "px");

	var figureHeight = Math.floor(window.innerHeight * 0.5);
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

// 5. Show first image immediately on load
window.addEventListener("DOMContentLoaded", () => {
	swapImages("images/01-globe.svg");

});

// Start it all
init();
