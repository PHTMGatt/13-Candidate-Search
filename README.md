Candidate Search

Description

Candidate Search is a React application built with TypeScript that interacts with the GitHub API to help employers find potential candidates. The application allows users to browse through GitHub profiles, accept or reject candidates, and store selected candidates for future reference. The project demonstrates the use of TypeScript in React to enhance maintainability, reliability, and scalability.

Table of Contents

Installation

Usage

Features

Screenshots

Technologies Used

Deployment

Contributing

License

Installation

Clone the repository:

git clone https://github.com/your-username/candidate-search.git

Navigate to the project directory:

cd candidate-search

Install dependencies:

npm install

Create a .env file in the project root and add your GitHub Personal Access Token:

VITE_GITHUB_TOKEN=your_personal_access_token

Usage

Start the development server:

npm run dev

Open the application in your browser at http://localhost:5173 (or the specified port).

Use the interface to browse candidates, accept or reject them, and view saved candidates.

Features

Fetches candidate data from the GitHub API.

Displays candidate details, including name, username, location, avatar, email, profile URL, and company.

Allows users to accept candidates (+ button) or reject them (- button).

Saves selected candidates to local storage.

Displays a list of saved candidates on the Potential Candidates page.

Persists saved candidates across page reloads.

Displays an appropriate message when no candidates are available.

(Bonus) Sorting and filtering functionality for potential candidates.

Screenshots

Candidate Search Page



Potential Candidates Page



Technologies Used

React

TypeScript

Vite

GitHub API

Local Storage

CSS

Deployment

The application is deployed using Render. To deploy your own version:

Push the project to a GitHub repository.

Follow the Render deployment guide to create and deploy a React application.

Set up your environment variable (VITE_GITHUB_TOKEN) in Render.

Contributing

Contributions are welcome! To contribute:

Fork the repository.

Create a new branch:

git checkout -b feature-branch

Make your changes and commit them:

git commit -m "Add new feature"

Push your branch:

git push origin feature-branch

Submit a pull request.

License

This project is licensed under the MIT License.
