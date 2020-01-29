import { IConfirmPhoneDialogService } from './IConfirmPhoneDialogService';

class ConfirmPhoneDialogService implements IConfirmPhoneDialogService {
    public _mdDialog: angular.material.IDialogService;

    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }


    public show(params: any, successCallback?: (data?: iqs.shell.SmsSettings) => void, cancelCallback?: () => void) {
        this._mdDialog.show({
            templateUrl: 'settings/user_settings/dialogs/confirm_phone/ConfirmPhoneDialog.html',
            controller: 'iqsConfirmPhoneDialogController',
            locals: { params: params },
            controllerAs: '$ctrl',
            clickOutsideToClose: true
        })
            .then(
                (data?: iqs.shell.SmsSettings) => {
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                () => {
                    if (cancelCallback) {
                        cancelCallback();
                    }
                }
            );
    }

}

angular
    .module('iqsConfirmPhoneDialog')
    .service('iqsConfirmPhoneDialog', ConfirmPhoneDialogService);