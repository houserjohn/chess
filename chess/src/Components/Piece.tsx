import React from "react";
import styled from "styled-components";
import store from "../store";

interface Props {
  tile_color?: string;
  white?: any;
  piece_type?: string;
}

const PIECE = styled.p<Props>`
  background-image: ${(p) => "url('pieces/" + p.piece_type + ".png')"};
  background-size: cover;
  width: 100%;
  height: 100%;
  &:hover {
    cursor: grab;
  }
  &:active {
    cursor: grabbing;
  }
  ${(p) => (p.color === "white" ? "filter: invert(100%)" : "")}
`;

interface Piece_Props {
  color: string;
  piece_type: string;
  row: number;
  col: number;
}

// window.addEventListener("mousedown", (e) => {
//   console.log("hello");
// });

function Piece(props: Piece_Props) {
  const saved_state: any = store.getState();
  const game = saved_state["game"];

  function click(e: any) {
    e.preventDefault();
    game.select_piece(props.row, props.col);
    //document.body.style.cursor = "crosshair";
  }

  function release(e: any) {
    e.preventDefault();
    //document.body.style.cursor = "crosshair";
  }
  /*
      onMouseDown={click}
      onMouseUp={click}
      */
  return (
    <PIECE
      onMouseDown={click}
      onMouseUp={release}
      color={props.color}
      piece_type={props.piece_type}
    />
  );
}

export default Piece;
