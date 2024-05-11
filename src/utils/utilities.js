import { useEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import { JavascriptOutlined, ApiSharp } from '@mui/icons-material'
import CodeIcon from '@mui/icons-material/Code'
import { customAlphabet } from 'nanoid'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import merge from 'lodash.merge'
import cloneDeep from 'lodash.clonedeep'
import { errorToast } from '../components/customToast'
import { BlockTypes, MiscTypes, ParamsEnums } from '../enums'
import config from '../config'
import {
  ApiInitialInstance,
  FunctionInitialInstance,
  IfInitialInstance,
  VariableInitialInstance,
  initialStatePlugin
} from '../store/enum.ts'
import isEqual from './deepCheckSelector'
import { switchOrg, switchOrganization } from '../api/index'
import { evalVariableAndCodeFromContext } from './codeUtility.ts'
import { INPUT_FIELDS_SUGGESTIONS } from '../pages/developerHub/constants/developerHubConstants.ts'

export const areAllKeysOthers = (groupedActions) => {
  return Object.keys(groupedActions).every((key) => key === 'others')
}

export const switchOrgId = async (orgId, orgName) => {
  try {
    await switchOrganization({ company_ref_id: orgId })
    if (process.env.REACT_APP_API_ENVIRONMENT === 'local') {
      const domain = getCurrentEnvironment()
      const response = await switchOrg({ id: orgId, name: orgName })
      setInCookies(domain, response?.data?.data?.token)
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      throw new Error('403 Forbidden')
    } else {
      console.error('Error:', error)
    }
  }
}

export const groupingCategory = (data) =>
  data?.reduce((acc, action) => {
    const category = action.category || 'others'

    if (category) {
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(action)
    }
    return acc
  }, {})

export const valueToKeyConvert = (json, type) => {
  const newArray = []
  if (type === 'KVD') {
    Object.entries(json).forEach((entry) => {
      const newData = {
        name: entry[0],
        value: entry[1],
        comment: ''
      }
      newArray.push(newData)
    })
  }
  if (type === 'NV')
    Object.entries(json).forEach((entry) => {
      const newData = {
        name: entry[0],
        value: entry[1]
      }
      newArray.push(newData)
    })
  return newArray
}
export const validateURL = (string) => {
  let givenURL
  try {
    givenURL = new URL(string)
    return givenURL
  } catch (error) {
    console.error('error is', error)
    return false
  }
}
export const truncateString = (name, maxLength) => {
  return name?.length > maxLength ? `${name.substring(0, maxLength)}...` : name
}
export const getContentType = (obj) => {
  let i = 0
  const arr = Object?.entries(obj)
  while (i < arr.length) {
    if (arr[i][0]?.toLowerCase() === 'content-type') {
      return arr[i][1]
    }
    i++
  }
  return ''
}
export const getRawType = (value) => {
  if (value === 'JavaScript (application/Javascript)') {
    return 'application/Javascript'
  }
  if (value === 'Text (text/plain)') {
    return 'text/plain'
  }
  if (value === 'XML (application/xml)') {
    return 'application/xml'
  }
  if (value === 'XML (text/xml)') {
    return 'text/xml'
  }
  return 'text/html'
}

export const makeUrl = (url, params) => {
  url = url || ''
  if (!params) {
    return url
  }
  let indexOfQsn = url?.length
  if (url?.includes('?')) {
    for (let i = 0; i < url.length; i++) {
      if (url[i] === '?') {
        const substring = url.substring(0, i)
        if (substring.lastIndexOf('}') >= substring.lastIndexOf('${context')) {
          indexOfQsn = i
          break
        }
      }
    }
  }
  let newUrl = url?.substring(0, indexOfQsn)
  const obj = params
  newUrl += '?'
  for (let i = 0; i < obj?.length; i++) {
    newUrl += obj[i].name
    if (obj[i].value) newUrl += `=${obj[i].value}&`
  }
  if (newUrl?.endsWith('?')) {
    return newUrl?.slice(0, -1)
  }
  return newUrl
}
export const makeUrlForSuggest = (queryHtml, urlHtml) => {
  let newUrlHtml = urlHtml?.split('?')[0]
  newUrlHtml += '?'
  const replacedQueryHtml = replaceCharactersForQueryParams(queryHtml)
  newUrlHtml += replacedQueryHtml
  if (newUrlHtml?.endsWith('?')) {
    return newUrlHtml?.slice(0, -1)
  }
  return newUrlHtml
}
function replaceCharactersForQueryParams(htmlString) {
  const regex = /([\s])/g
  const replacedString = htmlString?.replace(regex, (match, group1) => {
    if (group1 === ':') {
      return '='
    }
    if (group1 === ' ' || group1 === '\n') {
      return '&'
    }
    return match
  })
  return replacedString
}
export const convertArrToString = (variables) => {
  let i = 0
  let str = ''
  for (; i < variables?.length; i++) {
    const values = Object.values(variables[i])
    let j = 0
    let valid = false
    let str1 = ''
    for (; j < values?.length; j++) {
      if (values[j]?.length !== 0) {
        valid = true
      }
      str1 += values[j]
      if (j !== values.length - 1) {
        str1 += ':'
      }
    }
    if (valid) {
      str += str1
      str += '\n'
    }
  }
  return str
}
export const getStringToArrayObject = (type, data, ishtml = false) => {
  let fields = []
  let send = true
  switch (type) {
    case 1:
      fields = ['name', 'value']
      break
    case 2:
      fields = ['name', 'value']
      break
    case 3:
      fields = ['key', 'value', 'comment']
      break
    default:
      send = false
      break
  }
  if (send) {
    return bulkAddFunction(fields, data, ishtml)
  }
  return []
}
export const getChildrenOfAddress = (key, inputJsonToUpdate, index = 0) => {
  if (key.length === index) return inputJsonToUpdate || []
  for (let i = 0; i < inputJsonToUpdate.length; i++) {
    if (inputJsonToUpdate[i].key === key[index]) {
      if (inputJsonToUpdate[i].type === 'input groups') {
        return getChildrenOfAddress(key, inputJsonToUpdate[i].children, index + 1)
      }
      return inputJsonToUpdate[i].children || []
    }
  }
  return []
}
export const bulkAddFunction = (fields, data) => {
  if (fields.length === 0) {
    return []
  }
  let keyValue = data
  if (typeof data === 'string') keyValue = data?.split('\n')
  let variables = []
  let i = 0
  for (; i < keyValue?.length; i++) {
    if (keyValue[i].length !== 0) {
      const objArr = splitUrlWithChar(keyValue[i], ':')
      let j = 0
      let obj = {}
      for (; j < fields.length; j++) {
        let valueH = ''
        if (j < objArr.length) {
          valueH = objArr[j]?.trim()
        }
        obj = { ...obj, [fields[j]]: valueH }
      }
      variables = [...variables, obj]
    }
  }
  return variables
}
export const getInfoParamtersFromUrl = () => {
  const params = new URLSearchParams(window.location.search)
  const urlParameters = {}
  urlParameters.stepId = params.get('stepId') || ''
  urlParameters.slugName = params.get('slugName') || ''
  urlParameters.versionId = params.get('versionId') || ''
  if (urlParameters.versionId) {
    urlParameters.versionIdOrStepId = params.get('versionId') || ''
  }
  const urlPath = window.location.pathname.slice(1)?.split('/')
  if (urlPath.length === 2) {
    if (`/${urlPath[0]}` === config.projectsBaseUrl) {
      // /${config.projectsBaseUrl}/:orgId/
      urlParameters.orgId = urlPath[1]
    }
    if (`/${urlPath[0]}` === config.packageBaseUrl) {
      // /${config.packageBaseUrl}/:orgId/
      urlParameters.orgId = urlPath[1]
    }
    if (`/${urlPath[0]}` === config.developerBaseUrl) {
      // /${config.developerBaseUrl}/:orgId/
      urlParameters.orgId = urlPath[1]
    }
    if (`/${urlPath[0]}` === config.authBaseUrl) {
      // /${config.authBaseUrl}/:orgId/
      urlParameters.orgId = urlPath[1]
    }

    if (`/${urlPath[0]}` === '/i') {
      urlParameters.interfaceId = urlPath[1]
    }
  } else if (urlPath.length === 3) {
    if (`/${urlPath[0]}` === config.interface) {
      // /${config.projectsBaseUrl}/:orgId/:projectId
      urlParameters.projectId = urlPath[1]
      urlParameters.interfaceId = urlPath[1]
    }
    if (`/${urlPath[0]}` === config.projectsBaseUrl) {
      // /${config.projectsBaseUrl}/:orgId/:projectId
      urlParameters.projectId = urlPath[2]
      urlParameters.orgId = urlPath[1]
    }
    if (`${urlPath[1]}/${urlPath[2]}` === config.addNewAuth) {
      urlParameters.orgId = urlPath[0]
    }
    if (`${urlPath[1]}/${urlPath[2]}` === config.authCongoPage) {
      urlParameters.orgId = urlPath[0]
    }
    if (`/${urlPath[0]}` === config.orgBaseUrl && urlPath[2] === 'invite') {
      // /${config.orgBaseUrl}/:orgId/invite
      urlParameters.orgId = urlPath[1]
    }
  } else if (urlPath.length === 4) {
    if (`/${urlPath[0]}` === config.projectsBaseUrl) {
      urlParameters.orgId = urlPath[1]
      urlParameters.projectId = urlPath[2]
      urlParameters.interfaceId = urlPath[3]
    }
    if (`/${urlPath[0]}` === config.developerBaseUrl && urlPath[2] === 'plugin') {
      // `${developerBaseUrl}/:orgId/plugin/:pluginId`
      urlParameters.orgId = urlPath[1]
      urlParameters.pluginId = urlPath[3]

      // urlParameters[ParamsEnums.pluginIdOrScriptId] = urlPath[3]
    } else if (`/${urlPath[0]}` === config.projectsBaseUrl && urlPath[3] === 'setup') {
      // `${developerBaseUrl}/:orgId/plugin/:pluginId`
      urlParameters.orgId = urlPath[1]
      urlParameters.projectId = urlPath[2]
    }
  } else if (urlPath.length === 5) {
    if (`/${urlPath[0]}` === 'makeflow') {
      urlParameters.triggerId = urlPath[2]
      urlParameters.actionId = urlPath[4]
    } else if (`/${urlPath[0]}` === config.developerBaseUrl && urlPath[2] === 'plugin') {
      // `${config.developerBaseUrl}/:orgId/plugin/:pluginId/:sectionKey`
      urlParameters.orgId = urlPath[1]
      urlParameters.pluginId = urlPath[3]
      urlParameters.sectionKey = urlPath[4]
    } else if (`/${urlPath[0]}` === config.embedBaseUrl && urlPath[3] === 'embedProjects') {
      // `${embedBaseUrl}/org/:orgId/embedProjects/:projectId`
      urlParameters.orgId = urlPath[2]
      urlParameters.projectId = urlPath[4]
    } else if (`/${urlPath[5]}` === 'interfaceSetup') {
      //
      urlParameters.orgId = urlPath[1]
      urlParameters.projectId = urlPath[2]
      urlParameters.interfaceId = urlPath[3]
    } else {
      urlParameters.orgId = urlPath[1]
      urlParameters.projectId = urlPath[2]
      urlParameters.interfaceId = urlPath[3]
      urlParameters.serviceId = urlPath[4]
    }
  } else if (urlPath.length === 6) {
    if (`/${urlPath[0]}` === config.developerBaseUrl && urlPath[2] === 'plugin') {
      // ${developerBaseUrl}/:orgId/plugin/:pluginId/:sectionKey/:sectionId
      urlParameters.orgId = urlPath[1]
      urlParameters.pluginId = urlPath[3]
      urlParameters.sectionKey = urlPath[4]
      urlParameters.sectionId = urlPath[5]
      urlParameters[ParamsEnums.sectionIdOrScriptId] = urlPath[5]
      // urlParameters[ParamsEnums.pluginIdOrScriptId] = urlPath[3]
      // urlParameters[ParamsEnums.sectionIdOrStepId] = urlPath[5]
    } else if ((`/${urlPath[0]}` === config.projectsBaseUrl || `/${urlPath[0]}` === '/integrations') && urlPath[3] === 'workflows') {
      // /${config.projectsBaseUrl}/:orgId/:projectId/workflows/:scriptId/:tabName
      urlParameters.orgId = urlPath[1]
      urlParameters.projectId = urlPath[2]
      urlParameters.scriptId = urlPath[4]
      urlParameters.tabName = urlPath[5] === 'logs' ? 'draft' : urlPath[5]

      // urlParameters[ParamsEnums.pluginIdOrScriptId] = urlPath[4]
      // urlParameters[ParamsEnums.sectionIdOrStepId] = params.get('stepId')
      urlParameters[ParamsEnums.sectionIdOrScriptId] = urlPath[4]
      urlParameters[ParamsEnums.versionIdOrStepId] = params.get('stepId')
    }
  } else if (urlPath.length === 7) {
    if (urlPath[6] === 'slider') {
      urlParameters.orgId = urlPath[1]
      urlParameters.projectId = urlPath[2]
      urlParameters.scriptId = urlPath[4]
      urlParameters.tabName = urlPath[5] === 'logs' ? 'draft' : urlPath[5]
      urlParameters[ParamsEnums.sectionIdOrScriptId] = urlPath[4]
      urlParameters[ParamsEnums.versionIdOrStepId] = params.get('stepId')
    } else {
      urlParameters.orgId = urlPath[1]
      urlParameters.projectId = urlPath[2]
      urlParameters.serviceId = urlPath[4]
      urlParameters.eventId = urlPath[6]
    }
  } else if (urlPath.length === 8) {
    urlParameters.orgId = urlPath[1]
    urlParameters.projectId = urlPath[2]
    urlParameters.serviceId = urlPath[4]
    urlParameters.scriptId = urlPath[6]

    urlParameters.tabName = urlPath[7] === 'logs' ? 'draft' : urlPath[7]

    // urlParameters[ParamsEnums.pluginIdOrScriptId] = urlPath[6]
    // urlParameters[ParamsEnums.sectionIdOrStepId] = params.get('stepId')
    urlParameters[ParamsEnums.sectionIdOrScriptId] = urlPath[6]
    urlParameters[ParamsEnums.versionIdOrStepId] = params.get('stepId')
  }
  if (!urlParameters.tabName) urlParameters.tabName = 'draft'

  return urlParameters
}

export const convertArrayToObjectOrNot = (value, condition) => {
  if (condition) {
    return value[0]?.name ? value : [{ name: '', value: '' }]
  }
  const data = {}
  for (let i = 0; i < value?.length; i++) {
    const tempKey = value[i]?.name
    if (tempKey?.length !== 0) {
      data[tempKey] = value[i]?.value
    }
  }
  return data
}
export const urlWithParams = (value) => {
  value = value || ''
  let str = ''
  let indexOfQsn = value?.length
  if (value?.includes('?')) {
    for (let i = 0; i < value?.length; i++) {
      if (value[i] === '?') {
        const substring = value?.substring(0, i)
        if (substring.lastIndexOf('}') >= substring.lastIndexOf('${context')) {
          indexOfQsn = i
          break
        }
      }
    }
    const queryparams = value.substring(indexOfQsn + 1)
    const params = queryparams?.split('&')
    let pair = null
    params.forEach(function (d) {
      if (d.length !== 0) {
        pair = splitUrlWithChar(d, '=')
        str = `${str + (pair[0] || '')}:${pair[1] || ''}\n`
      }
    })
  }
  return { value, str, url: value?.substring(0, indexOfQsn) }
}
export function extractQueryParamsAndReturnHtml(html) {
  if (html?.length < 0 || !html) return ''
  const pattern = /\?(.*)/
  const match = html.match(pattern)
  if (!match) return ''
  const queryString = match[1]
  const replacestring = replaceCharactersForUrlQueryParams(queryString)
  const parser = new DOMParser()
  const doc = parser.parseFromString(replacestring, 'text/html')
  return doc.documentElement.innerHTML
}
function replaceCharactersForUrlQueryParams(htmlString) {
  // let firstEqualsReplaced = false
  const replacedString = htmlString.replace(/<span[^>]*>.*?<\/span>|(&amp;|=)/g, function (match, group1) {
    if (group1 === '=') {
      // firstEqualsReplaced = true
      return ':'
    }
    if (group1 === '&amp;') return '\n'
    return match
  })
  return replacedString
}
export const splitUrlWithChar = (url, char) => {
  let front = ''
  let back = ''
  let ch = false
  for (let i = 0; i < url.length; i++) {
    if (!ch && url[i] === char) ch = true
    else if (!ch) {
      front += url[i]
    } else {
      back += url[i]
    }
  }
  return [front, back]
}
export const extractCompanyNameFromEmail = (email) => {
  const domainRegex = /@([\w-]+(?:\.[\w-]+)+)$/
  const match = email.match(domainRegex)
  if (match && match.length > 1) {
    const domain = match[1]
    const lastIndex = domain.lastIndexOf('.')
    if (lastIndex !== -1) {
      return domain.substring(0, lastIndex)
    }
    return domain
  }
  return null
}
export function replaceSpacesWithUnderscores(str) {
  return str?.trim()?.split(' ').join('_')
}
export const generateNewId = (length = 8) => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', length)
  return nanoid()
}

