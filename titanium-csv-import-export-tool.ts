@customElement('titanium-csv-import-export-tool')
class TitaniumCsvImportExportTool extends LssProviderBehavior(Polymer.Element) {
    @property({ notify: true })
    toast: { show: (param: { text: string }) => any };

    @property({ notify: true })
    customTemplateFn: () => Promise<any[]>;

    @property({ notify: true })
    customExportFn: () => Promise<any[]>;

    @property({ notify: true })
    customValidateFn: (collection: any[]) => Promise<ICSVMessageResult>;

    @property({ notify: true })
    customImportFn: (collection: any[]) => Promise<ICSVMessageResult>;

    @property({ notify: true })
    startTemplateFn: () => void;

    @property({ notify: true })
    startExportFn: () => void;

    @property({ notify: true })
    startFileImportFn: (file: any | string) => Promise<ICSVMessageResult>;

    @property({ notify: true })
    startJSONImportFn: (rawCSV: string[][]) => void;

    @property({ notify: true })
    startObjectImportFn: (collection: any[]) => void;

    @property({ notify: true })
    filename: string = 'export';

    @property({ notify: true })
    model: any;

    @property({ notify: true })
    importCollection: any[];

    connectedCallback() {
        super.connectedCallback();
    }

    ready() {
        super.ready();

        let msg: string;
        let self = this;

        this.startTemplateFn = async () => {
            await self.exportCSVFile(self.customTemplateFn);
        };
        this.startExportFn = async () => {
            await self.exportCSVFile(self.customExportFn);
        };

        this.startFileImportFn = async (toImport: any | string) => {
            if ((typeof (toImport) === 'object' && !toImport.length) || typeof (toImport) === 'string') {
                return self.parseFile(toImport);
            }
            msg = 'Unable to parse, input is not a file or string';
            this.toast.show({ text: msg });
            return { isValid: false, messages: [{ message: msg }], errorType: 'ApplicationError' } as ICSVMessageResult;
        };
        this.startJSONImportFn = async (toImport: string[][]) => {
            if (toImport.length && toImport[0].length) {
                self.importCollection = self.rawCSVtoCollection(toImport);
            }
            msg = 'Unable to import, input is not valid JSON';
            this.toast.show({ text: msg });
            return { isValid: false, messages: [{ message: msg }], errorType: 'ApplicationError' } as ICSVMessageResult;
        };
        this.startObjectImportFn = async (toImport: any[]) => {
            if (toImport.length) {
                self.importCollection = toImport;
            }
            msg = 'Unable to import, input is not a collection';
            this.toast.show({ text: msg });
            return { isValid: false, messages: [{ message: msg }], errorType: 'ApplicationError' } as ICSVMessageResult;
        };
    }

    @observe('importCollection')
    async importCollectionReady(collection: any[]) {
        if (!this.customValidateFn || !this.customImportFn) {
            this.toast.show({ text: 'Custom type not set' });
            return;
        }
        let validMessage = await this.validate(collection);
        if (validMessage.isValid) {
            let importMessage: ICSVMessageResult = await this.customImportFn(collection);
            return this.checkAndToastErrorMessage(importMessage);
        }
        else {
            return this.checkAndToastErrorMessage(validMessage);
        }
    }

    async validate(collection: any[]): Promise<ICSVMessageResult> {
        let genericValidMessage = await this.validateCSV(collection, this.model);
        let customValidMessage = await this.customValidateFn(collection);
        this.checkAndToastErrorMessage(genericValidMessage);
        this.checkAndToastErrorMessage(customValidMessage);
        return {
            isValid: genericValidMessage.isValid && customValidMessage.isValid,
            messages: (genericValidMessage.messages || []).concat(customValidMessage.messages || []),
            errorType: 'ParseError'
        };
    }

    async parseFile(file: any): Promise<ICSVMessageResult> {
        return new Promise<any>((resolve) => {
            let options: PapaParse.ParseConfig = {
                header: true,
                dynamicTyping: true,
                complete: (results: PapaParse.ParseResult, file: File) => {

                    if (results.errors.length !== 0) {
                        let errorText = '';
                        results.errors.forEach((err) => {
                            errorText += `${err.message}`;
                        });
                        resolve({ isValid: false, messages: [{ message: errorText }] } as any);
                        return;
                    }

                    this.importCollection = results.data;
                    resolve({ isValid: true } as any);
                },
                error: (err: any) => {
                    resolve({
                        isValid: false,
                        messages: [{ message: err.message }],
                        errorType: 'ApplicationError'
                    } as any);
                }
            };

            Papa.parse(file, options);
        });
    }

