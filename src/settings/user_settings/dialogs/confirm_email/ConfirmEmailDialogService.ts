import { IConfirmEmailDialogService } from './IConfirmEmailDialogService';

class ConfirmEmailDialogService implements IConfirmEmailDialogService {
    public _mdDialog: angular.material.IDialogService;
    
    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }


    public show(params: any, successCallback?: (data?: iqs.shell.EmailSettings) => void, cancelCallback?: () => void) {
        this._mdDialog.show({
            templateUrl: 'settings/user_settings/dialogs/confirm_email/ConfirmEmailDialog.html',
            controller: 'iqsConfirmEmailDialogController',
            locals: { params: params },
            controllerAs: '$ctrl',
            clickOutsideToClose: true
        })
        .then(
            (data?: iqs.shell.EmailSettings) => {
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
    .module('iqsConfirmEmailDialog')
    .service('iqsConfirmEmailDialog', ConfirmEmailDialogService);