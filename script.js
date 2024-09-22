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
    "canada": { lat: 56.1304, lng: -106.3468 },
    "usa": { lat: 37.0902, lng: -95.7129 },
    "mexico": { lat: 23.6345, lng: -102.5528 },
    "japan": { lat: 36.2048, lng: 138.2529 },
    "china": { lat: 35.8617, lng: 104.1954 },
    "brazil": { lat: -14.2350, lng: -51.9253 },
    "argentina": { lat: -38.4161, lng: -63.6167 },
    "russia": { lat: 61.5240, lng: 105.3188 },
    "india": { lat: 20.5937, lng: 78.9629 },
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
        for (let j = x; j < x + w && j < width; j++) {
            const index = (i * width + j) * 4;
            r += data[index];
            g += data[index + 1];
            b += data[index + 2];
            count++;
        }
    }
    return {
        r: Math.floor(r / count),
        g: Math.floor(g / count),
        b: Math.floor(b / count)
    };
}

// Function to fill a block with a specific color
function fillBlock(x, y, w, h, rgb) {
    ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    ctx.fillRect(x, y, w, h);
}

// Function to reveal a specific grid section
function revealSection(row, col) {
    const index = row * gridCols + col;
    if (revealedSections[index]) {
        // Already revealed
        return;
    }
    revealedSections[index] = true;

    const x = col * gridSize;
    const y = row * gridSize;

    // Draw the actual image section
    ctx.drawImage(
        img,
        x, y, gridSize, gridSize,
        x, y, gridSize, gridSize
    );
}

// Function to handle canvas click events
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);

    revealSection(row, col);
});

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(coord1, coord2) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 3958.8; // Radius of Earth in miles
    const dLat = toRadians(coord2.lat - coord1.lat);
    const dLon = toRadians(coord2.lng - coord1.lng);
    const lat1 = toRadians(coord1.lat);
    const lat2 = toRadians(coord2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Function to determine direction from guess to correct country
function getDirection(coord1, coord2) {
    const dy = coord2.lat - coord1.lat;
    const dx = coord2.lng - coord1.lng;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const directions = [
        { min: -22.5, max: 22.5, direction: "East" },
        { min: 22.5, max: 67.5, direction: "Northeast" },
        { min: 67.5, max: 112.5, direction: "North" },
        { min: 112.5, max: 157.5, direction: "Northwest" },
        { min: 157.5, max: 180, direction: "West" },
        { min: -180, max: -157.5, direction: "West" },
        { min: -157.5, max: -112.5, direction: "Southwest" },
        { min: -112.5, max: -67.5, direction: "South" },
        { min: -67.5, max: -22.5, direction: "Southeast" },
    ];

    for (let dir of directions) {
        if (angle > dir.min && angle <= dir.max) {
            return dir.direction;
        }
    }
    return "East"; // Default direction
}

// Event listener for guess submission
submitGuessButton.addEventListener('click', () => {
    const userGuess = guessInput.value.trim().toLowerCase();
    if (userGuess === "") {
        displayFeedback("Please enter a country.", "red");
        return;
    }

    if (!(userGuess in countries)) {
        displayFeedback("Country not recognized. Please try another.", "red");
        return;
    }

    if (userGuess === correctCountry) {
        displayFeedback("🎉 Correct! You've guessed the country!", "green");
    } else {
        // Calculate distance and direction
        const userCoord = countries[userGuess];
        const correctCoord = countries[correctCountry];
        const distance = Math.round(calculateDistance(userCoord, correctCoord));
        const direction = getDirection(userCoord, correctCoord);

        // Add directional arrow based on direction
        const directionArrows = {
            "North": "⬆️",
            "Northeast": "↗️",
            "East": "➡️",
            "Southeast": "↘️",
            "South": "⬇️",
            "Southwest": "↙️",
            "West": "⬅️",
            "Northwest": "↖️"
        };
        const arrow = directionArrows[direction] || "";

        displayFeedback(`❌ Incorrect. You're ${distance} miles to the ${direction} of the correct country. ${arrow}`, "red");
    }
    guessInput.value = '';
});

// Function to display feedback with appropriate styling
function displayFeedback(message, color) {
    feedback.textContent = message;
    if (color === "green") {
        feedback.classList.remove("red");
        feedback.classList.add("green");
    } else if (color === "red") {
        feedback.classList.remove("green");
        feedback.classList.add("red");
    }
}