export const getVariablesFromPath = (paths, text) => {
  const regex = /\bcontext\S*/g
  const matches = text.match(regex)
  const finalVariables = {}
  for (let i = 0; i < matches?.length; i++) {
    finalVariables[matches[i]] = getValueFromPath(paths, matches[i])
  }
  return finalVariables
}
const getValueFromPath = (paths, text) => {
  paths = createPathObject(paths)
  text = text.replace(/\?/g, '')
  const valsPath = paths.find((path) => path.content === text)
  return valsPath?.value
}
export function createPathObject(groupedSuggestions) {
  const mergedArray = [].concat(...Object.values(groupedSuggestions))
  return mergedArray
}
export function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(email)
}
export function extractDomain(url) {
  const parts = url?.split('/')
  const [, , domain] = url.indexOf('://') > -1 ? parts : [parts[0], '', parts[0]]
  const cleanedDomain = domain?.split(':')[0]?.split('?')[0]
  return cleanedDomain.startsWith('www.') ? cleanedDomain.slice(4) : cleanedDomain
}
export const debounce = (func, delay) => {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
export const throttle = (func, limit) => {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
export function UsetraceParentPropsUpdate(props) {
  const prevProp = useRef(props)
  useEffect(() => {
    Object.entries(props).reduce((previousStateKaSingleObject, [key, value]) => {
      if (prevProp.current[key] !== value) {
        previousStateKaSingleObject[key] = [prevProp.current[key], value]
      }
      return previousStateKaSingleObject
    }, {})
    prevProp.current = props
  })
}
export function searchObjectForValue(obj, searchString, path = '') {
  let paths = []
  // Iterate over all object properties
  Object.entries(obj).forEach(([key, value]) => {
    // Construct the current path
    const currentPath = path ? `${path}.${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // If the value is an object (and not null or an array), recurse
      paths = paths.concat(searchObjectForValue(value, searchString, currentPath))
    } else if (value?.toString().includes(searchString)) {
      // If the value is not an object, convert it to string and check if it includes the search string
      paths.push(currentPath)
    }
  })

  return paths
}
export function formatStringAroundSubstring(inputString, substring, charsBeforeAfter = 5) {
  const index = inputString.indexOf(substring)

  if (index === -1) {
    // Substring not found
    return inputString
  }

  // Calculate start and end indices for slicing
  let start = index - charsBeforeAfter
  let end = index + substring.length + charsBeforeAfter

  // Adjust start and end if they exceed the string's boundaries
  start = start < 0 ? 0 : start
  end = end > inputString.length ? inputString.length : end

  // Construct and return the formatted string
  return `${start > 0 ? '...' : ''}${inputString.substring(start, end)}${end < inputString.length ? '...' : ''}`
}
export function capitalizeWords(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const toUpperCaseWord = (str) => {
  return str.toUpperCase()
}
export const makeWholeWordUpperCase = (str) => {
  return str.toUpperCase()
}
export async function GetUrlFromDomain(domain) {
  let url
  if (!domain) return '-1'
  if (!domain.includes('http')) {
    domain = `http://${domain}`
  }
  if (await validateIcon(`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${domain}&size=64`)) {
    url = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${domain}&size=64`
  } else if (await validateIcon(`https://api.faviconkit.com/${domain}/144`)) {
    url = `https://api.faviconkit.com/${domain}/144`
  } else if (await validateIcon(`https://favicons-api.com/api/v1/icons/${domain}`)) {
    url = `https://favicons-api.com/api/v1/icons/${domain}`
  } else if (await validateIcon(`http://favicongrabber.com/api/grab/${domain}`)) {
    url = `http://favicongrabber.com/api/grab/${domain}`
  } else if (await validateIcon(`http://getfavicon.appspot.com/${encodeURIComponent(domain)}`)) {
    url = `http://favicongrabber.com/api/grab/${domain}`
  } else if (await validateIcon(`https://www.${domain}/images/favicon.ico`)) {
    url = `https://www.${domain}/images/favicon.ico`
  }
  // else {
  //   let subDomain = domain?.split('://')
  //   subDomain = subDomain[1]?.split(".")
  //   if (subDomain.length > 2)
  //     subDomain.splice(0, 1);
  //   console.log(subDomain, domain);
  //   subDomain = subDomain.join(".")
  //   if (!subDomain.includes('http')) {
  //     subDomain = "http://" + subDomain
  //   }
  //   if (subDomain !== domain)
  //     GetUrlFromDomain(subDomain)
  // }
  if (!(await validateIcon(url))) url = '-1'
  return url
}
async function validateIcon(url) {
  // try {
  //   const response = await fetch(url, { mode: 'no-cors' });
  //   // Check if the response status is 200 (OK)
  //   if (response.ok) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // } catch (error) {
  //   return false;
  // }
  return new Promise((resolve) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
  })
}
export function validateDuplicateScriptName(allScripts, funId, newTitle) {
  let valid = true
  let msg = ''
  newTitle = newTitle.trim()
  if (newTitle?.length < 1) {
    valid = false
    msg = 'Script name cannot be empty'
  }

  allScripts.forEach((script) => {
    if (script.title === newTitle && script.id !== funId) {
      valid = false
      msg = 'Script with same name already exists'
    }
  })
  return [valid, msg]
}

export function isValidURL(url) {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol.startsWith('http')
  } catch (error) {
    return false
  }
}
export const returnTextAndUrl = (url) => {
  const urlArray = url?.split(' ')
  let finalString = '('
  urlArray.forEach((value) => {
    if (isValidURL(value)) {
      finalString += `<a href=${value} target="_blank">${value}</a>`
    } else {
      finalString += `${value} `
    }
  })
  finalString += ')'
  return finalString
}
function groupChildKeys(obj, path) {
  const result = []
  if (['string', 'number', 'boolean'].includes(typeof obj)) {
    result.push({
      display: path.replace(/^context\.res\.|context\.req\.|context\.vals\.|context\./, ''),
      id: `${path?.replaceAll('.', '?.')?.replaceAll('[', '?.[')}`,
      value: obj
    })
    return result
  }
  if (!obj) return []

  Object.keys(obj)?.forEach((key) => {
    const value = obj[key]
    let content = `${path}.${key}`
    if (/[\s~`!@#$%^&*()\-+=[\]{}|\\;:'",<.>/?]|^\d+$/.test(key)) content = `${path}["${key}"]`
    if (Array.isArray(obj)) {
      content = `${path}[${key}]`
    }
    // const content = `${path}.${key}`
    if (Array.isArray(value) && value != null) {
      for (let i = 0; i < value?.length; i++) {
        const newpath = /[\s~`!@#$%^&*()\-+=[\]{}|\\;:'",<.>/?]|^\d+$/.test(key) ? `${path}['${key}'][${i}]` : `${path}.${key}[${i}]`
        result.push(...groupChildKeys(value[i], newpath))
      }
      result.push({
        display: content.replace(/^context\.res\.|context\.req\.|context\.vals\.|context\./, ''),
        id: content?.replaceAll('.', '?.')?.replaceAll('[', '?.['),
        value
      })
    } else if (typeof value === 'object' && value !== null) {
      result.push({
        display: content.replace(/^context\.res\.|context\.req\.|context\.vals\.|context\./, ''),
        id: content?.replaceAll('.', '?.')?.replaceAll('[', '?.['),
        value
      })
      result.push(...groupChildKeys(value, content))
    } else {
      result.push({
        display: content.replace(/^context\.res\.|context\.req\.|context\.vals\.|context\./, ''),
        id: content?.replaceAll('.', '?.')?.replaceAll('[', '?.['),
        value
      })
    }
  })
  return result
}
function setAllValuesToUndefined(obj) {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string') {
      obj[key] = 'undefined'
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      setAllValuesToUndefined(obj[key])
    }
  })
  return obj
}

