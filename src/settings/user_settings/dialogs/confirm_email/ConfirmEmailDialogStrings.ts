
{
    function declareEmailConfirmDialogTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            CONIRM_EMAIL_DIALOG_TITLE: 'E-mail confirmation',
            CONIRM_EMAIL_CODE_LABEL: 'To confirm the e-mail, enter the code',
            CONIRM_EMAIL_CODE_PLACEHOLDER: 'Confirmation code',
            CONIRM_EMAIL_CODE_SUCCESS_LABEL: 'Your e-mail has been successfully verified.',
            CONIRM_EMAIL_CODE_VERIFY_ERROR_LABEL: 'An error occurred while confirming the e-mail, check the entered code.',
            CONIRM_EMAIL_CODE_SEND_ERROR_LABEL: 'An error occurred while trying to send a verification code.',
            CONIRM_EMAIL_CODE_SENDING_LABEL: 'Verification code is sent.',
            CONIRM_EMAIL_DIALOG_SEND_CODE_BUTTON: 'Send a new code',
            CONIRM_EMAIL_DIALOG_CANCEL_BUTTON: 'Cancel',
            CONIRM_EMAIL_DIALOG_CONFIRM_BUTTON: 'Confirm',
        });
        pipTranslateProvider.translations('ru', {
            CONIRM_EMAIL_DIALOG_TITLE: 'Подтвердить эл. почту',
            CONIRM_EMAIL_CODE_LABEL: 'Для подтверждения эл. почты введите код',
            CONIRM_EMAIL_CODE_PLACEHOLDER: 'Код подтверждения',
            CONIRM_EMAIL_CODE_SUCCESS_LABEL: 'Эл. почта успешно подтверждена.',
            CONIRM_EMAIL_CODE_VERIFY_ERROR_LABEL: 'Возникла ошибка при подтверждении эл. почты, проверьте введенный код.',
            CONIRM_EMAIL_CODE_SEND_ERROR_LABEL: 'Возникла ошибка при попытке отправить код подтверждения.',
            CONIRM_EMAIL_CODE_SENDING_LABEL: 'Письмо с кодом подтверждения отправлено.',
            CONIRM_EMAIL_DIALOG_SEND_CODE_BUTTON: 'Прислать новый код',
            CONIRM_EMAIL_DIALOG_CANCEL_BUTTON: 'Отменить',
            CONIRM_EMAIL_DIALOG_CONFIRM_BUTTON: 'Подвердить',
        });
    }

    angular
        .module('iqsConfirmEmailDialog')
        .config(declareEmailConfirmDialogTranslateResources);
}
