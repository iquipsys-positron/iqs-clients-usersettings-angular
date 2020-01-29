angular.module('iqsGlobalSettings', [
    'pipSettings',
    'iqsUserSettings',
    'iqsSessionsSettings',
    'iqsIncidentsSettings'
]);

import './incidents_settings/IncidentsSettings';
import './user_settings/UserSettings';
import './sessions_settings/SessionsSettings';