export class ConfirmEmailDialogController implements ng.IController {
    public $onInit() { }
    public theme;
    public transaction: pip.services.Transaction;
    public code: string = '';
    private emailData: iqs.shell.EmailSettings;
    private currentEmail: string;
    private saveEmailSettings: Function;
    public state: string = null;

    constructor(
        private $mdDialog: angular.material.IDialogService,
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsEmailSettingsData: iqs.shell.IEmailSettingsDataService,
        private params: any
    ) {
        "ngInject";

        this.theme = $rootScope[pip.themes.ThemeRootVar];

        this.init();
    }

    private init() {
        this.transaction = this.pipTransaction.create('settings.basic_info');

        this.emailData = this.params.emailData;
        this.currentEmail = this.params.currentEmail;

        this.saveEmailSettings = this.params.saveEmailSettings;
    }

    public onSendCode() {
        if (!this.emailData) return;
        if (this.transaction.busy()) return;

        this.transaction.begin('SEND_EMAIL_SEND')
        async.series([
            // save email settings
            (seriesCallback) => {
                if (this.currentEmail == this.emailData.email) {
                    seriesCallback();

                    return;
                }

                this.saveEmailSettings((data: iqs.shell.EmailSettings) => {

                    this.emailData = data;
                    seriesCallback()
                }, seriesCallback);
            },
            // send  code resend
            (seriesCallback) => {
                this.iqsEmailSettingsData.resendEmail(
                    {
                        email: this.emailData.email
                    },
                    (data: iqs.shell.EmailSettings) => {
                        seriesCallback();
                    },
                    seriesCallback)
            },
        ],
            (error) => {
                // Error
                if (!error) {
                    this.state = 'sending';
                    this.transaction.end();
                } else {
                    this.state = 'sending error';
                    this.transaction.end(error);
                }
            });
    }

    public onConfirm() {
        if (!this.code) return;

        if (!this.emailData || !this.emailData.email) return;

        this.transaction.begin('SEND_EMAIL_VERIFY')
        async.series([
            // save email settings
            (seriesCallback) => {
                if (this.currentEmail == this.emailData.email) {
                    seriesCallback();

                    return;
                }
                this.saveEmailSettings((data: iqs.shell.EmailSettings) => {
                    this.emailData = data;
                    seriesCallback()
                }, seriesCallback);
            },
            (seriesCallback) => {
                // verify email
                this.iqsEmailSettingsData.verifyEmail(
                    {
                        email: this.emailData.email,
                        code: this.code
                    },
                    (data: iqs.shell.EmailSettings) => {
                        this.emailData.verified = true;
                        this.state = 'confirm';
                        seriesCallback();
                    },
                    seriesCallback)
            },
        ],
            (error) => {
                // Error
                if (!error) {
                    this.$mdDialog.hide({
                        emailData: this.emailData
                    });
                    this.transaction.end();
                } else {
                    this.state = 'confirm error';
                    this.transaction.end(error);
                }
            });
    }

    public cancel() {
        this.$mdDialog.cancel();
    }
}


angular
    .module('iqsConfirmEmailDialog', [
        'ngMaterial', 'iqsFormats.ObjectFilter',
        'iqsEmailSettings.Data'
    ])
    .controller('iqsConfirmEmailDialogController', ConfirmEmailDialogController);

import "./ConfirmEmailDialogService"