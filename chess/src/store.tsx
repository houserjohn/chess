import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const reducer = (
  state: { board: any },
  action: { type: string; payload: string }
) => {
  // The reducer normally looks at the action type field to decide what happens
  switch (action.type) {
    // Do something here based on the different types of actions
    case "board/set": {
      return {
        ...state,
        board: action.payload,
      };
    }

    case "game/set": {
      return {
        ...state,
        game: action.payload,
      };
    }

    case "tiles/set": {
      return {
        ...state,
        tiles: action.payload,
      };
    }

    case "path/set_grid": {
      return {
        ...state,
        grid: action.payload,
      };
    }

    case "path/set_alg": {
      return {
        ...state,
        alg: action.payload,
      };
    }

    case "txt/set_txt": {
      // We need to return a new state object
      return {
        // that has all the existing state data
        ...state,
        txt: action.payload,
      };
    }
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state;
  }
};

// let chess_board: any = [];
// for (let i = 0; i < 8; i++) {
//   chess_board.push([]);
//   for (let j = 0; j < 8; j++) {
//     chess_board[i].push(j);
//   }
// }

const store = createStore(
  reducer as any,
  undefined, // board: chess_board },
  composeWithDevTools()
);

export default store;
