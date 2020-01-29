import { IIncidentsSettingsSaveService } from './IIncidentsSettingsSaveService';

class Exclusion {
    public only?: any[];
    public except?: any[];
}

class IncidentsSettingsController implements ng.IController {
    public $onInit() { }
    private incidentBaseKey: string = 'incident_rules';
    private debouncedChanged: Function;
    public currState: string;
    public incidentEventRuleSettings: iqs.shell.IncidentSettings[] = []
    private emailData: iqs.shell.EmailSettings;
    private phoneData: iqs.shell.SmsSettings;
    public typeCollection: iqs.shell.TypeCollection;
    public isPreLoading: boolean = true;
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $scope: ng.IScope,
        private pipNavService: pip.nav.INavService,
        private iqsEventRulesViewModel: iqs.shell.IEventRulesViewModel,
        private iqsSettingsViewModel: iqs.shell.ISettingsViewModel,
        private iqsEmailSettingsData: iqs.shell.IEmailSettingsDataService,
        private iqsSmsSettingsData: iqs.shell.ISmsSettingsDataService,
        private iqsIncidentsSettingsSaveService: IIncidentsSettingsSaveService,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        this.appHeader();
        const runWhenReady = () => {
            iqsTypeCollectionsService.init();
            this.typeCollection = iqsTypeCollectionsService.getIncidentSignalType();
            //read settings
            this.readSettings(() => {
                this.isPreLoading = false;
            });
        };

        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { runWhenReady(); }));

        this.debouncedChanged = _.debounce(() => {
            this.save();
        }, 1000);        
    }
    
    public $onDestroy() {
        this.saveState();
        this.save();
        for (const f of this.cf) { f(); }
    }

    private readSettings(successCallback?: () => void, errorCallback?: (error) => void): void {
        this.currState = iqs.shell.States.Progress;
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
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
        ],
            // optional callback
            (error, results) => {
                this.currState = iqs.shell.States.Data;
                this.init();
                if (successCallback && angular.isFunction(successCallback)) {
                    successCallback();
                }
            });
    }

    private saveState() {
        this.iqsIncidentsSettingsSaveService.expandedIds = [];

        _.each(this.incidentEventRuleSettings, (item: iqs.shell.IncidentSettings) => {
            if (item.expanded) {
                this.iqsIncidentsSettingsSaveService.expandedIds.push(item.rule_id);
            }
        });
    }

    private appHeader(): void {
        this.pipNavService.appbar.parts = { 'icon': true, 'actions': 'primary', 'menu': true, 'title': 'breadcrumb', 'organizations': true };
        this.pipNavService.actions.hide();
        this.pipNavService.appbar.removeShadow();
    }

    private restoreExpanded(incidentEventRuleSettings: iqs.shell.IncidentSettings[]): void {
        if (this.incidentEventRuleSettings && this.incidentEventRuleSettings.length > 0) {
            _.each(this.incidentEventRuleSettings, (item: iqs.shell.IncidentSettings) => {
                if (item.expanded) {
                    let index: number = _.findIndex(incidentEventRuleSettings, { rule_id: item.rule_id });

                    if (index > -1) {
                        incidentEventRuleSettings[index].expanded = true;
                    }
                }
            });
        } else if (this.iqsIncidentsSettingsSaveService.expandedIds && this.iqsIncidentsSettingsSaveService.expandedIds.length > 0) {
            _.each(incidentEventRuleSettings, (item: iqs.shell.IncidentSettings) => {
                if (this.iqsIncidentsSettingsSaveService.expandedIds.indexOf(item.rule_id) > -1) {
                    item.expanded = true;
                }
            });
        }
    }

    private getSignalType(emailSignal: boolean, smsSignal: boolean): string {
        if (emailSignal == null && smsSignal == null) return iqs.shell.IncidentSignalType.All;
        if (emailSignal === false && smsSignal === false) return iqs.shell.IncidentSignalType.None;
        if (emailSignal === false && smsSignal !== false) return iqs.shell.IncidentSignalType.Sms;
        if (emailSignal !== false && smsSignal === false) return iqs.shell.IncidentSignalType.Email;
    }

    private init(): void {
        let rules: iqs.shell.EventRule[] = _.filter(this.iqsEventRulesViewModel.getCollection(), { incident: true });
        let incidentSettings: iqs.shell.SettingsUncover[] = this.iqsSettingsViewModel.getSettingsBy(this.incidentBaseKey);

        let incidentEventRuleSettings: iqs.shell.IncidentSettings[] = [];

        _.each(rules, (r: iqs.shell.EventRule) => {
            let item: any = {
                rule_id: r.id,
                rule_name: r.name
            }

            let index: number = _.findIndex(incidentSettings, (s: iqs.shell.SettingsUncover) => {
                return this.incidentBaseKey + '_' + r.id === s.key;
            });
            let setting;
            if (index > -1) {
                setting = JSON.parse(incidentSettings[index].value, function (key, value) {
                    return value;
                });
            } else setting = {};

            item.enabled = setting.enabled === false ? false : true;
            item.include_object_ids = setting.include_object_ids ? setting.include_object_ids : [];
            item.exclude_object_ids = setting.exclude_object_ids ? setting.exclude_object_ids : [];
            item.include_group_ids = setting.include_group_ids ? setting.include_group_ids : [];
            item.exclude_group_ids = setting.exclude_group_ids ? setting.exclude_group_ids : [];

            let emailSignal: boolean = this.emailData.subscriptions && this.emailData.subscriptions[item.rule_id] != undefined ? this.emailData.subscriptions[item.rule_id] : null;
            let smsSignal: boolean = this.phoneData.subscriptions && this.phoneData.subscriptions[item.rule_id] != undefined ? this.phoneData.subscriptions[item.rule_id] : null;

            item.sendSignalType = this.getSignalType(emailSignal, smsSignal);

            this.iqsEventRulesViewModel.setObjectsDescriptions(item);
            incidentEventRuleSettings.push(item);
        });

        this.restoreExpanded(incidentEventRuleSettings);
        this.incidentEventRuleSettings = incidentEventRuleSettings;
    }

    public onSignalChange(s: iqs.shell.IncidentSettings): void {
        this.transaction.begin('SAVE_SETTINGS')

        async.parallel([
            (callback) => {
                if ((!this.emailData.subscriptions || this.emailData.subscriptions[s.rule_id] == undefined) && s.sendSignalType == iqs.shell.IncidentSignalType.All) {
                    callback();

                    return;
                }
                if (s.sendSignalType == iqs.shell.IncidentSignalType.All || s.sendSignalType == iqs.shell.IncidentSignalType.Email) {
                    if (this.emailData.subscriptions) {
                        delete this.emailData.subscriptions[s.rule_id];
                    }
                } else {
                    if (!this.emailData.subscriptions) {
                        this.emailData.subscriptions = {};
                    }
                    this.emailData.subscriptions[s.rule_id] = false;
                }
                // read email settings
                this.iqsEmailSettingsData.updateEmailSettings(
                    null,
                    this.emailData,
                    (data: iqs.shell.EmailSettings) => {
                        this.emailData = data;
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                if ((!this.phoneData.subscriptions || this.phoneData.subscriptions[s.rule_id] == undefined) && s.sendSignalType == iqs.shell.IncidentSignalType.All) {
                    callback();

                    return;
                }
                if (s.sendSignalType == iqs.shell.IncidentSignalType.All || s.sendSignalType == iqs.shell.IncidentSignalType.Sms) {
                    if (this.phoneData.subscriptions) {
                        delete this.phoneData.subscriptions[s.rule_id];
                    }
                } else {
                    if (!this.phoneData.subscriptions) {
                        this.phoneData.subscriptions = {};
                    }
                    this.phoneData.subscriptions[s.rule_id] = false;
                }
                // read sms settings
                this.iqsSmsSettingsData.updateSmsSettings(
                    null,
                    this.phoneData,
                    (data: iqs.shell.SmsSettings) => {
                        this.phoneData = data;
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
        ],
            // optional callback
            (error, results) => {
                this.transaction.end(error);
            });
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsSettingsViewModel.getTransaction();
    }

    public onDeferredSaveChanges(): void {
        this.debouncedChanged();
    }

    private save(): void {
        if (this.transaction.busy()) {
            return;
        }

        let s = _.cloneDeep(this.iqsSettingsViewModel.settings);
        this.iqsSettingsViewModel.deleteSettingsBy(s, this.incidentBaseKey);

        _.each(this.incidentEventRuleSettings, (item: iqs.shell.IncidentSettings) => {
            let sss = _.cloneDeep(item);
            delete sss.expanded;
            delete sss.rule_id;
            delete sss.rule_name;
            delete sss.sendSignalType;
            s[this.incidentBaseKey + '_' + item.rule_id] = JSON.stringify(sss);
        });

        delete s.$promise;
        delete s.$resolved;

        this.iqsSettingsViewModel.create(s,
            (settings: any) => {
                this.init();
            },
            (error: any) => {

            });
    }

    public onSave(item: iqs.shell.IncidentSettings): void {
        // todo update ruleDescription
        this.iqsEventRulesViewModel.setObjectsDescriptions(item);
    }
}


const config = function (pipSettingsProvider) {
    pipSettingsProvider.addTab({
        state: 'incidents',
        index: 1,
        icon: 'iqs:incident',
        iconClass: 'bg-incident',
        title: 'INCIDENT_SETTINGS_TITLE',
        stateConfig: {
            url: '/incidents',
            controller: IncidentsSettingsController,
            controllerAs: '$ctrl',
            templateUrl: 'settings/incidents_settings/IncidentsSettings.html',
            auth: true
        }
    });

    pipSettingsProvider.setDefaultTab('incidents');
};

angular
    .module('iqsIncidentsSettings', [
        'pipSettings.Service',
        'pipSettings.Page',
        'iqsFormats.EventRuleFilter',

        'iqsIncidentsSettings.ExclusionPanel',
        'iqsIncidentsSettings.SaveService',
        'iqsEventRules.ViewModel',
        'iqsSettings.ViewModel',
        'iqsEmailSettings.Data',
        'iqsSmsSettings.Data',
    ])
    .config(config);

import './panels/IncidentsExclusion';
import './IncidentsSettings';