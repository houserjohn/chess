import React from "react";
import styled from "styled-components";
import store from "../store";

import Piece from "./Piece";

interface Props {
  tile_color: string;
  board: [any];
  row: number;
  col: number;
}

interface TD_Props {
  tile_color: string;
}

// table detail
const TD = styled.td<TD_Props>`
  border: 1px solid black;
  padding: 0px;
  margin: 0px;
  background: ${(p) => p.tile_color || "green"};
  height: 50px;
  width: 50px;
`;

// const TileNumber = styled.td<Props>`
//   border: 1px solid black;
//   padding: 0px;
//   margin: 0px;
//   background: ${(p) => p.tile_color || "green"};
//   height: 50px;
//   width: 50px;
// `;

window.addEventListener("mouseup", (e) => {
  const saved_state: any = store.getState();
  const game = saved_state["game"];
  document.body.style.cursor = "auto";
  game.unselect_piece();
  //console.log("mouse left released window");
});

function Tile(props: Props) {
  const piece_here: any = props.board[props.row][props.col];
  const saved_state: any = store.getState();
  const game = saved_state["game"];

  function click(e: any) {
    e.preventDefault();
    //console.log("Hello");
    //game.select_piece();
    //document.body.style.cursor = "crosshair";
  }

  function release(e: any) {
    e.preventDefault();
    game.attempt_move_piece(props.row, props.col);
    //console.log("Bye");
    //document.body.style.cursor = "crosshair";
  }

  return (
    <TD tile_color={props.tile_color} onMouseDown={click} onMouseUp={release}>
      {piece_here !== null && (
        <Piece
          color={piece_here.color}
          piece_type={piece_here.piece_type}
          row={props.row}
          col={props.col}
        />
      )}
    </TD>
  );
}

export default Tile;
