# Group Expense Splitter

A simple web application to manage and split expenses within a group. This application allows you to create groups, add participants, record transactions, and calculate who owes whom.

## Features

- **Create and manage groups:** Easily create new groups for different events or purposes.
- **Add and remove participants:** Manage the members of each group.
- **Record transactions:** Add new expenses and specify who paid and for whom.
- **Calculate balances:** Automatically calculate the balance for each participant.
- **View settlements:** See a clear breakdown of who owes whom to settle debts.
- **Local Storage:** Your data is saved in your browser's local storage, so you don't have to worry about losing it.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your system.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/carlo-colombo/cashsplitter-ai.git
    ```
2.  Go into the project directory:
    ```sh
    cd cashsplitter-ai
    ```
3.  Install dependencies:
    ```sh
    npm install
    ```

### Running the Development Server

To start the development server, run the following command:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Building for Production

To create a production build of the application, run:

```sh
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Technologies Used

*   [Preact](https://preactjs.com/) - A fast 3kB alternative to React with the same modern API.
*   [Vite](https://vitejs.dev/) - A next-generation frontend tooling that is fast and lean.
*   [Bulma](https://bulma.io/) - A free, open source CSS framework based on Flexbox.
*   [Vitest](https://vitest.dev/) - A blazing fast unit-test framework powered by Vite.
