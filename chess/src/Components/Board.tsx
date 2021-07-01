import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import store from "../store";
import Game from "../Game";

import Tile from "./Tile";

// Create the game
let game: any = new Game();
game.reset();
store.dispatch({
  type: "game/set",
  payload: game,
});

const BOARD = styled.table`
  margin: auto;
  border: 0px solid black;
  border-spacing: 0px;
  padding: 5px;
  outline-style: none;
`;

const TBODY = styled.tbody``;

const TR = styled.tr`
  border: 1px solid black;
`;

interface state {
  board: any;
  tiles: any;
}
//   <TD key={r * 9 + c} tile_color={col}>
//     <Piece color="black" piece_type="rook" />
//   </TD>

// Note: for flipped board just do 10 9 8 ...

function Board() {
  const board: any = useSelector((state: state) => state.board);
  const tiles: any = useSelector((state: state) => state.tiles);
  return (
    <BOARD>
      <TBODY>
        {board.map((v: any, r: any) => {
          return (
            <TR key={r}>
              {v.map((t: any, c: any): any => {
                //let color = "white";
                //if ((r * 9 + c) % 2) {
                // color = "green";
                //}
                return (
                  <Tile
                    key={r * 9 + c}
                    tile_color={tiles[r][c]}
                    board={board}
                    row={r}
                    col={c}
                  />
                );
              })}
            </TR>
          );
        })}
      </TBODY>
    </BOARD>
  );
}

export default Board;
