import React from "react";
import styled from "styled-components";

import Board from "./Components/Board";

const TITLE = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

function Chess() {
  return (
    <div>
      <TITLE>Chessboard</TITLE>
      <Board />
    </div>
  );
}

export default Chess;
