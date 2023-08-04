import { DataFrame } from '../dataFrame/dataFrame';
import { readCSV } from '../dataFrame/read/dataFrameRead';

// Example usage:
const df = await readCSV('../../oscar_age_male.csv');

const firstRows = df.showFirstRows(10);
console.log('First 3 Rows:');
console.log(firstRows);

// Display the last 2 rows (default is 5 if no input is given)
const lastRows = df.showLastRows(2);
console.log('Last 2 Rows:');
console.log(df.getColumnDataTypes());