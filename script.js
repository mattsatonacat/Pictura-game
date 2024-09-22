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
    // Add more countries as needed
};

const correctCountry = landmark.country.toLowerCase();

const canvas = document.getElementById('picturaCanvas');
const ctx = canvas.getContext('2d');
const revealButton = document.getElementById('revealButton');
const submitGuessButton = document.getElementById('submitGuess');
const guessInput = document.getElementById('guessInput');
const feedback = document.getElementById('feedback');
const countryInfo = document.getElementById('countryInfo');

// Grid configuration
const gridRows = 3;
const gridCols = 3;
const gridSize = canvas.width / gridCols; // Adjust grid size based on canvas width

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

    // Simple pixelation by averaging colors in grid blocks
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

// Function to reveal a random unrevealed section
function revealSection() {
    const unrevealed = [];
    for (let i = 0; i < revealedSections.length; i++) {
        if (!revealedSections[i]) {
            unrevealed.push(i);
        }
    }

    if (unrevealed.length === 0) {
        alert("All sections revealed!");
        return;
    }

    const randomIndex = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    revealedSections[randomIndex] = true;

    const row = Math.floor(randomIndex / gridCols);
    const col = randomIndex % gridCols;
    const x = col * gridSize;
    const y = row * gridSize;

    // Draw the actual image section
    ctx.drawImage(
        img,
        x, y, gridSize, gridSize,
        x, y, gridSize, gridSize
    );
}

// Event listener for reveal button
revealButton.addEventListener('click', () => {
    revealSection();
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
        feedback.textContent = "Please enter a country.";
        feedback.style.color = "red";
        return;
    }

    if (!(userGuess in countries)) {
        feedback.textContent = "Country not recognized. Please try another.";
        feedback.style.color = "red";
        return;
    }

    if (userGuess === correctCountry) {
        feedback.textContent = "🎉 Correct! You've guessed the country!";
        feedback.style.color = "green";
    } else {
        // Calculate distance and direction
        const userCoord = countries[userGuess];
        const correctCoord = countries[correctCountry];
        const distance = Math.round(calculateDistance(userCoord, correctCoord));
        const direction = getDirection(userCoord, correctCoord);

        feedback.textContent = `❌ Incorrect. You're ${distance} miles to the ${direction} of the correct country.`;
        feedback.style.color = "red";
    }
    guessInput.value = '';
});

// Display the country information
window.onload = () => {
    countryInfo.textContent = `Country: ${landmark.country}`;
};
