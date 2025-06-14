// Enhanced Starry Night Puzzle Game with Autosolver
class StarryNightPuzzle {
    constructor() {
        this.gridSize = 3; // Default 3x3 grid
        this.totalPieces = this.gridSize * this.gridSize;
        this.emptyIndex = this.totalPieces - 1; // Last position is empty
        this.gameBoard = [];
        this.startTime = null;
        this.moves = 0;
        this.isAutoSolving = false;
        this.autoSolveSpeed = 500; // milliseconds between moves
        this.solutionMoves = [];
        this.currentSolutionStep = 0;
        
        this.init();
    }    init() {
        try {
            this.createPuzzleContainer();
            this.initializeBoard();
            this.renderBoard();
            this.bindEvents();
            this.shuffle();
            this.updateStats();
            console.log('Starry Night Puzzle initialized successfully');
        } catch (error) {
            console.error('Error initializing puzzle:', error);
        }
    }

    createPuzzleContainer() {
        // Check if puzzle container already exists
        let existingContainer = document.querySelector('.puzzle-container');
        if (existingContainer) {
            existingContainer.remove();
        }        // Create puzzle HTML structure
        const puzzleHTML = `
            <div class="puzzle-container">
                <div class="puzzle-header">
                    <h3 class="puzzle-title">Starry Night Puzzle</h3>
                </div>
                
                <div class="puzzle-controls">
                    <button class="puzzle-btn primary" id="shuffle-btn">Shuffle</button>
                    <button class="puzzle-btn secondary" id="solve-btn">Auto Solve</button>
                </div>
                
                <div class="puzzle-game">
                    <div class="puzzle-grid" id="puzzle-grid"></div>
                </div>
                
                <div class="puzzle-stats">
                    <div class="stat-item">
                        <span class="stat-value" id="moves-count">0</span>
                        <span class="stat-label">Moves</span>
                    </div>
                </div>
            </div>
            
            <div class="completion-modal" id="completion-modal">
                <div class="completion-content">
                    <h3 class="completion-title">🎉 Puzzle Completed!</h3>
                    <div class="completion-stats">
                        <div class="completion-moves" id="completion-moves">Moves: 0</div>
                    </div>
                    <button class="puzzle-btn primary" onclick="puzzleGame.shuffle()">New Game</button>
                </div>
            </div>
        `;        // Find a suitable container in the existing HTML
        const projectsSection = document.querySelector('#projects');
        console.log('Projects section found:', projectsSection);
        
        if (projectsSection) {
            const puzzleContainer = document.createElement('div');
            puzzleContainer.innerHTML = puzzleHTML;
            const puzzleElement = puzzleContainer.firstElementChild;
            
            console.log('Puzzle element created:', puzzleElement);
            projectsSection.appendChild(puzzleElement);
            console.log('Puzzle appended to projects section');
        } else {
            console.error('Projects section not found!');
        }
    }

    initializeBoard() {
        this.gameBoard = [];
        for (let i = 0; i < this.totalPieces - 1; i++) {
            this.gameBoard[i] = i;
        }
        this.gameBoard[this.totalPieces - 1] = null; // Empty space
        this.emptyIndex = this.totalPieces - 1;
    }    renderBoard() {
        const grid = document.getElementById('puzzle-grid');
        if (!grid) return;

        grid.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        grid.innerHTML = '';

        for (let i = 0; i < this.totalPieces; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.index = i;

            if (this.gameBoard[i] === null) {
                piece.classList.add('empty');
            } else {
                const pieceNumber = this.gameBoard[i];
                const row = Math.floor(pieceNumber / this.gridSize);
                const col = pieceNumber % this.gridSize;
                
                // Improved background position calculation
                const bgPosX = col * (100 / (this.gridSize - 1));
                const bgPosY = row * (100 / (this.gridSize - 1));
                
                piece.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
                piece.style.backgroundSize = `${this.gridSize * 100}% ${this.gridSize * 100}%`;
                
                // Add piece number for debugging
                piece.dataset.piece = pieceNumber;
                piece.title = `Piece ${pieceNumber} (${row}, ${col})`;
                
                piece.addEventListener('click', () => this.handlePieceClick(i));
            }

            grid.appendChild(piece);
        }
    }

