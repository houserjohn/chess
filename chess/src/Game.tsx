// The game class that handles all of the logic
import store from "./store";

// returns default tiles that you can manipulate
const get_default_tiles = (tiles: any): any => {
  for (let i = 0; i < 8; i++) {
    tiles.push([]);
    for (let j = 0; j < 8; j++) {
      let color = "white";
      if ((i * 9 + j) % 2) {
        color = "green";
      }
      tiles[i].push(color);
    }
  }
  return tiles;
};

const reset_tiles = (): any => {
  // generate the tiles colors
  let tiles: any = [];
  get_default_tiles(tiles);
  store.dispatch({
    type: "tiles/set",
    payload: tiles,
  });
};

const get_board = () => {
  let state: any = store.getState();
  let board = state["board"];
  return board;
};

// maybe consider just passing this around
const get_tile_number_from_row_and_col = (row: number, col: number): number => {
  return 8 * row + col;
};

const get_row_and_col_from_tile_number = (tile_number: number): any => {
  let row: number = Math.floor(tile_number / 8);
  let col: number = tile_number % 8;
  return { row: row, col: col };
  /*
  row = math.floor(i/8)
  col = i%8
  */
};

class Piece {
  piece_type: string;
  color: string;
  row: number;
  col: number;
  has_moved: boolean;
  available_moves: any;
  constructor() {
    this.piece_type = "";
    this.color = "";
    this.row = -1;
    this.col = -1;
    this.has_moved = false;
  }

  // Returns true if valid row and col (e.g. not -1 or 9 for row/col)
  is_valid_tile(row: number, col: number) {
    if (row > 7 || row < 0) {
      return false;
    }
    if (col > 7 || col < 0) {
      return false;
    }
    return true;
  }
  /*
  // Each piece will handle this differently
  is_valid_move(row: number, col: number) {
    return true;
  }
  */

  // returns true if row, col is a valid move
  is_valid_move(row: number, col: number) {
    //let board: any = get_board();
    //if (this.color === "white") {
    let tile_number: number = get_tile_number_from_row_and_col(row, col);
    if (tile_number in this.available_moves) {
      // available_moves was precomputed when user clicked piece
      return true;
    }
    /*
      if (row === this.row - 1) {
        return true;
      }*/
    //}
    return false;
  }

  // Returns enemy color
  get_opponent_color() {
    if (this.color === "white") {
      return "black";
    }
    return "white";
  }

  show_available_moves() {
    let tiles: any = [];
    get_default_tiles(tiles);

    let moves: any = {};
    this.get_available_moves(moves);

    for (const move in moves) {
      let rowcol: any = get_row_and_col_from_tile_number(parseInt(move));
      let row: number = rowcol["row"];
      let col: number = rowcol["col"];
      if (moves[move] === "move") {
        tiles[row][col] = "blue";
      } else {
        tiles[row][col] = "red";
      }
    }

    /*
    for (let move of moves) {
      tiles[move[0]][move[1]] = "blue";
    }
    */
    /*
    for (let i = 0; i < 8; i++) {
      tiles[0][i] = "blue";
    }
    */

    //let moves: any = this.get_available_moves();
    /*
    console.log("hello");
    for (let move in moves) {
      tiles[move[0]][move[1]] = "blue";
      console.log(move[0] + ", " + move[1]);
    }
    */
    store.dispatch({
      type: "tiles/set",
      payload: tiles,
    });
  }

  get_available_moves(moves: any) {}

  move(row: number, col: number, old_loc: any) {
    if (old_loc.row !== row || old_loc.col !== col) {
      if (this.is_valid_move(row, col)) {
        this.has_moved = true;
        let old_board: any = get_board();
        let new_board: any = [];
        copy_chessboard(old_board, new_board);
        new_board[row][col] = new_board[old_loc.row][old_loc.col];
        new_board[old_loc.row][old_loc.col] = null;
        this.row = row;
        this.col = col;

        store.dispatch({
          type: "board/set",
          payload: new_board,
        });
        //console.log("dispatched");
      }
    }
  }
}

class Pawn extends Piece {
  constructor(color: string, row: number, col: number) {
    super();
    this.piece_type = "pawn";
    this.color = color;
    this.row = row;
    this.col = col;
    this.available_moves = null;
  }

  // this will return -1 for white and 1 for black (so they move towards eachother)
  get_forward_move() {
    if (this.color === "black") {
      return 1;
    }
    return -1;
  }

  /*
  // returns true if row, col is a valid move
  is_valid_move(row: number, col: number) {
    //let board: any = get_board();
    //if (this.color === "white") {
    let tile_number: number = get_tile_number_from_row_and_col(row, col);
    if (tile_number in this.available_moves) {
      // available_moves was precomputed when user clicked piece
      return true;
    }
    /*
      if (row === this.row - 1) {
        return true;
      }*/
  //}
  //return false;
  //}

