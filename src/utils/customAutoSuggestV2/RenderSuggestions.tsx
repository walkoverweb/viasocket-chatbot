import React, { useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Tooltip, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FixedSizeList as VirtualizedList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import { useCustomSelector } from '../deepCheckSelector'
import { ParamsEnums } from '../../enums'
import addUrlDataHoc from '../../hoc/addUrlDataHoc.tsx'

function RenderSuggestions({ scriptId, handleAddSuggestion, search, showUsedVals, slugName }) {
  const [tipForCopy, setTipForCopy] = useState(false)

  const handleCopy = (value) => {
    if (window.parent !== window) window?.parent?.postMessage({ type: 'copy', message: value?.toString() }, '*')
    else navigator.clipboard.writeText(value?.toString() || '')
    setTipForCopy(true)
    setTimeout(() => {
      setTipForCopy(false)
    }, 1500)
  }

  const { allSuggestion, stepOrder, usedVariables } = useCustomSelector((state) => ({
    allSuggestion: state.invocationV2.groupedSuggestions,
    stepOrder: state.flowJsonV2[scriptId]?.stepOrder || [],
    usedVariables:
      Object.keys(state?.invocationV2?.usedVariables.variables).map((el) => el?.replaceAll('.', '?.')?.replaceAll('[', '?.[')) || []
  }))

  const arr = window.location.pathname.startsWith('/developer/') ? ['authData', 'inputData', 'webhookData'] : ['webhookData', ...stepOrder]
  const curIndex = arr.indexOf(slugName)
  return (
    <Box className='w-100'>
      {arr.map((key, parentIndex) => {
        let value = allSuggestion[key] || []
        if (value.length === 0) return null
        value = value.filter(
          (item) =>
            !(showUsedVals && !usedVariables.includes(item.id)) &&
            !(
              search &&
              !JSON.stringify(item.value)?.toLowerCase().includes(search) &&
              !item.display?.toLowerCase().includes(search) &&
              !key?.toLowerCase().includes(search)
            )
        )
        return (
          <Accordion
            className={`${curIndex <= parentIndex && curIndex !== -1 ? 'opacity-half' : ''}`}
            TransitionProps={{ timeout: { appear: 1, enter: 1, exit: 4 } }}
            defaultExpanded
            key={key}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant='h6'>{key}</Typography>
            </AccordionSummary>
            <AccordionDetails className='w-100 p-2'>
              <Box
                sx={value.length <= 10 ? { height: `${value.length * 65}px`, paddingTop: '10px' } : { height: '500px', paddingTop: '10px' }}
              >
                <AutoSizer>
                  {({ height, width }) => {
                    return (
                      <VirtualizedList height={height} itemCount={value.length} itemSize={65} width={width}>
                        {({ index, style }) => {
                          const item = value[index]
                          if (
                            (showUsedVals && !usedVariables.includes(item.id)) ||
                            (search &&
                              !JSON.stringify(item.value)?.toLowerCase().includes(search) &&
                              !item.display?.toLowerCase().includes(search) &&
                              !key?.toLowerCase().includes(search))
                          )
                            return null
                          return (
                            <div style={style} key={item.id} className='flex-start-center'>
                              <Box
                                className='list-item w-100 m-1 box-sizing-border-box flex-spaceBetween-center gap-3 text-overflow-eclipse '
                                onMouseDown={(e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                }}
                              >
                                <Box className='ellipsis-container w-100 flex-col-start-start'>
                                  <Tooltip title={item.display} placement='left'>
                                    <Typography className='ellipsis-text' variant='title' fontWeight='bold'>
                                      {item.display}
                                    </Typography>
                                  </Tooltip>
                                  <Tooltip
                                    title={typeof item.value === 'object' ? JSON.stringify(item.value) : `${item.value}`}
                                    placement='left'
                                    className='text-overflow-eclipse'
                                  >
                                    <Typography className='text-overflow-eclipse'>
                                      {typeof item.value === 'object' ? 'Object' : `${item.value}`}
                                    </Typography>
                                  </Tooltip>
                                </Box>
                                <Box className='right-button flex-end-center'>
                                  <Button
                                    disabled={curIndex <= parentIndex && curIndex !== -1}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handleAddSuggestion({ content: item.id }, e)
                                    }}
                                  >
                                    Use It
                                  </Button>
                                  <Tooltip title={tipForCopy ? 'copied' : 'copy'} placement='bottom'>
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()

                                        handleCopy(JSON.stringify(item.value))
                                      }}
                                      startIcon={<ContentCopyOutlinedIcon />}
                                    >
                                      Value
                                    </Button>
                                  </Tooltip>
                                  <Tooltip title={tipForCopy ? 'copied' : 'copy'} placement='bottom'>
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()

                                        handleCopy(item.id)
                                      }}
                                      startIcon={<ContentCopyOutlinedIcon />}
                                    >
                                      Path
                                    </Button>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </div>
                          )
                        }}
                      </VirtualizedList>
                    )
                  }}
                </AutoSizer>
              </Box>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </Box>
  )
}

export default React.memo(addUrlDataHoc(React.memo(RenderSuggestions), [ParamsEnums.scriptId, ParamsEnums.slugName]))
