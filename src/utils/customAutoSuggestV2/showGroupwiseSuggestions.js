import React from 'react'
import { Button, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ParamsEnums, Tabnames } from '../../enums'
import { getIconForBlockType } from './getIconForStep'
import { useCustomSelector } from '../deepCheckSelector'
import addUrlDataHoc from '../../hoc/addUrlDataHoc.tsx'

function RenderGroups({ keyname, isDisabled, suggestions, hideEditableDiv, handleAddSuggestion, showUsedVals, scriptId, tabName }) {
  const { flowJsonBlocks, usedVariables } = useCustomSelector((state) => ({
    flowJsonBlocks: state.flowJsonV2[scriptId]?.flowJson?.blocks,
    usedVariables: state.invocationV2?.usedVariables?.variables
  }))
  const isPublishedTab = tabName !== Tabnames.PUBLISH

  const groupSugesstionArray = suggestions[keyname] || []
  if (!groupSugesstionArray || groupSugesstionArray?.length === 0) return null
  return (
    <Box className='suggestionbox__group w-100 flex-col gap-2' key={keyname}>
      <Box className='flex-start-center gap-2 px-2'>
        {getIconForBlockType(flowJsonBlocks?.[keyname])}
        <Typography className='ff-b' variant='h4'>
          {keyname}
        </Typography>
      </Box>
      <Box className='flex-col w-100 gap-2'>
        {groupSugesstionArray?.map((suggestionDetailObj, index) => {
          const isUsedVariable = showUsedVals && usedVariables?.[suggestionDetailObj?.content?.replace(/\?/g, '')]
          return (
            <Box
              key={`${index.toString()}`}
              className={` w-100 gap-2  w-100  ${isDisabled ? 'disabled' : 'group_suggestion__box'} ${
                isUsedVariable && 'bg-green color-white'
              }`}
              onMouseDown={(e) => e.preventDefault()}
            >
              <Box className='usedvarslider-block flex-start-top gap-2 w-100 p-2'>
                <Box className='usedvarslider-block__title word_break-all flex-start-center '>
                  <Typography variant='base' className=''>
                    {suggestionDetailObj.name}
                  </Typography>
                </Box>
                <Tooltip
                  title={
                    typeof suggestionDetailObj?.value === 'object' ? JSON.stringify(suggestionDetailObj?.value) : suggestionDetailObj?.value
                  }
                  placement='left'
                >
                  <Box className='usedvarslider-block__value word_break-all flex-col gap-1'>
                    <Typography variant='base1'>{suggestionDetailObj.content}</Typography>
                    <Typography variant='base1' className='value fc-grey'>
                      {typeof suggestionDetailObj?.value === 'object' ? 'object' : suggestionDetailObj?.value}
                    </Typography>
                  </Box>
                </Tooltip>
                {!hideEditableDiv && (
                  <Button
                    disabled={isDisabled || !isPublishedTab}
                    onMouseDown={(e) => handleAddSuggestion(suggestionDetailObj, e, flowJsonBlocks?.[keyname])}
                    className='opacity-0 usedvarslider-block__btn'
                  >
                    Use It
                  </Button>
                )}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default React.memo(addUrlDataHoc(React.memo(RenderGroups), [ParamsEnums.scriptId, ParamsEnums.tabName]))