  // returns dictionary of tile_number to boolean (maybe consider the color there or piece)
  get_available_moves(moves: any) {
    let board: any = get_board();

    // moving one step forward
    let row: number = this.row + this.get_forward_move();
    let col: number = this.col;
    if (this.is_valid_tile(row, col) && board[row][col] == null) {
      moves[get_tile_number_from_row_and_col(row, col)] = "move";

      // moving two steps forward
      row = this.row + 2 * this.get_forward_move();
      col = this.col;
      if (
        this.is_valid_tile(row, col) && // not an invalid tile
        board[row][col] == null && // no piece is there
        !this.has_moved // hasn't moved already
      ) {
        moves[get_tile_number_from_row_and_col(row, col)] = "move";
      }
    }

    // taking diagonally left and right
    for (let i = -1; i <= 1; i += 2) {
      row = this.row + this.get_forward_move();
      col = this.col + i;
      if (
        this.is_valid_tile(row, col) && // valid tile
        board[row][col] !== null && // if a piece is there
        board[row][col].color === this.get_opponent_color() // make sure it is enemy
      ) {
        moves[get_tile_number_from_row_and_col(row, col)] = "take";
      }
    }

    // todo add en passant

    // create a dictionary for each available
    this.available_moves = moves; // cache available moves
    return moves;
  }

  /*
  // must have this for game to be able to call it
  show_available_moves() {
    console.log("Hello");
  }*/
}

class Rook extends Piece {
  constructor(color: string, row: number, col: number) {
    super();
    this.piece_type = "rook";
    this.color = color;
    this.row = row;
    this.col = col;
    this.available_moves = null;
  }

  check_rook_move(
    row: number,
    col: number,
    board: any,
    moves: any,
    callback_while: any
  ) {
    let rowcol: any = callback_while(row, col);
    row = rowcol["row"];
    col = rowcol["col"];
    while (this.is_valid_tile(row, col) && board[row][col] == null) {
      moves[get_tile_number_from_row_and_col(row, col)] = "move";

      let rowcol: any = callback_while(row, col);
      row = rowcol["row"];
      col = rowcol["col"];
    }

    // checking if can take
    if (
      this.is_valid_tile(row, col) &&
      board[row][col] !== null &&
      board[row][col].color === this.get_opponent_color()
    ) {
      moves[get_tile_number_from_row_and_col(row, col)] = "take";
    }
  }

  // returns dictionary of tile_number to boolean (maybe consider the color there or piece)
  get_available_moves(moves: any) {
    let board: any = get_board();

    // up direction
    let up_move = (row: number, col: number): any => {
      return { row: row - 1, col: col };
    };
    this.check_rook_move(this.row, this.col, board, moves, up_move);

    // left direction
    let left_move = (row: number, col: number): any => {
      return { row: row, col: col - 1 };
    };
    this.check_rook_move(this.row, this.col, board, moves, left_move);

    // right direction
    let right_move = (row: number, col: number): any => {
      return { row: row, col: col + 1 };
    };
    this.check_rook_move(this.row, this.col, board, moves, right_move);

    // down direction
    let down_move = (row: number, col: number): any => {
      return { row: row + 1, col: col };
    };
    this.check_rook_move(this.row, this.col, board, moves, down_move);

    // create a dictionary for each available
    this.available_moves = moves; // cache available moves
    return moves;
  }
}

class Knight extends Piece {
  constructor(color: string, row: number, col: number) {
    super();
    this.piece_type = "knight";
    this.color = color;
    this.row = row;
    this.col = col;
    this.available_moves = null;
  }

  check_knight_move(row: number, col: number, board: any, moves: any) {
    if (this.is_valid_tile(row, col) && board[row][col] === null) {
      moves[get_tile_number_from_row_and_col(row, col)] = "move";
    } else if (
      this.is_valid_tile(row, col) &&
      board[row][col] !== null &&
      board[row][col].color === this.get_opponent_color()
    ) {
      moves[get_tile_number_from_row_and_col(row, col)] = "take";
    }
  }

  // returns dictionary of tile_number to boolean (maybe consider the color there or piece)
  get_available_moves(moves: any) {
    let board: any = get_board();

    let row: number = this.row;
    let col: number = this.col;
    this.check_knight_move(row - 2, col - 1, board, moves);
    this.check_knight_move(row - 2, col + 1, board, moves);
    this.check_knight_move(row - 1, col - 2, board, moves);
    this.check_knight_move(row + 1, col - 2, board, moves);
    this.check_knight_move(row - 1, col + 2, board, moves);
    this.check_knight_move(row + 1, col + 2, board, moves);
    this.check_knight_move(row + 2, col - 1, board, moves);
    this.check_knight_move(row + 2, col + 1, board, moves);

    this.available_moves = moves;
    return moves;
  }
}

