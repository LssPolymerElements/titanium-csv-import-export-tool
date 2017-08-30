@customElement('csv-file-export-button')
class CsvFileExportButton extends LssProviderBehavior(Polymer.Element) {
    @property()
    exportButton: any;

    @property()
    buttonText: string;

    @property({ notify: true, reflectToAttribute: true })
    raised: boolean = false;

    @property({ notify: true })
    disabled: boolean = false;

    @property({ notify: true })
    exportFn: () => void;

    connectedCallback() {
        super.connectedCallback();
    }

    ready() {
        super.ready();
        this.exportButton = this.$.exportButton;
    }

    @observe('raised')
    setRaised(raised: boolean) {
        let raisedValue: any = raised;
        raisedValue = raisedValue === '' ? true : raisedValue;
        this.$.exportButton.raised = raisedValue;
    }

    @observe('disabled')
    setDisabled() {
        this.$.exportButton.disabled = this.disabled;
    }

    async exportButtonTapped() {
        if (this.exportFn) {
            await this.exportFn();
        }
    }
}
