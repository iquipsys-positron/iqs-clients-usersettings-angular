import { IIncidentsSettingsSaveService } from './IIncidentsSettingsSaveService';

class IncidentsSettingsSaveService implements IIncidentsSettingsSaveService {
    private _expandedIds: string[];

    constructor(
        private $log: ng.ILogService,
    ) {
        "ngInject";

    }

    public set expandedIds(expandedIds: string[]) {
        this._expandedIds = expandedIds;
    }

    public get expandedIds(): string[] {
        return this._expandedIds;
    }

}

{
    angular.module('iqsIncidentsSettings.SaveService', [])
        .service('iqsIncidentsSettingsSaveService', IncidentsSettingsSaveService);

}