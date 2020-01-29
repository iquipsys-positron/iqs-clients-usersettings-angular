(() => {
    function iqsPositronUserSettingsConfig(
        pipAuthStateProvider: pip.rest.IAuthStateProvider
    ) {
        pipAuthStateProvider.authorizedState = 'settings.user';
    }

    angular
        .module('iqsPositronUserSettings.Config', [
            'ngCookies',
            'iqsShell',
            'pipSettings',
            'pipSystem',
            'pipSystem.Templates',
        ])
        .config(iqsPositronUserSettingsConfig);
})();