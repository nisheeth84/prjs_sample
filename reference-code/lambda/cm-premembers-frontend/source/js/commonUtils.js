import uuid from 'uuid';
import config from './config.js'
import parserExcludedResources from './parserExcludedResources.js'
import moment from 'moment-timezone';
import UAParser from 'ua-parser-js'

const pm_uuid = function() {
    return uuid.v4()
}

const dataTypeSort = {
    "ASC" : {
        "larger": 1,
        "less": -1
    },
    "DESC" : {
        "larger": -1,
        "less": 1
    }
}

function sortByListSortConditions(firstItem, secondItem, listSortConditions, indexTest = 0) {
    let infoSort = listSortConditions[indexTest]
    if (infoSort === undefined) {
        return 0
    }

    if (firstItem[infoSort.key] > secondItem[infoSort.key]) {
        return dataTypeSort[infoSort.type]['larger']
    }

    if (firstItem[infoSort.key] < secondItem[infoSort.key]) {
        return dataTypeSort[infoSort.type]['less']
    }

    return sortByListSortConditions(firstItem, secondItem, listSortConditions, ++indexTest)
}

function getPolicyName(resourceNameMix) {
    let resourceMix = resourceNameMix.split(",")
    if (resourceMix.length < 1) {
        return ""
    }

    return resourceMix[0]
}

function getResourceName(resourceNameMix) {
    let resourceMix = resourceNameMix.split(",")
    if (resourceMix.length < 2) {
        return ""
    }
    return resourceMix[1]
}

const checkStatus = function(response) {
    if (response.ok) {
        return response
    } else {
        if (response.body) {
            throw response.json()
        } else {
            const errorObj = {
                "code": "999",
                "message": i18next.t('Error_message.client_error_message'),
                "errorId": "",
                "description": i18next.t('Error_message.client_error_description')
            }
            throw Promise.resolve(errorObj);
        }
    }
};

const cognitoSessionError = function(observer, cognitoUser) {
    observer.trigger('pm-loader-hide');
    const errorObj = {
        'code': '999',
        'message': i18next.t('Error_message.auth_error_message'),
        'errorId': '',
        'description': i18next.t('Error_message.auth_error_description')
    }
    const promiseErrorObj = Promise.resolve(errorObj);
    observer.trigger('error-modal-open', promiseErrorObj);
    observer.one('error-modal-close', function() {
        signOut(cognitoUser)
    });
}

const submitChange = function(form, flag) {
    for (var i = 0; i < form.length; i++) {
        if (form[i].type == 'submit') {
            form[i].disabled = flag;
        }
    }
}

var param = {}
const paramReceiver = function(key) {
    if (param[key]) {
        return param[key]
    } else {
        return null
    }
}
let myOrganizations = {}
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
const getMyOrganization = function(idToken, organizationId) {
    if (!isEmpty(myOrganizations)) {
        let ret
        myOrganizations.forEach(function(myOrganization) {
            if (myOrganization.organization.id === organizationId) {
                ret = Promise.resolve(myOrganization)
            }
        })
        return ret
    } else {
        const requestOrganizationUrl = config.APIGATEWAY_ADDRESS + '/myorganizations';
        const inviteParam = "?inviteStatus=1"
        let fetchResponse
        return fetch(requestOrganizationUrl + inviteParam, {
            method: "GET",
            headers: {
                'Authorization': idToken
            }
        }).then(function(response) {
            fetchResponse = response
            return response
        }).then(checkStatus)
            .then(function(response) {
                return response.json();
            }).then(function(myOrganizations) {
                setMyOrganizations(myOrganizations)
                let ret
                myOrganizations.forEach(function(myOrganization) {
                    if (myOrganization.organization.id === organizationId) {
                        ret = Promise.resolve(myOrganization)
                    }
                })
                return ret
            }).catch(function(error) {
                error.then(function(value) {
                    value.responseStatus = fetchResponse.status //エラー発生時にResponseを格納したオブジェクトからステータスコードを格納しておく
                })
                throw error
            })
    }
}

const setMyOrganizations = function(param) {
    myOrganizations = param
}

const convertShowAuthority = function(value) {
    return i18next.t(myDictionary['Authority'][value])
}

const convertShowReportStatus = function(value) {
    let message = myDictionary['ReportStatus'][value]
    if (!message) {
        message = 'エラー'
    }
    return message
}

const convertExcelOutputStatus = function(value) {
    return myDictionary['OutputReportStatus'][value]
}

const convertInviteStatus = function(value) {
    return i18next.t(myDictionary['InvitationStatus'][value])
}

const convertEffectiveText = function(value) {
    return i18next.t(myDictionary['Effective'][value])
}

