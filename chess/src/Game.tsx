// The game class that handles all of the logic
import store from "./store";

class Piece {
  piece_type: string;
  color: string;
  constructor() {
    this.piece_type = "";
    this.color = "";
  }
}

class Pawn extends Piece {
  constructor(color: string) {
    super();
    this.piece_type = "pawn";
    this.color = color;
  }
}

class Rook extends Piece {
  constructor(color: string) {
    super();
    this.piece_type = "rook";
    this.color = color;
  }
}

class Knight extends Piece {
  constructor(color: string) {
    super();
    this.piece_type = "knight";
    this.color = color;
  }
}

class Bishop extends Piece {
  constructor(color: string) {
    super();
    this.piece_type = "bishop";
    this.color = color;
  }
}

class Queen extends Piece {
  constructor(color: string) {
    super();
    this.piece_type = "queen";
    this.color = color;
  }
}

class King extends Piece {
  constructor(color: string) {
    super();
    this.piece_type = "king";
    this.color = color;
  }
}

class Game {
  current_piece: any;
  constructor() {
    this.current_piece = null;
  }

  select_piece() {}

  reset() {
    let white_pawns: any = [];
    for (let i = 0; i < 8; i++) {
      white_pawns.push(new Pawn("white"));
    }
    let black_pawns: any = [];
    for (let i = 0; i < 8; i++) {
      black_pawns.push(new Pawn("black"));
    }

    // change this eventually so that the pieces are in a separate array that is iterated upon
    let tst: any = [
      [
        new Rook("black"),
        new Knight("black"),
        new Bishop("black"),
        new Queen("black"),
        new King("black"),
        new Bishop("black"),
        new Knight("black"),
        new Rook("black"),
      ],
      black_pawns,
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      white_pawns,
      [
        new Rook("white"),
        new Knight("white"),
        new Bishop("white"),
        new Queen("white"),
        new King("white"),
        new Bishop("white"),
        new Knight("white"),
        new Rook("white"),
      ],
    ];
    store.dispatch({
      type: "board/set",
      payload: tst,
    });
  }
}

export default Game;
