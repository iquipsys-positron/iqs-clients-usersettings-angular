{

    class SessionsSettingsController implements ng.IController {
        public $onInit() { }
        public transaction: pip.services.Transaction;
        public message: string;
        public sessions: iqs.shell.Session[];
        public sessionId: string;
        public state: iqs.shell.States;
        private cf: Function[] = [];

        constructor(
            $rootScope: ng.IRootScopeService,
            pipTransaction: pip.services.ITransactionService,
            private iqsSessionsData: iqs.shell.ISessionsDataService,
            private pipIdentity: pip.services.IIdentityService,
            private pipSessionData: pip.services.ISessionService,
            private pipNavService: pip.nav.INavService,
            private iqsLoading: iqs.shell.ILoadingService
        ) {
            "ngInject";

            this.state = iqs.shell.States.Empty;
            this.transaction = pipTransaction.create('settings.sessions');
            this.sessions = [];//sessions;
            this.state = iqs.shell.States.Progress;

            const runWhenReady = () => {
                this.sessionId = this.pipIdentity.identity.id;
                this.iqsSessionsData.readSessions({ user_id: this.pipIdentity.identity.user_id, active: true }, (data) => {
                    this.sessions = data.data;
                    this.state = this.sessions.length ? iqs.shell.States.Data : iqs.shell.States.Empty;
                });
            };

            if (this.iqsLoading.isDone) { runWhenReady(); }
            this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { runWhenReady(); }));

            this.appHeader();
        }

        public $onDestroy() {
            for (const f of this.cf) { f(); }
        }

        private appHeader(): void {
            this.pipNavService.appbar.parts = { 'icon': true, 'actions': 'primary', 'menu': true, 'title': 'breadcrumb', 'organizations': true };
            this.pipNavService.actions.hide();
            this.pipNavService.appbar.removeShadow();
        }

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.Sessions:pipUserSettingsSessionsController
         * @name pipUserSettings.Sessions.pipUserSettingsSessionsController:onRemoveAll
         *
         * @description
         * Closes all active session.
         */
        public onRemoveAll() {
            const tid = this.transaction.begin('REMOVING');

            async.eachSeries(
                this.sessions,
                (session: any, callback) => {
                    if (session.id == this.sessionId) {
                        callback();
                    } else {
                        if (session.active) {
                            this.iqsSessionsData.deleteSession(
                                {
                                    sesion_id: session.id
                                },
                                () => {
                                    this.sessions = _.without(this.sessions, session);
                                    //session.active = false;
                                    //this.sessions.push(session);
                                    callback();
                                },
                                (error) => {
                                    callback;
                                }
                            );
                        }

                    }
                },
                (err) => {
                    if (err) {
                        this.transaction.end(err);
                    }
                    if (this.transaction.aborted(tid)) {
                        return;
                    }
                    this.transaction.end();
                });
        }

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.Sessions:pipUserSettingsSessionsController
         * @name pipUserSettings.Sessions.pipUserSettingsSessionsController:onRemove
         *
         * @description
         * Closes passed session.
         *
         * @param {Object} session  Session configuration object
         */
        public onRemove(session: iqs.shell.Session, callback) {
            if (session.id === this.sessionId) {
                return;
            }
            const tid = this.transaction.begin('REMOVING');
            this.iqsSessionsData.deleteSession(
                {
                    session_id: session.id
                },
                () => {
                    if (this.transaction.aborted(tid)) {
                        return;
                    }
                    this.transaction.end();

                    this.sessions = _.without(this.sessions, session);
                    //session.active = false;
                    //this.sessions.push(session);
                    if (callback) {
                        callback();
                    }
                },
                (error) => {
                    this.transaction.end(error);
                    this.message = 'ERROR_' + error.status || error.data.status_code;
                }
            );
        }
    }

    const config = function (pipSettingsProvider) {

        pipSettingsProvider.addTab({
            state: 'sessions',
            index: 1,
            icon: 'icons:globe',
            iconClass: 'bg-color-5',
            title: 'ACTIVE_SESSIONS',
            stateConfig: {
                url: '/sessions',
                controller: SessionsSettingsController,
                controllerAs: '$ctrl',
                templateUrl: 'settings/sessions_settings/SessionsSettings.html',
                auth: true
            }
        });

        pipSettingsProvider.setDefaultTab('sessions');
    };

    const stringConfig = function (pipTranslateProvider) {
        // Set translation strings for the module
        pipTranslateProvider.translations('en', {
            'ACTIVE_SESSIONS': 'Active sessions',
            'SETTINGS_TITLE': 'Settings',
            'SETTINGS_BASIC_INFO_TITLE': 'Basic info',
            'SETTINGS_ACTIVE_SESSIONS_TITLE': 'Active sessions',
            'SETTINGS_ACTIVE_SESSIONS_SUBTITLE': ' If you notice any unfamiliar devices or locations, click' +
                '"Close Session" to end the session.',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_SESSION': 'Close session',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_ACTIVE_SESSIONS': 'Close active sessions',
            'SETTINGS_ACTIVE_SESSION_OS': 'OS: ',
            'SETTINGS_ACTIVE_SESSION_IP': 'IP: ',
            'SETTINGS_ACTIVE_SESSION_ACTIVE': 'active',
            'SETTINGS_ACTIVE_SESSION_INACTIVE': 'inactive',
            'ERROR_WRONG_PASSWORD': 'Wrong password',
            'ERROR_IDENTICAL_PASSWORDS': 'Old and new passwords are identical',
            'REPEAT_PASSWORD_INVALID': 'Password does not match',
            'ERROR_EMAIL_INVALID': 'Please, enter a valid email'
        });

        pipTranslateProvider.translations('ru', {
            'SETTINGS_TITLE': 'Настройки',
            'ACTIVE_SESSIONS': 'Активные сессии',
            'SETTINGS_BASIC_INFO_TITLE': 'Основные данные',
            'SETTINGS_ACTIVE_SESSIONS_TITLE': 'Активные сессии',
            'SETTINGS_ACTIVE_SESSIONS_SUBTITLE': 'Если вы заметили какие-либо незнакомые устройства или ' +
                'месторасположение, нажмите кнопку "Закончить сеанс", чтобы завершить сеанс.',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_SESSION': 'Закрыть сессию',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_ACTIVE_SESSIONS': 'Закрыть активные сессии',
            'SETTINGS_ACTIVE_SESSION_OS': 'ОС: ',
            'SETTINGS_ACTIVE_SESSION_IP': 'IP: ',
            'SETTINGS_ACTIVE_SESSION_ACTIVE': 'Активно',
            'SETTINGS_ACTIVE_SESSION_INACTIVE': 'Не активно',
            'THEME': 'Тема',
            'HINT_PASSWORD': 'Минимум 6 знаков',
            'HINT_REPEAT_PASSWORD': 'Повторите пароль',
            'ERROR_WRONG_PASSWORD': 'Неправильный пароль',
            'ERROR_IDENTICAL_PASSWORDS': 'Старый и новый пароли идентичны',
            'REPEAT_PASSWORD_INVALID': 'Пароль не совпадает',
            'ERROR_EMAIL_INVALID': 'Пожалуйста, введите правильный почт.адрес'
        });
    }


    angular.module('iqsSessionsSettings', [
        'pipSettings.Service',
        'pipSettings.Page',
        'iqsSessions.Data'
    ])
        .config(config)
        .config(stringConfig);
}