let myDictionary = {}

const getMyDictionary = function() {
    if (!isEmpty(myDictionary)) {
        return myDictionary
    }
}

const setDictionary = function(param) {
    myDictionary = param
}

const paramSender = function(obj) {
    Object.keys(obj).forEach(function(key) {
        param[key] = obj[key]
    });
}

const isOwner = function(organization) {
    const result = organization.authority === myDictionary.AuthorityOwner
    return result
}
const isEditor = function(organization) {
    const result = organization.authority >= myDictionary.AuthorityEditor
    return result
}

const submitEnable = function(form) {
    submitChange(form, false)
}
const submitDisable = function(form) {
    submitChange(form, true)
}

const backHome = function(value) {
    if (value.errorCode === myDictionary.APIErrorCode.AuthorizationError) {
        window.location.href = "#/home/";
        return
    }
    if (value.responseCode === 403) {
        this.signOut()
        return
    }
}

const signOut = function(cognitoUser) {
    removeItemFromLocalStorage("language")

    if (!cognitoUser) {
        const cognitoUserMixin = riot.mixin('cognitoUser', cognitoUser);
        cognitoUser = cognitoUserMixin
    }

    if (cognitoUser.signInUserSession == null) {
        cognitoUser.getSession(function(err) {
            if (err) {
                cognitoUser.signOut();
                window.location.href = "#";
            } else {
                globalSignOut(cognitoUser);
            }
        });
    } else {
        globalSignOut(cognitoUser);
    }
}

function globalSignOut(cognitoUser, tries=3, delay=1, backoff=3, retry=1) {
    cognitoUser.globalSignOut({
        onSuccess: () => {
            cognitoUser.signOut();
            window.location.href = "#";
        },
        onFailure: (err) => {
            if (err.code == 'NotAuthorizedException' || err.message == 'User is not authenticated') {
                cognitoUser.signOut();
                window.location.href = "#";
            } else {
                if (retry == 1) {
                    riot.obs_footer.trigger('pm-common-loader-show');
                }
                if (retry >= tries) {
                    const errorObj = {
                        "errorTitle": i18next.t('Error_message.signOut_error_title'),
                        "message": i18next.t('Error_message.signOut_error_message')
                    }
                    riot.obs_footer.trigger('error-common-modal-open', Promise.resolve(errorObj));
                    riot.obs_footer.one("error-common-modal-close", function() {
                        cognitoUser.signOut();
                        window.location.href = "#";
                    })
                    riot.obs_footer.trigger('pm-common-loader-hide');
                } else {
                    setTimeout(() => {
                        globalSignOut(cognitoUser, tries, delay * backoff, backoff, retry + 1);
                    }, delay * 1000);
                }
            }
        }
    });
}

const isNeedLoginPage = function() {
    let hash = location.hash
    const notLoginUrlPatternLst = [
        '',
        '#/',
        '#/sign_in/',
        '#/sign_up.*/',
        '#/user/registration/',
        '#/reset_password/',
        '#/reset_password_complete/',
        '#/emailchangecomplete.html',
        '#/force_change_password/'
    ]
    let returnFlag = true
    notLoginUrlPatternLst.forEach(function(notLoginUrlPattern) {
        let re = new RegExp('^' + notLoginUrlPattern + '$')
        if (re.test(hash)) {
            returnFlag = false
            return false
        }
    })
    return returnFlag
}

/**
 * Replace location.hash with location.search.
 * e.g. https://insightwatch.io/app/#/user/info/ -> https://insightwatch.io/app/?entry=%2Fuser%2Finfo%2F
 * @param {Object} _location window.location object
 */
const handleEntryUrl = function(_location) {
    let entry = ''
    if (_location.hash.length > 1) {
        let hash = _location.hash.split('?')[0]
        entry = '?entry=' + encodeURIComponent(hash.replace('#', ''))
    }
    _location.href = entry;
}

const showOtherBrowerAccessWarning = function(){
    const parser = new UAParser();
    const browserName = parser.getBrowser().name
    if(browserName !== 'Chrome'){
        let hash = location.hash
        const SignInSignUpPatternLst = [
            '',
            '#/',
            '#/sign_in/',
            '#/sign_up.*/',
        ]
        let showWarningPage = false 
        SignInSignUpPatternLst.forEach(function(showWarningUrlPattern) {
            let re = new RegExp('^' + showWarningUrlPattern + '$')
            if (re.test(hash)) {
                showWarningPage = true
                return false
            }
        })
        return browserName !== 'Chrome' && showWarningPage
    }else{
        return false
    }
}

function groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    })
}

