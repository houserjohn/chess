import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Tile from "./Tile";

const BOARD = styled.table`
  margin: auto;
  border: 1px solid black;
  border-spacing: 0px;
`;

const TBODY = styled.tbody``;

const TR = styled.tr`
  border: 1px solid black;
`;

interface state {
  board: any;
}
//   <TD key={r * 9 + c} tile_color={col}>
//     <Piece color="black" piece_type="rook" />
//   </TD>

function Board() {
  const board: any = useSelector((state: state) => state.board);
  return (
    <BOARD>
      <TBODY>
        {board.map((v: any, r: any) => {
          return (
            <TR key={r}>
              {v.map((t: any, c: any): any => {
                let color = "white";
                if ((r * 9 + c) % 2) {
                  color = "green";
                }
                return (
                  <Tile
                    key={r * 9 + c}
                    tile_color={color}
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
