"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFrame = void 0;
var DataFrame = /** @class */ (function () {
    function DataFrame(data, columns) {
        if (data === void 0) { data = []; }
        if (columns === void 0) { columns = []; }
        this.data = data;
        this.columns = columns;
    }
    DataFrame.createStatic = function (data, columns) {
        return new DataFrame(data, columns);
    };
    DataFrame.prototype.addRow = function (row) {
        this.data.push(row);
    };
    DataFrame.prototype.addColumn = function (name, values) {
        if (values.length !== this.data.length) {
            throw new Error('Number of values must match the number of rows.');
        }
        this.columns.push(name);
        for (var i = 0; i < values.length; i++) {
            this.data[i][name] = values[i];
        }
    };
    DataFrame.prototype.getRows = function () {
        return this.data;
    };
    DataFrame.prototype.getColumns = function () {
        return this.columns;
    };
    DataFrame.prototype.getDataFrame = function () {
        return this.data;
    };
    DataFrame.prototype.getShape = function () {
        return [this.data.length, this.columns.length];
    };
    DataFrame.prototype.filterByColumn = function (columnName, value) {
        return this.data.filter(function (row) { return row[columnName] === value; });
    };
    DataFrame.prototype.showFirstRows = function (n) {
        if (n === void 0) { n = 5; }
        return this.data.slice(0, n);
    };
    DataFrame.prototype.showLastRows = function (n) {
        if (n === void 0) { n = 5; }
        return this.data.slice(-n);
    };
    DataFrame.prototype.getColumnDataTypes = function () {
        var _this = this;
        var columnDataTypes = {};
        this.columns.forEach(function (column) {
            // Initialize data types for each column
            columnDataTypes[column] = 'unknown';
            // Determine the data type for the current column
            for (var _i = 0, _a = _this.data; _i < _a.length; _i++) {
                var row = _a[_i];
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
    };
    DataFrame.prototype.renameColumn = function (currentName, newName) {
        var columnIndex = this.columns.indexOf(currentName);
        if (columnIndex !== -1) {
            this.columns[columnIndex] = newName;
        }
        else {
            throw new Error("Column \"".concat(currentName, "\" does not exist."));
        }
    };
    DataFrame.prototype.dropColumn = function (columnName) {
        var columnIndex = this.columns.indexOf(columnName);
        if (columnIndex !== -1) {
            this.columns.splice(columnIndex, 1);
            for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                var row = _a[_i];
                delete row[columnName];
            }
        }
        else {
            throw new Error("Column \"".concat(columnName, "\" does not exist."));
        }
    };
    DataFrame.prototype.selectColumns = function (selectedColumns) {
        var _this = this;
        var selectedData = this.data.map(function (row) {
            var selectedRow = {};
            selectedColumns.forEach(function (column) {
                if (_this.columns.includes(column)) {
                    selectedRow[column] = row[column];
                }
            });
            return selectedRow;
        });
        return DataFrame.createStatic(selectedData, selectedColumns);
    };
    DataFrame.prototype.where = function () {
        var _this = this;
        var conditions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            conditions[_i] = arguments[_i];
        }
        var filteredData = this.data.filter(function (row) { return _this.evaluateConditions(row, conditions); });
        return DataFrame.createStatic(filteredData, this.columns);
    };
    DataFrame.prototype.evaluateConditions = function (row, conditions) {
        var expression = conditions.join(' && ');
        var keys = Object.keys(row);
        var values = Object.values(row);
        try {
            return eval(expression);
        }
        catch (error) {
            throw new Error('Invalid condition.');
        }
    };
    DataFrame.prototype.sortBy = function (columns, directions) {
        var sortedData = this.data.slice();
        sortedData.sort(function (row1, row2) {
            for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                var column = columns_1[_i];
                var direction = Array.isArray(directions) ? directions[columns.indexOf(column)] : directions;
                var aValue = row1[column];
                var bValue = row2[column];
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
    };
    DataFrame.prototype.mean = function (column) {
        if (column) {
            var columnData = this.data.map(function (row) { return row[column]; });
            var sum = columnData.reduce(function (acc, value) {
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
            var allData = this.data.reduce(function (acc, row) {
                Object.values(row).forEach(function (value) {
                    if (typeof value === "number" && typeof acc.sum === "number" && typeof acc.count === "number") {
                        acc.sum += value;
                        acc.count += 1;
                    }
                });
                return acc;
            }, { sum: 0, count: 0 });
            return allData.count > 0 ? allData.sum / allData.count : NaN;
        }
    };
    DataFrame.prototype.median = function (column) {
        if (column) {
            var columnData = this.data.map(function (row) { return row[column]; }).filter(function (value) { return typeof value === 'number'; });
            var sortedData = columnData.slice().sort(function (a, b) { return a - b; });
            var length_1 = sortedData.length;
            var mid = Math.floor(length_1 / 2);
            if (length_1 % 2 === 0) {
                return (sortedData[mid - 1] + sortedData[mid]) / 2;
            }
            else {
                return sortedData[mid];
            }
        }
        else {
            var allData = this.data.reduce(function (acc, row) {
                Object.values(row).forEach(function (value) {
                    if (typeof value === 'number') {
                        acc.sortedData.push(value);
                    }
                });
                return acc;
            }, { sortedData: [] });
            var sortedData = allData.sortedData.sort(function (a, b) { return a - b; });
            var length_2 = sortedData.length;
            var mid = Math.floor(length_2 / 2);
            if (length_2 % 2 === 0) {
                return (sortedData[mid - 1] + sortedData[mid]) / 2;
            }
            else {
                return sortedData[mid];
            }
        }
    };
    DataFrame.prototype.mode = function (column) {
        if (column) {
            var columnData = this.data.map(function (row) { return row[column]; });
            var countMap = new Map();
            var maxCount = 0;
            var modeValue = void 0;
            for (var _i = 0, columnData_1 = columnData; _i < columnData_1.length; _i++) {
                var value = columnData_1[_i];
                var count = (countMap.get(value) || 0) + 1;
                countMap.set(value, count);
                if (count > maxCount) {
                    maxCount = count;
                    modeValue = value;
                }
            }
            return modeValue;
        }
        else {
            var allData = this.data.reduce(function (acc, row) {
                Object.values(row).forEach(function (value) {
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
    };
    DataFrame.prototype.std = function (column) {
        if (column) {
            var columnData = this.data.map(function (row) { return row[column]; }).filter(function (value) { return typeof value === 'number'; });
            var mean_1 = columnData.reduce(function (acc, value) { return acc + value; }, 0) / columnData.length;
            var squaredDifferencesSum = columnData.reduce(function (acc, value) { return acc + Math.pow(value - mean_1, 2); }, 0);
            var variance = squaredDifferencesSum / columnData.length;
            return Math.sqrt(variance);
        }
        else {
            var allData = this.data.reduce(function (acc, row) {
                Object.values(row).forEach(function (value) {
                    if (typeof value === 'number') {
                        acc.columnData.push(value);
                    }
                });
                return acc;
            }, { columnData: [] });
            var mean_2 = allData.columnData.reduce(function (acc, value) { return acc + value; }, 0) / allData.columnData.length;
            var squaredDifferencesSum = allData.columnData.reduce(function (acc, value) { return acc + Math.pow(value - mean_2, 2); }, 0);
            var variance = squaredDifferencesSum / allData.columnData.length;
            return Math.sqrt(variance);
        }
    };
    return DataFrame;
}());
exports.DataFrame = DataFrame;
