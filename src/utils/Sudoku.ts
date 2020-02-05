

/*
* Sudoku Generator
* v0.2
*
* Copyright (c) 2010, David J. Rager
* All rights reserved.
* 
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met: 
* 
*     * Redistributions of source code must retain the above copyright notice,
*       this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright
*       notice, this list of conditions and the following disclaimer in the
*       documentation and/or other materials provided with the distribution.
*     * Neither the name of Fourth Woods Media nor the names of its
*       contributors may be used to endorse or promote products derived from
*       this software without specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
* FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
* DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
* CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
* OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*
* This is a sudoku puzzle generator and solver. This program provides two
* generation algorithms, a solver and methods to update and check the state of
* the puzzle. This program does not provide any user interface controls.
*
* To create a new puzzle just instantiate the Sudoku object:
*
* var thePuzzle = new Sudoku();
*
* The puzzle is represented as a 9x9 matrix of numbers 0-9. A cell value of zero
* indicates a cell that has been masked from view for the user to discover. A
* user interface should display all the non-zero values to the user and blank
* cells for any cell containing a zero.
*
* The puzzle uses either a simple shuffle algorithm or the backtracking solver
* (the default) to create the puzzle.
*
* To start a new game call:
*
* thePuzzle.newGame();
*
* This class includes a solver that will solve the sudoku using a backtracking
* algorithm. To solve the puzzle call the solve() method:
*
* thePuzzle.solve();
*
* If there is more than one solution to the sudoku puzzle, the solver will show
* only one of them at random. The solver does not know if there is more than one
* solution.
*
* The enumSolutions() method is a modified version of the solver that will count
* all possible solutions for 
*
* Have fun. Send any comments, bugs, contribs to rageratwork@gmail.com

/**
 * Sudoku  
 * originated form Sudoku Generator ( ref docs above)
 * @export
 * @class Sudoku
 */
export default class Sudoku {
	
	matrix = new Array(81).fill(0);
	save: any[] = [];
	
	level = 0;
	
	_newGame() {
		var i, hints = 0;
		var mask = new Array(81);

		this.matrix = new Array(81).fill(0);

		this.solve(this.matrix);

		this.maskBoard(this.matrix, mask);

		if (this.level == 0)
			hints = 12;
		else if (this.level == 1)
			hints = 8;

		for (i = 0; i < hints; i++) {
			do {
				var cell = Math.floor(Math.random() * 81);
			}
			while (mask[cell] != 0);

			mask[cell] = this.matrix[cell];
		}

		this.save = this.matrix;

		this.matrix = mask;
	}

	
	enumSolutions(matrix: any[]) {
		var i, j, ret = 0;
		var cell = this.getCell(matrix);

		if (cell == -1)
			return 1;

		var avail = new Array(9).fill(0);

		j = this.getAvailable(matrix, cell, avail);
		for (i = 0; i < j; i++) {
			matrix[cell] = avail[i];

			ret += this.enumSolutions(matrix);

			if (ret > 1)
				break;
		}

		matrix[cell] = 0;
		return ret;
	}

