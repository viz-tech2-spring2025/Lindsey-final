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

		return;
	}

	next.src = newSrc;
	next.classList.add("show");
	current.classList.remove("show");
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

  // Unstick step 12
  const step12 = document.querySelector("[data-step='12']");
  step12.style.position = "relative";

}else if (response.index === 15) {
  swapImages("images/text-24.svg");

}else if (response.index === 16) {
  swapImages("images/text-25.svg");

}else if (response.index === 17) {
  swapImages("images/text-26.svg");

} else if (response.index === 18) {

  // Swap to iframe
  document.getElementById("image-a").style.display = "none";  // hide the image
  document.getElementById("image-c").style.display = "block"; // show the iframe
}

// Hide the iframe and show the image again
if (response.index !== 18) {
  document.getElementById("image-a").style.display = "block";  // show the image again
  document.getElementById("image-c").style.display = "none";  // hide the iframe
}

if (response.index === 19) {
  swapImages("images/white.png");

}else if (response.index === 20) {
  swapImages("images/18-list.svg");
 // Make text for step 20 sticky
  const step20 = document.querySelector("[data-step='20']");
  step20.style.position = "sticky";
  step20.style.top = "0px";

}else if (response.index === 21) {
  swapImages("images/19-checked-list.svg");

}else if (response.index === 22) {
  swapImages("images/gauguin.svg");

  // Unstick step 20
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

// 5. Event Listeners
// Add event listener to the image elements
window.addEventListener("DOMContentLoaded", () => {
  swapImages("images/01-globe-labels.png");

});



// Start it all
init();