export const makeVariables = (value) => {
  const variables = {
    context: {
      req: {
        query: {},
        body: {},
        headers: {}
      },
      res: {},
      vals: {},
      authData: {}
    }
  }

  if (value !== undefined) {
    const requestData = value?.requestSnapshot
    const responseData = value?.responseSnapshot
    const valsData = value?.vals
    variables.context.req = requestData || variables?.context?.req
    variables.context.res = responseData || {}
    variables.context.vals = valsData || {}
    variables.context.authData = value?.authData
    variables.context.inputData = value?.inputData
    variables.context.inputData = value?.inputData
    if (value?.interfaces) {
      variables.context.interfaces = value?.interfaces
    }
    value?.stepOrderJsonData?.forEach((el) => {
      if (el.type === 'ifBlock') delete variables?.context?.res?.[el?.id]
    })
  }

  return variables
}
function getUsedVariables(payloadData) {
  return Object.keys(payloadData || {}).length >= 1 ? cloneDeep(payloadData) : makeVariables()
}
export const updateGroupedSnippet = (invocationSelectorOutput, usedVariables) => {
  let { context } = makeVariables(invocationSelectorOutput)
  // merge use vals and logs vals  --start

  const usedValsWithUndefinedValue = setAllValuesToUndefined(getUsedVariables(usedVariables?.payloadData))
  const usedVariablesContext = {
    req: usedValsWithUndefinedValue?.context?.req,
    res: usedValsWithUndefinedValue?.context?.res,
    vals: usedValsWithUndefinedValue?.context?.vals
  }

  context = merge(usedVariablesContext, context)
  if (context?.inputData) {
    if (context && context.inputData && 'performList' in context.inputData) {
      context.req.body = { ...context.req.body, ...context?.inputData?.performList }
      delete context.inputData.performList
    }
  }
  // merge use vals and logs vals  -- end
  const suggestionJson = { authData: [], inputData: [] }
  delete context.req?.['headers']
  delete context.req?.['url']
  delete context.req?.['requestType']
  delete context?.if
  const result2 = groupChildKeys(context.req, 'context.req')
  suggestionJson.webhookData = result2
  const suggestionArr = [...result2]
  const groupSuggestionWithkeys = (property, path) => {
    Object.entries(property).forEach(([key, value]) => {
      let content = `${path}.${key}`
      if (/[\s~`!@#$%^&*()\-+=[\]{}|\\;:'",<.>/?]|^\d+$/.test(key)) {
        content = `${path}["${key}"]`
      }
      const result = groupChildKeys(value, content)
      if (!['string', 'number', 'boolean'].includes(typeof value))
        result.unshift({
          display: content.replace(/^context\.res\.|context\.req\.|context\.vals\.|context\./, ''),
          id: content?.replaceAll('.', '?.')?.replaceAll('[', '?.['),
          value: value
        })
      suggestionJson[key] = [...result]
      suggestionArr.push(...result)
    })
  }
  groupSuggestionWithkeys(context.res, 'context.res')
  groupSuggestionWithkeys(context.vals, 'context.vals')
  if (context?.authData) {
    groupSuggestionWithkeys({ authData: context.authData }, 'context')
  }
  if (context?.inputData) {
    groupSuggestionWithkeys({ inputData: context.inputData }, 'context')
  }
  if (context?.interfaces) {
    groupSuggestionWithkeys(context.interfaces, 'context.interfaces')
  }
  // if(isUserOnDH) suggestionArr.concat(INPUT_FIELDS_SUGGESTIONS)
  const updatedSuggestionArr = appendOtherLibrarySnippets(suggestionArr)
  updateSnippet(updatedSuggestionArr, MiscTypes.JAVASCRIPT)
  updateSnippet(suggestionArr, MiscTypes.JSON)
  // if (isUserOnDH) updateSnippet([...INPUT_FIELDS_SUGGESTIONS, {}])
  return { suggestionJson, context: { context } }
}

const appendOtherLibrarySnippets = (suggestionArr) => {
  const updateSuggestionObj = [
    {
      display: 'get',
      id: `axios.get(url).then(response => {
        // Handle the response data
        console.log(response.data);
      }).catch(error => {
        // Handle any errors
        console.error('Axios GET request error:', error);
      });`,
      value: 'axios.get'
    },
    {
      display: 'post',
      id: `axios.post(url, {name : "viasocket"}, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        // Handle the response
        console.log(response.data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Axios POST request error:', error);
      });`,
      value: 'axios.post'
    },
    {
      display: 'put',
      id: `axios.put(url, dataToReplace)
      .then(response => {
        // Handle the response
        console.log(response.data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Axios PUT request error:', error);
      });`,
      value: 'axios.put'
    },
    {
      display: 'delete',
      id: `axios.delete(url)
      .then(response => {
        // Handle the response
        console.log('Resource deleted successfully.');
      })
      .catch(error => {
        // Handle any errors
        console.error('Axios DELETE request error:', error);
      });`,
      value: 'axios.delete'
    },
    {
      display: 'patch',
      id: `axios.patch(url, dataToUpdate)
      .then(response => {
        // Handle the response
        console.log(response.data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Axios PATCH request error:', error);
      });`,
      value: 'axios.patch'
    },
    {
      display: 'get',
      id: `fetch(url)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    `,
      value: 'fetch(get)'
    },
    {
      display: 'post',
      id: `fetch('Your URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'value' }),
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
      `,
      value: 'fetch(post)'
    },
    {
      display: 'put',
      id: `fetch('Your URL', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'new_value' }),
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));`,
      value: 'fetch(put)'
    },
    {
      display: 'delete',
      id: `fetch('Your URL', {
        method: 'DELETE',
      })
        .then(response => {
          if (response.status === 204) {
            console.log('Resource deleted successfully');
          } else {
            console.error('Error:', response.status);
          }
        })
        .catch(error => console.error('Error:', error));
      `,
      value: 'fetch(delete)'
    },
    {
      display: 'patch',
      id: `fetch('Your URL', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'partial_update' }),
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
      `,
      value: 'fetch(patch)'
    }
  ]
  return [...suggestionArr, ...updateSuggestionObj, ...INPUT_FIELDS_SUGGESTIONS]
}

export function validateDuplicateTemplateName(allScripts, newTitle) {
  let valid = true
  allScripts.forEach((script) => {
    if (script.title === newTitle) {
      valid = false
    }
  })
  return valid
}

export const updateSnippet = (paths, scope = 'javascript') => {
  const newSnippets = paths.map((element) => {
    let name
    if (scope === 'json') {
      name = `${element.display}(${typeof element.value === 'string' ? truncateString(element.value, 25) : typeof element.value})`
    } else {
      name = `${element.display}(${
        typeof element.value === 'string' || typeof element.value === 'number' ? truncateString(element.value, 25) : typeof element.value
      })`
    }
    return {
      tabTrigger: element.display,
      name,
      content: element.id,
      scope
    }
  })
  const { snippetManager } = window.ace.require('ace/snippets')
  if (snippetManager.snippetMap[scope]) {
    snippetManager.unregister(snippetManager.snippetMap[scope], scope)
    snippetManager.snippetMap[scope] = [] // Reset the snippet map for the scope
  }
  snippetManager.register(newSnippets)
}

export function calculateTimeDifference(timestamp, position = 'logs') {
  const currentTime = Date.now()
  const timeDifference = currentTime - timestamp
  const seconds = Math.floor(timeDifference / 1000)
  if (seconds < 60) {
    return position === 'logs' ? `${seconds} seconds ago` : `${seconds} sec ago`
  }
  const minutes = Math.floor(timeDifference / (1000 * 60))
  if (minutes < 60) {
    return position === 'logs' ? `${minutes} minutes ago` : `${minutes} min ago`
  }
  const hours = Math.floor(timeDifference / (1000 * 60 * 60))
  if (hours < 24) {
    return position === 'logs' ? `${hours} hours ago` : `${hours} hrs ago`
  }
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  return `${days} days ago`
}
export function extractDomainWithoutWWW(url) {
  try {
    // Ensure the URL has a scheme (e.g., http:// or https://) before parsing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`
    }
    const parsedURL = new URL(url)
    let domain = parsedURL.hostname
    // Remove "www." if it exists at the beginning of the domain
    if (domain.startsWith('www.')) {
      domain = domain.substring(4)
    }
    return domain
  } catch (error) {
    console.error('Invalid URL:', error)
    return ''
  }
}
export function addChildrenInJson(key, inputJsonToUpdate, childrenToAppend, index = 0) {
  if (key.length === index) return
  for (let i = 0; i < inputJsonToUpdate?.length; i++) {
    if (inputJsonToUpdate[i].key === key[index]) {
      if (inputJsonToUpdate[i].type === 'input groups') {
        if (index + 1 === key.length) inputJsonToUpdate[i].children = childrenToAppend
        else addChildrenInJson(key, inputJsonToUpdate[i].children, childrenToAppend, index + 1)
      } else inputJsonToUpdate[i].children = childrenToAppend
      break
    }
  }
}

export function addDummyDraftData(dataToUpdate) {
  let dummyData = {}
  if (dataToUpdate?.type?.includes('function')) {
    dummyData = FunctionInitialInstance
  }
  if (dataToUpdate?.type === BlockTypes.API || dataToUpdate?.type === BlockTypes.DRY_RUN) {
    dummyData = ApiInitialInstance
  }
  if (dataToUpdate?.type === BlockTypes.VARIABLE) {
    dummyData = VariableInitialInstance
  }
  if (dataToUpdate?.type === BlockTypes.IFBLOCK) dummyData = IfInitialInstance
  if (dataToUpdate?.type === BlockTypes.PLUG) {
    dummyData = initialStatePlugin
  }
  return { ...dummyData, ...dataToUpdate }
}

export const getNextUntitledName = (parentObj, name = 'untitled') => {
  name = name.charAt(0).toUpperCase() + name.slice(1)
  const namesArray = Object.keys(parentObj)
  let newName = name
  let counter = 1

  while (namesArray.includes(newName)) {
    newName = `${name}${counter}`
    counter++
  }

  return newName
}

export const generateUniqueTitles = (arrayOfObjects, name = 'untitled') => {
  name = name.charAt(0).toUpperCase() + name.slice(1)
  const titleSet = new Set(arrayOfObjects.map((obj) => obj.title))
  let counter = 1

  while (titleSet.has(`${name} ${counter}`)) {
    counter++
  }

  return `${name} ${counter}`
}

export const removeFromOrder = (obj, stringToDelete) => {
  try {
    Object.keys(obj).forEach((key) => {
      if (Array.isArray(obj[key])) {
        const index = obj[key].indexOf(stringToDelete)
        if (index > -1) {
          obj[key].splice(index, 1)
        }
      }
    })
    return obj
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const replaceFromOrder = (oldValue, newValue, order, root = 'root') => {
  for (let i = 0; i < order[root].length; i++) {
    if (order[root][i] === oldValue) {
      order[root][i] = newValue
      break
    } else if (Object.keys(order)?.includes(order[root][i])) {
      replaceFromOrder(oldValue, newValue, order, order[root][i])
    }
  }
}

export function getNextVersion(currentVersion) {
  try {
    const versionParts = currentVersion?.split('.')
    // eslint-disable-next-line radix
    const patch = parseInt(versionParts[2])
    const nextPatch = patch + 1
    const nextVersion = `${versionParts[0]}.${versionParts[1]}.${nextPatch}`

    return nextVersion
  } catch (error) {
    console.error(error)
    return '0.0.1'
  }
}

export function pickByKeys(obj, keysToPick) {
  const pickedObject = {}
  keysToPick.forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      pickedObject[key] = obj[key]
    }
  })

  return pickedObject
}

export function compareValuesLodash(previousObj, newObj) {
  const previousValues = pickByKeys(previousObj, Object.keys(newObj))
  return isEqual(previousValues, newObj)
}

export function timeConverter(timeToUpdate) {
  const a = new Date(timeToUpdate * 1000)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const year = a.getFullYear()
  const month = months[a.getMonth()]
  const date = a.getDate()
  const hour = a.getHours()
  const min = a.getMinutes()
  const sec = a.getSeconds()
  const time = `${date} ${month} ${year} ${hour}:${min}:${sec}`
  return time
}

export const Notes = {
  response: (
    <Box className='p-3 mt-3 notes-bg'>
      <Typography className='font-bold'>Avoid initializing Variables 📌</Typography>
      <Typography>Always initialize variable outside of response block to prevent unexpected errors </Typography>
      <br />
      <Typography className='font-bold'>Keep Functions Simple ➖</Typography>
      <Typography>
        When adding functions, make them short, ideally one line, to prevent mistakes and make your code easy to read.👓📝
      </Typography>
      <br />
      <Typography className='font-bold'>Return What&apos;s Needed 📉</Typography>
      <Typography>
        Only include necessary data in the response to minimize processing and transfer overhead. Leave out unnecessary information. 🚀✨
      </Typography>
    </Box>
  ),
  function: (
    <Box className='p-3 notes-bg mt-3'>
      <Typography className='font-bold'>Syntax 📝</Typography>
      <Typography>Just include the core code of the function.</Typography>
      <br />
      <Typography className='font-bold'>Supported Libraries 📚</Typography>
      <Typography>moment, axios, FormData, https, fetch and crypto are supported inside the function.</Typography>
      <Typography
        className='info-color flex-start-center gap-1'
        onClick={() => {
          window.open('https://dev-interface.viasocket.com/i/65f01b9b4bc027b8ec12a2ed')
        }}
      >
        Click for more details
        <OpenInNewIcon fontSize='small' />
      </Typography>
      <br />
      <Typography className='font-bold'>Logging Messages</Typography>
      <Typography>
        The console allows developers to output messages from their code, which can help in debugging and understanding how the code is
        running.
      </Typography>
      <br />
      <Typography className='font-bold'>Read Blog 📚🔍</Typography>
      <Typography>
        For more information, please read our{' '}
        <a rel='noreferrer' href='https://viasocket.com/faq/functions' target='_blank'>
          blog.
        </a>
      </Typography>
    </Box>
  ),
  variable: (
    <Box className='notes-bg p-3 mt-3'>
      <Typography className='font-bold'>How to Write 📝</Typography>
      <Typography>Use regular javascript syntax to assign values to variables. For text, use quotes like &quot;name&quot;.</Typography>
      <br />
      <Typography className='font-bold'>Start Simple</Typography>
      <Typography>Create variables with the necessary information, without adding extra code.</Typography>
      <br />
      <Typography className='font-bold'>Use Anywhere 🌐</Typography>
      <Typography>Once initialized, you can use these variables anywhere you need, like in functions, API calls, or conditions.</Typography>
      <br />
      <Typography className='font-bold'>Read Blog 📚🔍</Typography>
      <Typography>
        For more information, please read our{' '}
        <a rel='noreferrer' href='https://viasocket.com/faq/variable-customizations' target='_blank'>
          blog.
        </a>
      </Typography>
    </Box>
  ),
  if: (
    <Box className='p-3 mt-3 notes-bg'>
      <Typography className='font-bold'>Check a Condition First ✔️</Typography>
      <Typography>Before doing something, make sure a condition is met, like checking if something is true: value === true.</Typography>
      <br />
      <Typography className='font-bold'>Any Type of Check 🔄</Typography>
      <Typography>This check can be for anything - a number, text, or something stored in a variable you made before.</Typography>
      <br />
      <Typography className='font-bold'>Use JavaScript Rules 📜 </Typography>
      <Typography>Write these checks using regular JavaScript rules, just like you normally would.</Typography>
      <br />
      <Typography className='font-bold'>Read Blog 📚🔍</Typography>
      <Typography>
        For more information, please read our{' '}
        <a rel='noreferrer' href='https://viasocket.com/faq/conditional-logic' target='_blank'>
          blog.
        </a>
      </Typography>
    </Box>
  ),
  transferOptionNotes: (
    <Box className='p-3 mt-3 notes-bg'>
      <Typography className='font-bold'>Match Function Output to Input Format 🔄</Typography>
      <Typography>
        Function&apos;s output format will be same as the value&apos;s format passed through flow for trigger activation{' '}
      </Typography>
    </Box>
  ),
  cron: (
    <Box className='p-3 mt-3 notes-bg'>
      <Typography className='font-bold'>Be Clear 🗣</Typography>
      <Typography>Use simple and clear terms when setting up your schedule.</Typography>
      <br />
      <Typography className='font-bold'>Match Your Needs 🎯</Typography>
      <Typography> Make sure your schedule&apos;s description clearly states what you need it to do.</Typography>
      <br />
      <Typography className='font-bold'>Timing ⏱</Typography>
      <Typography>Cron jobs can only run every minute at the least, not more often.</Typography>
      <br />
      <Typography className='font-bold'>Read Blog 📚🔍</Typography>
      <Typography>
        For more information, please read our{' '}
        <a rel='noreferrer' href=' https://viasocket.com/faq/scheduled-tasks' target='_blank'>
          blog.
        </a>
      </Typography>
    </Box>
  ),
  emailToFlow: (
    <Box className='p-3 mt-3 notes-bg'>
      <Typography className='font-bold'>Automate Flow ✉️✨</Typography>
      <Typography>Forward emails to this flow you want to automate</Typography>
      <br />
      <Typography className='font-bold'>Smart Filtering for Targeted Forwarding 🎯</Typography>
      <Typography>
        Enable forwarding for specific emails effortlessly by applying filters, such as those containing resumes or originating from
        specific IDs.
      </Typography>
      <br />
      <Typography className='font-bold'>Read Blog 📚🔍</Typography>
      <Typography>
        For more information, please read our{' '}
        <a rel='noreferrer' href='https://viasocket.com/faq/email-to-flow' target='_blank'>
          blog.
        </a>
      </Typography>
    </Box>
  ),
  API: (
    <Box className='p-3 mt-3 notes-bg'>
      <Typography className='font-bold'>API Basics 🔄</Typography>
      <Typography>APIs help software talk to each other without needing to know complex code</Typography>
      <br />
      <Typography className='font-bold'>Custom API Control 🛠️</Typography>
      <Typography>
        With viaSocket&apos;s Custom API, you can easily make specific requests for tasks like getting or changing data
      </Typography>
      <br />
      <Typography className='font-bold'>Streamlined Workflows</Typography>
      <Typography>viaSocket&apos;s Custom API automates tasks, making work faster and easier.</Typography>
      <br />
      <Typography className='font-bold'>Read Blog 📚🔍</Typography>
      <Typography>
        For more information, please read our{' '}
        <a rel='noreferrer' href='https://viasocket.com/faq/custom-api-integration' target='_blank'>
          blog.
        </a>
      </Typography>
    </Box>
  )
}

export function validateOrgName(orgName, orgList, setOrgListVariable = () => {}) {
  orgName = orgName?.trim()
  const isDuplicate = orgList.find((org) => org.name === orgName)
  if (isDuplicate) {
    errorToast('Org name  already exists')
    return false
  }
  if (orgName?.length === 0) {
    setOrgListVariable(orgList)
    return false
  }
  if (orgName?.length < 3) {
    errorToast('Org name too short')
    return false
  }
  if (orgName?.length > 25) {
    errorToast('Org name must be less than 25')
    return false
  }
  return true
}

export function getAvailableVariables(stepOrder, currentSlugName, allSuggestion) {
  const generateContent = (arr) => arr?.map((element) => `${element?.content} = ${JSON.stringify(element?.value)}`).join('\n')

  let variablesTemporary = ''

  const webhookDataArr = allSuggestion?.webhookData
  if (webhookDataArr) {
    variablesTemporary += `${generateContent(webhookDataArr)}\n`
  }

  // if (chatbotDetails.stepType === 'dhActionJSON' || (sectionId && currentStepId)) {
  //   variablesTemporary += generateContent(allSuggestion.authData) + '\n';
  //   variablesTemporary += generateContent(allSuggestion.inputData);
  // } else
  // {
  for (let i = 0; i < stepOrder?.length; i++) {
    const stepId = stepOrder[i]
    if (stepId === currentSlugName) break
    const stepSuggestionArr = allSuggestion?.[stepId]
    variablesTemporary += `${generateContent(stepSuggestionArr)}\n`
  }
  // }

  return variablesTemporary
}

function deepCompare(o, i) {
  return JSON.stringify(o) === JSON.stringify(i)
}

export class DeepSet extends Set {
  add(o) {
    // eslint-disable-next-line
    for (const i of this) if (deepCompare(o, i)) return this
    super.add(o) // Modified to use this context correctly
    return this
  }
}

export function timeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.round((now - date) / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  if (seconds < 60) {
    return `${seconds}${seconds === 1 ? 'second' : seconds}  ago`
  }
  if (minutes < 60) {
    return `${minutes}${minutes === 1 ? 'minute' : 'minutes'}  ago`
  }
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}  ago`
  }
  return `${days} ${days === 1 ? 'day' : 'days'}  ago`
}
export function millisecondsToSeconds(milliseconds) {
  const seconds = Math.ceil(milliseconds / 1000)
  return seconds
}

export function convertToReadableFormatIST(dateTimeString) {
  const date = new Date(dateTimeString)
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short'
  }
  return date.toLocaleString('en-IN', options)
}

export function formatDateRange(days) {
  const daysAgo = days === '3days' ? 3 : 7

  // const currentDate =  new Date()

  const endDate = new Date()
  endDate.setDate(endDate.getDate() - 1)

  const startDate = new Date()
  startDate.setDate(endDate.getDate() - (daysAgo - 1))

  function formatDate(date) {
    const monthAbbreviations = {
      0: 'Jan',
      1: 'Feb',
      2: 'Mar',
      3: 'Apr',
      4: 'May',
      5: 'Jun',
      6: 'Jul',
      7: 'Aug',
      8: 'Sep',
      9: 'Oct',
      10: 'Nov',
      11: 'Dec'
    }
    const month = date.getMonth()
    const day = date.getDate()
    const monthName = monthAbbreviations[month]

    return `${day} ${monthName}`
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}
function getDomain() {
  const hostname = window.location.hostname
  const parts = hostname?.split('.')
  if (parts.length >= 2) {
    parts.shift() // Remove the subdomain part
    return `.${parts.join('.')}`
  }
  return hostname
}

export const getSubdomain = () => {
  return window.location.hostname
}

export const getCurrentEnvironment = () => process.env.REACT_APP_API_ENVIRONMENT

export const setInCookies = (key, value) => {
  const domain = getDomain()
  let expires = ''

  const date = new Date()
  date.setTime(date.getTime() + 2 * 24 * 60 * 60 * 1000)
  expires = `; expires= ${date.toUTCString()}`
  document.cookie = `${key}=${value || ''}${expires}; domain=${domain}; path=/`
}

function splitFromFirstEqual(str) {
  // Handle empty string or string without an equal sign gracefully
  if (!str || str.indexOf('=') === -1) {
    return [str, ''] // Return the original string as both parts
  }

  // Find the index of the first equal sign
  const index = str.indexOf('=')

  // Handle cases where the equal sign is at the beginning or end of the string
  if (index === 0) {
    return ['', str.slice(1)] // Empty key, value is the rest of the string
  }
  if (index === str.length - 1) {
    return [str.slice(0, -1), ''] // Key is the entire string except the last character (equal sign)
  }

  // Split the string into key and value parts
  const key = str.slice(0, index)
  const value = str.slice(index + 1)

  return [key, value]
}

export const getFromCookies = (cookieId) => {
  // Split cookies string into individual cookie pairs and trim whitespace
  const cookies = document.cookie?.split(';').map((cookie) => cookie.trim())
  // Loop through each cookie pair
  for (let i = 0; i < cookies.length; i++) {
    // const cookiePair = cookies[i]?.split('=');
    // If cookie name matches, return its value
    const [key, value] = splitFromFirstEqual(cookies[i])
    if (cookieId === key) {
      return value
    }
  }
  // If the cookie with the given name doesn't exist, return null
  return null
}

export const removeCookie = (cookieName) => {
  const domain = getDomain()
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`
}

