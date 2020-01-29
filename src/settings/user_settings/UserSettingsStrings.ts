
{

    function declareUserSettingsResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            'SETTINGS_TITLE': 'Settings',
            'SETTINGS_USER_TITLE': 'User settings',
            'SETTINGS_BASIC_INFO_TITLE': 'Basic info',

            'SETTINGS_BASIC_INFO_FULL_NAME': 'First and last name',
            'SETTINGS_BASIC_INFO_VERIFY_HINT': 'Please, verify your email address.',
            'SETTINGS_BASIC_INFO_VERIFY_CODE': 'Verify email address',
            'SETTINGS_BASIC_INFO_DATE_CHANGE_PASSWORD': 'Your password was changed on ',
            'SETTINGS_BASIC_INFO_CHANGE_PASSWORD': 'Change your password',
            'SETTINGS_BASIC_INFO_NAME_HINT': 'Please, use your real name to let other people know who you are.',
            'SETTINGS_BASIC_INFO_WORDS_ABOUT_ME': 'Few words about yourself',

            'SETTINGS_BASIC_INFO_GENDER': 'Gender',
            'SETTINGS_BASIC_INFO_BIRTHDAY': 'Birthday',
            'SETTINGS_BASIC_INFO_LOCATION': 'Current location',
            'SETTINGS_BASIC_INFO_PRIMARY_EMAIL': 'Email',
            'SETTINGS_BASIC_INFO_FROM': 'User since ',
            'SETTINGS_BASIC_INFO_USER_ID': 'User ID',
            'SETTINGS_BASIC_INFO_LOGIN': 'Login',
            'SETTINGS_BASIC_INFO_DESCRIPTION': 'Position',

            'SETTINGS_CHANGE_PASSWORD_TITLE': 'Change password',
            'SETTINGS_CHANGE_PASSWORD_NEW_PASSWORD': 'New password',
            'SETTINGS_CHANGE_PASSWORD_REPEAT_RASSWORD': 'Repeat password',
            'SETTINGS_CHANGE_PASSWORD_CURRENT_PASSWORD': 'Current password',
            'THEME': 'Theme',
            'HINT_PASSWORD': 'Minimum 6 characters',
            'HINT_REPEAT_PASSWORD': 'Repeat password',
            'ERROR_WRONG_PASSWORD': 'Wrong password',
            'ERROR_IDENTICAL_PASSWORDS': 'Old and new passwords are identical',
            'REPEAT_PASSWORD_INVALID': 'Password does not match',
            'ERROR_EMAIL_INVALID': 'Please, enter a valid email',
            'iqt-main': 'Main theme',
            'iqt-accent': 'Additional theme',
            LOADING_USER_SETTINGS: 'Loading user settings',
            SETTINGS_BASIC_INFO_PHONE: 'Phone',
            SETTINGS_BASIC_INFO_PHONE_VERIFY_ERROR: 'Phone requires confirmation',
            SETTINGS_BASIC_INFO_PHONE_VALIDATE_ERROR: 'Enter a valid phone in e.164 format: +xxxxxxxxxxx',
            SETTINGS_BASIC_INFO_VERIFY_EMAIL_BUTTON: 'Confirm',
            SETTINGS_BASIC_INFO_VERIFY_PHONE_BUTTON: 'Confirm',
            SETTINGS_BASIC_INFO_EMAIL_NOT_VERIFY: 'Email address requires confirmation',

            CONIRM_EMAIL_DIALOG_SEND_CODE_TEXT_21: "If you haven't received email with code, press ",
            CONIRM_EMAIL_DIALOG_SEND_CODE_RESEND: 'resend',
            CONIRM_EMAIL_DIALOG_SEND_CODE_TEXT_22: 'to send it again.',

            CONIRM_SMS_DIALOG_SEND_CODE_TEXT_21: "If you haven't received sms with code, press ",
            CONIRM_SMS_DIALOG_SEND_CODE_RESEND: 'resend',
            CONIRM_SMS_DIALOG_SEND_CODE_TEXT_22: 'to send it again.',
        });
        pipTranslateProvider.translations('ru', {
            'SETTINGS_TITLE': 'Настройки',
            'SETTINGS_USER_TITLE': 'Настройки пользователя',
            'SETTINGS_BASIC_INFO_TITLE': 'Основные данные',
            'SETTINGS_ACTIVE_SESSIONS_TITLE': 'Активные сессии',

            'SETTINGS_BASIC_INFO_FULL_NAME': 'Имя и фамилия',
            'SETTINGS_BASIC_INFO_NAME_HINT': 'Пожалуйста, используйте реальное имя, чтоб люди могли вас узнать',
            'SETTINGS_BASIC_INFO_VERIFY_HINT': 'Пожалуйста, подтвердите адрес своей электронной почты',
            'SETTINGS_BASIC_INFO_VERIFY_CODE': 'Подтвердите адрес эл.почты',
            'SETTINGS_BASIC_INFO_DATE_CHANGE_PASSWORD': 'Ваш пароль был изменен ',
            'SETTINGS_BASIC_INFO_CHANGE_PASSWORD': 'Поменять пароль',
            'SETTINGS_BASIC_INFO_LOGIN': 'Логин',
            'SETTINGS_BASIC_INFO_DESCRIPTION': 'Должность',

            'SETTINGS_BASIC_INFO_WORDS_ABOUT_ME': 'Несколько слов о себе',
            'SETTINGS_BASIC_INFO_GENDER': 'Пол',
            'SETTINGS_BASIC_INFO_BIRTHDAY': 'Дата рождения',
            'SETTINGS_BASIC_INFO_LOCATION': 'Текущее местонахождение',
            'SETTINGS_BASIC_INFO_PRIMARY_EMAIL': 'Адрес эл. почты',
            'SETTINGS_BASIC_INFO_FROM': 'Начиная с',
            'SETTINGS_BASIC_INFO_USER_ID': 'Личный код',

            'SETTINGS_CHANGE_PASSWORD_TITLE': 'Изменить пароль',
            'SETTINGS_CHANGE_PASSWORD_NEW_PASSWORD': 'Новый пароль',
            'SETTINGS_CHANGE_PASSWORD_REPEAT_RASSWORD': 'Повтор',
            'SETTINGS_CHANGE_PASSWORD_CURRENT_PASSWORD': 'Текущий пароль',
            'THEME': 'Тема',
            'HINT_PASSWORD': 'Минимум 6 знаков',
            'HINT_REPEAT_PASSWORD': 'Повторите пароль',
            'ERROR_WRONG_PASSWORD': 'Неправильный пароль',
            'ERROR_IDENTICAL_PASSWORDS': 'Старый и новый пароли идентичны',
            'REPEAT_PASSWORD_INVALID': 'Пин код не совпадает',
            'ERROR_EMAIL_INVALID': 'Пожалуйста, введите правильный адрес эл.почты',
            'iqt-main': 'Основная тема',
            'iqt-accent': 'Дополнительная тема',
            LOADING_USER_SETTINGS: 'Загружаются настройки пользователя',
            SETTINGS_BASIC_INFO_PHONE: 'Телефон',
            SETTINGS_BASIC_INFO_PHONE_VERIFY_ERROR: 'Телефон требует подтверждения',
            SETTINGS_BASIC_INFO_PHONE_VALIDATE_ERROR: 'Используйте E.164 формат для телефонных номеров: +xxxxxxxxxxx',
            SETTINGS_BASIC_INFO_VERIFY_EMAIL_BUTTON: 'Подтвердить',
            SETTINGS_BASIC_INFO_VERIFY_PHONE_BUTTON: 'Подтвердить',
            SETTINGS_BASIC_INFO_EMAIL_NOT_VERIFY: 'Адрес  эл. почты требует подтверждения',

            CONIRM_EMAIL_DIALOG_SEND_CODE_TEXT_21: "Если вы не получили почтовое сообщение с кодом, нажмите ",
            CONIRM_EMAIL_DIALOG_SEND_CODE_RESEND: 'отправить снова',
            CONIRM_EMAIL_DIALOG_SEND_CODE_TEXT_22: '.',

            CONIRM_SMS_DIALOG_SEND_CODE_TEXT_21: "Если вы не получили СМС сообщение с кодом, нажмите ",
            CONIRM_SMS_DIALOG_SEND_CODE_RESEND: 'отправить снова',
            CONIRM_SMS_DIALOG_SEND_CODE_TEXT_22: '.',
        });
    }

    angular
        .module('iqsUserSettings')
        .config(declareUserSettingsResources);
}
