export interface IConfirmPhoneDialogService {
    show(params: any, successCallback?: (data?: iqs.shell.SmsSettings) => void, cancelCallback?: () => void): any;
}