export function generateRandomString() {
  const length = 20
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_'
  let randomString = ''

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(length)
    window.crypto.getRandomValues(values)

    for (let i = 0; i < length; i++) {
      randomString += charset[values[i] % charset.length]
    }
  } else {
    // Fallback for environments that don't support crypto.getRandomValues
    for (let i = 0; i < length; i++) {
      randomString += charset.charAt(Math.floor(Math.random() * charset.length))
    }
  }

  return randomString
}

export const checkIfArraysEmpty = (obj) => {
  let hasNonEmptyArray = false // Flag variable to track if any array has a length greater than zero

  Object.values(obj).forEach((element) => {
    Object.values(element).forEach((val) => {
      Object.values(val).forEach((ele) => {
        if (Array.isArray(ele) && ele.length > 0) {
          hasNonEmptyArray = true
        }
      })
    })
  })

  return hasNonEmptyArray
}

export const sendDataToParentInEmbed = (action, flowId, description, title, payloadDataToSend) => {
  const webhookUrlData = {
    webhookurl: `${process.env.REACT_APP_WEBHOOK_URL}/func/${flowId}`,
    payload: payloadDataToSend,
    action,
    id: flowId,
    description,
    title
  }
  window?.parent?.postMessage(webhookUrlData, '*')
}

