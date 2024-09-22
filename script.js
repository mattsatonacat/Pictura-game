// Define the landmark and image path
const landmark = "Eiffel Tower"; // Correct answer
const imagePath = "images/eiffel_tower.jpg"; // Path to the landmark image

const canvas = document.getElementById('picturaCanvas');
const ctx = canvas.getContext('2d');
const revealButton = document.getElementById('revealButton');
const submitGuessButton = document.getElementById('submitGuess');
const guessInput = document.getElementById('guessInput');
const feedback = document.getElementById('feedback');

// Grid configuration
const gridRows = 10;
const gridCols = 10;
const gridSize = 50; // Size of each grid section in pixels

// Track revealed sections
let revealedSections = Array(gridRows * gridCols).fill(false);

// Load and pixelate the image
const img = new Image();
img.src = imagePath;
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

// Event listener for guess submission
submitGuessButton.addEventListener('click', () => {
    const userGuess = guessInput.value.trim().toLowerCase();
    if (userGuess === landmark.toLowerCase()) {
        feedback.textContent = "🎉 Correct! You've guessed the landmark!";
        feedback.style.color = "green";
    } else {
        feedback.textContent = "❌ Incorrect. Try again!";
        feedback.style.color = "red";
    }
    guessInput.value = '';
});
