import React, { useState } from "react";
import "./App.css";

const App = () => {
  const gridSize = 10; // Define grid size (4x4)
  const initialGrid = Array(gridSize).fill(Array(gridSize).fill(0)); // Initialize grid with 0s

  const [grid, setGrid] = useState(initialGrid);
  const [rowCounts, setRowCounts] = useState(Array(gridSize).fill(0));
  const [colCounts, setColCounts] = useState(Array(gridSize).fill(0));
  const [error, setError] = useState("");

  // Function to handle cell click
  const handleCellClick = (row, col) => {
    const newGrid = grid.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? 1 - c : c))
    );

    // Dynamic Updates (Neighbors)
    updateNeighbors(newGrid, row, col);

    // Enforce Constraints
    if (!isValidGrid(newGrid)) {
      setError("Invalid action: violates constraints!");
      return;
    }

    updateCounts(newGrid);
    setError(""); // Clear any previous error
    setGrid(newGrid);
  };

  // Function to update neighbors
  const updateNeighbors = (grid, row, col) => {
    const directions = [
      [0, 1], // Right
      [0, -1], // Left
      [1, 0], // Down
      [-1, 0], // Up
    ];
    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      if (
        newRow >= 0 &&
        newRow < gridSize &&
        newCol >= 0 &&
        newCol < gridSize
      ) {
        grid[newRow][newCol] = 1; // Fill neighbor cell
      }
    });
  };

  // Function to enforce constraints
  const isValidGrid = (grid) => {
    // Check for row/column constraints
    for (let i = 0; i < gridSize; i++) {
      if (
        grid[i].filter((cell) => cell === 1).length > 3 || // Row constraint
        grid.map((row) => row[i]).filter((cell) => cell === 1).length > 3 // Column constraint
      ) {
        return false;
      }
    }

    // Check for 2x2 square constraint
    for (let i = 0; i < gridSize - 1; i++) {
      for (let j = 0; j < gridSize - 1; j++) {
        const squareSum =
          grid[i][j] + grid[i + 1][j] + grid[i][j + 1] + grid[i + 1][j + 1];
        if (squareSum === 4) return false;
      }
    }

    return true;
  };

  // Function to update row and column counts
  const updateCounts = (grid) => {
    const rows = grid.map((row) => row.filter((cell) => cell === 1).length);
    const cols = grid[0].map(
      (_, colIndex) =>
        grid.map((row) => row[colIndex]).filter((cell) => cell === 1).length
    );
    setRowCounts(rows);
    setColCounts(cols);
  };

  // Reset Grid
  const resetGrid = () => {
    setGrid(initialGrid);
    setRowCounts(Array(gridSize).fill(0));
    setColCounts(Array(gridSize).fill(0));
    setError("");
  };

  // Random Fill (while respecting constraints)
  const randomFill = () => {
    let newGrid;
    let attempts = 0; // Add a safeguard against infinite loops
    const maxAttempts = 100; // Maximum number of attempts to generate a valid grid

    do {
      // Generate a random grid
      newGrid = grid.map((row) => row.map(() => (Math.random() > 0.5 ? 1 : 0)));
      attempts++;
    } while (!isValidGrid(newGrid) && attempts < maxAttempts);

    if (isValidGrid(newGrid)) {
      updateCounts(newGrid);
      setGrid(newGrid);
      setError("");
    } else {
      setError(
        "Failed to generate a valid random grid after several attempts."
      );
    }
  };

  return (
    <div className="App">
      <h1>Dynamic Grid</h1>

      {error && <p className="error">{error}</p>}
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <div
                className={`cell ${cell === 1 ? "filled" : "empty"}`}
                key={colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="controls">
        <button onClick={resetGrid}>Reset Grid</button>
        <button onClick={randomFill}>Random Fill</button>
      </div>
      <div className="counts">
        <p>Row Counts: {rowCounts.join(", ")}</p>
        <p>Column Counts: {colCounts.join(", ")}</p>
      </div>
    </div>
  );
};

export default App;