    @observe('filename')
    filenameChanged() {
        if (!this.filename)
            this.filename = 'export';
    }

    checkAndToastErrorMessage(csvMessage: ICSVMessageResult): ICSVMessageResult {
        if (csvMessage.errorType === 'ApplicationError') {
            let messages = (csvMessage.messages || []).map(function (entry) {
                return entry.message;
            });
            let toastMessage = messages.join('/n');
            this.toast.show({ text: toastMessage });
            csvMessage.messages = [];
            return csvMessage;
        }
        return csvMessage;
    }

    rawCSVtoCollection(rawCSV: string[][]): any[] {
        let keys = rawCSV[0];
        let collection = [];

        return rawCSV.slice(1).map((eachRawCSVRow: string[], rowNumber: number) => {
            let returnRow: { [index: string]: string | number | undefined } = {};
            keys.forEach((eachKey: string, keyIndex: number) => {
                if (!eachRawCSVRow[keyIndex]) {
                    returnRow[eachKey] = undefined;
                    return;
                }
                if (parseInt(eachRawCSVRow[keyIndex]).toString() === eachRawCSVRow[keyIndex]) {
                    returnRow[eachKey] = parseInt(eachRawCSVRow[keyIndex]);
                    return;
                }
                returnRow[eachKey] = eachRawCSVRow[keyIndex];
            });
            return returnRow;
        });

    }

    async exportCSVFile(getCollection: () => Promise<any[]>) {
        if (!this.customExportFn) {
            this.toast.show({ text: 'Custom type not set' });
            return;
        }
        let collection: any = await getCollection();
        if (collection) {
            if (collection.isValid === false) {
                return this.checkAndToastErrorMessage(collection);
            }
            let dataString = this.createCSVString(collection);
            if (dataString) {
                this.downloadCSV(`${this.filename}.csv`, dataString);
            }
        }
    }

    createCSVString(dataArray: any[]): string {
        if (!dataArray || dataArray.length < 1) {
            return '';
        }
        let outputString = Object.keys(dataArray[0]).join(',') + '\r\n';
        outputString += dataArray.map((eachRow) => {
            return Object.keys(eachRow).map((eachKey) => {
                if (eachRow[eachKey] === null || !eachRow[eachKey]) {
                    return '';
                }
                if (typeof (eachRow[eachKey]) === 'number') {
                    return eachRow[eachKey].toString();
                }
                return `"${eachRow[eachKey].toString()}"`;
            }).join(',');
        }).join('\r\n');

        return outputString;
    }

    downloadCSV(filename: string, csvString: string) {
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvString));
        linkElement.setAttribute('download', filename);

        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);

        linkElement.click();

        document.body.removeChild(linkElement);
    }

    async validateCSV(collection: { [index: string]: any }[], model?: { [index: string]: string }): Promise<ICSVMessageResult> {
        let self = this;
        let thisModel = model || {};
        if (!model) {
            Object.keys(collection[0]).forEach((eachKey) => {
                thisModel[eachKey] = typeof (collection[0][eachKey]);
            });
        }
        let columnSize = Object.keys(thisModel).length;
        let invalidSizeError: CSVMessage = { message: `The uploaded file does not have the expected amount of columns. The expected number of columns is ${columnSize}`, lines: [] };
        let invalidTypeError: CSVMessage = { message: 'The expected type was not found.  This could mean you put letters in a number box or that a column name does not match the template.', lines: [] };

        collection.forEach((csvRow, i) => {
            let keysMatch = Object.keys(csvRow).every((key: string) => {
                if (!thisModel[key]) {
                    if (!csvRow[key]) {
                        return true;  // Both thisModel[key] and csvRow[key] are falsey
                    }
                    return false; // csvRow[key] has value and doesn't match the falsey model
                }
                return csvRow[key] === '' || thisModel[key] === typeof (csvRow[key]);
            });
            if (!keysMatch) {
                invalidTypeError.lines.push(i + 1);
            }
            if (Object.keys(csvRow).length !== columnSize) {
                invalidSizeError.lines.push(i + 1);
            }
        });

        let errorList = [
            invalidSizeError,
            invalidTypeError
        ];

        errorList = errorList.filter((error: CSVMessage) => {
            return error.lines.length > 0;
        });

        return {
            isValid: errorList.length === 0,
            messages: errorList,
            errorType: 'ParseError'
        };
    }
}