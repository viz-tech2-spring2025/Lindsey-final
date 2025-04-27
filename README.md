# Stormscape Scrollytelling Project

This project using scrollama.js and d3.js to create a scrollytelling experiencing about hurricanes.

## Functionality

- **Smooth Transition**: Animated morphing between the two chart types
- **Scroll-Triggered Animation**: The transition is controlled by the user's scroll position
- **Interactive Visualization**: Number of recorded hurricanes per month for the top five global activity regions are plotted when a specific year button is clicked

## Getting Started

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd chart-transition
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

  - `images` folder- Linked images for site
  - `chart.html` - Interactive visualization showing historical seasonality of hurricanes
  - `d3.v4.min.js` - Necessary D3.js code
  - `index.html` - Primary html file to run in browser
  - `script.js` - Primary javascript file where steps for the scollytelling are declared
  - `scrollama.js` - Code to get the scrolling feature to work
  - `styles.css` - Styles
  - `tropical_cyclones_filtered.csv` - Filtered data for chart.html to draw visualization

## How It Works

1. **Data Preparation**: The `chart.html` loads and parses the data, `tropical_cyclones_filtered.csv` to be able to draw the visualization.

2. **Scrollama Integration**: `index.html` component uses the Scrollama library to track scroll position and update the step images on the right of the screen.

3. **Swap Function**: The function `swapImages` in the `script.js` uses two images declared in the `index.html` to display a set a default image (A) so the images to be changed on the right-side of the site will be swapped out (B) as they are declared in the `script.js` file.

4. **image-c: iframe visualization**: `chart.html` is added as id="image-c" within the `index.html` so it may be swapped in the `script.js` as step 18.

5. **sticky text**: In the `script.js`, style: position "sticky" is added onto steps where the text should stick when the page is scrolled. Style: position "relative" is used when the text should no longer be sticky.

## Available Components

The includes one standalone chart component that can be used independently:

- **chart.html**: The main component that draws the interactive visulaizations of hurricane seasonality from the data file

## Demo Options

The project includes a simplified version of the default Scrollama example. To use this demo:

1. Open `src/App.jsx`
2. Uncomment the `Demo` component in the return statement
3. Comment out the other chart components

This provides a simpler starting point for understanding how Scrollama works with basic animations.


## Dependencies

- D3.js
- Scrollama.js


## Acknowledgements

- [D3.js](https://d3js.org/) for data visualization
- [React Scrollama](https://github.com/jsonkao/react-scrollama) for scroll-based interactions
