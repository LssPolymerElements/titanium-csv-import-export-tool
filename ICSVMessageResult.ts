interface ICSVMessageResult {
    isValid: boolean;
    messages?: CSVMessage[];
    errorType?: any;
    collection?: any[];
}
interface CSVMessage {
    message: string;
    lines: number[];
}

