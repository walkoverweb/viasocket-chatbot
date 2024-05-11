import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { AppBar, Dialog, Divider, Slide, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import { TransitionProps } from '@mui/material/transitions'
import { Box } from '@mui/system'
import cloneDeep from 'lodash.clonedeep'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ParamsEnums } from '../../../../enums'
import addUrlDataHoc from '../../../../hoc/addUrlDataHoc.tsx'
import { updateInterfaceActionStart } from '../../../../store/interface/interfaceSlice.ts'
import { $ReduxCoreType } from '../../../../types/reduxCore.ts'
import { useCustomSelector } from '../../../../utils/deepCheckSelector'

interface BridgeConfigurationModal {
  isBridgeModalOpen: boolean
  setIsBridgeModalOpen: (value: boolean) => void
  interfaceId: string
}

interface BridgeMappingType {
  [key: string]: {
    bridgeId: string
    defaultQuestions: Array<string>
  }
}
interface BridgeType {
  authKey: string
  bridgeKeys: Array<string>
  bridgeMapping: BridgeMappingType
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

function BridgeConfigurationModal({ isBridgeModalOpen, setIsBridgeModalOpen, interfaceId }: BridgeConfigurationModal) {
  const { componentDetails } = useCustomSelector((state: $ReduxCoreType) => ({
    componentDetails: state?.Interface?.currentSelectedComponent
  }))
  const { actionData } = useCustomSelector((state: $ReduxCoreType) => ({
    actionData: state?.Interface?.interfaceData?.[interfaceId]?.actions?.[componentDetails?.gridId]?.[componentDetails?.componentId]
  }))
  const [bridgeData, setBridgeData] = React.useState<BridgeType>(actionData?.bridge || { authKey: '', bridgeKeys: [], bridgeMapping: {} })
  const dispatch = useDispatch()

  useEffect(() => {
    setBridgeData(actionData?.bridge || { authKey: '', bridgeKeys: [], bridgeMapping: {} })
  }, [actionData?.bridge])

  const onSave = () => {
    dispatch(
      updateInterfaceActionStart({
        gridId: componentDetails?.gridId,
        componentId: componentDetails?.componentId,
        bridge: bridgeData,
        actionId: actionData?._id || null
      })
    )
    setIsBridgeModalOpen(false)
  }

  const onAddNewBridge = () => {
    const bridgeKeys = [...bridgeData.bridgeKeys]
    bridgeKeys.push(`Bridge${bridgeKeys.length + 1}`)
    setBridgeData((prev) => ({
      ...prev,
      bridgeKeys,
      bridgeMapping: {
        ...prev.bridgeMapping,
        [`Bridge${bridgeKeys.length}`]: {
          bridgeId: ''
        }
      }
    }))
  }

  const onAddNewDefaultQuestion = (bridgeKey: keyof BridgeMappingType) => {
    const defaultReponses = [...(bridgeData?.bridgeMapping?.[bridgeKey]?.defaultQuestions ?? [])]
    defaultReponses.push(' ')
    setBridgeData((prev) => {
      return {
        ...prev,
        bridgeMapping: {
          ...prev.bridgeMapping,
          [bridgeKey]: {
            ...prev.bridgeMapping[bridgeKey],
            defaultQuestions: defaultReponses
          }
        }
      }
    })
  }

  const handleDeleteBridge = (bridgeKeyToDelete: keyof BridgeMappingType) => {
    setBridgeData((prev) => {
      // Create a copy of bridgeKeys array without the bridgeKeyToDelete
      const updatedBridgeKeys = prev.bridgeKeys.filter((bridgeKey) => bridgeKey !== bridgeKeyToDelete)

      // Create a copy of bridgeMapping object without the bridgeKeyToDelete
      const updatedBridgeMapping = { ...prev.bridgeMapping }
      delete updatedBridgeMapping[bridgeKeyToDelete]

      return {
        ...prev,
        bridgeKeys: updatedBridgeKeys,
        bridgeMapping: updatedBridgeMapping
      }
    })
  }

  const handleDeleteDefaultQuestion = (index, bridgeKey) => {
    setBridgeData((prev) => {
      const updatedDefaultResponses = [...prev.bridgeMapping[bridgeKey].defaultQuestions]
      updatedDefaultResponses.splice(index, 1)

      return {
        ...prev,
        bridgeMapping: {
          ...prev.bridgeMapping,
          [bridgeKey]: {
            ...prev.bridgeMapping[bridgeKey],
            defaultQuestions: updatedDefaultResponses
          }
        }
      }
    })
  }

  const onBlurAuthField = (e: React.ChangeEvent<HTMLInputElement>, key: keyof BridgeType) => {
    const value = e.target.value
    setBridgeData((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const onBlurBridgeIdField = (e: React.ChangeEvent<HTMLInputElement>, bridgeName: keyof BridgeType) => {
    const value = e.target.value
    setBridgeData((prev) => ({
      ...prev,
      bridgeMapping: {
        ...prev.bridgeMapping,
        [bridgeName]: {
          ...prev.bridgeMapping[bridgeName],
          bridgeId: value
        }
      }
    }))
  }

  const handleDefaultQuestionChange = (e: React.ChangeEvent<HTMLInputElement>, bridgeKey: keyof BridgeMappingType, index: number) => {
    const value = e.target.value
    setBridgeData((prev) => ({
      ...prev,
      bridgeMapping: {
        ...prev.bridgeMapping,
        [bridgeKey]: {
          ...prev.bridgeMapping[bridgeKey],
          defaultQuestions: prev.bridgeMapping[bridgeKey].defaultQuestions.map((response, i) => (i === index ? value : response))
        }
      }
    }))
  }

  const onBlurBridgeNameField = (e: React.ChangeEvent<HTMLInputElement>, bridgeName: keyof BridgeType) => {
    const value = e.target.value
    const tempBridgeData = cloneDeep(bridgeData.bridgeMapping)
    const previousValue = tempBridgeData?.[bridgeName]
    delete tempBridgeData?.[bridgeName]

    const bridgeKeys = [...bridgeData.bridgeKeys]
    const index = bridgeKeys.indexOf(bridgeName)
    if (index !== -1) {
      bridgeKeys[index] = value
    }
    setBridgeData((prev) => ({
      ...prev,
      bridgeKeys,
      bridgeMapping: {
        ...tempBridgeData,
        [value]: previousValue
      }
    }))
  }

  return (
    <Dialog fullScreen open={isBridgeModalOpen} onClose={() => setIsBridgeModalOpen(false)} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={() => setIsBridgeModalOpen(false)} aria-label='close'>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Edit Bridge Configuration
          </Typography>
          <Button autoFocus color='inherit' onClick={onSave}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <Box className='m-5 p-5'>
        <TextField
          placeholder='Auth Key'
          fullWidth
          label='Auth Key'
          defaultValue={actionData?.bridge?.authKey || ''}
          onBlur={(e) => onBlurAuthField(e, 'authKey')}
        />
        <Divider className='my-4' />
        {(bridgeData.bridgeKeys || [])?.map((bridgeKey: keyof BridgeMappingType, i: number) => (
          <Box key={`${bridgeKey}`} className='flex-col' gap={1}>
            {i !== 0 && (
              <Box className='flex-end-center'>
                <Box className='flex cursor-pointer' onClick={() => handleDeleteBridge(bridgeKey)}>
                  <DeleteForeverIcon color='error' />
                  <Typography>Delete Bridge</Typography>
                </Box>
              </Box>
            )}
            <Box className='flex' gap={2} rowGap={2}>
              <TextField
                placeholder='Bridge Name'
                label='Bridge Name'
                defaultValue={bridgeKey || ''}
                onBlur={(e) => onBlurBridgeNameField(e, bridgeKey)}
                disabled={i === 0}
                fullWidth
              />
              <TextField
                placeholder='Bridge Id'
                label='Bridge Id'
                defaultValue={bridgeData?.bridgeMapping[bridgeKey]?.bridgeId || ''}
                onBlur={(e) => onBlurBridgeIdField(e, bridgeKey)}
                fullWidth
              />
            </Box>
            {bridgeData?.bridgeMapping[bridgeKey]?.defaultQuestions?.map((response, index) => (
              <>
                <TextField
                  key={`${index.toString()}`}
                  placeholder={`Default Question ${index + 1}`}
                  label={`Default Question ${index + 1}`}
                  defaultValue={response}
                  onBlur={(e) => handleDefaultQuestionChange(e, bridgeKey, index)}
                />
                <Box className='flex-end-center'>
                  <Box className='flex cursor-pointer' onClick={() => handleDeleteDefaultQuestion(index, bridgeKey)}>
                    <DeleteForeverIcon color='error' />
                    <Typography>Delete Default Question</Typography>
                  </Box>
                </Box>
              </>
            ))}
            <Button variant='contained' onClick={() => onAddNewDefaultQuestion(bridgeKey)}>
              Add New Default Question
            </Button>
            <Divider className='my-4' />
          </Box>
        ))}
        <Button variant='contained' onClick={onAddNewBridge}>
          Add New Bridge
        </Button>
      </Box>
    </Dialog>
  )
}

export default React.memo(addUrlDataHoc(React.memo(BridgeConfigurationModal), [ParamsEnums?.interfaceId]))
