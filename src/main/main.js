"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dataFrame_1 = require("../dataFrame/dataFrame");
// Example usage:
var df = new dataFrame_1.DataFrame();
df.addRow({ Index: 1, Year: 1928, Age: 44, Name: 'Emil Jannings', Movie: 'The Last Command' });
df.addRow({ Index: 1, Year: 1929, Age: 41, Name: 'Warner Baxter', Movie: 'The Old Arizona' });
df.addRow({ Index: 1, Year: 1930, Age: 62, Name: 'George Arliss', Movie: 'Disraeli' });
df.addRow({ Index: 1, Year: 1931, Age: 53, Name: 'Lionel Barrymore', Movie: 'A Free Soul' });
var firstRows = df.showFirstRows(10);
console.log('First 3 Rows:');
console.log(firstRows);
// Display the last 2 rows (default is 5 if no input is given)
var lastRows = df.showLastRows(2);
console.log('Last 2 Rows:');
console.log(lastRows);