class Bishop extends Piece {
  constructor(color: string, row: number, col: number) {
    super();
    this.piece_type = "bishop";
    this.color = color;
    this.row = row;
    this.col = col;
    this.available_moves = null;
  }

  check_bishop_move(
    row: number,
    col: number,
    board: any,
    moves: any,
    callback_while: any
  ) {
    let rowcol: any = callback_while(row, col);
    row = rowcol["row"];
    col = rowcol["col"];
    while (this.is_valid_tile(row, col) && board[row][col] === null) {
      moves[get_tile_number_from_row_and_col(row, col)] = "move";
      let rowcol: any = callback_while(row, col);
      row = rowcol["row"];
      col = rowcol["col"];
    }
    if (
      this.is_valid_tile(row, col) &&
      board[row][col] !== null &&
      board[row][col].color === this.get_opponent_color()
    ) {
      moves[get_tile_number_from_row_and_col(row, col)] = "take";
    }
  }

  // returns dictionary of tile_number to boolean (maybe consider the color there or piece)
  get_available_moves(moves: any) {
    let board: any = get_board();

    let row: number = this.row;
    let col: number = this.col;

    // up-right diagonal
    let up_right = (row: number, col: number): any => {
      return { row: row - 1, col: col + 1 };
    };
    this.check_bishop_move(row, col, board, moves, up_right);

    // up-left diagonal
    let up_left = (row: number, col: number): any => {
      return { row: row - 1, col: col - 1 };
    };
    this.check_bishop_move(row, col, board, moves, up_left);

    // down-right diagonal
    let down_right = (row: number, col: number): any => {
      return { row: row + 1, col: col + 1 };
    };
    this.check_bishop_move(row, col, board, moves, down_right);

    // down-left diagonal
    let down_left = (row: number, col: number): any => {
      return { row: row + 1, col: col - 1 };
    };
    this.check_bishop_move(row, col, board, moves, down_left);

    this.available_moves = moves;
    return moves;
  }
}

class Queen extends Piece {
  constructor(color: string, row: number, col: number) {
    super();
    this.piece_type = "queen";
    this.color = color;
    this.row = row;
    this.col = col;
    this.available_moves = null;
  }

  check_bishop_move(
    row: number,
    col: number,
    board: any,
    moves: any,
    callback_while: any
  ) {
    let rowcol: any = callback_while(row, col);
    row = rowcol["row"];
    col = rowcol["col"];
    while (this.is_valid_tile(row, col) && board[row][col] === null) {
      moves[get_tile_number_from_row_and_col(row, col)] = "move";
      let rowcol: any = callback_while(row, col);
      row = rowcol["row"];
      col = rowcol["col"];
    }
    if (
      this.is_valid_tile(row, col) &&
      board[row][col] !== null &&
      board[row][col].color === this.get_opponent_color()
    ) {
      moves[get_tile_number_from_row_and_col(row, col)] = "take";
    }
  }

  check_rook_move(
    row: number,
    col: number,
    board: any,
    moves: any,
    callback_while: any
  ) {
    let rowcol: any = callback_while(row, col);
    row = rowcol["row"];
    col = rowcol["col"];
    while (this.is_valid_tile(row, col) && board[row][col] == null) {
      moves[get_tile_number_from_row_and_col(row, col)] = "move";

      let rowcol: any = callback_while(row, col);
      row = rowcol["row"];
      col = rowcol["col"];
    }

    // checking if can take
    if (
      this.is_valid_tile(row, col) &&
      board[row][col] !== null &&
      board[row][col].color === this.get_opponent_color()
    ) {
      moves[get_tile_number_from_row_and_col(row, col)] = "take";
    }
  }

  get_available_moves(moves: any) {
    let board: any = get_board();

    let row: number = this.row;
    let col: number = this.col;

    // up-right diagonal
    let up_right = (row: number, col: number): any => {
      return { row: row - 1, col: col + 1 };
    };
    this.check_bishop_move(row, col, board, moves, up_right);

    // up-left diagonal
    let up_left = (row: number, col: number): any => {
      return { row: row - 1, col: col - 1 };
    };
    this.check_bishop_move(row, col, board, moves, up_left);

    // down-right diagonal
    let down_right = (row: number, col: number): any => {
      return { row: row + 1, col: col + 1 };
    };
    this.check_bishop_move(row, col, board, moves, down_right);

    // down-left diagonal
    let down_left = (row: number, col: number): any => {
      return { row: row + 1, col: col - 1 };
    };
    this.check_bishop_move(row, col, board, moves, down_left);

    // up direction
    let up_move = (row: number, col: number): any => {
      return { row: row - 1, col: col };
    };
    this.check_rook_move(row, col, board, moves, up_move);

    // left direction
    let left_move = (row: number, col: number): any => {
      return { row: row, col: col - 1 };
    };
    this.check_rook_move(row, col, board, moves, left_move);

    // right direction
    let right_move = (row: number, col: number): any => {
      return { row: row, col: col + 1 };
    };
    this.check_rook_move(row, col, board, moves, right_move);

    // down direction
    let down_move = (row: number, col: number): any => {
      return { row: row + 1, col: col };
    };
    this.check_rook_move(row, col, board, moves, down_move);

    this.available_moves = moves;
    return moves;
  }
}

