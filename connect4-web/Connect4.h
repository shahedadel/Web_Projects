#pragma once
using namespace std;
#include <string>
#include <stdexcept>
#include <vector>

class Connect4 {
private:
	char player;
	vector<vector<char>> board;
	int columns;
	int rows;
	

public:
	Connect4(int rows = 7, int columns = 8) {
		this->rows = rows;
		this->columns = columns;
		player = 'A';
		board = vector<vector<char>>(rows, vector<char>(columns, ' '));
	}

	char getCurrentPlayer() const {
		return player;
	}

	int getColumns() const {
		return columns;
	}

	void dropPiece(int columnNumber) {
		if (columnNumber < 0 || columnNumber >= columns) {
			throw invalid_argument("Column out of bounds!");
		}

		for (int row = rows - 1; row >= 0; row--) {
			if (board[row][columnNumber] == ' ') {
				board[row][columnNumber] = player;

				if (player == 'A') {
					player = 'O';
				}
				else {
					player = 'A';
				}
				return;
			}
		}
		throw invalid_argument("Column is full!");
	}

	void printBoard() {
		for (const auto& row : board) {
			cout << "| ";
			for (char cell : row) {
				cout << cell << " | " << " ";
			}
			cout << endl;
		}
		cout << string(columns * 4, '-') << endl;
		for (int index = 0; index < columns; index++) {
			cout << " " << index + 1 << " ";
		}
		cout << endl;
	}

	bool winnerByColumn() {
		for (int columnNumber = 0; columnNumber < columns; columnNumber++) {
			for (int row = 0; row <= rows - 4; row++) {
				if (board[row][columnNumber] != ' ' &&
					board[row][columnNumber] == board[row + 1][columnNumber] &&
					board[row][columnNumber] == board[row + 2][columnNumber] &&
					board[row][columnNumber] == board[row + 3][columnNumber]) {
					return true;
				}
			}
		}
		return false;
	}

	bool winnerByRow() {
		for (int row = 0; row < rows; row++) {
			for (int columnNumber = 0; columnNumber <= columns - 4; columnNumber++) {
				if (board[row][columnNumber] != ' ' &&
					board[row][columnNumber] == board[row][columnNumber + 1] &&
					board[row][columnNumber] == board[row][columnNumber + 2] &&
					board[row][columnNumber] == board[row][columnNumber + 3]) {
					return true;
				}
			}
		}
		return false;
	}

	bool winnerByDiagonal() {
		for (int row = 0; row <= rows - 4; row++) {     // top right to bottom left
			for (int columnNumber = 0; columnNumber <= columns - 4; columnNumber++) {
				if (board[row][columnNumber] != ' ' &&
					board[row][columnNumber] == board[row + 1][columnNumber + 1] &&
					board[row][columnNumber] == board[row + 2][columnNumber + 2] &&
					board[row][columnNumber] == board[row + 3][columnNumber + 3]) {
					return true;
				}
			}
		}

		for (int row = 3; row < rows; row++) {          // Top-left to bottom-right
			for (int columnNumber = 0; columnNumber <= columns - 4; columnNumber++) {
				if (board[row][columnNumber] != ' ' &&
					board[row][columnNumber] == board[row - 1][columnNumber + 1] &&
					board[row][columnNumber] == board[row - 2][columnNumber + 2] &&
					board[row][columnNumber] == board[row - 3][columnNumber + 3]) {
					return true;
				}
			}
		}

		return false;
	}

	bool winner() {
		return winnerByDiagonal() || winnerByColumn() || winnerByRow();
	}

	bool isGameOver() {
		if (winner()) {
			return true;
		}

		for (vector<char> row : board) {
			for (char column : row) {
				if (column == ' ') {
					return false;
				}
			}
		}
		return true;
	}
};
