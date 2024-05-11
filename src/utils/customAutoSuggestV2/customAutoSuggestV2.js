/* eslint-disable */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import '../chipSuggestion.css'
import { Box, Chip, IconButton, Switch, Tab, Tabs, Tooltip, Typography, Button } from '@mui/material'
import { closeSuggestionBox, openSuggestionBox } from '../../store/chip/allChip/allChip.ts'
import JsonPretty from '../../components/JsonPretty/jsonPretty'
import { JsonTreeComp } from '../../components/jsonTreeComp/jsonTreeComp'
import { ParamsEnums, Tabnames } from '../../enums'
import SearchBar from '../../components/projectdashboard/searchBar'
import './customAutoSuggest.scss'
import { useCustomSelector } from '../deepCheckSelector'
import addUrlDataHoc from '../../hoc/addUrlDataHoc.tsx'
import MentionsInput from '../react-mentons/src/MentionsInput'
import Mention from '../react-mentons/src/Mention'
import debounce from 'lodash.debounce'
import RenderSuggestions from './RenderSuggestions.tsx'
import Markdown from 'react-markdown'
import { LinkRenderer } from '../../components/Markdown/LinkRenderer.tsx'
import { updateAppInfoState } from '../../store/appInfo/appInfoSlice.ts'

function CustomAutoSuggestV2({
  id,
  editableDivRef,
  getHtmlAndValue = () => {},
  defaultValue,
  hideEditableDiv,
  disabled,
  sliderPosition = 'right',
  onChangeFunction = () => {},
  haveError,
  scriptId,
  transparent = false,
  singleLine = false,
  slugName,
  help = '',
  tabName,
  stepId,
  placeholder = '',
  noborder = false,
  value = '',
  plainText = '',
  height,
  copyText = false,
  hideAddVariablesButton = false,
  darkbg = false,
  onBlurFunction = () => {}
}) {
  const dispatch = useDispatch()
  const [localData, setLocalData] = useState({ value: value || '', plainText: plainText || '' })
  const cursorPositionRef = useRef({ selectionStart: null, selectionEnd: null })
  const {
    showFullScreen,
    isAiSliderOpen,
    allSuggestion,
    isSuggestionOpen,
    stepOrder,
    isAlertOnPublishSliderOpen,
    currentStepId,
    currentStepType
  } = useCustomSelector((state) => ({
    showFullScreen: state.appInfo.showFullScreen,
    isAiSliderOpen: state.appInfo.isAiSliderOpen,
    allSuggestion: state.invocationV2.groupedSuggestions,
    isSuggestionOpen: state.allChip.isSuggestionOpen,
    stepOrder: state.flowJsonV2[scriptId]?.stepOrder || [],
    isAlertOnPublishSliderOpen: state.appInfo.isAlertOnPublishSliderOpen,
    currentStepId: state.appInfo.currentStepId,
    currentStepType: state.appInfo.currentStepType
  }))
  const isPublishedTab = tabName === Tabnames.PUBLISH

  const [toggleForRawData, setToggleForRawData] = useState('variables')
  const suggestionRef = useRef()
  const preventwriting = useRef(false)
  const triggerRef = useRef('c')
  const [showUsedVals, setShowUsedVals] = useState(false)
  const [search, setSearch] = useState('')
  const mentionRef = useRef()
  const inputRef = useRef()
  const suggestionListRef = useRef([])
  const relationRef = useRef({})
  useEffect(() => {
    let valueToset = value || ''
    let textToset = plainText || ''
    if (typeof valueToset !== 'string') valueToset = JSON.stringify(valueToset)
    if (typeof textToset !== 'string') textToset = JSON.stringify(textToset)
    setLocalData({ value: valueToset || textToset || '', plainText: textToset || '' })
  }, [value, plainText])

  // const [isHelpExpanded, setIsHelpExpanded] = useState(false)

  // const truncatedHelp = help.length > 90 ? help.slice(0, 90) + '...' : help

  // const handleHelpToggle = () => {
  //   setIsHelpExpanded(!isHelpExpanded)
  // }

  const marginRight = useMemo(() => {
    if (sliderPosition === 'left') return 'slider-left-zero'
    if ((isAiSliderOpen || isAlertOnPublishSliderOpen) && stepId) return 'margin-step-and-chatbot'
    if (isAlertOnPublishSliderOpen || isAiSliderOpen) return 'margin-step-and-ai'
    if (showFullScreen) return 'margin-step-fullscreen'
    if (stepId) return 'margin-step'
    return 'suggestion_slider_right'
  }, [stepId, showFullScreen, isAlertOnPublishSliderOpen, isAiSliderOpen, sliderPosition])

  const handleAddSuggestion = (suggestionDetailObj) => {
    if (hideEditableDiv || disabled || isPublishedTab) return
    if (id === 'function-slider') {
      const editor = editableDivRef.current.editor
      const cursorPosition = editor.getCursorPosition() // Get the current cursor position
      editor.session.insert(cursorPosition, suggestionDetailObj.content)
      return
    }
    if (cursorPositionRef.current && mentionRef.current && suggestionDetailObj?.content) {
      const sbstring = suggestionDetailObj?.content?.substring(7) || ''
      mentionRef.current.addMention(
        { id: sbstring, display: sbstring },
        {
          childIndex: 0,
          querySequenceStart: cursorPositionRef.current.selectionStart,
          querySequenceEnd: cursorPositionRef.current.selectionEnd,
          plainTextValue: localData.plainText
        }
      )
    }
  }

  const handleChangeInShowUsedVals = (event) => {
    setShowUsedVals(event.target.checked)
  }

  const handleRawDataBtnClick = (e, value) => {
    setToggleForRawData(value)
  }

  const closeSuggestions = (e) => {
    dispatch(closeSuggestionBox())
    e.stopPropagation()
  }
  const debouncedSearch = debounce((text) => {
    setSearch(text?.trim()?.toLowerCase())
  }, 300)

  const handleChipClick = () => {
    dispatch(openSuggestionBox(id))
    dispatch(updateAppInfoState({ compareSliderOpen: false }))
  }

  const suggestionBox = useMemo(() => {
    return (
      <Box
        ref={suggestionRef}
        className={`suggestion-box  ${
          isAiSliderOpen &&
          (isSuggestionOpen == 'teamId' ||
            isSuggestionOpen == 'content' ||
            isSuggestionOpen == 'headerTab' ||
            isSuggestionOpen == 'requestInput' ||
            isSuggestionOpen == 'queryparamsTab')
            ? 'content-right'
            : ''
        }
          ${isAiSliderOpen && isSuggestionOpen && currentStepType ? 'swipe-left' : ''} 
          ${isAlertOnPublishSliderOpen && isSuggestionOpen && currentStepType ? 'swipe-left' : ''}
           ${marginRight} flex-col-start-top gap-3  p-2   overflow-scroll-y box-sizing-border-box `}
      >
        <Box ref={suggestionRef} className='flex-col-start-end gap-3  w-100 overflow-scroll-y box-sizing-border-box pb-2 '>
          <Box className='flex-spaceBetween-center'>
            <Tabs value={toggleForRawData} onChange={handleRawDataBtnClick}>
              <Tab value='variables' label='Variables' />
              <Tab value='rawdata' label='Raw Data' />
            </Tabs>
            <Box className='flex-end-center gap-2'>
              <Typography className='smallHeading'>Used variables</Typography>
              <Switch onChange={handleChangeInShowUsedVals} inputProps={{ 'aria-label': 'controlled' }} />
              <IconButton onClick={closeSuggestions}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box className='pb-2'>
          <SearchBar parentRef={suggestionRef} handleSearchBar={(text) => debouncedSearch(text)} placeholder='Filter Suggestions' />
        </Box>
        {toggleForRawData === 'rawdata' ? (
          <ShowCaseTheRawData />
        ) : (
          <RenderSuggestions showUsedVals={showUsedVals} handleAddSuggestion={handleAddSuggestion} search={search} />
        )}
      </Box>
    )
  }, [marginRight, toggleForRawData, showUsedVals, search, isSuggestionOpen, isAiSliderOpen, currentStepType, currentStepId])
  useEffect(() => {
    cursorPositionRef.current = { selectionStart: null, selectionEnd: null }
    suggestionListRef.current = []
    const arr = window.location.pathname.startsWith('/developer/')
      ? ['authData', 'inputData', 'webhookData']
      : ['webhookData', ...stepOrder]
    const curIndex = arr?.indexOf(slugName)
    arr.forEach((key) => {
      if (curIndex <= arr?.indexOf(key) && curIndex !== -1) return
      const group = allSuggestion[key] || []
      if (group.length === 0) return
      suggestionListRef.current = suggestionListRef.current.concat(
        group.map((el) => {
          return { ...el, id: el.id.substring(7) }
        })
      )
    })
  }, [allSuggestion, slugName, stepOrder])

  if (hideEditableDiv) return suggestionBox
  return (
    <Box className='w-100 h-100 '>
      <Box className='suggestion-box__parent'>{isSuggestionOpen === id && suggestionBox}</Box>
      {!hideEditableDiv && id !== 'function-slider' && (
        <Box className='input-parent pos-rel'>
          <MentionsInput
            placeholder={placeholder}
            ref={mentionRef}
            singleLine={singleLine}
            copyText={copyText}
            allowSpaceInQuery
            allowSuggestionsAboveCursor
            style={{
              control: {
                backgroundColor: transparent || disabled || isPublishedTab ? 'transparent' : 'white',
                fontSize: 14,
                opacity: isPublishedTab ? '0.5' : '1',
                fontWeight: 'normal',
                padding: transparent ? '0px' : '8px'
              },
              '& .multiLine': {
                width: '100%',
                minHeight: height || '80px',
                control: { fontFamily: 'monospace', minHeight: height || '80px', padding: transparent ? '0px' : '8px' },

                highlighter: { border: '1px solid transparent' },
                input: {
                  border: darkbg || noborder ? 'none' : haveError ? '1px solid #8b0000' : '1px solid silver',
                  outline: 'none',
                  color: darkbg ? 'white' : 'black',
                  padding: transparent ? '0px' : '8px'
                }
              },
              '& .singleLine': {
                width: '100%',
                height: '40px',
                border: haveError ? '1px solid #8b0000' : darkbg || noborder ? 'none' : '',
                display: 'inline-block',
                highlighter: {},
                input: {
                  height: '40px',
                  outline: haveError ? '1px solid #8b0000' : darkbg || noborder ? 'none' : '',
                  color: darkbg ? 'white' : 'black'
                },
                control: {
                  height: '40px',
                  padding: '10px',
                  paddingLeft: '4px'
                }
              },
              suggestions: {
                zIndex: 3001,
                list: {
                  zIndex: '30001',
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontSize: 14
                },
                item: {
                  padding: '5px 15px',
                  borderBottom: '1px solid rgba(0,0,0,0.15)',
                  '& .focused': {
                    backgroundColor: '#f7f7f7'
                  }
                }
              }
            }}
            value={localData.value}
            onKeyUp={(e) => {
              cursorPositionRef.current = {
                selectionStart: e.target.selectionStart,
                selectionEnd: e.target.selectionEnd
              }
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'y')) preventwriting.current = true
              else preventwriting.current = false
            }}
            onFocus={() => {
              if (isSuggestionOpen && isSuggestionOpen !== id) dispatch(openSuggestionBox(id))
            }}
            inputRef={inputRef}
            textareaClass={transparent ? '' : 'p-2'}
            onClick={(e) => {
              if (isSuggestionOpen && isSuggestionOpen !== id) dispatch(openSuggestionBox(id))
              cursorPositionRef.current = {
                selectionStart: e.target.selectionStart,
                selectionEnd: e.target.selectionEnd
              }
            }}
            triggerRef={triggerRef}
            defaultValue={defaultValue}
            onChange={(e, newval) => {
              if (preventwriting.current) return
              let text = newval.replace(/\${(.*?)}/g, '$1')
              if (disabled || isPublishedTab) return
              Object.entries(relationRef.current).map(([key, value]) => {
                text = text?.replaceAll(key, value)
              })
              setLocalData({ value: newval, plainText: text })
              onChangeFunction(text?.replaceAll('🏷', ''), newval)
            }}
            disabled={disabled}
            onBlur={(event, clickedSuggestion) => {
              if (disabled || isPublishedTab) return
              let text = localData.plainText
              Object.entries(relationRef.current).map(([key, value]) => {
                text = text?.replaceAll(key, value)
              })
              getHtmlAndValue(text?.trim(), localData?.value?.trim())
              onBlurFunction(event, clickedSuggestion)
            }}
          >
            <Mention
              trigger={triggerRef.current}
              markup='${context__id__}'
              relationRef={relationRef}
              displayTransform={(id) => {
                id = `context${id}`
                return `🏷${id
                  ?.replaceAll('?.[', '[')
                  ?.replaceAll('?.', '.')
                  .replace(/^context\.res\.|context\.req\.|context\.vals\.|context\./, '')}`
              }}
              data={suggestionListRef.current}
              style={{ backgroundColor: '#cee4e5' }}
              renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => {
                return (
                  <div className={`user ${focused ? 'focused' : ''} flex-spaceBetween-center gap-2`}>
                    <Typography variant='base'>{highlightedDisplay}</Typography>
                    <Tooltip
                      placement='bottom'
                      title={typeof suggestion.value !== 'object' ? `${suggestion.value}` : JSON.stringify(suggestion.value, null, 2)}
                    >
                      <Typography
                        variant='caption'
                        className='text-overflow-eclipse w-value'
                        fontWeight={typeof suggestion.value === 'object' ? '600' : ''}
                      >
                        {typeof suggestion.value !== 'object' ? `${suggestion.value}` : 'object'}
                      </Typography>
                    </Tooltip>
                  </div>
                )
              }}
            />
          </MentionsInput>

          {!disabled && !hideAddVariablesButton && (
            <Box className={`flex-spaceBetween-top addvariables ${tabName === 'draft' ? '' : 'opacity-0 pointer-event-none'}`}>
              {help ? (
                <Markdown className='opacity-half' components={{ a: LinkRenderer }}>
                  {help}
                </Markdown>
              ) : (
                <Box />
              )}
              {/* <Chip
                size='small'
                icon={<AddCircleRoundedIcon />}
                onClick={() => { dispatch(openSuggestionBox(id)); dispatch(updateAppInfoState(compareSliderOpen(false))) }}
                color={haveError ? 'error' : undefined}
                label='variables'
              /> */}
              <Chip
                size='small'
                icon={<AddCircleRoundedIcon />}
                onClick={() => handleChipClick(id)}
                color={haveError ? 'error' : undefined}
                label='variables'
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

function ShowCaseTheRawData() {
  const invocationData = useCustomSelector((state) => state.invocationV2?.invocationData)
  return (
    <Box className='w-100'>
      <Box className='p-1'>
        {invocationData?.requestSnapshot?.requestType}
        <JsonTreeComp collapsed src={invocationData?.requestSnapshot?.query} name='query' rootPath='context.req' />
        <JsonTreeComp collapsed src={invocationData?.requestSnapshot?.body} name='body' rootPath='context.req' />
        <JsonTreeComp collapsed src={invocationData?.requestSnapshot?.headers} name='headers' rootPath='context.req' />
        <JsonTreeComp collapsed src={invocationData?.requestSnapshot?.attachment} name='attachment' rootPath='context.req' />
      </Box>

      <Box className='p-1 responseNameMainContainer'>
        <Box> Response :-</Box>
        <Box>
          {typeof invocationData?.responseSnapshot === 'object' ? (
            <JsonTreeComp collapsed src={invocationData?.responseSnapshot} name='res' rootPath='context' />
          ) : (
            <JsonPretty data={invocationData?.responseSnapshot} />
          )}
        </Box>
      </Box>
      <Box className='p-1 responseNameMainContainer'>
        <Box> Vals :-</Box>
        {typeof invocationData?.vals === 'object' ? (
          <JsonTreeComp collapsed src={invocationData?.vals} name='vals' rootPath='context' />
        ) : (
          <JsonPretty data={invocationData?.vals} />
        )}
      </Box>
    </Box>
  )
}

export default React.memo(
  addUrlDataHoc(React.memo(CustomAutoSuggestV2), [ParamsEnums.stepId, ParamsEnums.scriptId, ParamsEnums.slugName, ParamsEnums.tabName])
)
