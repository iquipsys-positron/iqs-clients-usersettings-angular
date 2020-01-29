class SettingsParams {
    public item: iqs.shell.IncidentSettings;
}

interface IIncidentsExclusionBindings {
    [key: string]: any;

    ngDisabled: any;
    item: any;
    saveSettings: any;
}

const IncidentsExclusionBindings: IIncidentsExclusionBindings = {
    ngDisabled: '&?',
    item: '<?iqsIncidentSettingsItem',
    saveSettings: '&iqsSave',
}

class IncidentsExclusionChanges implements ng.IOnChangesObject, IIncidentsExclusionBindings {
    [key: string]: ng.IChangesObject<any>;
    // Not one way bindings
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
    item: ng.IChangesObject<iqs.shell.IncidentSettings>;
    saveSettings: ng.IChangesObject<() => ng.IPromise<void>>;
}

class IncidentsExclusionController implements ng.IController {
    public $onInit() { }
    public objectInclude: iqs.shell.MultiSelectDialogData[];
    public objectExclude: iqs.shell.MultiSelectDialogData[];
    public ngDisabled: () => boolean;
    public saveSettings: (params: SettingsParams) => void
    public item: iqs.shell.IncidentSettings;
    public includeSearch: string;
    public excludeSearch: string;
    public variants: any[];
    private debouncedChanged: Function;

    constructor(
        private $element: JQuery,
        private $window: ng.IWindowService,
        private $state: angular.ui.IStateService,
        private $log: ng.ILogService,
        private iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private iqsObjectGroupsViewModel: iqs.shell.IObjectGroupsViewModel,

    ) {
        "ngInject";

        $element.addClass('iqs-incidents-exclusion-panel');

        // this.debouncedChanged = _.debounce(() => {
        //     this.item.include_object_ids = this.getIds(this.objectInclude, SearchObjectTypes.ControlObject);
        //     this.item.include_group_ids = this.getIds(this.objectInclude, SearchObjectTypes.ObjectGroup);

        //     this.item.exclude_object_ids = this.getIds(this.objectExclude, SearchObjectTypes.ControlObject);
        //     this.item.exclude_group_ids = this.getIds(this.objectExclude, SearchObjectTypes.ObjectGroup);
        //     this.saveSettings({ item: this.item });
        // }, 1000);

    }

    private getCollection(collection: any[], collectionIds: string[], type?: string): iqs.shell.MultiSelectDialogData[] {
        let result: iqs.shell.MultiSelectDialogData[] = [];

        _.each(collectionIds, (id: string) => {
            let index = _.findIndex(collection, { id: id });
            if (index != -1) {
                let item = collection[index];
                item.object_type = type;
                result.push(item);
            }
        });

        return result;
    }

    private getIds(collection: any[], entityType?: string): string[] {
        let result: string[] = [];
        _.each(collection, (item: any) => {
            if (entityType && item.object_type == entityType) {
                result.push(item.id);
            }
        });

        return result;
    }

    private prepare() {
        this.variants = [];
        let includeObjects: iqs.shell.MultiSelectDialogData[];
        let includeObjectGroups: iqs.shell.MultiSelectDialogData[];
        let excludeObjects: iqs.shell.MultiSelectDialogData[];
        let excludeObjectGroups: iqs.shell.MultiSelectDialogData[];

        _.each(this.iqsObjectsViewModel.allObjects, (item: any) => {
            item.object_type = iqs.shell.SearchObjectTypes.ControlObject;
            this.variants.push(item);
        });
        _.each(this.iqsObjectGroupsViewModel.getCollection(
            () => {
                this.prepare();
            }
        ), (item: any) => {
            item.object_type = iqs.shell.SearchObjectTypes.ObjectGroup;
            this.variants.push(item);
        });

        includeObjects = this.getCollection(this.iqsObjectsViewModel.allObjects, this.item.include_object_ids, iqs.shell.SearchObjectTypes.ControlObject);
        includeObjectGroups = this.getCollection(this.iqsObjectGroupsViewModel.getCollection(), this.item.include_group_ids, iqs.shell.SearchObjectTypes.ObjectGroup);
        excludeObjects = this.getCollection(this.iqsObjectsViewModel.allObjects, this.item.exclude_object_ids, iqs.shell.SearchObjectTypes.ControlObject);
        excludeObjectGroups = this.getCollection(this.iqsObjectGroupsViewModel.getCollection(), this.item.exclude_group_ids, iqs.shell.SearchObjectTypes.ObjectGroup);

        this.objectInclude = _.unionBy(includeObjects, includeObjectGroups, 'id');
        this.objectExclude = _.unionBy(excludeObjects, excludeObjectGroups, 'id');
    }

    public $onChanges(changes: IncidentsExclusionChanges): void {
        this.prepare();
    }

    public onChange(): void {
        // this.debouncedChanged();
        this.item.include_object_ids = this.getIds(this.objectInclude, iqs.shell.SearchObjectTypes.ControlObject);
        this.item.include_group_ids = this.getIds(this.objectInclude, iqs.shell.SearchObjectTypes.ObjectGroup);

        this.item.exclude_object_ids = this.getIds(this.objectExclude, iqs.shell.SearchObjectTypes.ControlObject);
        this.item.exclude_group_ids = this.getIds(this.objectExclude, iqs.shell.SearchObjectTypes.ObjectGroup);
        this.saveSettings({ item: this.item });
    }

    public getVariantsInclude(search: string) {
        let res = _.filter(this.variants, (variant: any) => {
            return variant.name.toLowerCase().includes(search.toLowerCase()) ||
                variant.id.toLowerCase().includes(search.toLowerCase());
        });

        return _.differenceBy(res, this.objectInclude, 'id');
    }

    public getVariantsExclude(search: string) {
        let res = _.filter(this.variants, (variant: any) => {
            return variant.name.toLowerCase().includes(search.toLowerCase()) ||
                variant.id.toLowerCase().includes(search.toLowerCase());
        });

        return _.differenceBy(res, this.objectExclude, 'id');
    }
}

(() => {



    const incidentsExclusion: ng.IComponentOptions = {
        bindings: IncidentsExclusionBindings,
        templateUrl: 'settings/incidents_settings/panels/IncidentsExclusion.html',
        controller: IncidentsExclusionController
    }

    angular
        .module('iqsIncidentsSettings.ExclusionPanel', [
            'iqsFormats.ObjectFilter',
            'iqsObjects.ViewModel',
            'iqsObjectGroups.ViewModel',
        ])
        .component('iqsIncidentsExclusion', incidentsExclusion);

})();