function displayDate(date, dateFormat='YYYY/MM/DD HH:mm:ss') {
    return moment.utc(date, 'YYYY-MM-DD HH:mm:ss').tz(i18next.t('time_zone')).format(dateFormat);
}

function parseHtml(tag, description) {
    tag.root.innerHTML = description
}

function parseHtmlByRef(object, description) {
    object.innerHTML = description
}

function canUseLocalStorage(){
    const mod = "insightwatch"
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch(e) {
        console.warn("can not use localstorage.")
        return false;
    }
}

function getItemFromLocalStorage(key) {
    if(canUseLocalStorage()){
        return localStorage.getItem(key)
    }else{
        return false
    }
}

function setItemToLocalStorage(key, value) {
    if(canUseLocalStorage()){
        localStorage.setItem(key,value)
    }else{
        return false
    }
}

function removeItemFromLocalStorage(key) {
    if (canUseLocalStorage()) {
        localStorage.removeItem(key);
        return true
    } else {
        return false
    }
}

function getLocalStorageKey(value){
    return myDictionary['LocalStorageKey'][value]
}

function getClassIconCheckCIS(itemCheckCis) {
    let iconClass = ''
    switch (itemCheckCis) {
        case 'CHECK_CIS_ITEM_1_14':
        case 'CHECK_CIS_ITEM_1_21':
        case 'CHECK_CIS_ITEM_2_02':
        case 'CHECK_CIS_ITEM_2_07':
        case 'CHECK_CIS_ITEM_2_08':
        case 'CHECK_CIS_ITEM_3_06':
        case 'CHECK_CIS_ITEM_3_07':
        case 'CHECK_CIS_ITEM_3_09':
        case 'CHECK_CIS_ITEM_3_10':
        case 'CHECK_CIS_ITEM_3_11':
        case 'CHECK_CIS_ITEM_4_03':
        case 'CHECK_CIS_ITEM_4_04':
        case 'CHECK_CIS_ITEM_4_05':
        case 'CHECK_CIS12_ITEM_1_14':
        case 'CHECK_CIS12_ITEM_1_19':
        case 'CHECK_CIS12_ITEM_2_02':
        case 'CHECK_CIS12_ITEM_2_07':
        case 'CHECK_CIS12_ITEM_2_08':
        case 'CHECK_CIS12_ITEM_2_09':
        case 'CHECK_CIS12_ITEM_3_06':
        case 'CHECK_CIS12_ITEM_3_07':
        case 'CHECK_CIS12_ITEM_3_09':
        case 'CHECK_CIS12_ITEM_3_10':
        case 'CHECK_CIS12_ITEM_3_11':
        case 'CHECK_CIS12_ITEM_4_03':
        case 'CHECK_CIS12_ITEM_4_04':
            iconClass = 'icon fa-warning text-warning'
            break
        default:
            iconClass = 'icon fa-exclamation-circle text-danger'
            break
    }
    return iconClass
}

function checkConfirmationCode(event) {
    const elem = event.srcElement
    let validationMessage = ''
    if (!/[0-9]{6,}/.test(elem.value)) {
        validationMessage = i18next.t('Validation_message.incorrect_code_confirm')
    }
    if (elem.value === '') {
        validationMessage = i18next.t('Validation_message.invalid_require')
    }
    elem.setCustomValidity(validationMessage);
}

function checkMessageInput(event) {
    let validationMessage = ''
    const elem = event.srcElement
    if (elem.value === '') {
        validationMessage = i18next.t('Validation_message.invalid_require')
    }
    elem.setCustomValidity(validationMessage);
}

function backSignin() {
    window.location.href = "#/sign_in/";
}

function readFileJson(pathFile) {
    return fetch(pathFile).then(function(response) {
        return response.json();
    })
}

function getLanguageFromBrowser() {
    let list_language = ['ja', 'en']
    let language = window.navigator.language.substr(0, 2)

    if (!list_language.includes(language)) {
      language = 'en'
    }
    return language
}

const callApiWithLoader = function(tag, url, method, body=null, showModalError=true) {
    tag.obs.trigger('pm-loader-show');
    return callApi(tag, url, method, body, showModalError).then(function(response) {
        tag.obs.trigger('pm-loader-hide');
        return response;
    }).catch(function(error) {
        tag.obs.trigger('pm-loader-hide');
        throw error
    });
}

