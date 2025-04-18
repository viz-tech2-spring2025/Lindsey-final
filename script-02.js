
// Scrollama setup
var container = d3.select("#scroll");
var figure = container.select(".image-wrapper"); // Updated to match new image container
var article = container.select("article");
var step = article.selectAll(".step");

var scroller = scrollama();

// 1. Swap Images with Crossfade
const imageC = document.getElementById("image-c");
const imageD = document.getElementById("image-d");

function swapImages(newSrc) {
	const current = imageC.classList.contains("show") ? imageC : imageD;
	const next = current === imageC ? imageD : imageC;

	if (current.src.includes(newSrc)) {
		// Already showing the correct image
		return;
	}

	next.src = newSrc;
	next.classList.add("show");
	current.classList.remove("show");
}

// 2. Handle scroll-based events for first section
function handleStepEnter(response) {
	console.log("Scroll Section 1, Step Index:", response.index);

	// Highlight active step
	step.classed("is-active", function (d, i) {
		return i === response.index;
	});

	// Switch images based on the scroll step
	if (response.index === 0) {
		swapImages("images/05-surge.svg");
	} else if (response.index === 1) {
		swapImages("images/02-hurricane-scale.svg");
	} else if (response.index === 2) {
		swapImages("images/03-reacecar.svg");
	} else if (response.index === 3) {
		swapImages("images/04-jet.svg");
	} else if (response.index === 4) {
		swapImages("images/05-surge.svg");
	}
}

// 3. Handle scroll-based events for second section
function handleStepEnterSection2(response) {
	console.log("Scroll Section 2, Step Index:", response.index);

	// Example: You could trigger image fades, background transitions, etc., here
}

// 4. Resize handler
function handleResize() {
	var stepHeight = Math.floor(window.innerHeight * 0.75);
	step.style("height", stepHeight + "px");

	var figureHeight = Math.floor(window.innerHeight * 0.5);
	figure.style("height", figureHeight + "px");

	scroller.resize();
}

// 5. Initialize Scrollama
function init() {
	handleResize();

	// Setup first scroll section
	scroller
		.setup({
			step: "#scroll-02 article .step",
			offset: 0.6,
			debug: false
		})
		.onStepEnter(handleStepEnter);

	// // Setup second scroll section
	// scrollama()
	// 	.setup({
	// 		step: "#scroll-2 article .step",
	// 		offset: 0.6,
	// 		debug: false
	// 	})
	// 	.onStepEnter(handleStepEnterSection2);

	window.addEventListener("resize", handleResize);
}

// 6. Show first image on load
window.addEventListener("DOMContentLoaded", () => {
	swapImages("images/05-surge.svg");
});

// 7. Start it all
init();
