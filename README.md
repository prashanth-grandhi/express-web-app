Google Maps App
===============

This is a simple web app comprising of a single webpage which utilizes the Google Maps API to display a map of Helsinki city center. The user is able to plot paths on top of this map by clicking at different points on the map.

## Setup
It uses Express node.js framework, which can serve static files like HTML, CSS, client-side javascript. The Express app listens for requests on localhost at port 8081.

## Running the app
Assumption: Node.js and npm is installed*

Go to folder containing app.js and Run the following in terminal window:
1. npm install
2. npm install body-parser
3. node app.js
4. Then open a browser and head to http://localhost:8081/

At this point the map is initialized at zoom level 14 with fixed coordinates. You should also see a form below the map.

## Code structure
1. index.html
2. style.css
3. script.js (client-side)
4. app.js  (server-side)
5. package.json

## Features
1. The web app allows users to save the paths they have plotted
2. Max limit of the number of paths that can be saved in a single session to 10 paths, each containing a maximum of 10 coordinate points
3. Once the paths are saved, the user should be able to visualize the paths in form of a heatmap layover atop the map displayed on the page
4. Save all path coordinates as json and send it to server. A file paths.json is created in the public folder of the app

## Tests
The application is tested in Chrome and Firefox browsers

Example of paths.json format:
{
	"paths": [{
		"coordinates": [{
			"lat": 60.164102003164,
			"lng": 24.926433563232422
		}, {
			"lat": 60.16508414078868,
			"lng": 24.935274124145508
		}]
	}, {
		"coordinates": [{
			"lat": 60.164102003164,
			"lng": 24.926433563232422
		}, {
			"lat": 60.16508414078868,
			"lng": 24.935274124145508
		}, {
			"lat": 60.16764610077336,
			"lng": 24.926776885986328
		}]
	}]
}


