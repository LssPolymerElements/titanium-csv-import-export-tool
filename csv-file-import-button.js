/// <reference path="./papaParse.d.ts" />
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
let CsvFileImportButton = class CsvFileImportButton extends LssProviderBehavior(Polymer.Element) {
    /// <reference path="./papaParse.d.ts" />
    constructor() {
        super(...arguments);
        this.uploading = false;
        this.done = false;
        this.error = false;
        this.errorText = '';
    }
    connectedCallback() {
        super.connectedCallback();
    }
    ready() {
        super.ready();
    }
    handleFileSelect(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.stopPropagation();
            event.preventDefault();
            if (this.disabled) {
                return;
            }
            this.dragLeave();
            this.uploading = true;
            this.$.errorText.innerHTML = '';
            this.$.uploadedFile.innerHTML = '';
            let file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
            let result = yield this.importFn(file);
            this.uploading = false;
            if (result.isValid) {
                this.done = true;
                this.$.uploadedFile.innerHTML = file.name;
                return;
            }
            this.error = true;
            result.messages.forEach((eachMsg) => {
                this.$.errorText.innerHTML += `<li>${eachMsg.message}</li>`;
            });
        });
    }
    clearFile() {
        this.done = false;
        this.uploading = false;
        this.error = false;
        this.$.inputFile.value = null;
    }
    removeDisabled(value) {
        if (!value) {
            this.$.dropBox.classList.remove('disabled');
            this.$.cloudIcon.classList.remove('disabled');
        }
        else {
            this.$.dropBox.classList.add('disabled');
            this.$.cloudIcon.classList.add('disabled');
        }
    }
    handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.disabled) {
            return;
        }
        let drop = this.$.dropBox;
        drop.classList.add('background-drag-over');
    }
    openFileChooser() {
        if (this.disabled) {
            return;
        }
        this.$.fileInput.click();
    }
    dragLeave() {
        let drop = this.$.dropBox;
        drop.classList.remove('background-drag-over');
    }
    browserCanDragDrop() {
        let div = document.createElement('div');
        return !((('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window);
    }
};
__decorate([
    property({ notify: true }),
    __metadata("design:type", Boolean)
], CsvFileImportButton.prototype, "uploading", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Boolean)
], CsvFileImportButton.prototype, "done", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Boolean)
], CsvFileImportButton.prototype, "error", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", String)
], CsvFileImportButton.prototype, "errorText", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Boolean)
], CsvFileImportButton.prototype, "disabled", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Function)
], CsvFileImportButton.prototype, "importFn", void 0);
__decorate([
    observe('disabled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CsvFileImportButton.prototype, "removeDisabled", null);
CsvFileImportButton = __decorate([
    customElement('csv-file-import-button')
], CsvFileImportButton);
