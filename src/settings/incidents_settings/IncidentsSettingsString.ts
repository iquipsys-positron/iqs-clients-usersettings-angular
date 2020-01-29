
{
    function declareIncidentsSettingsResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            INCIDENT_SETTINGS_TITLE: 'Notification settings',
            SETTINGS_INCIDENT_INCLUDE_OBJECT_PLACEHOLDER: 'Applies to objects or groups',
            SETTINGS_INCIDENT_EXCLUDE_OBJECT_PLACEHOLDER: 'Excluding objects or groups',
            SETTINGS_INCIDENT_INCLUDE_OBJECT: 'Only for selected groups and objects',
            SETTINGS_INCIDENT_EXCLUDE_OBJECT: 'Except selected groups and objects',
            SETTING_INCIDENT_SIGNAL_TYPE: 'Send notification',
            INCIDENT_SETTINGS_EMPTY_TITLE: 'Notification settings not found',
            RULES_LOADING_TITLE: 'Loading rules',
        });
        pipTranslateProvider.translations('ru', {
            INCIDENT_SETTINGS_TITLE: 'Настройка уведомлений',
            SETTINGS_INCIDENT_INCLUDE_OBJECT_PLACEHOLDER: 'Применяется к объектам или группам',
            SETTINGS_INCIDENT_EXCLUDE_OBJECT_PLACEHOLDER: 'Исключая объекты или группы',
            SETTINGS_INCIDENT_INCLUDE_OBJECT: 'Только для выбранных групп и объектов',
            SETTINGS_INCIDENT_EXCLUDE_OBJECT: 'Кроме выбранных групп и объектов',
            SETTING_INCIDENT_SIGNAL_TYPE: 'Послылать уведомление',
            INCIDENT_SETTINGS_EMPTY_TITLE: 'Настройка уведомлений не найдена',
            RULES_LOADING_TITLE: 'Правила загружаются',
        });
    }

    angular
        .module('iqsIncidentsSettings')
        .config(declareIncidentsSettingsResources);
}
