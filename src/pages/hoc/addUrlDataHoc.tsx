import React, { FC } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { ParamsEnums, Tabnames } from '../../enums'

export default function addUrlDataHoc(WrappedComponent: FC<any>, paramsToInject?: string[]) {
    return function addUrlDataHoc(props: any) {
        const urlParams = useParams()
        const location = useLocation()
        const setSearchParams = useSearchParams()[1]
        const data: { [key: string]: string | boolean | undefined } = {}
        const queryParams = new URLSearchParams(window.location.search)
        paramsToInject?.forEach((key: string) => {
            if (key === ParamsEnums.isPublishedTab) {
                data[key] = urlParams[ParamsEnums.tabName] === Tabnames.PUBLISH
            } else {
                if (key === 'versionIdOrStepId') {
                    data[key] = urlParams['stepId'] || urlParams['versionId'] || ''
                    if (!data[key] && (queryParams.has('stepId') || queryParams.has('versionId'))) {
                        data[key] = queryParams.get('stepId') || queryParams.get('versionId') || ''
                    }
                }
                if (key === 'sectionIdOrScriptId') {
                    data[key] = urlParams['sectionId'] || urlParams['scriptId'] || ''
                    if (!data[key] && (queryParams.has('sectionId') || queryParams.has('scriptId'))) {
                        data[key] = queryParams.get('sectionId') || queryParams.get('scriptId') || ''
                    }
                }
                if (key === ParamsEnums.isTemplate) {
                    data[key] = location.pathname.includes('template')
                }
                if (key === ParamsEnums.embedding) {
                    data[key] = location.pathname.includes(ParamsEnums.embedding)
                }
                if (key === ParamsEnums.isLogs) {
                    data[key] = location.pathname.includes(Tabnames.LOG)
                }
                if (key === ParamsEnums.isConfiguration) {
                    data[key] = location.pathname.includes(Tabnames.CONFIGURATION)
                }
                if (key === ParamsEnums.isSetup) {
                    data[key] = location.pathname.includes(Tabnames.SETUP)
                }
                if (key === ParamsEnums.search) {
                    data[key] = location.pathname.includes(ParamsEnums.search)
                }
                if (!data[key]) {
                    data[key] = urlParams[key] || ''
                    if (!urlParams[key] && queryParams.has(key)) {
                        data[key] = queryParams.get(key) || ''
                    }
                }
            }
        })

        if (!data.tabName) data.tabName = 'draft'
        return <WrappedComponent {...props} {...data} setSearchParams={setSearchParams} />
    }
}
