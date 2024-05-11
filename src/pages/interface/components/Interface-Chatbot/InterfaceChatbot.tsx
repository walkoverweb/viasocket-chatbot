/* eslint-disable */
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import EastIcon from '@mui/icons-material/East'
import { Box, Grid, IconButton, LinearProgress, Paper, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import WebSocketClient from 'rtlayer-client'
import { getPreviousMessage, sendDataToAction } from '../../../../api/InterfaceApis/InterfaceApis.ts'
import { errorToast } from '../../../../components/customToast.js'
import { ParamsEnums } from '../../../../enums'
import addUrlDataHoc from '../../../../hoc/addUrlDataHoc.tsx'
import { $ReduxCoreType } from '../../../../types/reduxCore.ts'
import { useCustomSelector } from '../../../../utils/deepCheckSelector.js'
import InterfaceGrid from '../Grid/Grid.tsx'
import './InterfaceChatbot.scss'

const client = new WebSocketClient('lyvSfW7uPPolwax0BHMC', 'DprvynUwAdFwkE91V5Jj')
interface InterfaceChatbotProps {
  props: any
  inpreview: boolean
  interfaceId: string
  componentId: string
  gridId: string
  dragRef: any
}
interface MessageType {
  content: string
  role: string
  responseId?: string
  wait?: boolean
  timeOut?: boolean
  createdAt?: string
  function?: () => void
  id?: string
}

function isJSONString(str) {
  try {
    JSON.parse(str)
    return JSON.parse(str)
  } catch (error) {
    return {}
  }
}

function InterfaceChatbot({ props, inpreview = false, interfaceId, gridId, componentId, dragRef }: InterfaceChatbotProps) {
  const { actionId, interfaceContextData, threadId, bridgeName } = useCustomSelector((state: $ReduxCoreType) => ({
    actionId: state.Interface?.interfaceData?.[interfaceId]?.actions?.[gridId]?.[componentId]?.actionId,
    interfaceContextData: state.Interface?.interfaceContext?.[interfaceId]?.interfaceData,
    threadId: state.Interface?.threadId || '',
    bridgeName: state.Interface?.bridgeName || 'root'
  }))
  const [chatsLoading, setChatsLoading] = useState(false)
  const timeoutIdRef = useRef<any>(null)
  const containerRef = useRef(null)
  const userId = localStorage.getItem('interfaceUserId')
  const [messages, setMessages] = useState<MessageType[]>(
    !inpreview
      ? [
          { content: 'hello how are you ', role: 'user' },
          {
            responseId: 'Response24131',
            content: '{\n  "response": "Our AI services are available for you anytime, Feel free to ask anything"\n}',
            role: 'assistant'
          }
        ]
      : []
  )
  const [defaultQuestion, setDefaultQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const messageRef = useRef()

  const startTimeoutTimer = () => {
    timeoutIdRef.current = setTimeout(() => {
      setMessages((prevMessages): MessageType[] => {
        prevMessages.pop()
        setLoading(false)
        const updatedMessages = [...prevMessages, { role: 'assistant', wait: false, timeOut: true }]
        return updatedMessages
      })
    }, 120000) //2 minutes
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !loading) {
      onSend()
    }
  }
  const getallPreviousHistory = async () => {
    if (threadId && interfaceId) {
      setChatsLoading(true)
      const previousChats = await getPreviousMessage(interfaceId, threadId, bridgeName, actionId)
      if (previousChats?.chats?.data.length === 0) {
        setDefaultQuestions([...previousChats?.defaultQuestions])
        setMessages([])
        setChatsLoading(false)
      } else {
        setMessages([...(previousChats?.chats?.data || [])])
        setChatsLoading(false)
      }
    }
  }

  console.log(defaultQuestion, 'defaultQuestion')
  React.useEffect(() => {
    setLoading(false)
    if (inpreview) {
      const subscribe = () => {
        client.subscribe(interfaceId + (threadId || userId))
      }
      client.on('open', subscribe)
      subscribe()
      getallPreviousHistory()

      const handleMessage = (message: string) => {
        if (message !== '{"status":"connected"}') {
          const stringifiedJson = JSON.parse(message)?.response?.choices?.[0]?.message
          setLoading(false)
          setMessages((prevMessages) => {
            prevMessages.pop()
            const updatedMessages = [...prevMessages, stringifiedJson]
            return updatedMessages
          })
        }
        clearTimeout(timeoutIdRef.current)
      }

      client.on('message', handleMessage)

      return () => {
        client.unsubscribe(interfaceId + threadId)
      }
    }
  }, [threadId])

  const sendMessage = async (message: string) => {
    await sendDataToAction(actionId, {
      message: message,
      userId: userId,
      interfaceContextData: interfaceContextData || {},
      threadId: threadId,
      bridgeName: bridgeName
    })
  }

  const onSend = () => {
    setDefaultQuestions([])
    if (!actionId) {
      errorToast('Action is not available')
      return
    }
    const message = messageRef.current.value

    if (message?.trim()?.length === 0) return
    startTimeoutTimer()
    sendMessage(message)
    setLoading(true)
    setMessages((prevMessages): MessageType[] => {
      const updatedMessages = [...prevMessages, { role: 'user', content: message }, { role: 'assistant', wait: true }]
      return updatedMessages
    })

    messageRef.current.value = ''
  }

  const styles = {
    height: window.innerHeight
  }

  const movetoDown = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }
  React.useEffect(() => {
    movetoDown()
  }, [messages])

  // console.log(window.innerWidth)
  const [windowHW, setWindowHW] = useState({ width: window.innerWidth, height: window.innerHeight })
  const handleResize = () => {
    setWindowHW({ width: window.innerWidth, height: window.innerHeight - 20 })
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })
  return (
    <Box
      // maxWidth='sm'
      sx={{
        // width: windowHW.width,
        // height: windowHW.height,
        // minWidth: `${window.innerWidth - 20}px !important`,
        // maxWidth: `${window.innerWidth - 20}px !important`,
        // width: window.innerWidth - 20,
        // minHeight: `${window.innerHeight - 20}px !important`,
        // height: `${window.innerHeight - 20}px !important`, // Ensures full viewport height
        display: 'flex', // Enables flexbox layout
        flexDirection: 'column' // Stacks children vertically
        // padding: '0px !important',// Removes padding to allow full width on small screens
        // margin: '0px !important',
      }}
      className='w-100 h-100vh'
    >
      {/* Header */}
      <Grid item xs={12} className='first-grid' sx={{ paddingX: 2, paddingY: 1, backgroundColor: 'red' }}>
        <Box className='flex-col-start-start'>
          <Typography variant='h6' className='interface-chatbot__header__title color-white'>
            {props?.title || 'ChatBot'}
          </Typography>
          <Typography variant='overline' className='interface-chatbot__header__subtitle color-white'>
            {props?.subtitle || 'Do you have any questions? Ask us!'}
          </Typography>
        </Box>
      </Grid>
      {chatsLoading && <LinearProgress variant='indeterminate' color='primary' sx={{ height: 4 }} />}
      {/* Chat messages */}
      {
        <Grid item xs className='second-grid' sx={{ paddingX: 0.2, paddingBottom: 0.2 }}>
          <Paper
            elevation={3}
            sx={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: 2 }}
            ref={containerRef}
          >
            <Box sx={{ flex: '1 1 auto', minHeight: 0 }}>
              {messages.map((message, index) => (
                <Box className='w-100' key={index}>
                  {message?.role === 'user' && (
                    <Box className='flex w-100 chat-row box-sizing-border-box mr-2'>
                      <Box className='w-100 flex-start-center'>
                        <AccountBoxIcon />
                        <Typography variant='body1' className='ml-2'>
                          {message?.content}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {message?.role === 'assistant' && (
                    <Box className='chat-row w-100 box-sizing-border-box mr-2'>
                      <Box className='w-100 flex-start-start'>
                        <SmartToyIcon className='mr-1' />
                        {message?.wait === true ? (
                          <Box className='flex-start-center w-100 gap-5 p-1'>
                            <>
                              <Typography variant='body'>Waiting for bot response</Typography>
                              <div className='dot-pulse' />
                            </>
                          </Box>
                        ) : message?.timeOut === true ? (
                          <>
                            <Box className='flex-start-center w-100 gap-5 p-1'>
                              <Typography variant='body'>Timeout reached. Please try again later.</Typography>
                            </Box>
                          </>
                        ) : (
                          <Box className='w-100 flex-start-center'>
                            {isJSONString(message?.content || '{}')?.responseId ? (
                              <InterfaceGrid
                                style={styles}
                                dragRef={dragRef}
                                inpreview={false}
                                ingrid={false}
                                gridId={JSON.parse(message?.content || '{}')?.responseId || 'default'}
                                loadInterface={false}
                                componentJson={JSON.parse(message?.content || '{}')}
                                msgId={message?.createdAt}
                              />
                            ) : (
                              <Typography className='ml-1'>Invalid Response</Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
            {/* move to down icon */}
            {messages?.length > 10 && (
              <IconButton onClick={movetoDown} className='move-to-down-button' sx={{ backgroundColor: '#1976d2' }} disableRipple>
                <KeyboardDoubleArrowDownIcon color='inherit' className='color-white' onClick={movetoDown} />
              </IconButton>
            )}
            {/* Dynamic default questions at the bottom */}
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              {defaultQuestion.map((response, index) => (
                <Grid item xs={6} sm={6} key={index}>
                  <Box
                    sx={{
                      borderRadius: '5px',
                      boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.2)',
                      border: '.5px solid #1976d2'
                    }}
                    className='w-100 h-100 flex-spaceBetween-center cursor-pointer p-3 pl-3'
                    onClick={() => {
                      messageRef.current.value = response
                      onSend()
                    }}
                  >
                    <Typography variant='subtitle2'>{response}</Typography>
                    <EastIcon />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      }
      {/* Text field */}
      <Grid item xs={12} className='third-grid bg-white p-3 flex-center mb-2'>
        <TextField inputRef={messageRef} onKeyDown={handleKeyDown} placeholder='Enter your message' fullWidth />
        <IconButton
          onClick={() => (!loading ? onSend() : null)}
          className='p-3 cursor-pointer ml-2'
          sx={{ backgroundColor: '#1976d2', opacity: loading ? 0.5 : 1 }}
          disableRipple
        >
          <SendIcon color='inherit' className='color-white' />
        </IconButton>
      </Grid>
    </Box>
  )
}
export default React.memo(addUrlDataHoc(React.memo(InterfaceChatbot), [ParamsEnums?.interfaceId]))
