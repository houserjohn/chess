# Chess with AI

Web implementation of chess including an AI opponent

## Technologies used

React, Redux, TypeScript, HTML, CSS, JS, Styled Components

## My Development Notes

I developed this project on Windows 10 using WSL 2. Therefore, for Windows users, it is recommended to use WSL 2 with VScode to avoid as many problems as possible when following these instructions.  
Problems I encountered during this project using WSL2:

- [NPM start may not update on page refresh so add CHOKIDAR_USEPOLLING=true.](https://stackoverflow.com/questions/45553302/npm-start-not-refreshing-new-content-on-save-on-one-computer-but-is-on-another)
- [TypeScript interfering with Styled Components props](https://stackoverflow.com/questions/47077210/using-styled-components-with-props-and-typescript)

### Installing NPM

Before continuing, open up the terminal in VScode using ctrl+` and make sure you are using WSL 2 in the terminal.

```
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

### Creating a React app with Typescript

```
npx create-react-app my-app --template typescript
```

### Before Continuing, Change Directory

Run the following command before the next steps:

```
cd my-app
```

### Introducing Redux into our app

```
npm install --save redux @types/redux
npm install --save react-redux @types/react-redux
npm install --save-dev redux-devtools-extension
```

### Installing styled components in our app

```
npm install --save styled-components @types/styled-components
```

### Displaying our app

```
npm start
```
