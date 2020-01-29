export class ConfirmPhoneDialogController implements ng.IController {
    public $onInit() { }
    public theme;
    public transaction: pip.services.Transaction;
    public code: string = '';
    private phoneData: iqs.shell.SmsSettings;
    private currentPhone: string;
    private savePhoneSettings: Function;
    public state: string = null;

    constructor(
        private $mdDialog: angular.material.IDialogService,
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsSmsSettingsData: iqs.shell.ISmsSettingsDataService,
        private params: any
    ) {
        "ngInject";

        this.theme = $rootScope[pip.themes.ThemeRootVar];

        this.init();
    }

    private init() {
        this.transaction = this.pipTransaction.create('settings.basic_info');

        this.phoneData = this.params.phoneData;
        this.currentPhone = this.params.currentPhone;

        this.savePhoneSettings = this.params.savePhoneSettings;
    }

    public onSendCode() {
        if (!this.phoneData) return;
        if (this.transaction.busy()) return;

        this.transaction.begin('SEND_SMS_SEND')
        async.series([
            // save email settings
            (seriesCallback) => {
                if (this.currentPhone == this.phoneData.phone) {
                    seriesCallback();

                    return;
                }

                this.savePhoneSettings((data: iqs.shell.SmsSettings) => {

                    this.phoneData = data;
                    seriesCallback()
                }, seriesCallback);
            },
            // send  code resend
            (seriesCallback) => {
                this.iqsSmsSettingsData.resendPhone(
                    {
                        phone: this.phoneData.phone
                    },
                    (data: iqs.shell.SmsSettings) => {
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

        if (!this.phoneData || !this.phoneData.phone) return;

        this.transaction.begin('SEND_SMS_VERIFY')
        async.series([
            // save email settings
            (seriesCallback) => {
                if (this.currentPhone == this.phoneData.phone) {
                    seriesCallback();

                    return;
                }
                this.savePhoneSettings((data: iqs.shell.SmsSettings) => {
                    this.phoneData = data;
                    seriesCallback()
                }, seriesCallback);
            },
            (seriesCallback) => {
                // verify phone
                this.iqsSmsSettingsData.verifyPhone(
                    {
                        phone: this.phoneData.phone,
                        code: this.code
                    },
                    (data: iqs.shell.SmsSettings) => {
                        this.phoneData.verified = true;
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
                        phoneData: this.phoneData
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
    .module('iqsConfirmPhoneDialog', [
        'ngMaterial', 'iqsFormats.ObjectFilter',
        'iqsSmsSettings.Data'
    ])
    .controller('iqsConfirmPhoneDialogController', ConfirmPhoneDialogController);

import "./ConfirmPhoneDialogService"