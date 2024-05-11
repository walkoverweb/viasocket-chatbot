import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Typography, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { errorToast } from '../../../../components/customToast'
import FunctionsActionsButton from '../../../../components/functiondashboard/workFlow/workFlowComponent/functionsActionsButton/functionsActionsButton'
import { ParamsEnums } from '../../../../enums'
import addUrlDataHoc from '../../../../hoc/addUrlDataHoc.tsx'
import {
  getAllInterfaceStart,
  updateInterfaceDetailsStart,
  resetConfigModalState,
  setConfigSlider,
  toggleNestedGridSliderOpen,
  deleteInterfaceStart
} from '../../../../store/interface/interfaceSlice.ts'
import { InterFaceDataType } from '../../../../types/interface/InterfaceReduxType.ts'
import { $ReduxCoreType } from '../../../../types/reduxCore.ts'
import { useCustomSelector } from '../../../../utils/deepCheckSelector'
import './allInterfaceList.scss'

interface AllInterfaceListPropTypes {
  projectId: string
  interfaceId: string
}

function AllInterfaceList({ projectId, interfaceId, orgId }: AllInterfaceListPropTypes) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [renameInterfaceId, setRenameInterfaceId] = useState<string | null>(null)
  const { allInterfaceObj } = useCustomSelector((state: $ReduxCoreType) => ({
    allInterfaceObj: state?.Interface?.interfaceData || {}
  }))
  const navigateToInterface = (interfaceId: string) => {
    navigate(`/projects/${orgId}/${projectId}/${interfaceId}`)
  }

  const { isInterfaceListLoading } = useCustomSelector((state) => ({
    isInterfaceListLoading: state.scripts.isLoading
  }))
  const allInterfaceArr: InterFaceDataType[] = Object?.values(allInterfaceObj)
  const filteredInterfaces = React.useMemo(() => {
    return allInterfaceArr.filter((interfaceObj) => interfaceObj?.projectId === projectId)
  }, [projectId, allInterfaceObj])

  useEffect(() => {
    dispatch(getAllInterfaceStart(projectId))
  }, [projectId])

  const handleRenameInterface = async (e, oldTitle: string) => {
    const newInterfaceName = e.target.value?.trim()
    if (newInterfaceName === oldTitle) {
      setRenameInterfaceId(null)
      return
    }
    const isNameExists = filteredInterfaces.some((interfaceObj) => interfaceObj.title === newInterfaceName)
    if (isNameExists) {
      setRenameInterfaceId(null)
      errorToast('Interface name already exists.')
      return
    }

    if (!newInterfaceName.trim() || newInterfaceName.length < 5) {
      setRenameInterfaceId(null)
      errorToast('Interface name should be greater than 5 characters.')
      return
    }
    dispatch(updateInterfaceDetailsStart({ interfaceId: renameInterfaceId, title: newInterfaceName }))
    setRenameInterfaceId(null)
  }

  const options = ['Delete', 'Rename']
  const handleActionBtns = async (option, projectInfo) => {
    switch (option) {
      case 'Rename':
        setRenameInterfaceId(projectInfo?.interfaceId)
        break

      case 'Delete':
        dispatch(deleteInterfaceStart({ interfaceId: projectInfo?.interfaceId, navigateToInterface }))
        break

      default:
        break
    }
  }

  return isInterfaceListLoading ? (
    <Box className='column gap-3 '>
      <Skeleton variant='rounded' className='w-100' height={30} />
      <Skeleton variant='text' className='w-25 mb-2 font-1rem' />
      <Box className='flex-col-start-center gap-1'>
        <Skeleton variant='text' className='w-50 font-1rem' />
        <Skeleton variant='text' className='w-50 font-1rem' />
        <Skeleton variant='text' className='w-50 font-1rem' />
        <Skeleton variant='text' className='w-50 font-1rem' />
        <Skeleton variant='text' className='w-50 font-1rem' />
        <Skeleton variant='text' className='w-50 font-1rem' />
        <Skeleton variant='text' className='w-50 font-1rem' />
        <Skeleton variant='text' className='w-50 font-1rem' />
      </Box>
      <Skeleton variant='rounded' className='w-25' height={30} />
    </Box>
  ) : (
    filteredInterfaces.length > 0 && (
      <Box className='flex-col '>
        <Typography darkbg='true' variant='smallHeading' className='px-1'>
          Interfaces
        </Typography>

        <Box className='flex w-100 '>
          <Box className='flex-col w-100'>
            <List>
              {filteredInterfaces?.map((interfaceObj: InterFaceDataType, index: number) => {
                return (
                  <ListItem
                    disablePadding
                    key={interfaceObj._id}
                    onClick={() => {
                      dispatch(setConfigSlider({ openSlider: false }))
                      dispatch(toggleNestedGridSliderOpen(false))
                      dispatch(resetConfigModalState({}))
                      navigateToInterface(interfaceObj?._id)
                    }}
                    className=''
                    active={(interfaceObj?._id).toString() === interfaceId}
                  >
                    {renameInterfaceId === interfaceObj._id ? (
                      <>
                        <ListItemIcon>
                          <svg width='20' height='20' viewBox='0 0 140 140' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                              d='M128.263 125.03H119.729V117.835H128.263C129.792 117.835 131 116.534 131 114.887C131 113.24 129.792 111.94 128.263 111.94H119.729V110.899C119.729 109.252 118.522 107.952 116.992 107.952C110.149 107.952 105.238 111.246 103.467 116.708C103.226 116.621 102.984 116.534 102.662 116.534H19.1776V15.8831H120.051V85.2379C120.051 87.9254 122.144 90.1794 124.64 90.1794C127.136 90.1794 129.229 88.0121 129.229 85.2379V10.9415C129.229 8.25403 127.136 6 124.64 6H14.5888C12.0931 6 10 8.16734 10 10.9415V121.476C10 124.163 12.0126 126.417 14.5888 126.417H102.662C102.904 126.417 103.145 126.331 103.387 126.244C105.399 132.573 111.357 135 116.992 135C118.522 135 119.729 133.7 119.729 132.052V131.012H128.263C129.792 131.012 131 129.712 131 128.065C131 126.417 129.792 125.03 128.263 125.03Z'
                              fill='white'
                            />
                            <path
                              d='M56 43.5C56 39.3791 52.6209 36 48.5 36C44.3791 36 41 39.3791 41 43.5C41 47.6209 44.3791 51 48.5 51C52.6209 51 56 47.6209 56 43.5Z'
                              fill='white'
                            />
                            <path
                              d='M100 43.5C100 39.3791 96.6209 36 92.5 36C88.3791 36 85 39.3791 85 43.5C85 47.6209 88.3791 51 92.5 51C96.6209 51 100 47.6209 100 43.5Z'
                              fill='white'
                            />
                            <path
                              d='M72.1165 87C63.6503 87 56.6929 85.6989 56.2738 85.6989C53.4237 85.1785 51.5796 82.4028 52.0826 79.4537C52.5855 76.5045 55.1841 74.5963 58.1179 75.1167C58.2855 75.1167 72.5356 77.7189 83.6842 75.1167C86.5343 74.5095 89.3004 76.3311 89.8872 79.1935C90.474 82.1426 88.7137 85.005 85.9475 85.6122C81.3372 86.653 76.5592 87 72.1165 87Z'
                              fill='white'
                            />
                          </svg>
                        </ListItemIcon>
                        <TextField
                          size='small'
                          noborder='true'
                          fullWidth
                          key={interfaceObj._id}
                          darkbg='true'
                          className='title-textfield'
                          autoFocus
                          onFocus={(e) => e.target.focus()}
                          id='outlined-helperText-sfdghjkl'
                          defaultValue={interfaceObj?.title}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameInterface(e, interfaceObj?.title)
                          }}
                          onBlur={(e) => handleRenameInterface(e, interfaceObj?.title)}
                        />
                      </>
                    ) : (
                      <ListItemButton className='list-item px-1'>
                        <ListItemIcon>
                          <svg width='20' height='20' viewBox='0 0 140 140' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                              d='M128.263 125.03H119.729V117.835H128.263C129.792 117.835 131 116.534 131 114.887C131 113.24 129.792 111.94 128.263 111.94H119.729V110.899C119.729 109.252 118.522 107.952 116.992 107.952C110.149 107.952 105.238 111.246 103.467 116.708C103.226 116.621 102.984 116.534 102.662 116.534H19.1776V15.8831H120.051V85.2379C120.051 87.9254 122.144 90.1794 124.64 90.1794C127.136 90.1794 129.229 88.0121 129.229 85.2379V10.9415C129.229 8.25403 127.136 6 124.64 6H14.5888C12.0931 6 10 8.16734 10 10.9415V121.476C10 124.163 12.0126 126.417 14.5888 126.417H102.662C102.904 126.417 103.145 126.331 103.387 126.244C105.399 132.573 111.357 135 116.992 135C118.522 135 119.729 133.7 119.729 132.052V131.012H128.263C129.792 131.012 131 129.712 131 128.065C131 126.417 129.792 125.03 128.263 125.03Z'
                              fill='white'
                            />
                            <path
                              d='M56 43.5C56 39.3791 52.6209 36 48.5 36C44.3791 36 41 39.3791 41 43.5C41 47.6209 44.3791 51 48.5 51C52.6209 51 56 47.6209 56 43.5Z'
                              fill='white'
                            />
                            <path
                              d='M100 43.5C100 39.3791 96.6209 36 92.5 36C88.3791 36 85 39.3791 85 43.5C85 47.6209 88.3791 51 92.5 51C96.6209 51 100 47.6209 100 43.5Z'
                              fill='white'
                            />
                            <path
                              d='M72.1165 87C63.6503 87 56.6929 85.6989 56.2738 85.6989C53.4237 85.1785 51.5796 82.4028 52.0826 79.4537C52.5855 76.5045 55.1841 74.5963 58.1179 75.1167C58.2855 75.1167 72.5356 77.7189 83.6842 75.1167C86.5343 74.5095 89.3004 76.3311 89.8872 79.1935C90.474 82.1426 88.7137 85.005 85.9475 85.6122C81.3372 86.653 76.5592 87 72.1165 87Z'
                              fill='white'
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText primary={interfaceObj?.title} />
                        <FunctionsActionsButton
                          parentId={index.toString()}
                          darkbg
                          options={options}
                          handleOptionsBtn={handleActionBtns}
                          componentDetails={{ index, interfaceId: interfaceObj?._id, title: interfaceObj?.title }}
                          interface
                        />
                      </ListItemButton>
                    )}
                  </ListItem>
                )
              })}
            </List>
          </Box>
        </Box>
      </Box>
    )
  )
}

export default React.memo(
  addUrlDataHoc(React.memo(AllInterfaceList), [ParamsEnums?.projectId, ParamsEnums?.interfaceId, ParamsEnums?.orgId])
)