const callApi = function(tag, url, method, body=null, showModalError=true) {
    return tag.cognitoUser.getSession(function(err, session) {
        if (err) {
            tag.commonUtils.cognitoSessionError(tag.obs, tag.cognitoUser)
        } else {
            let idToken = session.getIdToken().getJwtToken();
            let fetchResponse = null
            let request_params = {
                method: method,
                headers: {
                    'Authorization': idToken
                }
            }
            if (body != null) {
                request_params['body'] = JSON.stringify(body)
            }
            return fetch(url, request_params).then(function(response) {
                fetchResponse = response
                return response
            })
                .then(tag.commonUtils.checkStatus)
                .then(function(response) {
                    return response.json().catch(function(){});
                }).catch(function(error) {
                    error.then(function(value) {
                        value.responseStatus = fetchResponse.status //エラー発生時にResponseを格納したオブジェクトからステータスコードを格納しておく
                    })

                    if (showModalError) {
                        tag.obs.trigger('error-modal-open', error);
                        tag.obs.one('error-modal-close', function(value) {
                            tag.commonUtils.backHome(value)
                        })
                    }
                    throw error
                })
        }
    });
}

function getCurrentTime() {
    return new Date().getTime()
}

function getTitleCheckItem(checkItemCode) {
    const typeCheck = checkItemCode.match(/CIS|ASC|IBP/)[0]
    return i18next.t(typeCheck + "." + checkItemCode + ".title")
}

function getItemCodeCheckItem(checkItemCode) {
    const typeCheck = checkItemCode.match(/CIS|ASC|IBP/)[0]
    return i18next.t(typeCheck + ".check_group_name") + " " + i18next.t(typeCheck + "." + checkItemCode + ".number") + " " + i18next.t(typeCheck + "." + checkItemCode + ".title")
}

function getDescriptionCheckItem(checkItemCode) {
    const typeCheck = checkItemCode.match(/CIS|ASC|IBP/)[0]
    const descriptionCheck = i18next.t(typeCheck + "." + checkItemCode, { returnObjects: true })
    let descriptions = []
    for (const key in descriptionCheck) {
        if (key.match("alert_criteria") || key.match("description_")) {
            descriptions.push(descriptionCheck[key]);
        }
    }
    return descriptions
}

function getAwsAccount(awsAccount, awsAccountName) {
    let result = awsAccount
    if (awsAccountName) {
        result += " | " + awsAccountName
    }
    return result
}

export default {
    'checkStatus': checkStatus,
    'submitEnable': submitEnable,
    'submitDisable': submitDisable,
    'signOut': signOut,
    'isEmpty': isEmpty,
    'cognitoSessionError': cognitoSessionError,
    'paramSender': paramSender,
    'paramReceiver': paramReceiver,
    'uuid': pm_uuid,
    'getMyOrganization': getMyOrganization,
    'setMyOrganizations': setMyOrganizations,
    'getMyDictionary': getMyDictionary,
    'setDictionary': setDictionary,
    'convertShowAuthority': convertShowAuthority,
    'convertInviteStatus': convertInviteStatus,
    'convertShowReportStatus': convertShowReportStatus,
    'convertEffectiveText': convertEffectiveText,
    'convertExcelOutputStatus': convertExcelOutputStatus,
    'isOwner': isOwner,
    'isEditor': isEditor,
    'backHome': backHome,
    'isNeedLoginPage': isNeedLoginPage,
    'handleEntryUrl': handleEntryUrl,
    'showOtherBrowerAccessWarning': showOtherBrowerAccessWarning,
    'groupBy' : groupBy,
    'displayDate' : displayDate,
    'parseHtml' : parseHtml,
    'getItemFromLocalStorage' : getItemFromLocalStorage,
    'setItemToLocalStorage': setItemToLocalStorage,
    'removeItemFromLocalStorage': removeItemFromLocalStorage,
    'getLocalStorageKey': getLocalStorageKey,
    'getClassIconCheckCIS' : getClassIconCheckCIS,
    'checkConfirmationCode' : checkConfirmationCode,
    'checkMessageInput' : checkMessageInput,
    'backSignin' : backSignin,
    'readFileJson' : readFileJson,
    'getLanguageFromBrowser' : getLanguageFromBrowser,
    'callApiWithLoader' : callApiWithLoader,
    'callApi' : callApi,
    'getCurrentTime' : getCurrentTime,
    'parseHtmlByRef': parseHtmlByRef,
    'getItemCodeCheckItem': getItemCodeCheckItem,
    'getDescriptionCheckItem': getDescriptionCheckItem,
    'getTitleCheckItem': getTitleCheckItem,
    'getAwsAccount': getAwsAccount,
    'getExcludedResourcesByCheckCodeItem': parserExcludedResources.getExcludedResourcesByCheckCodeItem,
    'getPolicyName': getPolicyName,
    'getResourceName': getResourceName,
    'sortByListSortConditions': sortByListSortConditions
}
