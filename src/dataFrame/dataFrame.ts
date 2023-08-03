import { DataFrameRow } from './dataFrameRow';

export class DataFrame {
    private data: DataFrameRow[];
    private columns: string[];

    constructor(data: DataFrameRow[] = [], columns: string[] = []) {
        this.data = data;
        this.columns = columns;
    }

    public static createStatic(data: DataFrameRow[], columns: string[]): DataFrame {
        return new DataFrame(data, columns);
    }

    public addRow(row: DataFrameRow): void {
        this.data.push(row);
    }

    public addColumn(name: string, values: (number | string | boolean)[]): void {
        if (values.length !== this.data.length) {
            throw new Error('Number of values must match the number of rows.');
        }

        this.columns.push(name);
        for (let i = 0; i < values.length; i++) {
            this.data[i][name] = values[i];
        }
    }

    public getRows(): DataFrameRow[] {
        return this.data;
    }

    public getColumns(): string[] {
        return this.columns;
    }

    public getDataFrame(): DataFrameRow[] {
        return this.data;
    }

    public getShape(): [number, number] {
        return [this.data.length, this.columns.length];
    }

    public filterByColumn(columnName: string, value: number | string | boolean): DataFrameRow[] {
        return this.data.filter(row => row[columnName] === value);
    }

    public showFirstRows(n: number = 5): DataFrameRow[] {
        return this.data.slice(0, n);
    }

    public showLastRows(n: number = 5): DataFrameRow[] {
        return this.data.slice(-n);
    }

    public getColumnDataTypes(): { [key: string]: string } {
        const columnDataTypes: { [key: string]: string } = {};

        this.columns.forEach((column) => {
            // Initialize data types for each column
            columnDataTypes[column] = 'unknown';

            // Determine the data type for the current column
            for (const row of this.data) {
                if (typeof row[column] === 'number') {
                    columnDataTypes[column] = 'number';
                } else if (typeof row[column] === 'string') {
                    columnDataTypes[column] = 'string';
                } else if (typeof row[column] === 'boolean') {
                    columnDataTypes[column] = 'boolean';
                }
                // Add more checks for additional data types as needed (e.g., Date, object, etc.)
            }
        });

        return columnDataTypes;
    }

    public renameColumn(currentName: string, newName: string): void {
        const columnIndex = this.columns.indexOf(currentName);
        if (columnIndex !== -1) {
            this.columns[columnIndex] = newName;
        } else {
            throw new Error(`Column "${currentName}" does not exist.`);
        }
    }

    public dropColumn(columnName: string): void {
        const columnIndex = this.columns.indexOf(columnName);
        if (columnIndex !== -1) {
            this.columns.splice(columnIndex, 1);
            for (const row of this.data) {
                delete row[columnName];
            }
        } else {
            throw new Error(`Column "${columnName}" does not exist.`);
        }
    }

    public selectColumns(selectedColumns: string[]): DataFrame {
        const selectedData: DataFrameRow[] = this.data.map((row) => {
            const selectedRow: DataFrameRow = {};
            selectedColumns.forEach((column) => {
                if (this.columns.includes(column)) {
                    selectedRow[column] = row[column];
                }
            });
            return selectedRow;
        });

        return DataFrame.createStatic(selectedData, selectedColumns);
    }

    public where(...conditions: string[]): DataFrame {
        const filteredData: DataFrameRow[] = this.data.filter((row) => this.evaluateConditions(row, conditions));
        return DataFrame.createStatic(filteredData, this.columns);
    }

    private evaluateConditions(row: DataFrameRow, conditions: string[]): boolean {
        const expression = conditions.join(' && ');
        const keys = Object.keys(row);
        const values = Object.values(row);

        try {
            return eval(expression);
        } catch (error) {
            throw new Error('Invalid condition.');
        }
    }

    public sortBy(columns: string[], directions: 'asc' | 'desc' | ('asc' | 'desc')[]): DataFrame {
        const sortedData: DataFrameRow[] = this.data.slice();

        sortedData.sort((row1, row2) => {
            for (const column of columns) {
                const direction = Array.isArray(directions) ? directions[columns.indexOf(column)] : directions;
                const aValue = row1[column];
                const bValue = row2[column];

                if (aValue === bValue) continue;

                if (direction === 'asc') {
                    return aValue < bValue ? -1 : 1;
                } else {
                    return aValue > bValue ? -1 : 1;
                }
            }
            return 0;
        });

        return DataFrame.createStatic(sortedData, this.columns);
    }