export function RenderIcons({ flowJsonBlocks = {}, size = '24px', alternate = '' }) {
  let icons = []
  const handleIcon = (data) => {
    if (data === 'api') return <ApiSharp sx={{ width: size, height: size }} />
    if (data === 'variable') return <CodeIcon sx={{ width: size, height: size }} />
    if (data === 'function') return <JavascriptOutlined sx={{ width: size, height: size }} />
    return <img src={data} alt='icon url' width={size} height={size} />
  }
  Object.values(flowJsonBlocks).forEach((block) => {
    if (block.type === 'plugin' && block.iconUrl) icons.push(block?.iconUrl)
    // else icons.push(block.type)
    if (block.type === 'variable') icons.push(block.type)
    if (block.type === 'api') {
      if (block.url) icons.push(block.url)
      else icons.push('api')
    }
    if (block.type === 'function') icons.push(block.type)
  })
  icons = [...new Set(icons)]
  return icons.length > 0 ? (
    <Box className='flex-start-center   flex-wrap gap-1'>
      {icons.slice(0, 8).map((url) => handleIcon(url))}
      {icons.length > 8 && '...'}
    </Box>
  ) : (
    <Typography sx={{ fontSize: size }}>{alternate}</Typography>
  )
}

/* eslint-disable */
export function removereplaceKeyWithUnderscoreForPlugin(inputObject: any) {
  // If the input is a string, return it as is
  if (typeof inputObject === 'string' || typeof inputObject === 'number' || typeof inputObject === 'boolean') return inputObject

  // Initialize an empty object to store filtered keys and values
  const filteredObject: any = {}

  // Iterate through the keys of the input object
  for (const key in inputObject) {
    // Check if the key is a direct property of the inputObject
    if (inputObject.hasOwnProperty(key)) {
      // Check if the key starts with '_' and the value is 'number' or 'boolean'
      if (key.startsWith('_') && (inputObject[key] === 'number' || inputObject[key] === 'boolean')) {
        // Remove the underscore prefix and split the key by '-'
        const keyWithout_ = key.substring(1).split('-')

        // Check if the modified key is longer than 0 and ends with 'Type'
        if (keyWithout_.length > 0 && keyWithout_[keyWithout_.length - 1] === 'Type') {
          // Check if the first part of the modified key exists as a key in the inputObject
          if (keyWithout_[0] in inputObject && inputObject[keyWithout_[0]].trim() != '') {
            // Create a new key without '_' and add the modified value to the filteredObject
            filteredObject[keyWithout_[0]] = `~${inputObject[keyWithout_[0]]}~`
          } else if (keyWithout_[0] in inputObject && inputObject[keyWithout_[0]].trim() === '') {
            delete inputObject[keyWithout_[0]]
          }
        }
      }
      // Check if the key is not already added to the filteredObject
      if (!filteredObject.hasOwnProperty(key)) {
        // Recursively call the function on the nested object and assign the result to the filteredObject
        filteredObject[key] = removereplaceKeyWithUnderscoreForPlugin(inputObject[key])
      }
    }
  }
  // Return the filtered object with modified keys
  return filteredObject
}

