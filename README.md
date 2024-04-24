# My TypeScript Command-Line Application

This is a TypeScript command-line application with an interactive prompt and console colors. It allows users to pick from a list of commands and execute different actions.

## Project Structure

```
my-ts-app
├── src
│   ├── app.ts
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

To install the required dependencies, run the following command:

```
npm install
```

## Development Mode

To run the application in development mode, use the following command:

```
npm run dev
```

This command uses `nodemon` and `ts-node` to automatically restart the application whenever changes are made to the source files.

## Build

To build the application, use the following command:

```
npm run build
```

This command compiles the TypeScript code into JavaScript and outputs the compiled files in the `dist` directory.

## Usage

To start the application, use the following command:

```
npm start
```

This command runs the compiled JavaScript code using `node`.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
```

Please note that you may need to modify the commands in the `scripts` section of the `package.json` file based on your specific requirements.