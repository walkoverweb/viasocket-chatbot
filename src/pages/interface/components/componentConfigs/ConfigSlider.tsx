import CloseIcon from '@mui/icons-material/Close'
import { Button, Divider, IconButton, Tab, Tabs } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ParamsEnums } from '../../../../enums'
import addUrlDataHoc from '../../../../hoc/addUrlDataHoc.tsx'
import {
  deleteComponentStart,
  resetConfigModalState,
  setConfigSlider,
  toggleNestedGridSliderOpen,
  updateInterfaceActionStart,
  updateInterfaceStart
} from '../../../../store/interface/interfaceSlice.ts'
import { changeScriptStatus } from '../../../../store/scripts/scriptsThunk'
import { $ReduxCoreType } from '../../../../types/reduxCore.ts'
import { useCustomSelector } from '../../../../utils/deepCheckSelector'
import ActionsTab from './ActionsTab.tsx'
import ConfigurationTab from './ConfigurationTab.tsx'
import DataTab from './DataTab.tsx'
import './componentConfigs.scss' // Import the SCSS module

interface ComponentConfigsProps {
  interfaceId: string
  projectId: string
}

function ComponentConfigs({ interfaceId, projectId }: ComponentConfigsProps) {
  const [value, setValue] = useState(0)
  const { openConfigModal, componentDetails, interfaceDetails, actionChatbotData, actionData } = useCustomSelector(
    (state: $ReduxCoreType) => ({
      openConfigModal: state?.Interface?.isConfigSliderOpen,
      componentDetails: state?.Interface?.currentSelectedComponent,
      interfaceDetails: state?.Interface?.interfaceData?.[interfaceId],
      actionChatbotData:
        state?.Interface?.interfaceData?.[interfaceId]?.actions?.['root']?.[state?.Interface?.currentSelectedComponent?.componentId],
      actionData: state?.Interface?.interfaceData?.[interfaceId]?.actions?.['root']?.[state.Interface?.nestedGridSliderOpen?.componentId]
    })
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (openConfigModal) {
      window.addEventListener('keydown', handleKeyDown)
    } else {
      window.removeEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [openConfigModal, componentDetails.gridId])

  const handleKeyDown = (event: any) => {
    if ((event.ctrlKey || event.metaKey) && (event.key === 'Delete' || event.key === 'Backspace')) {
      if (event.shiftKey) {
        event.preventDefault()
        deleteComponent()
      }
    }
  }

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const closeSlider = () => {
    dispatch(resetConfigModalState({}))
    dispatch(setConfigSlider({ openSlider: false }))
  }

  const deleteComponetFromResponse = () => {
    const updatedResponseArr = (actionData?.responseArr || []).map((response) => {
      if (response.responseId === componentDetails?.gridId) {
        return {
          responseId: response.responseId,
          description: response.description,
          components: Object.fromEntries(Object.entries(response.components).filter(([key]) => key !== componentDetails?.componentId))
        }
      }
      return response
    })
    dispatch(
      updateInterfaceActionStart({
        gridId: componentDetails?.gridId,
        componentId: componentDetails?.componentId,
        responseId: componentDetails?.gridId,
        responseArr: updatedResponseArr,
        actionId: actionData?._id || null
      })
    )
  }

  const deleteAllChatBotResponses = () => {
    actionChatbotData?.responseArr?.map((response) => {
      dispatch(deleteComponentStart({ componentId: response.responseId }))
      return 0
    })
  }

  const deleteComponent = () => {
    closeSlider()
    if (componentDetails?.componentId?.includes('ChatBot')) deleteAllChatBotResponses()
    if (componentDetails?.gridId?.includes('Response')) deleteComponetFromResponse()

    actionChatbotData?.actionsArr?.forEach((action: any) => {
      if (action.type === 'flow') {
        dispatch(changeScriptStatus({ projectId, scriptId: action.scriptId, status: '0' }))
      }
    })

    dispatch(deleteComponentStart({ gridId: componentDetails?.gridId, componentId: componentDetails?.componentId }))
    dispatch(toggleNestedGridSliderOpen(false))
  }

  const saveComponentProps = () => {
    dispatch(
      updateInterfaceStart({
        gridId: componentDetails?.gridId,
        componentId: componentDetails?.componentId,
        components: interfaceDetails?.components?.[componentDetails?.gridId][componentDetails?.componentId]
      })
    )
  }
  return openConfigModal && componentDetails?.componentId ? (
    <Box className='config-container p-4 box-sizing-border-box'>
      {/* Top Fixed Area */}
      <Box className='top-fixed'>
        <Box className='flex-spaceBetween-center w-100'>
          <Button onClick={saveComponentProps} variant='light'>
            SAVE
          </Button>
          <IconButton onClick={closeSlider}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
          <Tabs value={value} onChange={handleChangeTab} aria-label='basic tabs example'>
            <Tab label='Configuration' {...a11yProps(0)} />
            <Tab label='Data' {...a11yProps(1)} />
            <Tab label='Actions' {...a11yProps(2)} />
          </Tabs>
        </Box>
      </Box>

      {/* Scrollable Content Area */}
      <Box className='content-area'>
        <CustomTabPanel value={value} index={0}>
          <ConfigurationTab />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <DataTab />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ActionsTab componentDetails={componentDetails} />
        </CustomTabPanel>
      </Box>
      <Divider />
      {/* Bottom Fixed Area */}
      <Box className='delete-button mt-3'>
        <Button variant='contained' color='error' onClick={deleteComponent}>
          <Typography className='font-bold'>Delete component</Typography>
        </Button>
      </Box>
    </Box>
  ) : null
}
export default React.memo(addUrlDataHoc(React.memo(ComponentConfigs), [ParamsEnums?.interfaceId, ParamsEnums?.projectId]))

function CustomTabPanel(props: any) {
  const { children, value, index, ...other } = props
  return (
    <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box className='w-100'>{children}</Box>}
    </div>
  )
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}
