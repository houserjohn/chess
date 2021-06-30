import React from "react";
import styled from "styled-components";

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
  cursor: grab;
  ${(p) => (p.color === "white" ? "filter: invert(100%)" : "")}
`;

interface Piece_Props {
  color: string;
  piece_type: string;
}

// window.addEventListener("mousedown", (e) => {
//   console.log("hello");
// });

function Piece(props: Piece_Props) {
  function click(e: any) {
    e.preventDefault();
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
