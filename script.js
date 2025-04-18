// script.js
const gridContainer = document.getElementById("word-search-grid");
const wordListElement = document.getElementById("word-list");

// Words to find (add more words here)
const words = ["FOXY", "UBER", "COZY", "NAKED", "MAKEOUT", "MATCHA", "EDINBURGH", "BLOWJOB", "BATHROOM","CUDDLES", "CHILOS", "HAYMARKET", "TESCO"];
let remainingWords = [...words]; // Copy of the words array for tracking found words
wordListElement.textContent = remainingWords.join(", ");

// Determine grid size dynamically based on the words
const longestWord = Math.max(...words.map(word => word.length));
const gridSize = Math.max(longestWord + 2, Math.ceil(Math.sqrt(words.join("").length) * 1.5));

// Create the grid
let grid = Array.from({ length: gridSize }, () =>
  Array.from({ length: gridSize }, () => "")
);

// Insert words into the grid
function placeWord(word) {
  const directions = ["horizontal", "vertical", "diagonal"];
  let placed = false;

  while (!placed) {
    const direction = directions[Math.floor(Math.random() * directions.length)];
    let row, col;

    if (direction === "horizontal") {
      row = Math.floor(Math.random() * gridSize);
      col = Math.floor(Math.random() * (gridSize - word.length));
      if (canPlaceWord(word, row, col, 0, 1)) {
        for (let i = 0; i < word.length; i++) {
          grid[row][col + i] = word[i];
        }
        placed = true;
      }
    } else if (direction === "vertical") {
      row = Math.floor(Math.random() * (gridSize - word.length));
      col = Math.floor(Math.random() * gridSize);
      if (canPlaceWord(word, row, col, 1, 0)) {
        for (let i = 0; i < word.length; i++) {
          grid[row + i][col] = word[i];
        }
        placed = true;
      }
    } else if (direction === "diagonal") {
      row = Math.floor(Math.random() * (gridSize - word.length));
      col = Math.floor(Math.random() * (gridSize - word.length));
      if (canPlaceWord(word, row, col, 1, 1)) {
        for (let i = 0; i < word.length; i++) {
          grid[row + i][col + i] = word[i];
        }
        placed = true;
      }
    }
  }
}

// Check if a word can be placed in the grid
function canPlaceWord(word, row, col, rowStep, colStep) {
  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * rowStep;
    const newCol = col + i * colStep;
    if (
      newRow >= gridSize ||
      newCol >= gridSize ||
      (grid[newRow][newCol] !== "" && grid[newRow][newCol] !== word[i])
    ) {
      return false;
    }
  }
  return true;
}

// Fill the grid with random letters
function fillGrid() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === "") {
        grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

// Render the grid
function renderGrid() {
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;
  grid.forEach((row) => {
    row.forEach((letter) => {
      const cell = document.createElement("div");
      cell.textContent = letter;
      cell.classList.add("letter");
      gridContainer.appendChild(cell);
    });
  });
}

// Update the word list when a word is found
function updateWordList(foundWord) {
  remainingWords = remainingWords.filter((word) => word !== foundWord);
  wordListElement.textContent = remainingWords.join(", ");

  // Check if all words are found
  if (remainingWords.length === 0) {
    // Redirect to the "Congratulations" page
    window.location.href = "congrats.html"; // Replace with the actual path to your page
  }
}

// Place all words and render the grid
words.forEach((word) => placeWord(word));
fillGrid();
renderGrid();

// Add click functionality to track selected letters
let selectedCells = [];

document.querySelectorAll(".letter").forEach((cell) => {
  cell.addEventListener("click", () => {
    if (cell.classList.contains("selected")) return;

    // Mark the cell as selected
    cell.classList.add("selected");
    selectedCells.push(cell);

    // Check if selected letters form a valid word
    const selectedWord = selectedCells.map(c => c.textContent).join("");
    if (words.includes(selectedWord)) {
      alert(`You found the word: ${selectedWord}`);
      updateWordList(selectedWord); // Remove the word from the list

      // Highlight the word and clear selections
      selectedCells.forEach((cell) => {
        cell.style.backgroundColor = "#6edb8f"; // Highlight found word
      });
      selectedCells = [];
    }

    // Reset selection if no match and too many letters
    else if (selectedCells.length > longestWord) {
      resetSelections();
    }
  });
});

// Function to reset selected cells
function resetSelections() {
  selectedCells.forEach((cell) => cell.classList.remove("selected"));
  selectedCells = [];
}
