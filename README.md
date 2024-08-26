# TurnBasedGame `README.md` 

```markdown
# Hitwicket Assignment - Turn-Based Chess-Like Game

This project is a turn-based chess-like game with a server-client architecture, utilizing WebSockets for real-time communication and a web-based user interface. The game features a 5x5 grid and three types of characters (Pawn, Hero1, Hero2), each with specific movement and combat rules.

## Features

- 5x5 Grid: A compact game board for strategic play.
- Three Character Types: 
  - Pawn:Basic movement and attack capabilities.
  - Hero1: Advanced movement and combat abilities.
  - Hero2: Special abilities with strategic advantages.
  - Real-Time Communication:Implemented using WebSockets for smooth interaction between players.
  - Web-Based Interface:Accessible via any modern web browser.

## Bonus Features

- Hero3 Implementation: Additional character with unique abilities.
- Dynamic Team Composition: Flexibility in selecting team members.
- Dark and Light Mode: Toggle between light and dark modes for better user experience.

## Installation and Setup

Follow these steps to get the project up and running on your local machine:

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- A modern web browser.
```
### Downloading the Project

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/hitwicket-assignment.git
   ```

2. Navigate to the project directory:
   ```bash
   cd hitwicket-assignment/software
   ```

### Installing Dependencies

Install the required Node.js packages using npm:

```bash
npm install
```

### Running the Server

1. Start the server:
   ```bash
   node server.js
   ```

   By default, the server will run on `http://localhost:8080`.

2. Open your web browser and go to `http://localhost:8080` to access the game.

### Troubleshooting

If you encounter an `EADDRINUSE` error (address already in use), it means port `8080` is already occupied. You can resolve this by either:

- Stopping the process currently using port `8080` (see the steps below).
- Changing the port in the `server.js` file to another available port (e.g., `8081`).

#### Stopping the Process Using Port 8080

##### On Windows:

1. Find the process using the port:
   ```bash
   netstat -ano | findstr :8080
   ```
2. Kill the process:
   ```bash
   taskkill /PID <PID> /F
   ```

##### On macOS or Linux:

1. Find the process using the port:
   ```bash
   lsof -i :8080
   ```
2. Kill the process:
   ```bash
   kill -9 <PID>
   ```

## Project Structure

- **public/** - Contains the static assets including `index.html`, styles, and client-side JavaScript.
- **server.js** - The main server file handling HTTP requests and WebSocket communication.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

If you have suggestions or improvements, feel free to fork the repository, make your changes, and submit a pull request. Contributions are welcome!

## Contact

For any questions or issues, please open an issue on GitHub or contact me directly at [rohith.xyz].

---

**Author:** Juluru Venkata Lakshmi Sai Rohith
