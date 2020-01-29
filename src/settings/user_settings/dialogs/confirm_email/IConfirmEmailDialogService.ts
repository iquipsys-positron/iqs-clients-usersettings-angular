export interface IConfirmEmailDialogService {
    show(params: any, successCallback?: (data?: iqs.shell.EmailSettings) => void, cancelCallback?: () => void): any;
}