export function removeKeyWithUnderscore(inputObject: any) {
  const filteredObject: any = {}

  for (const key in inputObject) {
    if (!key.startsWith('_')) {
      if (typeof inputObject[key] === 'object') {
        filteredObject[key] = removeKeyWithUnderscore(inputObject[key])
      } else {
        filteredObject[key] = inputObject[key]
      }
    }
  }
  return filteredObject
}

export function replaceQuotesWithBackticks(obj: any): any {
  if (typeof obj === 'string') {
    return `\`${obj}\``
  }

  if (Array.isArray(obj)) {
    // Iterate over the array and replace all double quotes in each element.
    return obj.map(replaceQuotesWithBackticks)
  }

  if (typeof obj === 'object' && obj != null) {
    // Iterate over the dictionary and replace all double quotes in each value.
    return Object.keys(obj).reduce((acc: any, key) => {
      acc[key] = replaceQuotesWithBackticks(obj[key])
      return acc
    }, {})
  }
  return obj
}

export function replaceQuotes(input: string) {
  // Replace all double quotes and backticks with single backticks.
  return input.replace(/"(`.*?`)"(?!:)/g, '$1')
}

export function replaceQuotesForPlugin(input: string) {
  // Replace all double quotes and backticks with single backticks.
  return input.replace(/`~(.*?)~`(?!:)/g, '$1')
}
export function getStringFromUsedVariable(inputObjectValue) {
  let filteredUsedVariables = []
  filteredUsedVariables = removereplaceKeyWithUnderscoreForPlugin(inputObjectValue)
  filteredUsedVariables = removeKeyWithUnderscore(filteredUsedVariables)
  filteredUsedVariables = replaceQuotesWithBackticks(filteredUsedVariables)
  filteredUsedVariables = JSON.stringify(filteredUsedVariables)
  filteredUsedVariables = replaceQuotes(filteredUsedVariables)
  filteredUsedVariables = replaceQuotesForPlugin(filteredUsedVariables)
  return filteredUsedVariables
}

