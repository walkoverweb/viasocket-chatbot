const BlockTypes = {
  FUNCTION: 'function',
  API: 'api',
  IFBLOCK: 'ifBlock',
  COMMENT: 'comment',
  VARIABLE: 'variable',
  RESPONSE: 'response',
  CRON: 'cron',
  PLUG: 'plugin',
  DRY_RUN: 'DRY_RUN',
  TRIGGER: 'trigger'
}

const DataTypes = {
  STRING: 'string',
  NUMBER: 'number',
  OBJECT: 'object'
}

const RequestTypes = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

const HeaderTypes = {
  CONTENT_TYPE: 'content-type',
  MULTIPART_FORM_DATA: 'multipart/form-data',
  APPLICATION_JSON: 'application/json',
  APPLICATION_FORM_URLENCODED: 'application/x-www-form-urlencoded'
}

const IfConditionColor = {
  TRUE: '#006400',
  FALSE: '#b8b8b8',
  ERROR: '#FF7F7F'
}

const WrapKeys = {
  WINDOWS: 'Alt-z',
  MAC: 'Control-z'
}

const MiscTypes = {
  CODE: 'code',
  FLOW: 'flow',
  CONTEXT: 'context',
  JAVASCRIPT: 'javascript',
  JSON: 'json',
  OBJECT: 'object',
  NOT_CHECK: 'notcheck',
  MAKE_COMMENT: 'makeComment',
  PROCESSING: 'processing',
  API_FUNCTION_PLUGIN_COMPONENT: 'apiFunctionPluginComponent',
  EMBED_MODE: 'embed',
  OAUTH_MODE: 'oauth',
  SSO_MODE: 'sso'
}

const sliderTypes = {
  FUNCTION: 'function',
  API: 'api',
  RESPONSE: 'response',
  PLUG: 'plugin',
  TRIGGER: 'trigger',
  SELECTTRIGGER: 'selecttrigger',
  CRON: 'cron',
  WEBHOOK: 'webhook',
  MARKETPLACE: 'marketplace',
  VARIABLE: 'variable',
  DH_FUNCTION: 'DH-Function',
  DH_AUTH2_SLIDER: 'DH-AUTH2-SLIDER',
  DRY_RUN: 'DRY_RUN',
  EMAIL: 'email',
  IFBLOCK: 'ifBlock'
}

export const CUSTOM_PLUGIN = {
  id: 'CUSTOM_PLUGIN',
  label: 'Custom Plugin'
}

const ApiTypes = {
  EMBED: 'embed',
  TEMPLATE: 'template',
  FLOW: 'flow',
  INTEGRATION: 'integration'
}

const EmbedVerificationStatus = {
  VERIFIED: 'verified',
  NOT_VERIFIED: 'notVerified',
  VERIFYING: 'verifying'
}

// const Domains = ['flow.viasocket.com', 'dev-flow.viasocket.com', 'localhost']

const ChatBotResponseTypes = {
  EXPRESSION: 'expression',
  PERFORM_API: 'perform_API',
  JSON: 'json',
  WORKFLOW: 'workflow',
  CODE: 'code',
  API: 'api'
}

const Tabnames = {
  PUBLISH: 'published',
  DRAFT: 'draft',
  LOG: 'logs',
  CONFIGURATION: 'configuration',
  SETUP: 'setup'
}

const ModalTypeEnums = {
  EMBEDPROJECTCREATE: 'createEmbedProject',
  TEMPLATECREATE: 'createTemplate',
  AUTHORIZE_ORG: 'authorize_org'
}
const ParamsEnums = {
  orgId: 'orgId',
  flowhitid: 'flowhitid',
  projectId: 'projectId',
  stepId: 'stepId',
  slugName: 'slugName',
  scriptId: 'scriptId',
  tabName: 'tabName',
  pluginId: 'pluginId',
  actionId: 'actionId',
  sectionKey: 'sectionKey',
  sectionId: 'sectionId',
  inviteId: 'inviteId',
  clientId: 'clientId',
  sectionIdOrScriptId: 'sectionIdOrScriptId',
  versionIdOrStepId: 'versionIdOrStepId',
  isPublishedTab: 'isPublishedTab',
  versionId: 'versionId',
  isTemplate: 'isTemplate',
  interfaceId: 'interfaceId',
  isConfiguration: 'isConfiguration',
  isLogs: 'isLogs',
  isSetup: 'isSetup',
  embedding: 'embedding',
  search: 'search',
  serviceId: 'serviceId',
  triggerId: 'triggerId',
  stepName: 'stepName',
  eventId: 'eventId'
}
const FunctionDummyData = {
  id: '',
  code: '',
  type: 'function',
  title: ''
}
const TemplateSettingEnums = {
  editable: 'editable',
  partialEditable: 'partialEditable',
  disabled: 'disabled',
  onlyNewStep: 'onlyNewStep'
}

const STEP_OPERATION_STATUS = {
  DELETE: 'DELETE',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DRAFTED: 'DRAFTED'
}
export const LOCAL_NOTFICATION_REQUIRED_FIELDS = {
  address: 'PLUGIN_REQUIRED_FIELDS',
  type: 'Error',
  message: 'Please fill all required fields'
}

export const LOCAL_NOTFICATION_UPDATE = {
  address: 'PLUGIN_UPDATE',
  type: 'Success',
  message: 'Update available',
  funcButtonText: 'Update'
}

export const ORG_DEFAULT_TIMEZONE = {
  utcOffset: '+05:30',
  identifier: 'Asia/Kolkata'
}

export const BRIDGES = {
  ROOT: 'root',
  FLOW: 'flow',
  FUNCTION: 'function',
  PROJECT: 'project',
  API: 'api',
  DHACTION: 'dhAction'
}

Object.freeze(BRIDGES)
Object.freeze(BlockTypes)
Object.freeze(DataTypes)
Object.freeze(RequestTypes)
Object.freeze(HeaderTypes)
Object.freeze(MiscTypes)
Object.freeze(IfConditionColor)
Object.freeze(WrapKeys)
Object.freeze(sliderTypes)
Object.freeze(ApiTypes)
Object.freeze(Tabnames)
Object.freeze(ChatBotResponseTypes)
Object.freeze(ModalTypeEnums)
Object.freeze(ParamsEnums)
Object.freeze(TemplateSettingEnums)
Object.freeze(STEP_OPERATION_STATUS)

export {
  BlockTypes,
  DataTypes,
  RequestTypes,
  HeaderTypes,
  MiscTypes,
  IfConditionColor,
  WrapKeys,
  sliderTypes,
  ApiTypes,
  EmbedVerificationStatus,
  // Domains,
  ChatBotResponseTypes,
  Tabnames,
  ModalTypeEnums,
  ParamsEnums,
  FunctionDummyData,
  TemplateSettingEnums,
  STEP_OPERATION_STATUS
}
