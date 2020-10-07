import pm_mixin from './pm_mixin.js'

const listLanguageSupport = ['ja', 'en']

function getResourcesI18next() {
    let languageConfig = {}
    let promises = []
    listLanguageSupport.forEach(function(languageSupport) {
        languageConfig[languageSupport] = {
            translation: {}
        }
        promises.push(
            new Promise(function(resolve) {
                pm_mixin.commonUtils.readFileJson('./assets/javascripts/language/' + languageSupport + '.json').then(function(json) {
                    languageConfig[languageSupport]['translation'] = Object.assign(languageConfig[languageSupport]['translation'], json)
                    resolve(languageConfig);
                })
            })
        )
    })
    return Promise.all(promises)
}

function initI18Next() {
    return getResourcesI18next().then(function(resources) {
        i18next.init({
            fallbackLng: 'en',
            debug: false,
            resources: resources[0]
        }, function() {
            let language = pm_mixin.commonUtils.getItemFromLocalStorage('language')
            if (language == null) {
                language = window.navigator.language.substr(0, 2)
            }
            i18next.changeLanguage(language);
        });
    });
}

export default {
    'initI18Next': initI18Next
}
