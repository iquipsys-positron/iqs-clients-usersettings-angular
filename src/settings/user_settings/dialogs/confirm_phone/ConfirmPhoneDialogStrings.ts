
{
    function declarePhoneConfirmDialogTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            CONIRM_PHONE_DIALOG_TITLE: 'Phone confirmation',
            CONIRM_PHONE_CODE_LABEL: 'To confirm the phone, enter the code sent to you by SMS',
            CONIRM_PHONE_CODE_PLACEHOLDER: 'Confirmation code',
            CONIRM_PHONE_CODE_SUCCESS_LABEL: 'Your phone has been successfully verified.',
            CONIRM_PHONE_CODE_VERIFY_ERROR_LABEL: 'An error occurred while confirming the phone, check the entered code.',
            CONIRM_PHONE_CODE_SEND_ERROR_LABEL: 'An error occurred while trying to send a verification code.',
            CONIRM_PHONE_CODE_SENDING_LABEL: 'SMS with verification code sent.',
            CONIRM_PHONE_DIALOG_SEND_CODE_BUTTON: 'Send a new code',
            CONIRM_PHONE_DIALOG_CANCEL_BUTTON: 'Cancel',
            CONIRM_PHONE_DIALOG_CONFIRM_BUTTON: 'Confirm',
        });
        pipTranslateProvider.translations('ru', {
            CONIRM_PHONE_DIALOG_TITLE: 'Подтвердить телефон',
            CONIRM_PHONE_CODE_LABEL: 'Для подтверждения телефона введите код присланный вам по СМС',
            CONIRM_PHONE_CODE_PLACEHOLDER: 'Код подтверждения',
            CONIRM_PHONE_CODE_SUCCESS_LABEL: 'Телефон успешно подтвержден.',
            CONIRM_PHONE_CODE_VERIFY_ERROR_LABEL: 'Возникла ошибка при подтверждении телефона, проверьте введенный код.',
            CONIRM_PHONE_CODE_SEND_ERROR_LABEL: 'Возникла ошибка при попытке отправить код подтверждения.',
            CONIRM_PHONE_CODE_SENDING_LABEL: 'СМС с кодом подтверждения отправлено.',
            CONIRM_PHONE_DIALOG_SEND_CODE_BUTTON: 'Прислать новый код',
            CONIRM_PHONE_DIALOG_CANCEL_BUTTON: 'Отменить',
            CONIRM_PHONE_DIALOG_CONFIRM_BUTTON: 'Подвердить',
        });
    }

    angular
        .module('iqsConfirmPhoneDialog')
        .config(declarePhoneConfirmDialogTranslateResources);
}
