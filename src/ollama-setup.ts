import http from 'http';
import chalk from 'chalk';

const payload = JSON.stringify({
    name: 'llama3'
});

const options = {
    hostname: process.env.OLLAMA_HOST || 'localhost',
    port: process.env.OLLAMA_PORT || 11434,
    path: '/api/pull',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
    }
};

console.log(chalk.bgYellow('***') + ' ' + chalk.green(' Pulling LLama3 model (4.7GB) it make take several minutes. Please wait... ') + chalk.bgYellow('***\r\n'));

const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(chunk);
    });
    res.on('error', (error) => {
        console.error(chalk.bgRed('***') + chalk.white('An error occurred while pulling LLama3 model. ') + chalk.bgRed('***'))
        console.error(error);
    });
});
req.write(payload);

req.on('error', (error) => {
    console.error(chalk.bgRed('***') + chalk.white('An error occurred while pulling LLama3 model. ') + chalk.bgRed('***'))
    console.error(error);
});

req.on('response', (res) => {
    if (res.statusCode === 400) {
        console.error(chalk.bgRed('***') + chalk.white('Bad request. ') + chalk.bgRed('***'));
    } else if (res.statusCode === 404) {
        console.error(chalk.bgRed('***') + chalk.white('Resource not found. ') + chalk.bgRed('***'));
    }
});

//req.write(payload);
req.end();