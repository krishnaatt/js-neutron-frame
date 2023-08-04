import { DataFrameRow } from './dataFrameRow';
export declare class DataFrame {
    private data;
    private columns;
    constructor(data?: DataFrameRow[], columns?: string[]);
    static createStatic(data: DataFrameRow[], columns: string[]): DataFrame;
    addRow(row: DataFrameRow): void;
    addColumn(name: string, values: (number | string | boolean)[]): void;
    getRows(): DataFrameRow[];
    getColumns(): string[];
    getDataFrame(): DataFrameRow[];
    getShape(): [number, number];
    filterByColumn(columnName: string, value: number | string | boolean): DataFrameRow[];
    showFirstRows(n?: number): DataFrameRow[];
    showLastRows(n?: number): DataFrameRow[];
    getColumnDataTypes(): {
        [key: string]: string;
    };
    renameColumn(currentName: string, newName: string): void;
    dropColumn(columnName: string): void;
    selectColumns(selectedColumns: string[]): DataFrame;
    where(...conditions: string[]): DataFrame;
    private evaluateConditions;
    sortBy(columns: string[], directions: 'asc' | 'desc' | ('asc' | 'desc')[]): DataFrame;
    mean(column?: string): number;
    median(column?: string): number;
    mode(column?: string): any | any[];
    std(column?: string): number;
}
