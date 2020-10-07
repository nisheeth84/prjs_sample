import config from './config.js'
import commonUtils from './commonUtils.js'

function pm_mixin_init() {
    String.prototype.format = function() {
        var text = this;
        for (var argument in arguments) {
            text = text.replace(new RegExp("\\{" + argument + "\\}", 'g'), arguments[argument]);
        }
        return text
    }
}

export default {
    'init': pm_mixin_init,
    'config': config,
    'commonUtils': commonUtils,
    '_t': i18next.t
}