    handlePieceClick(index) {
        if (this.isAutoSolving) return;
        
        if (this.canMove(index)) {
            this.movePiece(index);
            this.updateStats();
            
            if (this.isSolved()) {
                this.onPuzzleComplete();
            }
        }
    }

    canMove(index) {
        const row = Math.floor(index / this.gridSize);
        const col = index % this.gridSize;
        const emptyRow = Math.floor(this.emptyIndex / this.gridSize);
        const emptyCol = this.emptyIndex % this.gridSize;

        return (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
               (Math.abs(col - emptyCol) === 1 && row === emptyRow);
    }    movePiece(index) {
        // Swap piece with empty space
        [this.gameBoard[index], this.gameBoard[this.emptyIndex]] = 
        [this.gameBoard[this.emptyIndex], this.gameBoard[index]];
        
        this.emptyIndex = index;
        this.moves++;
        
        this.renderBoard();
    }// Check if the puzzle is solvable using inversion count
    isSolvable(board = this.gameBoard) {
        let inversions = 0;
        const flattened = board.filter(val => val !== null);
        
        for (let i = 0; i < flattened.length - 1; i++) {
            for (let j = i + 1; j < flattened.length; j++) {
                if (flattened[i] > flattened[j]) {
                    inversions++;
                }
            }
        }
        
        // For odd grid sizes, puzzle is solvable if inversions are even
        if (this.gridSize % 2 === 1) {
            return inversions % 2 === 0;
        }
        
        // For even grid sizes, check blank position
        const emptyRow = Math.floor(this.emptyIndex / this.gridSize);
        const blankOnEvenRowFromBottom = (this.gridSize - emptyRow) % 2 === 0;
        
        return blankOnEvenRowFromBottom ? inversions % 2 === 1 : inversions % 2 === 0;
    }

    // Enhanced shuffle that ensures solvability
    shuffle() {
        this.stopAutoSolve();
        
        // Generate a solvable configuration
        let attempts = 0;
        do {
            // Reset to solved state
            this.initializeBoard();
            
            // Perform random valid moves to ensure solvability
            for (let i = 0; i < 1000; i++) {
                const validMoves = this.getValidMoves();
                if (validMoves.length > 0) {
                    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                    this.gameBoard[this.emptyIndex] = this.gameBoard[randomMove];
                    this.gameBoard[randomMove] = null;
                    this.emptyIndex = randomMove;
                }
            }
            attempts++;
        } while (!this.isSolvable() && attempts < 10);
        
        if (!this.isSolvable()) {
            console.warn('Could not generate solvable puzzle, using default solvable state');
            this.initializeBoard();
            // Make one simple shuffle that we know is solvable
            if (this.totalPieces > 1) {
                const validMoves = this.getValidMoves();
                if (validMoves.length > 0) {
                    const move = validMoves[0];
                    this.gameBoard[this.emptyIndex] = this.gameBoard[move];
                    this.gameBoard[move] = null;
                    this.emptyIndex = move;
                }
            }
        }
        
        this.moves = 0;
        this.startTime = null;
        this.renderBoard();
        this.updateStats();
        
        console.log('Puzzle shuffled. Solvable:', this.isSolvable());
        console.log('Current state:', this.gameBoard);
    }

    getValidMoves() {
        const moves = [];
        const row = Math.floor(this.emptyIndex / this.gridSize);
        const col = this.emptyIndex % this.gridSize;

        // Check all four directions
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        for (const [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (newRow >= 0 && newRow < this.gridSize && 
                newCol >= 0 && newCol < this.gridSize) {
                moves.push(newRow * this.gridSize + newCol);
            }
        }
        
        return moves;
    }

    isSolved() {
        for (let i = 0; i < this.totalPieces - 1; i++) {
            if (this.gameBoard[i] !== i) {
                return false;
            }
        }
        return this.gameBoard[this.totalPieces - 1] === null;
    }    // Enhanced A* Algorithm for finding optimal solution with better debugging
    findSolution() {
        const start = [...this.gameBoard];
        const target = [...Array(this.totalPieces - 1).keys()];
        target.push(null);

        // Check if already solved
        if (this.boardsEqual(start, target)) {
            console.log('Puzzle is already solved!');
            return [];
        }

        console.log('Finding solution for board:', start);
        console.log('Target board:', target);

        const openSet = [{
            board: start,
            moves: [],
            g: 0,
            f: this.heuristic(start)
        }];
        
        const visited = new Set();
        let iterations = 0;
        const maxIterations = 50000; // Prevent infinite loops
        
        while (openSet.length > 0 && iterations < maxIterations) {
            iterations++;
            
            // Sort by f-score and get the best option
            openSet.sort((a, b) => a.f - b.f);
            const current = openSet.shift();
            
            const boardKey = current.board.join(',');
            if (visited.has(boardKey)) continue;
            visited.add(boardKey);
            
            // Check if we found the solution
            if (this.boardsEqual(current.board, target)) {
                console.log(`✅ Solution found in ${iterations} iterations with ${current.moves.length} moves`);
                console.log('Solution moves:', current.moves);
                return current.moves;
            }
            
            const emptyIdx = current.board.indexOf(null);
            const validMoves = this.getValidMovesForBoard(current.board, emptyIdx);
            
            for (const moveIdx of validMoves) {
                const newBoard = [...current.board];
                [newBoard[emptyIdx], newBoard[moveIdx]] = [newBoard[moveIdx], newBoard[emptyIdx]];
                
                const newBoardKey = newBoard.join(',');
                if (visited.has(newBoardKey)) continue;
                
                const newMoves = [...current.moves, moveIdx];
                const g = current.g + 1;
                const h = this.heuristic(newBoard);
                
                openSet.push({
                    board: newBoard,
                    moves: newMoves,
                    g: g,
                    f: g + h
                });
            }
            
            // Progress logging every 1000 iterations
            if (iterations % 1000 === 0) {
                console.log(`Search progress: ${iterations} iterations, ${visited.size} states visited, ${openSet.length} states in queue`);
            }
            
            // Limit search space to prevent memory issues
            if (visited.size > 100000) {
                console.log('Search space limit reached (100k visited states)');
                break;
            }
        }
        
        console.log(`❌ No solution found after ${iterations} iterations`);
        console.log(`Visited ${visited.size} states, ${openSet.length} states remaining`);
        return []; // No solution found
    }

    heuristic(board) {
        let distance = 0;
        for (let i = 0; i < board.length - 1; i++) {
            if (board[i] !== null) {
                const currentRow = Math.floor(i / this.gridSize);
                const currentCol = i % this.gridSize;
                const targetRow = Math.floor(board[i] / this.gridSize);
                const targetCol = board[i] % this.gridSize;
                
                distance += Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
            }
        }
        return distance;
    }

    boardsEqual(board1, board2) {
        return board1.every((val, index) => val === board2[index]);
    }

    getValidMovesForBoard(board, emptyIdx) {
        const moves = [];
        const row = Math.floor(emptyIdx / this.gridSize);
        const col = emptyIdx % this.gridSize;

        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        for (const [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (newRow >= 0 && newRow < this.gridSize && 
                newCol >= 0 && newCol < this.gridSize) {
                moves.push(newRow * this.gridSize + newCol);
            }
        }
        
        return moves;
    }    async autoSolve() {
        if (this.isAutoSolving) {
            this.stopAutoSolve();
            return;
        }
        
        if (this.isSolved()) {
            alert('Puzzle is already solved!');
            return;
        }
        
        // Check if puzzle is solvable before attempting to solve
        if (!this.isSolvable()) {
            alert('This puzzle configuration is not solvable! Please shuffle again.');
            return;
        }
          this.isAutoSolving = true;
        const solveBtn = document.getElementById('solve-btn');
        
        if (solveBtn) solveBtn.textContent = 'Finding Solution...';
        
        // Find solution with timeout to prevent UI blocking
        setTimeout(() => {
            try {
                console.log('🔍 Starting autosolver...');
                const solution = this.findSolution();
                
                if (solution.length === 0) {
                    if (this.isSolved()) {
                        console.log('✅ Puzzle was already solved!');
                        this.stopAutoSolve();
                        return;
                    }
                    
                    console.error('❌ No solution found despite puzzle being solvable');
                    alert('No solution found! This might be a bug. Try shuffling again.');
                    this.stopAutoSolve();
                    return;
                }
                
                console.log(`🎯 Solution found! ${solution.length} moves required.`);
                
                if (solveBtn) solveBtn.textContent = 'Stop Solving';
                  this.solutionMoves = solution;
                this.currentSolutionStep = 0;
                
                this.executeSolution();
            } catch (error) {
                console.error('❌ Error finding solution:', error);
                alert('Error occurred while finding solution. Try shuffling again.');
                this.stopAutoSolve();
            }
        }, 100);
    }    async executeSolution() {
        if (!this.isAutoSolving || this.currentSolutionStep >= this.solutionMoves.length) {
            this.stopAutoSolving();
            return;
        }
        
        const moveIndex = this.solutionMoves[this.currentSolutionStep];
        console.log(`Auto-solving step ${this.currentSolutionStep + 1}/${this.solutionMoves.length}: moving piece at index ${moveIndex}`);
        
        this.movePiece(moveIndex);
        this.updateStats();
        
        if (this.isSolved()) {
            console.log('Puzzle solved by autosolver!');
            this.onPuzzleComplete();
            return;
        }
        
        this.currentSolutionStep++;
        
        setTimeout(() => this.executeSolution(), this.autoSolveSpeed);
    }    stopAutoSolve() {
        this.isAutoSolving = false;
        const solveBtn = document.getElementById('solve-btn');
        
        if (solveBtn) solveBtn.textContent = 'Auto Solve';
    }updateStats() {
        const movesElement = document.getElementById('moves-count');
        
        if (movesElement) movesElement.textContent = this.moves;    }    onPuzzleComplete() {
        this.stopAutoSolve();
        
        document.getElementById('completion-moves').textContent = `Moves: ${this.moves}`;
        
        document.getElementById('completion-modal').classList.add('show');
        
        setTimeout(() => {
            document.getElementById('completion-modal').classList.remove('show');
        }, 5000);
    }

    // Test function to validate autosolver with a simple case
    testAutosolver() {
        console.log('🧪 Testing autosolver with simple 3x3 case...');
        
        // Set up a simple solvable puzzle (just one move away from solution)
        this.gridSize = 3;
        this.totalPieces = 9;
        this.gameBoard = [0, 1, 2, 3, 4, 5, 6, null, 7]; // 7 and empty swapped
        this.emptyIndex = 7;
        
        console.log('Test board (one move from solution):', this.gameBoard);
        console.log('Is solvable:', this.isSolvable());
        
        const solution = this.findSolution();
        console.log('Test solution:', solution);
        
        if (solution.length === 1 && solution[0] === 8) {
            console.log('✅ Autosolver test PASSED!');
            return true;
        } else {
            console.log('❌ Autosolver test FAILED!');
            return false;
        }    }    bindEvents() {
        document.getElementById('shuffle-btn')?.addEventListener('click', () => this.shuffle());
        document.getElementById('solve-btn')?.addEventListener('click', () => this.autoSolve());
        
        // Close modal when clicking outside
        document.getElementById('completion-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'completion-modal') {
                document.getElementById('completion-modal').classList.remove('show');
            }
        });
    }
}

// Initialize the puzzle game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for other scripts to load, then initialize
    setTimeout(() => {
        try {
            console.log('🎮 Initializing puzzle game...');
            // Check if projects section exists
            const projectsSection = document.querySelector('#projects');
            if (projectsSection) {
                console.log('✅ Projects section found, creating puzzle...');
                window.puzzleGame = new StarryNightPuzzle();
                console.log('✅ Puzzle game initialized successfully');
                
                // Run autosolver test
                if (window.puzzleGame.testAutosolver) {
                    window.puzzleGame.testAutosolver();
                }
            } else {
                console.warn('❌ Projects section not found, puzzle will not be initialized');
            }
        } catch (error) {
            console.error('❌ Failed to initialize puzzle game:', error);
        }
    }, 1000);
});

// Make it globally accessible
if (typeof window !== 'undefined') {
    window.StarryNightPuzzle = StarryNightPuzzle;
}