import { DataFrame } from '../dataFrame';
import { DataFrameRow } from '../dataFrameRow';
export declare function createDataFrame(data: DataFrameRow[], columns: string[]): DataFrame;
export declare function readCSV(filePath: string): Promise<DataFrame>;
export declare function readXLSX(filePath: string): Promise<DataFrame>;
