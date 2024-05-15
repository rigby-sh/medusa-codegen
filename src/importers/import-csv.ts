import fs from 'fs';
import readline from 'readline';

/**
 * Asynchronously opens a CSV file and reads the column names.
 * @param filePath The path to the CSV file.
 * @returns A promise with an array of column names.
 */
async function readColumnNames(filePath: string): Promise<string[]> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const firstLine = await new Promise<string>((resolve, reject) => {
        rl.on('line', (line) => {
            rl.close(); // Close after reading the first line
            resolve(line);
        });
        rl.on('error', reject);
    });

    return firstLine.split(','); // Assumes that the column names are comma-separated
}

/**
 * Converts a CSV line into an object using the provided column names.
 * @param line A line from the CSV file.
 * @param columnNames An array of column names.
 * @returns An object representing the record.
 */
function parseSingleRecord(line: string, columnNames: string[]): Record<string, any> {
    const values = line.split(',');
    const record: Record<string, any> = {};
    columnNames.forEach((columnName, index) => {
        record[columnName] = values[index];
    });
    return record;
}

// Example usage
const filePath = 'path_to_your_file.csv'; // Change to your file path

async function processInput() {
    const columnNames = await readColumnNames(filePath);
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        const record = parseSingleRecord(line, columnNames);
        console.log(record);
    });
}