class King extends Piece {
  constructor(color: string, row: number, col: number) {
    super();
    this.piece_type = "king";
    this.color = color;
    this.row = row;
    this.col = col;
    this.available_moves = null;
  }

  check_king_move(row: number, col: number, board: any, moves: any) {
    if (this.is_valid_tile(row, col) && board[row][col] === null) {
      moves[get_tile_number_from_row_and_col(row, col)] = "move";
    } else if (
      this.is_valid_tile(row, col) &&
      board[row][col] !== null &&
      board[row][col].color === this.get_opponent_color()
    ) {
      moves[get_tile_number_from_row_and_col(row, col)] = "take";
    }
  }

  get_available_moves(moves: any) {
    let board: any = get_board();

    let row: number = this.row;
    let col: number = this.col;

    // four corners
    this.check_king_move(row + 1, col - 1, board, moves);
    this.check_king_move(row + 1, col + 1, board, moves);
    this.check_king_move(row - 1, col + 1, board, moves);
    this.check_king_move(row - 1, col - 1, board, moves);
    // four sides
    this.check_king_move(row - 1, col, board, moves);
    this.check_king_move(row + 1, col, board, moves);
    this.check_king_move(row, col + 1, board, moves);
    this.check_king_move(row, col - 1, board, moves);

    this.available_moves = moves;
    return moves;
  }
}

const copy_chessboard = (old_board: any, new_board: any): any => {
  for (let i = 0; i < 8; i++) {
    new_board.push([]);
    for (let j = 0; j < 8; j++) {
      new_board[i].push(old_board[i][j]);
    }
  }
  return new_board;
};

const reset_chessboard = (): any => {
  let white_pawns: any = [];
  for (let i = 0; i < 8; i++) {
    white_pawns.push(new Pawn("white", 6, i));
  }
  let black_pawns: any = [];
  for (let i = 0; i < 8; i++) {
    black_pawns.push(new Pawn("black", 1, i));
  }

  // change this eventually so that the pieces are in a separate array that is iterated upon
  let tst: any = [
    [
      new Rook("black", 0, 0),
      new Knight("black", 0, 1),
      new Bishop("black", 0, 2),
      new Queen("black", 0, 3),
      new King("black", 0, 4),
      new Bishop("black", 0, 5),
      new Knight("black", 0, 6),
      new Rook("black", 0, 7),
    ],
    black_pawns,
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    white_pawns,
    [
      new Rook("white", 7, 0),
      new Knight("white", 7, 1),
      new Bishop("white", 7, 2),
      new Queen("white", 7, 3),
      new King("white", 7, 4),
      new Bishop("white", 7, 5),
      new Knight("white", 7, 6),
      new Rook("white", 7, 7),
    ],
  ];
  store.dispatch({
    type: "board/set",
    payload: tst,
  });
};

class Game {
  current_piece: any;
  has_selected_piece: boolean;
  selected_piece_location: any;
  constructor() {
    this.current_piece = null;
    this.has_selected_piece = false;
    this.selected_piece_location = {};
  }

  select_piece(row: number, col: number) {
    this.has_selected_piece = true;
    this.selected_piece_location = { row: row, col: col };
    let board: any = get_board();
    //console.log(board[row][col]);
    board[row][col].show_available_moves();
    //document.body.style.cursor = "grabbing";
  }

  unselect_piece() {
    //console.log("unselect");
    this.has_selected_piece = false;
    let tiles: any = [];
    get_default_tiles(tiles);
    store.dispatch({
      type: "tiles/set",
      payload: tiles,
    });
  }

  // user attempt to move piece
  attempt_move_piece(row: number, col: number) {
    //console.log(row + " " + col);
    //console.log(
    //   this.selected_piece_location.row + " " + this.selected_piece_location.col
    // );

    if (this.has_selected_piece) {
      //console.log("register");
      this.unselect_piece();

      let old_loc: any = this.selected_piece_location;

      //if (old_loc.row !== row || old_loc.col !== col) {
      // can't move into same square
      //console.log("position");
      let old_board: any = get_board();
      old_board[old_loc.row][old_loc.col].move(row, col, old_loc);

      // check if valid move
      //if (old_board[old_loc.row][old_loc.col].is_valid_move(row, col)) {
      //}
    }
  }

  reset() {
    reset_chessboard();

    reset_tiles();
  }
}

export default Game;