    public mean(column?: string): number {
        if (column) {
            const columnData = this.data.map((row) => row[column]);
            const sum = columnData.reduce((acc, value) => {
                if (typeof value === "number" && typeof acc === "number") { return acc + value; }
                return 0;
            }, 0);
            if (typeof sum === "number") return sum / columnData.length;
            return 0;
        } else {
            const allData = this.data.reduce((acc, row) => {
                Object.values(row).forEach((value) => {
                    if (typeof value === "number" && typeof acc.sum === "number" && typeof acc.count === "number") {
                        acc.sum += value;
                        acc.count += 1;
                    }
                });
                return acc;
            }, { sum: 0 as number, count: 0 as number });
            return (allData.count as number) > 0 ? (allData.sum as number) / (allData.count as number) : NaN;
        }
    }

    public median(column?: string): number {
        if (column) {
            const columnData = this.data.map((row) => row[column]).filter((value) => typeof value === 'number');
            const sortedData = columnData.slice().sort((a, b) => (a as number) - (b as number));
            const length = sortedData.length;
            const mid = Math.floor(length / 2);

            if (length % 2 === 0) {
                return ((sortedData[mid - 1] as number) + (sortedData[mid] as number)) / 2;
            } else {
                return sortedData[mid] as number;
            }
        } else {
            const allData = this.data.reduce((acc, row) => {
                Object.values(row).forEach((value) => {
                    if (typeof value === 'number') {
                        acc.sortedData.push(value);
                    }
                });
                return acc;
            }, { sortedData: [] as number[] });

            const sortedData = allData.sortedData.sort((a, b) => a - b);
            const length = sortedData.length;
            const mid = Math.floor(length / 2);

            if (length % 2 === 0) {
                return (sortedData[mid - 1] + sortedData[mid]) / 2;
            } else {
                return sortedData[mid];
            }
        }
    }

    public mode(column?: string): any | any[] {
        if (column) {
            const columnData = this.data.map((row) => row[column]);
            const countMap = new Map();
            let maxCount = 0;
            let modeValue: any;

            for (const value of columnData) {
                const count = (countMap.get(value) || 0) + 1;
                countMap.set(value, count);

                if (count > maxCount) {
                    maxCount = count;
                    modeValue = value;
                }
            }

            return modeValue;
        } else {
            const allData = this.data.reduce((acc, row) => {
                Object.values(row).forEach((value) => {
                    if (acc.countMap.has(value)) {
                        acc.countMap.set(value, acc.countMap.get(value) + 1);
                    } else {
                        acc.countMap.set(value, 1);
                    }

                    if (acc.countMap.get(value) > acc.maxCount) {
                        acc.maxCount = acc.countMap.get(value);
                        acc.modes = [value];
                    } else if (acc.countMap.get(value) === acc.maxCount) {
                        acc.modes.push(value);
                    }
                });
                return acc;
            }, { countMap: new Map(), maxCount: 0, modes: [] as (string | boolean | number)[] });

            return allData.modes;
        }
    }

    public std(column?: string): number {
        if (column) {
            const columnData = this.data.map((row) => row[column]).filter((value) => typeof value === 'number');
            const mean = columnData.reduce((acc, value) => (acc as number) + (value as number), 0) as number / columnData.length as number;
            const squaredDifferencesSum = columnData.reduce((acc, value) => (acc as number) + Math.pow((value as number) - mean, 2), 0) as number;
            const variance = squaredDifferencesSum / columnData.length;
            return Math.sqrt(variance);
        } else {
            const allData = this.data.reduce((acc, row) => {
                Object.values(row).forEach((value) => {
                    if (typeof value === 'number') {
                        acc.columnData.push(value);
                    }
                });
                return acc;
            }, { columnData: [] as number[] });

            const mean = allData.columnData.reduce((acc, value) => acc + value, 0) / allData.columnData.length;
            const squaredDifferencesSum = allData.columnData.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0);
            const variance = squaredDifferencesSum / allData.columnData.length;
            return Math.sqrt(variance);
        }
    }

}
