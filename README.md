# Face Recognition Attendance System

This project is a face recognition-based attendance system built using React and face-api.js. The primary functionality is to detect and recognize faces from a live webcam feed, recording attendance based on the recognized faces.

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js
- npm

### Installing Dependencies

In the project root directory, run:

```bash
npm install
```

In the `server` directory, run:

```bash
npm install --save-dev nodemon
```

### Running the Application

In the project directory, you can run:

#### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Building the Application

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### Running the Server

To start the server, navigate to the `server` directory and run:

```bash
npm run dev
```

This will start the server using nodemon for automatic restarts on code changes.

### Issues

- **Path Issue**: The path for the `labeled_images` folder couldn't be resolved, so it has to be placed in the `public` folder.
- **Model Loading Time**: Loading the face recognition models can take time. It is recommended to wait for 30 seconds and then reload the website.
- **Database Functions**: 
  - The function to record viewing users in the database has not been added yet.
  - The function to add a user for face recognition has not been added yet.

### Dependencies

- [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- [React Router DOM](https://reactrouter.com/web/guides/quick-start)

### Future Improvements

- **Database Integration**: Implement functionality to record attendance in the database.
- **User Management**: Add functionality to add and manage users for face recognition.
- **Session Management**: Implement session management to check presence/absence within the live stream session.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved [here](https://facebook.github.io/create-react-app/docs/code-splitting).

### Analyzing the Bundle Size

This section has moved [here](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size).

### Making a Progressive Web App

This section has moved [here](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app).

### Advanced Configuration

This section has moved [here](https://facebook.github.io/create-react-app/docs/advanced-configuration).

### Deployment

This section has moved [here](https://facebook.github.io/create-react-app/docs/deployment).

### `npm run build` fails to minify

This section has moved [here](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify).
