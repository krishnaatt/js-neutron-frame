export class DataFrame {
    data;
    columns;
    constructor(data = [], columns = []) {
        this.data = data;
        this.columns = columns;
    }
    static createStatic(data, columns) {
        return new DataFrame(data, columns);
    }
    addRow(row) {
        this.data.push(row);
    }
    addColumn(name, values) {
        if (values.length !== this.data.length) {
            throw new Error('Number of values must match the number of rows.');
        }
        this.columns.push(name);
        for (let i = 0; i < values.length; i++) {
            this.data[i][name] = values[i];
        }
    }
    getRows() {
        return this.data;
    }
    getColumns() {
        return this.columns;
    }
    getDataFrame() {
        return this.data;
    }
    getShape() {
        return [this.data.length, this.columns.length];
    }
    filterByColumn(columnName, value) {
        return this.data.filter(row => row[columnName] === value);
    }
    showFirstRows(n = 5) {
        return this.data.slice(0, n);
    }
    showLastRows(n = 5) {
        return this.data.slice(-n);
    }
    getColumnDataTypes() {
        const columnDataTypes = {};
        this.columns.forEach((column) => {
            // Initialize data types for each column
            columnDataTypes[column] = 'unknown';
            // Determine the data type for the current column
            for (const row of this.data) {
                if (typeof row[column] === 'number') {
                    columnDataTypes[column] = 'number';
                }
                else if (typeof row[column] === 'string') {
                    columnDataTypes[column] = 'string';
                }
                else if (typeof row[column] === 'boolean') {
                    columnDataTypes[column] = 'boolean';
                }
                // Add more checks for additional data types as needed (e.g., Date, object, etc.)
            }
        });
        return columnDataTypes;
    }
    renameColumn(currentName, newName) {
        const columnIndex = this.columns.indexOf(currentName);
        if (columnIndex !== -1) {
            this.columns[columnIndex] = newName;
        }
        else {
            throw new Error(`Column "${currentName}" does not exist.`);
        }
    }
    dropColumn(columnName) {
        const columnIndex = this.columns.indexOf(columnName);
        if (columnIndex !== -1) {
            this.columns.splice(columnIndex, 1);
            for (const row of this.data) {
                delete row[columnName];
            }
        }
        else {
            throw new Error(`Column "${columnName}" does not exist.`);
        }
    }
    selectColumns(selectedColumns) {
        const selectedData = this.data.map((row) => {
            const selectedRow = {};
            selectedColumns.forEach((column) => {
                if (this.columns.includes(column)) {
                    selectedRow[column] = row[column];
                }
            });
            return selectedRow;
        });
        return DataFrame.createStatic(selectedData, selectedColumns);
    }
    where(...conditions) {
        const filteredData = this.data.filter((row) => this.evaluateConditions(row, conditions));
        return DataFrame.createStatic(filteredData, this.columns);
    }
    evaluateConditions(row, conditions) {
        const expression = conditions.join(' && ');
        const keys = Object.keys(row);
        const values = Object.values(row);
        try {
            return eval(expression);
        }
        catch (error) {
            throw new Error('Invalid condition.');
        }
    }
    sortBy(columns, directions) {
        const sortedData = this.data.slice();
        sortedData.sort((row1, row2) => {
            for (const column of columns) {
                const direction = Array.isArray(directions) ? directions[columns.indexOf(column)] : directions;
                const aValue = row1[column];
                const bValue = row2[column];
                if (aValue === bValue)
                    continue;
                if (direction === 'asc') {
                    return aValue < bValue ? -1 : 1;
                }
                else {
                    return aValue > bValue ? -1 : 1;
                }
            }
            return 0;
        });
        return DataFrame.createStatic(sortedData, this.columns);
    }
    mean(column) {
        if (column) {
            const columnData = this.data.map((row) => row[column]);
            const sum = columnData.reduce((acc, value) => {
                if (typeof value === "number" && typeof acc === "number") {
                    return acc + value;
                }
                return 0;
            }, 0);
            if (typeof sum === "number")
                return sum / columnData.length;
            return 0;
        }
        else {
            const allData = this.data.reduce((acc, row) => {
                Object.values(row).forEach((value) => {
                    if (typeof value === "number" && typeof acc.sum === "number" && typeof acc.count === "number") {
                        acc.sum += value;
                        acc.count += 1;
                    }
                });
                return acc;
            }, { sum: 0, count: 0 });
            return allData.count > 0 ? allData.sum / allData.count : NaN;
        }
    }
    median(column) {
        if (column) {
            const columnData = this.data.map((row) => row[column]).filter((value) => typeof value === 'number');
            const sortedData = columnData.slice().sort((a, b) => a - b);
            const length = sortedData.length;
            const mid = Math.floor(length / 2);
            if (length % 2 === 0) {
                return (sortedData[mid - 1] + sortedData[mid]) / 2;
            }
            else {
                return sortedData[mid];
            }
        }
        else {
            const allData = this.data.reduce((acc, row) => {
                Object.values(row).forEach((value) => {
                    if (typeof value === 'number') {
                        acc.sortedData.push(value);
                    }
                });
                return acc;
            }, { sortedData: [] });
            const sortedData = allData.sortedData.sort((a, b) => a - b);
            const length = sortedData.length;
            const mid = Math.floor(length / 2);
            if (length % 2 === 0) {
                return (sortedData[mid - 1] + sortedData[mid]) / 2;
            }
            else {
                return sortedData[mid];
            }
        }
    }
    mode(column) {
        if (column) {
            const columnData = this.data.map((row) => row[column]);
            const countMap = new Map();
            let maxCount = 0;
            let modeValue;
            for (const value of columnData) {
                const count = (countMap.get(value) || 0) + 1;
                countMap.set(value, count);
                if (count > maxCount) {
                    maxCount = count;
                    modeValue = value;
                }
            }
            return modeValue;
        }
        else {
            const allData = this.data.reduce((acc, row) => {
                Object.values(row).forEach((value) => {
                    if (acc.countMap.has(value)) {
                        acc.countMap.set(value, acc.countMap.get(value) + 1);
                    }
                    else {
                        acc.countMap.set(value, 1);
                    }
                    if (acc.countMap.get(value) > acc.maxCount) {
                        acc.maxCount = acc.countMap.get(value);
                        acc.modes = [value];
                    }
                    else if (acc.countMap.get(value) === acc.maxCount) {
                        acc.modes.push(value);
                    }
                });
                return acc;
            }, { countMap: new Map(), maxCount: 0, modes: [] });
            return allData.modes;
        }
    }
    std(column) {
        if (column) {
            const columnData = this.data.map((row) => row[column]).filter((value) => typeof value === 'number');
            const mean = columnData.reduce((acc, value) => acc + value, 0) / columnData.length;
            const squaredDifferencesSum = columnData.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0);
            const variance = squaredDifferencesSum / columnData.length;
            return Math.sqrt(variance);
        }
        else {
            const allData = this.data.reduce((acc, row) => {
                Object.values(row).forEach((value) => {
                    if (typeof value === 'number') {
                        acc.columnData.push(value);
                    }
                });
                return acc;
            }, { columnData: [] });
            const mean = allData.columnData.reduce((acc, value) => acc + value, 0) / allData.columnData.length;
            const squaredDifferencesSum = allData.columnData.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0);
            const variance = squaredDifferencesSum / allData.columnData.length;
            return Math.sqrt(variance);
        }
    }
}
