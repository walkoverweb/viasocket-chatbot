import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ParamsEnums } from '../../../../enums'
import addUrlDataHoc from '../../../hoc/addUrlDataHoc.tsx'
import {
  deleteComponentStart,
  toggleNestedGridSliderOpen,
  updateComponentProps,
  updateInterfaceActionStart
} from '../../../../store/interface/interfaceSlice.ts'
import { $ReduxCoreType } from '../../../../types/reduxCore.ts'
import { useCustomSelector } from '../../../../utils/deepCheckSelector'
import { DataforComponents, allowedProps } from '../../utils/InterfaceUtils.ts'
import BridgeConfigurationModal from './BridgeConfigurationModal.tsx'
import ComponentToTakePropValue from './PropsRenderer.tsx'

interface ConfigurationTabProps {
  interfaceId: string
}

function ConfigurationTab({ interfaceId }: ConfigurationTabProps) {
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null)
  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState<boolean>(false)
  const dispatch = useDispatch()

  const { componentDetails } = useCustomSelector((state: $ReduxCoreType) => ({
    componentDetails: state?.Interface?.currentSelectedComponent
  }))

  const { data, actionData } = useCustomSelector((state: $ReduxCoreType) => ({
    data: state?.Interface?.interfaceData?.[interfaceId]?.components?.[componentDetails?.gridId]?.[componentDetails?.componentId]?.props,
    actionData: state?.Interface?.interfaceData?.[interfaceId]?.actions?.[componentDetails?.gridId]?.[componentDetails?.componentId]
  }))

  const [componentConfig, setComponentConfig] = useState<{ [key: string]: any }>(data)

  useEffect(() => {
    setComponentConfig(data)
  }, [data])

  const handleChange = (value: any, propName: string) => {
    if (allowedProps[propName] === 'number') value = Number(value)
    dispatch(
      updateComponentProps({
        data: { ...componentConfig, [propName]: value },
        componentId: componentDetails?.componentId,
        gridId: componentDetails?.gridId
      })
    )
    setComponentConfig((prevConfig) => ({
      ...prevConfig,
      [propName]: value
    }))
  }

  const onAddNewResponse = (componentId: string) => {
    const uniqueTime = ((Date.now() / 1000) * 1000)?.toString()
    const responseId = `Response${(Math.random() + uniqueTime).toString(36).slice(2, 7)}`

    dispatch(toggleNestedGridSliderOpen({ id: responseId, gridId: responseId, componentId: componentId }))

    const isResPresent = actionData?.responseArr?.some((action: any) => action.type === 'chatbot')
    const updatedResponseArr = isResPresent
      ? actionData?.responseArr.map((action: any) => (action.type === 'chatbot' ? { ...action, responseId } : action))
      : [...(actionData?.responseArr || []), { responseId: responseId, description: '', components: {} }]

    dispatch(
      updateInterfaceActionStart({
        gridId: componentDetails?.gridId,
        componentId: componentId,
        responseId: responseId,
        responseArr: updatedResponseArr,
        actionId: actionData?._id || null
      })
    )
  }

  const handleDelete = (responseId) => {
    actionData?.responseArr.filter((response) => {
      dispatch(deleteComponentStart({ componentId: responseId }))
      return response
    })
    const updatedResponseArr = actionData?.responseArr.filter((response) => response.responseId !== responseId)
    dispatch(
      updateInterfaceActionStart({
        actionId: actionData?._id || null,
        gridId: componentDetails?.gridId,
        responseId: responseId,
        responseArr: updatedResponseArr
      })
    )
    dispatch(toggleNestedGridSliderOpen(false))
    setSelectedResponseId(null)
  }

  const handleClick = (responseId: string) => {
    dispatch(toggleNestedGridSliderOpen({ id: responseId, gridId: responseId, componentId: componentDetails?.componentId }))
    setSelectedResponseId(responseId)
  }

  const saveDescription = (responseId: string, e: any) => {
    const newValue = e?.target?.value
    const updatedResponseArr = (actionData?.responseArr || []).map((response) => {
      if (response.responseId === responseId) {
        return {
          responseId: response.responseId,
          description: newValue,
          components: response.components
        }
      }
      return response
    })

    dispatch(
      updateInterfaceActionStart({
        gridId: componentDetails?.gridId,
        componentId: componentDetails?.componentId,
        responseId: responseId,
        responseArr: updatedResponseArr,
        actionId: actionData?._id || null
      })
    )
  }

  return (
    <Box className='column w-100 gap-2'>
      {DataforComponents[componentDetails?.componentType]?.props
        ?.filter((prop) => Boolean(allowedProps[prop]))
        ?.map((propName: string) => {
          return (
            <div className='w-100 flex-start-center' key={propName}>
              <Typography className='text-overflow-eclipse propName'>{propName}:</Typography>
              <ComponentToTakePropValue propName={propName} componentConfig={componentConfig} handleChange={handleChange} />
            </div>
          )
        })}

      <Divider className='my-2' />
      <div className='w-100 column' key='sx'>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
            Custom Styling
          </AccordionSummary>
          <AccordionDetails>
            <ComponentToTakePropValue propName='sx' componentConfig={componentConfig} handleChange={handleChange} />
          </AccordionDetails>
        </Accordion>
      </div>
      <Divider className='my-2' />

      {componentDetails?.componentType === 'ChatBot' ? (
        <Box>
          <Box gap={1} className='flex-col'>
            <Box className='flex-spaceBetween-center'>
              <Typography variant='h7'>Configure Bridge</Typography>
              <Button variant='contained' onClick={() => setIsBridgeModalOpen(true)}>
                Edit Bridge Configuration
              </Button>
            </Box>
            <BridgeConfigurationModal isBridgeModalOpen={isBridgeModalOpen} setIsBridgeModalOpen={setIsBridgeModalOpen} />
          </Box>
          <Divider className='my-3' />
          <Box>
            <Box className='flex-spaceBetween-center mb-4'>
              <Typography variant='h7' className='mr-2'>
                Add Response Type
              </Typography>
              <Button variant='contained' onClick={() => onAddNewResponse(componentDetails?.componentId)}>
                Add Response +
              </Button>
            </Box>

            {actionData?.responseArr?.map((response, i) => {
              const isLastResponse = actionData?.responseArr?.length === 1
              return (
                <Box key={response.responseId}>
                  <Box className='flex-spaceBetween-center'>
                    <Typography variant='caption'>Description</Typography>
                    {!isLastResponse && (
                      <DeleteIcon onClick={() => handleDelete(response.responseId)} color='error' className='cursor-pointer' />
                    )}
                  </Box>

                  <TextField
                    id='outlined-multiline-static '
                    placeholder='Enter Description'
                    multiline
                    maxRows={3}
                    minRows={1}
                    fullWidth
                    defaultValue={response.description}
                    onBlur={(e) => saveDescription(response.responseId, e)}
                    style={{ marginBottom: '1rem' }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      key={response.responseId}
                      variant='outlined'
                      onClick={() => handleClick(response.responseId)}
                      className={`${selectedResponseId === response.responseId ? 'border-2' : 'border-p5'}`}
                    >
                      Response {i + 1}
                    </Button>
                  </div>

                  <Divider className='my-2' />
                </Box>
              )
            })}
          </Box>
        </Box>
      ) : (
        ''
      )}
    </Box>
  )
}

export default React.memo(addUrlDataHoc(React.memo(ConfigurationTab), [ParamsEnums?.interfaceId]))