export const createObjectOfUsedVariablesPluginString = (pluginUsedVariables, context) => {
  if (pluginUsedVariables === null || pluginUsedVariables === undefined || Object.keys(pluginUsedVariables).length === 0) return {}
  return evalVariableAndCodeFromContext(`return ${getStringFromUsedVariable(pluginUsedVariables)}`, context)
}
export const webhookSupportedLanguages = (method, url) => {
  const urlString = `'${url}'`
  return {
    node: {
      name: 'Node',
      mode: 'javascript',
      code: `const https = require('https');
      const url = ${urlString};
      https.${method}(url, (response) => {
        let data = '';
        // A chunk of data has been received.
        response.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received.
        response.on('end', () => {
          console.log(data);
        });
      }).on('error', (error) => {
        console.error(\`Error making GET request: \${error.message}\`);
      });
    `
    },
    python: {
      name: 'Python',
      mode: 'python',
      code: `import requests
  
url = "${url}"
  
try:
    response = requests.get(url)
    response.raise_for_status()  # Raise an exception for HTTP errors
    print(response.text)
except requests.exceptions.RequestException as e:
    print(f'Error making GET request: {e}')
  `
    },
    javascript: {
      name: 'Javascript',
      mode: 'javascript',
      code: `const url = "${url}";
  
     fetch(url)
       .then(response => {
         if (!response.ok) {
           throw new Error(\`HTTP error! Status: \${response.status}\`);
         }
         return response.text();
       })
       .then(data => {
         console.log(data);
       })
       .catch(error => {
         console.error('Fetch error:', error);
       });`
    },
    php: {
      name: 'PHP',
      mode: 'php',
      code: `<?php
      $url = '${url}';
      
      $ch = curl_init($url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      $response = curl_exec($ch);
      
      if ($response === false) {
          echo "Failed to fetch data from $url: " . curl_error($ch);
      } else {
          echo $response;
      }
      
      curl_close($ch);
      ?>`
    },
    java: {
      name: 'JAVA',
      mode: 'java',
      code: `import java.io.BufferedReader;
      import java.io.InputStreamReader;
      import java.net.HttpURLConnection;
      import java.net.URL;
      
      public class Main {
          public static void main(String[] args) {
              String url = "${url}";
      
              try {
                  URL obj = new URL(url);
                  HttpURLConnection con = (HttpURLConnection) obj.openConnection();
      
                  // Set the request method to GET
                  con.setRequestMethod("GET");
      
                  // Get the response code
                  int responseCode = con.getResponseCode();
      
                  if (responseCode == HttpURLConnection.HTTP_OK) {
                      BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
                      String inputLine;
                      StringBuilder response = new StringBuilder();
      
                      while ((inputLine = in.readLine()) != null) {
                          response.append(inputLine);
                      }
                      in.close();
      
                      // Print the response body
                      System.out.println(response.toString());
                  } else {
                      System.out.println("HTTP Error: " + responseCode);
                  }
              } catch (Exception e) {
                  System.out.println("Error making GET request: " + e.getMessage());
              }
          }
      }
      `
    },
    ruby: {
      name: 'Ruby',
      mode: 'ruby',
      code: `require 'net/http'
  
      url = URI.parse('${url}')
      
      begin
        response = Net::HTTP.get_response(url)
      
        if response.is_a?(Net::HTTPSuccess)
          puts response.body
        else
          puts "HTTP Error: #{response.code} #{response.message}"
        end
      rescue StandardError => e
        puts "Error making GET request: #{e.message}"
      end
      `
    },
    clojure: {
      name: 'Clojure',
      mode: 'clojure',
      code: `(ns your-namespace
        (:require [clojure.java.io :as io]))
      
      (defn make-get-request [url]
        (try
          (with-open [reader (io/reader (java.net.URL. url))]
            (let [response (slurp reader)]
              (println response)))
          (catch Exception e
            (println (str "Error making GET request: " (.getMessage e))))))
      
      (def url "${url}")
      
      (make-get-request url)
      `
    },
    go: {
      name: 'go',
      mode: 'golang',
      code: `package main
  
      import (
        "fmt"
        "io/ioutil"
        "net/http"
      )
      
      func main() {
        url := "${url}"
      
        response, err := http.Get(url)
        if err != nil {
          fmt.Printf("Error making GET request: %s", err)
          return
        }
        defer response.Body.Close()
      
        if response.StatusCode != http.StatusOK {
          fmt.Printf("HTTP Error: %s", response.Status)
          return
        }
      
        body, err := ioutil.ReadAll(response.Body)
        if err != nil {
          fmt.Printf("Error reading response body: %s", err)
          return
        }
      
        fmt.Println(string(body))
      }
      `
    },
    kotlin: {
      name: 'Kotlin',
      mode: 'kotlin',
      code: `import java.net.HttpURLConnection
      import java.net.URL
      import java.io.BufferedReader
      import java.io.InputStreamReader
      
      fun main() {
          val url = "${url}"
      
          try {
              val connection = URL(url).openConnection() as HttpURLConnection
              connection.requestMethod = "GET"
      
              val responseCode = connection.responseCode
      
              if (responseCode == HttpURLConnection.HTTP_OK) {
                  val response = connection.inputStream.bufferedReader().use(BufferedReader::readText)
                  println(response)
              } else {
                  println("HTTP Error: $responseCode - \${connection.responseMessage}")
              }
          } catch (e: Exception) {
              println("Error: \${e.message}")
          }
      }
      `
    }
  }
}
