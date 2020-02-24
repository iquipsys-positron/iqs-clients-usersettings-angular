import { IConfirmPhoneDialogService } from './dialogs/confirm_phone/IConfirmPhoneDialogService';
import { IConfirmEmailDialogService } from './dialogs/confirm_email/IConfirmEmailDialogService';

{

    class UserSettingsController implements ng.IController {
        public $onInit() { }

        public picture: any;
        public genders: string[];
        public languages: string[];
        public identity: any;
        public themes: any[];
        public transaction: pip.services.Transaction;
        public state: string;
        public isLanguageChanged: boolean = false;

        public onChangeUser: () => void;
        public onChangeBasicInfo: () => void;

        private nonChanged: boolean = true;
        private isSetValue: boolean = false;

        public emailData: iqs.shell.EmailSettings;
        public phoneData: iqs.shell.SmsSettings;

        public isEmailNotVerify: boolean = false;
        public isPhoneNotVerify: boolean = false;
        public phone: string;
        public email: string;

        public form: any;
        public touchedErrorsWithHint: Function;
        public isPreLoading: boolean = true;
        private cf: Function[] = [];

        constructor(
            private $rootScope: ng.IRootScopeService,
            private $scope: ng.IScope,
            private pipTranslate: pip.services.ITranslateService,
            private pipIdentity: pip.services.IIdentityService,
            private pipRest: pip.rest.IRestService,
            private pipTheme: pip.themes.IThemeService,
            private $state: ng.ui.IStateService,
            private $mdTheming: any,
            private $timeout: ng.ITimeoutService,
            private pipTransaction: pip.services.ITransactionService,
            private pipFormErrors: pip.errors.IFormErrorsService,
            private iqsAccountsData: iqs.shell.IAccountsDataService,
            private pipSessionData: pip.entry.ISessionDataService,
            private pipEntryData: pip.entry.IEntryDataService,
            private pipNavService: pip.nav.INavService,
            private pipMedia: pip.layouts.IMediaService,
            private pipChangePasswordDialog: pip.entry.IChangePasswordDialogService,
            private iqsSettingsViewModel: iqs.shell.ISettingsViewModel,
            private iqsEmailSettingsData: iqs.shell.IEmailSettingsDataService,
            private iqsSmsSettingsData: iqs.shell.ISmsSettingsDataService,
            private iqsConfirmPhoneDialog: IConfirmPhoneDialogService,
            private iqsConfirmEmailDialog: IConfirmEmailDialogService,
            private iqsLoading: iqs.shell.ILoadingService
        ) {
            "ngInject";

            this.genders = pipTranslate.translateSet(['male', 'female', 'n/s'], null, null);
            this.languages = pipTranslate.translateSet(['ru', 'en'], null, null);
            this.themes = _.keys(_.omit($mdTheming.THEMES, 'default'));

            this.transaction = pipTransaction.create('settings.basic_info');
            this.state = 'progress';

            this.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;

            const runWhenReady = () => {
                // hak for 'default' theme
                this.identity = _.cloneDeep(pipIdentity.identity);
                let themesIndex: number = _.findIndex(this.themes, (theme: string) => this.identity.user.theme === theme);

                if (themesIndex < 0) {
                    this.identity.user.theme = 'iqt-main';
                }
                // hak end
                this.getSettings();
            }

            if (this.iqsLoading.isDone) { runWhenReady(); }
            this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { runWhenReady(); }));

            $state.get('settings.user').onExit = () => {
                if (!this.nonChanged) {
                    this.updateUser();
                }
                this.saveChanges();
            };

            this.onChangeUser = _.debounce(() => {
                if (this.isSetValue) {
                    this.nonChanged = false;
                    this.updateUser();
                }
            }, 2000);

            this.form = $scope.form;
            $timeout(() => {
                this.isSetValue = true;
            }, 2500);

            this.appHeader();
        }

        public $onDestroy() {
            for (const f of this.cf) { f(); }
        }

        private savePhoneSettings(successCallback?: (data: iqs.shell.SmsSettings) => void, errorCallback?: (error) => void): void {
            let e = _.cloneDeep(this.phoneData);
            e.verified = false;
            e.ver_code = null;
            e.phone = this.phone;
            e.language = this.identity && this.identity.user && this.identity.user.language ? this.identity.user.language : null;
            this.iqsSmsSettingsData.updateSmsSettings(
                null,
                e,
                (data: iqs.shell.SmsSettings) => {
                    this.phoneData = data;
                    successCallback(data);
                },
                errorCallback)
        }

        private saveEmailSettings(successCallback?: (data: iqs.shell.EmailSettings) => void, errorCallback?: (error) => void): void {
            let e = _.cloneDeep(this.emailData);
            e.verified = false;
            e.ver_code = null;
            e.email = this.email;
            e.language = this.identity && this.identity.user && this.identity.user.language ? this.identity.user.language : null;

            this.iqsEmailSettingsData.updateEmailSettings(
                null,
                e,
                (data: iqs.shell.EmailSettings) => {
                    this.emailData = data;
                    successCallback(data);
                },
                errorCallback)
        }

        private readSettings(successCallback?: () => void, errorCallback?: (error) => void): void {
            async.parallel([
                (callback) => {
                    // read settings
                    this.iqsSettingsViewModel.read(
                        (data: any) => {
                            callback();
                        },
                        (error: any) => {
                            callback(error);
                        });
                },
                (callback) => {
                    // read email settings
                    this.iqsEmailSettingsData.readEmailSettings(
                        null,
                        (data: iqs.shell.EmailSettings) => {
                            this.emailData = data;
                            this.email = data.email;
                            callback();
                        },
                        (error: any) => {
                            callback(error);
                        });
                },
                (callback) => {
                    // read sms settings
                    this.iqsSmsSettingsData.readSmsSettings(
                        null,
                        (data: iqs.shell.SmsSettings) => {
                            this.phoneData = data;
                            this.phone = data.phone || null;
                            callback();
                        },
                        (error: any) => {
                            callback(error);
                        });
                },
            ],
                // optional callback
                (error, results) => {
                    if (error) {
                        if (errorCallback) errorCallback(error)
                    } else {
                        if (successCallback) successCallback();
                    }
                });
        }

        private getSettings() {
            this.transaction.begin('READ_SETTINGS')
            this.readSettings(
                () => {
                    this.transaction.end();
                    this.state = 'data';
                    this.form = this.$scope.form;
                    this.setSettingsState();
                    this.isPreLoading = false;
                },
                (error: any) => {
                    this.transaction.end(error);
                    this.state = 'data';
                }
            );
        }

        private setPhoneValidate(value): void {
            this.isPhoneNotVerify = value;
            if (value && this.form && this.form['phone']) {
                this.form.$submitted = true;
                this.form['phone'].$dirty = true;
            }
            this.setValidity(!value, 'phone', 'phoneVerify');
        }

        private setEmailValidate(value): void {
            this.isEmailNotVerify = value;
            if (value && this.form && this.form['email']) {
                this.form.$submitted = true;
                this.form['email'].$dirty = true;
            }
            this.setValidity(!value, 'email', 'emailVerify');
        }

        private setPhoneState(): void {
            if (!this.phone) {
                this.setPhoneValidate(false);

                return;
            }

            if (this.phoneData && this.phoneData.phone) {
                if (this.phoneData.phone != this.phone) {
                    this.setPhoneValidate(true);
                } else {
                    this.setPhoneValidate(!this.phoneData.verified);
                }

                return
            }

            this.setPhoneValidate(true);
        }

        private setValidity(value: boolean, fieldName: string, fieldValidatorName: string): void {
            if (this.form && this.form[fieldName]) {
                this.form[fieldName].$setValidity(fieldValidatorName, value);
            }
        }

        private setEmailState(): void {
            if (!this.email) {
                this.setEmailValidate(false);

                return;
            }

            if (this.emailData && this.emailData.email) {
                if (this.emailData.email != this.email) {
                    this.setEmailValidate(true);
                } else {
                    this.setEmailValidate(!this.emailData.verified);
                }

                return
            }

            this.setEmailValidate(true);
        }

        private setSettingsState(): void {
            this.setEmailState();
            this.setPhoneState();
        }

        public onChangeUserLanguage(): void {
            this.isLanguageChanged = true;
            this.onChangeUser();
        }

        public onVerifyEmail(): void {
            this.iqsConfirmEmailDialog.show(
                {
                    emailData: _.cloneDeep(this.emailData),
                    currentEmail: _.clone(this.email),
                    saveEmailSettings: (successCallback?: (data: iqs.shell.EmailSettings) => void, errorCallback?: (error) => void) => {
                        if (this.email) {
                            this.saveEmailSettings(successCallback, errorCallback)
                        }
                    }
                },
                (data?: any) => {
                    this.emailData = data && data.emailData ? data.emailData : this.emailData;
                    this.setEmailState();
                },
                () => {

                });
        }

        public onVerifyPhone(): void {
            this.iqsConfirmPhoneDialog.show(
                {
                    phoneData: _.cloneDeep(this.phoneData),
                    currentPhone: _.clone(this.phone),
                    savePhoneSettings: (successCallback?: (data: iqs.shell.SmsSettings) => void, errorCallback?: (error) => void) => {
                        if (this.phone) {
                            this.savePhoneSettings(successCallback, errorCallback)
                        }
                    }
                },
                (data?: any) => {
                    this.phoneData = data && data.phoneData ? data.phoneData : this.phoneData;
                    this.setPhoneState();
                },
                () => {

                });
        }

        public onChangePhone(): void {
            this.setPhoneState();
        }

        private onEmailUniqueValidate(successCallback?: () => void, errorCallback?: (error) => void) {
            this.pipEntryData.signupValidate(this.email,
                (data) => {
                    this.setValidity(true, 'email', 'emailUnique');
                    if (successCallback) successCallback();
                },
                (error: any) => {
                    this.setValidity(false, 'email', 'emailUnique');
                    if (errorCallback) errorCallback(error);
                });
        }

        public onChangeEmail(): void {
            if (this.email != this.pipIdentity.identity.user.login) {
                this.onEmailUniqueValidate(
                    () => {
                        this.setEmailState();
                    }
                );
            } else {
                this.setEmailState();
            }
        }

        private saveChanges() {
            // save smsSettings
            if (this.phoneData && this.phone != this.phoneData.phone && this.phone) {
                this.savePhoneSettings();
            }

            // save emailSettings
            if (this.emailData && this.email != this.emailData.email && this.email) {
                this.saveEmailSettings();
            }
        }

        private appHeader(): void {
            this.pipNavService.appbar.parts = { 'icon': true, 'actions': 'primary', 'menu': true, 'title': 'breadcrumb', 'organizations': true };
            this.pipNavService.actions.hide();
            this.pipNavService.appbar.removeShadow();
        }

        private updateUser() {
            const tid = this.transaction.begin('RequestEmailVerification');

            async.parallel([
                (callback) => {
                    this.iqsAccountsData.updateAccount(this.identity.user.id, this.identity.user,
                        (data) => {
                            if (this.transaction.aborted(tid)) {
                                callback();

                                return;
                            }
                            this.readSettings(
                                () => { this.setSettingsState(); },
                                (error: any) => { callback(error); }
                            );

                            this.pipRest.getResource('restoreSessions').call({
                                session_id: this.pipIdentity.identity.id
                            },
                                (data: pip.entry.SessionData) => {
                                    if (this.transaction.aborted(tid)) {
                                        callback();

                                        return;
                                    }

                                    this.pipIdentity.identity = data;
                                    this.identity = data;

                                    if (data.user.language != this.pipTranslate.language) {

                                        this.pipTranslate.language = data.user.language
                                    }

                                    if (this.pipTheme.theme != data.user.theme) {
                                        this.pipTheme.use(data.user.theme);
                                    }
                                    callback();
                                });
                        },
                        (error: any) => {
                            let message;
                            this.transaction.end(error);
                            message = String() + 'ERROR_' + error.status || error.data.status_code;
                            callback(error);
                        }
                    );
                },
                (callback) => {
                    if (!this.phone) {
                        callback();

                        return;
                    }
                    if (!this.isLanguageChanged) {
                        callback();

                        return;
                    }

                    this.phoneData.language = this.identity.user.language;
                    this.savePhoneSettings(
                        (data: iqs.shell.SmsSettings) => {
                            callback();
                        }, callback);
                },
                (callback) => {
                    if (!this.email) {
                        callback();

                        return;
                    }
                    if (!this.isLanguageChanged) {
                        callback();

                        return;
                    }

                    this.emailData.language = this.identity.user.language;
                    this.saveEmailSettings(
                        (data: iqs.shell.EmailSettings) => {
                            callback();
                        }, callback);
                }
            ],
                // optional callback
                (error, results) => {
                    this.transaction.end(error);
                    this.isLanguageChanged = false;
                });
        }

        public onChangePassword() {
            this.pipChangePasswordDialog.show({});
        };

        public onResetClick() {
            this.picture.reset();
        };

        public onPictureChanged($control) {
            this.picture = $control;
            if (!this.iqsLoading.isDone) { return; }
            this.picture.save(
                this.identity.user.id,
                () => {
                    this.$rootScope.$broadcast('pipPartyAvatarUpdated');
                },
                (error) => {
                    return new Error(error);
                }
            );
        }

        public onPictureCreated(obj) {
            this.picture = obj.$control;
            this.onPictureChanged(obj.$control);
        }
    }

    const config = function (pipSettingsProvider) {
        pipSettingsProvider.addTab({
            state: 'user',
            index: 1,
            icon: 'icons:contacts',
            iconClass: 'bg-color-8',
            title: 'SETTINGS_USER_TITLE',
            stateConfig: {
                url: '/user',
                auth: true,
                controller: UserSettingsController,
                controllerAs: '$ctrl',
                templateUrl: 'settings/user_settings/UserSettings.html',

            }

        });

        pipSettingsProvider.setDefaultTab('user');
    };




    angular.module('iqsUserSettings', [
        'pipSettings.Service',
        'pipSettings.Page',
        'iqsAccounts.Data',
        'iqsSettings.ViewModel',
        'iqsEmailSettings.Data',
        'iqsSmsSettings.Data',
        'iqsConfirmPhoneDialog',
        'iqsConfirmEmailDialog'
    ])
        .config(config);
}