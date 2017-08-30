var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let TitaniumCsvImportExportTool = class TitaniumCsvImportExportTool extends LssProviderBehavior(Polymer.Element) {
    constructor() {
        super(...arguments);
        this.filename = 'export';
    }
    connectedCallback() {
        super.connectedCallback();
    }
    ready() {
        super.ready();
        let msg;
        let self = this;
        this.startTemplateFn = () => __awaiter(this, void 0, void 0, function* () {
            yield self.exportCSVFile(self.customTemplateFn);
        });
        this.startExportFn = () => __awaiter(this, void 0, void 0, function* () {
            yield self.exportCSVFile(self.customExportFn);
        });
        this.startFileImportFn = (toImport) => __awaiter(this, void 0, void 0, function* () {
            if ((typeof (toImport) === 'object' && !toImport.length) || typeof (toImport) === 'string') {
                return self.parseFile(toImport);
            }
            msg = 'Unable to parse, input is not a file or string';
            this.toast.show({ text: msg });
            return { isValid: false, messages: [{ message: msg }], errorType: 'ApplicationError' };
        });
        this.startJSONImportFn = (toImport) => __awaiter(this, void 0, void 0, function* () {
            if (toImport.length && toImport[0].length) {
                self.importCollection = self.rawCSVtoCollection(toImport);
            }
            msg = 'Unable to import, input is not valid JSON';
            this.toast.show({ text: msg });
            return { isValid: false, messages: [{ message: msg }], errorType: 'ApplicationError' };
        });
        this.startObjectImportFn = (toImport) => __awaiter(this, void 0, void 0, function* () {
            if (toImport.length) {
                self.importCollection = toImport;
            }
            msg = 'Unable to import, input is not a collection';
            this.toast.show({ text: msg });
            return { isValid: false, messages: [{ message: msg }], errorType: 'ApplicationError' };
        });
    }
    importCollectionReady(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.customValidateFn || !this.customImportFn) {
                this.toast.show({ text: 'Custom type not set' });
                return;
            }
            let validMessage = yield this.validate(collection);
            if (validMessage.isValid) {
                let importMessage = yield this.customImportFn(collection);
                return this.checkAndToastErrorMessage(importMessage);
            }
            else {
                return this.checkAndToastErrorMessage(validMessage);
            }
        });
    }
    validate(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            let genericValidMessage = yield this.validateCSV(collection, this.model);
            let customValidMessage = yield this.customValidateFn(collection);
            this.checkAndToastErrorMessage(genericValidMessage);
            this.checkAndToastErrorMessage(customValidMessage);
            return {
                isValid: genericValidMessage.isValid && customValidMessage.isValid,
                messages: genericValidMessage.messages.concat(customValidMessage.messages),
                errorType: 'ParseError'
            };
        });
    }
    parseFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                let options = {
                    header: true,
                    dynamicTyping: true,
                    complete: (results, file) => {
                        if (results.errors.length !== 0) {
                            let errorText = '';
                            results.errors.forEach((err) => {
                                errorText += `${err.message}`;
                            });
                            resolve({ isValid: false, messages: [{ message: errorText }] });
                            return;
                        }
                        this.importCollection = results.data;
                        resolve({ isValid: true });
                    },
                    error: (err) => {
                        resolve({
                            isValid: false,
                            messages: [{ message: err.message }],
                            errorType: 'ApplicationError'
                        });
                    }
                };
                Papa.parse(file, options);
            });
        });
    }
    filenameChanged() {
        if (!this.filename)
            this.filename = 'export';
    }
    checkAndToastErrorMessage(csvMessage) {
        if (csvMessage.errorType === 'ApplicationError') {
            let messages = csvMessage.messages.map(function (entry) {
                return entry.message;
            });
            let toastMessage = messages.join('/n');
            this.toast.show({ text: toastMessage });
            csvMessage.messages = [];
            return csvMessage;
        }
        return csvMessage;
    }
    rawCSVtoCollection(rawCSV) {
        let keys = rawCSV[0];
        let collection = [];
        return rawCSV.slice(1).map((eachRawCSVRow, rowNumber) => {
            let returnRow = {};
            keys.forEach((eachKey, keyIndex) => {
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
    exportCSVFile(getCollection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.customExportFn) {
                this.toast.show({ text: 'Custom type not set' });
                return;
            }
            let collection = yield getCollection();
            if (collection) {
                if (collection.isValid === false) {
                    return this.checkAndToastErrorMessage(collection);
                }
                let dataString = this.createCSVString(collection);
                if (dataString) {
                    this.downloadCSV(`${this.filename}.csv`, dataString);
                }
            }
        });
    }
    createCSVString(dataArray) {
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
    downloadCSV(filename, csvString) {
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvString));
        linkElement.setAttribute('download', filename);
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
    }
    validateCSV(collection, model) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let thisModel = model || {};
            if (!model) {
                Object.keys(collection[0]).forEach((eachKey) => {
                    thisModel[eachKey] = typeof (collection[0][eachKey]);
                });
            }
            let columnSize = Object.keys(thisModel).length;
            let invalidSizeError = { message: `The uploaded file does not have the expected amount of columns. The expected number of columns is ${columnSize}`, lines: [] };
            let invalidTypeError = { message: 'The expected type was not found.  This could mean you put letters in a number box or that a column name does not match the template.', lines: [] };
            collection.forEach((csvRow, i) => {
                let keysMatch = Object.keys(csvRow).every((key) => {
                    if (!thisModel[key]) {
                        if (!csvRow[key]) {
                            return true; // Both thisModel[key] and csvRow[key] are falsey
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
            errorList = errorList.filter((error) => {
                return error.lines.length > 0;
            });
            return {
                isValid: errorList.length === 0,
                messages: errorList,
                errorType: 'ParseError'
            };
        });
    }
};
__decorate([
    property({ notify: true }),
    __metadata("design:type", Object)
], TitaniumCsvImportExportTool.prototype, "toast", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Function)
], TitaniumCsvImportExportTool.prototype, "customTemplateFn", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Function)
], TitaniumCsvImportExportTool.prototype, "customExportFn", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Function)
], TitaniumCsvImportExportTool.prototype, "customValidateFn", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Function)
], TitaniumCsvImportExportTool.prototype, "customImportFn", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Function)
], TitaniumCsvImportExportTool.prototype, "startTemplateFn", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Function)
], TitaniumCsvImportExportTool.prototype, "startExportFn", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Function)
], TitaniumCsvImportExportTool.prototype, "startFileImportFn", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Function)
], TitaniumCsvImportExportTool.prototype, "startJSONImportFn", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Function)
], TitaniumCsvImportExportTool.prototype, "startObjectImportFn", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", String)
], TitaniumCsvImportExportTool.prototype, "filename", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Object)
], TitaniumCsvImportExportTool.prototype, "model", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Array)
], TitaniumCsvImportExportTool.prototype, "importCollection", void 0);
__decorate([
    observe('importCollection'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TitaniumCsvImportExportTool.prototype, "importCollectionReady", null);
__decorate([
    observe('filename'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TitaniumCsvImportExportTool.prototype, "filenameChanged", null);
TitaniumCsvImportExportTool = __decorate([
    customElement('titanium-csv-import-export-tool')
], TitaniumCsvImportExportTool);
