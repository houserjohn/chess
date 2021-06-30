import React from "react";
import styled from "styled-components";

import Board from "./Components/Board";
import Game from "./Game";
import store from "./store";

const TITLE = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Start the game logic
let game: any = new Game();
game.reset();
store.dispatch({
  type: "game/set",
  payload: game,
});

function Chess() {
  return (
    <div>
      <TITLE>Chessboard</TITLE>
      <Board />
    </div>
  );
}

export default Chess;
