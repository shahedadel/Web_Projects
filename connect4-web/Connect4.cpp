using namespace std;
#include <iostream>
#include <string>
#include <stdexcept>
#include "Connect4.h"

int main()
{
    Connect4 round1;
    round1.printBoard();

    while (!round1.isGameOver()) {
        int column;
        char player = round1.getCurrentPlayer();
        cout << "Player " << player << ", choose a column (0-" << round1.getColumns() - 1 << "): ";
        cin >> column;

        try {
            round1.dropPiece(column);
            round1.printBoard();

            if (round1.winner()) {
                cout << "Player " << player << " wins!" << endl;
                break;

            }
        }
        catch (const invalid_argument& error) {
            cerr << "Error: " << error.what() << endl;
        }
    }
    if (!round1.winner()) {
        cout << "This game is tied!" << endl;
    }
}
