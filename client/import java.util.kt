import java.util.Scanner

class TicTacToe {
    private val board = Array(3) { CharArray(3) { ' ' } }
    private var currentPlayer = 'X'

    fun playGame() {
        var gameOver = false
        val scanner = Scanner(System.`in`)

        while (!gameOver) {
            printBoard()
            println("Player $currentPlayer's turn. Enter row (0-2): ")
            val row = scanner.nextInt()
            println("Enter column (0-2): ")
            val col = scanner.nextInt()

            if (isValidMove(row, col)) {
                board[row][col] = currentPlayer

                if (checkWin(row, col)) {
                    printBoard()
                    println("Player $currentPlayer wins!")
                    gameOver = true
                } else if (checkDraw()) {
                    printBoard()
                    println("It's a draw!")
                    gameOver = true
                } else {
                    currentPlayer = if (currentPlayer == 'X') 'O' else 'X'
                }
            } else {
                println("Invalid move, please try again.")
            }
        }
    }

    private fun isValidMove(row: Int, col: Int): Boolean {
        return row in 0..2 && col in 0..2 && board[row][col] == ' '
    }

    private fun checkWin(row: Int, col: Int): Boolean {
        // Check row
        if (board[row][0] == board[row][1] && board[row][1] == board[row][2] && board[row][0] != ' ')
            return true

        // Check column
        if (board[0][col] == board[1][col] && board[1][col] == board[2][col] && board[0][col] != ' ')
            return true

        // Check diagonals
        if (row == col) {
            // Check main diagonal
            if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != ' ')
                return true
        }

        if (row + col == 2) {
            // Check anti-diagonal
            if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != ' ')
                return true
        }

        return false
    }

    private fun checkDraw(): Boolean {
        for (row in 0 until 3) {
            for (col in 0 until 3) {
                if (board[row][col] == ' ')
                    return false
            }
        }
        return true
    }

    private fun printBoard() {
        for (row in 0 until 3) {
            for (col in 0 until 3) {
                print("${board[row][col]} ")
            }
            println()
        }
        println()
    }
}

fun main() {
    val game = TicTacToe()
    game.playGame()
}

