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
let CsvFileExportButton = class CsvFileExportButton extends LssProviderBehavior(Polymer.Element) {
    constructor() {
        super(...arguments);
        this.raised = false;
        this.disabled = false;
    }
    connectedCallback() {
        super.connectedCallback();
    }
    ready() {
        super.ready();
        this.exportButton = this.$.exportButton;
    }
    setRaised(raised) {
        let raisedValue = raised;
        raisedValue = raisedValue === '' ? true : raisedValue;
        this.$.exportButton.raised = raisedValue;
    }
    setDisabled() {
        this.$.exportButton.disabled = this.disabled;
    }
    exportButtonTapped() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.exportFn) {
                yield this.exportFn();
            }
        });
    }
};
__decorate([
    property(),
    __metadata("design:type", Object)
], CsvFileExportButton.prototype, "exportButton", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], CsvFileExportButton.prototype, "buttonText", void 0);
__decorate([
    property({ notify: true, reflectToAttribute: true }),
    __metadata("design:type", Boolean)
], CsvFileExportButton.prototype, "raised", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Boolean)
], CsvFileExportButton.prototype, "disabled", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Function)
], CsvFileExportButton.prototype, "exportFn", void 0);
__decorate([
    observe('raised'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], CsvFileExportButton.prototype, "setRaised", null);
__decorate([
    observe('disabled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CsvFileExportButton.prototype, "setDisabled", null);
CsvFileExportButton = __decorate([
    customElement('csv-file-export-button')
], CsvFileExportButton);
