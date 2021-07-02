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

class Piece {
  piece_type: string;
  color: string;
  row: number;
  col: number;
  has_moved: boolean;
  constructor() {
    this.piece_type = "";
    this.color = "";
    this.row = -1;
    this.col = -1;
    this.has_moved = false;
  }

  // Each piece will handle this differently
  is_valid_move(row: number, col: number) {
    return true;
  }

  show_available_moves() {
    let tiles: any = [];
    get_default_tiles(tiles);

    let moves: any = [];
    this.get_available_moves(moves);

    for (let move of moves) {
      tiles[move[0]][move[1]] = "blue";
    }
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
  }

  is_valid_move(row: number, col: number) {
    let board: any = get_board();
    if (this.color === "white") {
      if (row === this.row - 1) {
        return true;
      }
    }
    return false;
  }

  get_available_moves(moves: any) {
    moves.push([this.row - 1, this.col]);
    moves.push([this.row - 2, this.col]);
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
  }
}

class Knight extends Piece {
  constructor(color: string, row: number, col: number) {
    super();
    this.piece_type = "knight";
    this.color = color;
    this.row = row;
    this.col = col;
  }
}

class Bishop extends Piece {
  constructor(color: string, row: number, col: number) {
    super();
    this.piece_type = "bishop";
    this.color = color;
    this.row = row;
    this.col = col;
  }
}

class Queen extends Piece {
  constructor(color: string, row: number, col: number) {
    super();
    this.piece_type = "queen";
    this.color = color;
    this.row = row;
    this.col = col;
  }
}

class King extends Piece {
  constructor(color: string, row: number, col: number) {
    super();
    this.piece_type = "king";
    this.color = color;
    this.row = row;
    this.col = col;
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
