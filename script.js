// Define the landmark details
const landmark = {
    name: "Eiffel Tower",
    country: "France",
    coordinates: { lat: 48.8584, lng: 2.2945 } // Eiffel Tower coordinates
};

// Sample country data with coordinates
const countries = {
    "france": { lat: 46.2276, lng: 2.2137 },
    "germany": { lat: 51.1657, lng: 10.4515 },
    "spain": { lat: 40.4637, lng: -3.7492 },
    "italy": { lat: 41.8719, lng: 12.5674 },
    "portugal": { lat: 39.3999, lng: -8.2245 },
    "belgium": { lat: 50.5039, lng: 4.4699 },
    "netherlands": { lat: 52.1326, lng: 5.2913 },
    "switzerland": { lat: 46.8182, lng: 8.2275 },
    "luxembourg": { lat: 49.8153, lng: 6.1296 },
    "austria": { lat: 47.5162, lng: 14.5501 },
    "norway": { lat: 60.4720, lng: 8.4689 },
    "sweden": { lat: 60.1282, lng: 18.6435 },
    "denmark": { lat: 56.2639, lng: 9.5018 },
    "finland": { lat: 61.9241, lng: 25.7482 },
    "ireland": { lat: 53.1424, lng: -7.6921 },
    "poland": { lat: 51.9194, lng: 19.1451 },
    "united kingdom": { lat: 55.3781, lng: -3.4360 },
    "uk": { lat: 55.3781, lng: -3.4360 },
    "canada": { lat: 56.1304, lng: -106.3468 },
    "usa": { lat: 37.0902, lng: -95.7129 },
    "us": { lat: 37.0902, lng: -95.7129 },
    "mexico": { lat: 23.6345, lng: -102.5528 },
    "japan": { lat: 36.2048, lng: 138.2529 },
    "china": { lat: 35.8617, lng: 104.1954 },
    "brazil": { lat: -14.2350, lng: -51.9253 },
    "argentina": { lat: -38.4161, lng: -63.6167 },
    "russia": { lat: 61.5240, lng: 105.3188 },
    "india": { lat: 20.5937, lng: 78.9629 },
    "australia": { lat: -25.2744, lng: 133.7751 },
    "new zealand": { lat: -40.9006, lng: 174.8860 },
    // Add more countries as needed
};

const correctCountry = landmark.country.toLowerCase();

const canvas = document.getElementById('picturaCanvas');
const ctx = canvas.getContext('2d');
const submitGuessButton = document.getElementById('submitGuess');
const guessInput = document.getElementById('guessInput');
const feedback = document.getElementById('feedback');

// Grid configuration
const gridRows = 3;
const gridCols = 3;
const gridSize = canvas.width / gridCols; // 100 pixels for 3x3 grid

// Track revealed sections
let revealedSections = Array(gridRows * gridCols).fill(false);

// Load and pixelate the image
const img = new Image();
img.src = "images/eiffel_tower.jpg"; // Path to the landmark image
img.crossOrigin = "Anonymous"; // To avoid CORS issues if needed
img.onload = () => {
    // Draw the original image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // Apply pixelation
    pixelateImage();
};

// Function to pixelate the image
function pixelateImage() {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Pixelate by averaging colors in grid blocks
    for (let y = 0; y < height; y += gridSize) {
        for (let x = 0; x < width; x += gridSize) {
            const rgb = getAverageColor(x, y, gridSize, gridSize, data, width, height);
            fillBlock(x, y, gridSize, gridSize, rgb);
        }
    }
}

// Function to get average color of a block
function getAverageColor(x, y, w, h, data, width, height) {
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = y; i < y + h && i < height; i++) {
        for

