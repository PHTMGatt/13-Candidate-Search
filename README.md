# Candidate Search

## Description
Candidate Search is a React application built with TypeScript that interacts with the GitHub API to help employers find potential candidates. The application allows users to browse through GitHub profiles, accept or reject candidates, and store selected candidates for future reference. The project demonstrates the use of TypeScript in React to enhance maintainability, reliability, and scalability.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/candidate-search.git
   ```
2. Navigate to the project directory:
   ```sh
   cd candidate-search
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the project root and add your GitHub Personal Access Token:
   ```sh
   VITE_GITHUB_TOKEN=your_personal_access_token
   ```

## Usage
1. Start the development server:
   ```sh
   npm run dev
   ```
2. Open the application in your browser at `http://localhost:5173` (or the specified port).
3. Use the interface to browse candidates, accept or reject them, and view saved candidates.

## Features
- Fetches candidate data from the GitHub API.
- Displays candidate details, including name, username, location, avatar, email, profile URL, and company.
- Allows users to accept candidates (+ button) or reject them (- button).
- Saves selected candidates to local storage.
- Displays a list of saved candidates on the Potential Candidates page.
- Persists saved candidates across page reloads.
- Displays an appropriate message when no candidates are available.
- (Bonus) Sorting and filtering functionality for potential candidates.

## Screenshots
### Candidate Search Page
![Candidate Search](./assets/screenshots/candidate-search.png)

### Potential Candidates Page
![Potential Candidates](./assets/screenshots/potential-candidates.png)

## Technologies Used
- React
- TypeScript
- Vite
- GitHub API
- Local Storage
- CSS

## Deployment
The application is deployed using Render. To deploy your own version:
1. Push the project to a GitHub repository.
2. Follow the [Render deployment guide](https://render.com/docs) to create and deploy a React application.
3. Set up your environment variable (`VITE_GITHUB_TOKEN`) in Render.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push your branch:
   ```sh
   git push origin feature-branch
   ```
5. Submit a pull request.

## License
This project is licensed under the MIT License.

---

Feel free to update this README with any additional details specific to your project.
