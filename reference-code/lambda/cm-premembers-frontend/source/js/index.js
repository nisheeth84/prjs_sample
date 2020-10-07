import 'bootstrap/bootstrap';
import 'multi-select/jquery.multi-select'
import 'webui-popover/jquery.webui-popover'
import './tags/common/container/HomeContainer.tag.html';
import './tags/common/container/ResetPasswordContainer.tag.html';
import './tags/common/container/ResetPasswordCompleteContainer.tag.html';
import './tags/report/container/ReportListContainer.tag.html';
import './tags/common/container/SigninContainer.tag.html';
import './tags/common/container/ForceChangePasswordContainer.tag.html';
import './tags/common/container/SignOutContainer.tag.html';
import './tags/common/container/ClientErrorContainer.tag.html';
import './tags/common/container/DeleteConfirmModalContainer.tag.html';
import './tags/common/component/ErrorModal.tag.html';
import './tags/common/component/ErrorCommonModal.tag.html';
import './tags/common/component/PmRouter.tag.html';
import './tags/common/component/PmLoading.tag.html';
import './tags/common/component/PmCommonLoading.tag.html';
import './tags/doc/container/AWSCoopsDescriptionContainer.tag.html';
import './tags/doc/container/CheckDescriptionContainer.tag.html';
import './tags/doc/container/StepSummaryContainer.tag.html';
import './tags/organizations/container/InvitationsContainer.tag.html'
import './tags/organizations/container/OrganizationsListContainer.tag.html'
import './tags/organizations/container/OrganizationInformationContainer.tag.html'
import './tags/organizations/container/OrganizationCreateContainer.tag.html'
import './tags/organizations/container/OrganizationEditContainer.tag.html'
import './tags/organizations/container/OrganizationNotifyContainer.tag.html'
import './tags/organizations/container/ProjectsListContainer.tag.html'
import './tags/organizations/container/ProjectInformationContainer.tag.html'
import './tags/organizations/container/ProjectCreateContainer.tag.html'
import './tags/organizations/container/ProjectEditContainer.tag.html'
import './tags/organizations/container/UsersListContainer.tag.html'
import './tags/organizations/container/UserAuthorityContainer.tag.html'
import './tags/organizations/container/UserInviteContainer.tag.html'
import './tags/organizations/container/AwsCoopsListContainer.tag.html'
import './tags/organizations/container/AwsCoopsCreateContainer.tag.html'
import './tags/check/container/CheckResultContainer.tag.html';
import './tags/check/container/CheckHistoryContainer.tag.html';
import './tags/check/container/CheckExecuteContainer.tag.html';
import './tags/check/container/CheckIntegrationsContainer.tag.html';
import './tags/check/container/CheckItemSettingsContainer.tag.html';
import './tags/check/container/CheckItemSettingsCopyContainer.tag.html';
import './tags/report/container/ReportListContainer.tag.html';
import './tags/report/container/ReportCreateContainer.tag.html';
import './tags/report/container/ReportInformationContainer.tag.html';
import './tags/signup/container/SignUpContainer.tag.html';
import './tags/signup/container/SignUpConfirmContainer.tag.html';
import './tags/signup/container/SignUpCompleteContainer.tag.html';
import './tags/user/container/UserAttributeRegistrationContainer.tag.html';
import './tags/user/container/UserAttributeUpdateContainer.tag.html';
import './tags/user/container/UserAttributeInfoContainer.tag.html';
import './tags/user/container/UserAttributeUpdateMailContainer.tag.html';
import './tags/user/container/UserAttributeUpdateMailCompleteContainer.tag.html';
import './vendor.js';

import pm_mixin from './pm_mixin.js'
import pm_dictionary from './dictionary.js'
import trans from './trans.js'

import {
  CognitoUserPool
} from 'amazon-cognito-identity-js';
const poolData = {
  UserPoolId: pm_mixin.config.COGNITO_USER_POOL_ID,
  ClientId: pm_mixin.config.COGNITO_CLIENT_ID
};
const userPool = new CognitoUserPool(poolData);
const cognitoUser = userPool.getCurrentUser()
window.console.log(pm_mixin.config.COMMIT_TAG)
if (!cognitoUser && pm_mixin.commonUtils.isNeedLoginPage()) {
  pm_mixin.commonUtils.handleEntryUrl(window.location)
} else {
  if (cognitoUser) {
    riot.mixin('cognitoUser', cognitoUser);
  }
}

trans.initI18Next().then(function() {
  pm_dictionary.getDictionary().then(function(value) {
    pm_mixin.commonUtils.setDictionary(value)
    riot.mixin(pm_mixin)
    riot.mount('pm-router');
  });
})