	maskBoard(matrix: any[], mask: any[]) {
		var i, j, k, r, c, n = 0, a, hints = 0, cell, val;
		var avail = new Array(9).fill(0);

		var tried = new Array(81).fill(0);

		mask.fill(0);
		do {
			do {
				cell = Math.floor(Math.random() * 81);
			}
			while ((mask[cell] != 0) || (tried[cell] != 0));
			val = matrix[cell];

			i = this.getAvailable(mask, cell, null);

			if (i > 1) {
				var cnt, row = Math.floor(cell / 9), col = cell % 9;

				cnt = 0; 

				for (i = 0; i < 9; i++) {
					if (i == col)
						continue;

					j = row * 9 + i; // j stores the cell index

					if (mask[j] > 0)
						continue;

					a = this.getAvailable(mask, j, avail);

					for (j = 0; j < a; j++) {
						if (avail[j] == val) {
							cnt++;
							break;
						}
						avail[j] = 0;
					}
				}

				if (cnt > 0) {
					cnt = 0;
					for (i = 0; i < 9; i++) {
						if (i == row)
							continue;

						j = i * 9 + col;
						if (mask[j] > 0)
							continue;
						a = this.getAvailable(mask, j, avail);
						for (j = 0; j < a; j++) {
							if (avail[j] == val) {
								cnt++;
								break;
							}
							avail[j] = 0;
						}
					}

					if (cnt > 0) {
						// square
						cnt = 0;
						r = row - row % 3;
						c = col - col % 3;
						for (i = r; i < r + 3; i++) {
							for (j = c; j < c + 3; j++) {
								if ((i == row) && (j == col))
									continue;

								k = i * 9 + j;
								if (mask[k] > 0)
									continue;
								a = this.getAvailable(mask, k, avail);
								for (k = 0; k < a; k++) {
									if (avail[k] == val) {
										cnt++;
										break;
									}
									avail[k] = 0;
								}
							}
						}

						if (cnt > 0) {
							mask[cell] = val;
							hints++;
						}
					}
				}
			}

			tried[cell] = 1;
			n++;
		}
		while (n < 81);

		do {
			do {
				cell = Math.floor(Math.random() * 81);
			}
			while ((mask[cell] == 0) || (tried[cell] == 0));

			val = mask[cell];

			var t = this;
			var solutions = 0;

			mask[cell] = 0;
			solutions = this.enumSolutions(mask);

			if (solutions > 1)
				mask[cell] = val;

			tried[cell] = 0;
			hints--;
		}
		while (hints > 0);

	}

	getAvailable(matrix: any[], cell: number, avail: any) {
		let i, j, row, col, r, c;
		let arr = new Array(9).fill(0);

		row = Math.floor(cell / 9);
		col = cell % 9;

		// row
		for (i = 0; i < 9; i++) {
			j = row * 9 + i;
			if (matrix[j] > 0)
				arr[matrix[j] - 1] = 1;
		}

		// col
		for (i = 0; i < 9; i++) {
			j = i * 9 + col;
			if (matrix[j] > 0) {
				arr[matrix[j] - 1] = 1;
			}
		}

		// square
		r = row - row % 3;
		c = col - col % 3;
		for (i = r; i < r + 3; i++)
			for (j = c; j < c + 3; j++)
				if (matrix[i * 9 + j] > 0)
					arr[matrix[i * 9 + j] - 1] = 1;

		j = 0;
		if (avail != null) {
			for (i = 0; i < 9; i++)
				if (arr[i] == 0)
					avail[j++] = i + 1;
		}
		else {
			for (i = 0; i < 9; i++)
				if (arr[i] == 0)
					j++;
			return j;
		}

		if (j == 0)
			return 0;

		for (i = 0; i < 18; i++) {
			r = Math.floor(Math.random() * j);
			c = Math.floor(Math.random() * j);
			row = avail[r];
			avail[r] = avail[c];
			avail[c] = row;
		}

		return j;
	}

	getCell(matrix: any[]) {
		let cell = -1, n = 10, i, j;
		let avail = new Array(9).fill(0);

		for (i = 0; i < 81; i++) {
			if (matrix[i] == 0) {
				j = this.getAvailable(matrix, i, null);

				if (j < n) {
					n = j;
					cell = i;
				}

				if (n == 1)
					break;
			}
		}

		return cell;
	}

	solve(matrix: any[]) {
		var i, j, ret = 0;
		var cell = this.getCell(matrix);

		if (cell == -1)
			return 1;

		var avail = new Array(9).fill(0);

		j = this.getAvailable(matrix, cell, avail);
		for (i = 0; i < j; i++) {
			matrix[cell] = avail[i];

			if (this.solve(matrix) == 1)
				return 1;
		}

		matrix[cell] = 0;
		return 0;
	}

}



/* var su = new Sudoku();
su._newGame();


var arrayWrapper = [];
if( su.matrix ){
	var chunk = 9;

	for(let i = 0, j = su.matrix.length; i < j; i+=chunk){
		let tempArray = su.matrix.slice( i, i+chunk);
		arrayWrapper.push(tempArray)
	}
}

console.info(arrayWrapper)



var arrayWrapper2 = [];
if (su.save) {
	var chunk = 9;

	for (let i = 0, j = su.save.length; i < j; i += chunk) {
		let tempArray = su.save.slice(i, i + chunk);
		arrayWrapper2.push(tempArray)
	}
}

console.info(arrayWrapper2) */


