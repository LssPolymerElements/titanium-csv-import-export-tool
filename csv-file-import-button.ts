/// <reference path="./papaParse.d.ts" />

@customElement('csv-file-import-button')
class CsvFileImportButton extends LssProviderBehavior(Polymer.Element) {

    @property({ notify: true })
    uploading: boolean = false;

    @property({ notify: true })
    done: boolean = false;

    @property({ notify: true })
    error: boolean = false;

    @property({ notify: true })
    errorText: string = '';

    @property({ notify: true })
    disabled: boolean;

    @property({ notify: true })
    importFn: (file: any) => Promise<ICSVMessageResult>;

    connectedCallback() {
        super.connectedCallback();
    }

    ready() {
        super.ready();
    }

    async handleFileSelect(event: any) {
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

        let result = await this.importFn(file);
        this.uploading = false;
        if (result.isValid) {
            this.done = true;
            this.$.uploadedFile.innerHTML = file.name;
            return;
        }
        this.error = true;
        (result.messages || []).forEach((eachMsg) => {
            this.$.errorText.innerHTML += `<li>${eachMsg.message}</li>`;
        });
    }

    clearFile() {
        this.done = false;
        this.uploading = false;
        this.error = false;
        this.$.inputFile.value = null;
    }

    @observe('disabled')
    removeDisabled(value: any) {
        if (!value) {
            this.$.dropBox.classList.remove('disabled');
            this.$.cloudIcon.classList.remove('disabled');
        }
        else {
            this.$.dropBox.classList.add('disabled');
            this.$.cloudIcon.classList.add('disabled');
        }
    }

    handleDragOver(event: any) {
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

}