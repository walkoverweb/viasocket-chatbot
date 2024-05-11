import React from 'react'
import PropTypes from 'prop-types'
import ApiSharpIcon from '@mui/icons-material/ApiSharp'
import FunctionsIcon from '@mui/icons-material/Functions'
import CodeIcon from '@mui/icons-material/Code'
import useStyles from 'substyle'
import get from 'lodash.get'
import { Tooltip } from '@mui/material'
import { useCustomSelector } from '../../deepCheckSelector'
import addUrlDataHoc from '../../../hoc/addUrlDataHoc.tsx'
import { ParamsEnums } from '../../../enums'

const defaultStyle = {
  fontWeight: 'inherit',
  wordBreak: 'break-all'
}

function Mention({ display, style, className, classNames, scriptId, relationRef, id }) {
  relationRef.current = { ...relationRef.current, [display]: `context${id}` }
  const flowJsonBlock = useCustomSelector((state) => {
    const blocks = state.flowJsonV2[scriptId]?.flowJson?.blocks
    const key = display?.split('.')[0].substring(1)
    return blocks?.[key]
  })
  const value = useCustomSelector((state) => {
    const context = state.invocationV2.context
    return get(context, `context${id}`?.replaceAll('?.[', '[')?.replaceAll('?.', '.'), '')
  })
  const getImage = () => {
    if (flowJsonBlock?.iconUrl) return <img src={flowJsonBlock.iconUrl} alt='' width='100%' height='100%' />
    if (flowJsonBlock?.type === 'function') return <FunctionsIcon color='black' className='w-100 h-100' />
    if (flowJsonBlock?.type === 'api') return <ApiSharpIcon color='black' className='w-100 h-100' />
    return <CodeIcon color='black' className='w-100 h-100' />
  }
  const styles = useStyles(defaultStyle, { style, className, classNames })
  const virtualSpan = document.createElement('span')
  const virtualStrong = document.createElement('strong')
  virtualStrong.innerHTML = '🏷'
  virtualStrong.setAttribute('id', 'getwidthof')
  virtualStrong.setAttribute('class', 'pos-abs opacity-0 pointer-event-none')
  virtualSpan.appendChild(virtualStrong)
  Object.assign(virtualSpan.style, styles)
  document.body.appendChild(virtualSpan)
  const width = virtualStrong.offsetWidth
  document.body.removeChild(virtualSpan)
  return (
    <span>
      <strong {...styles} className='pos-rel'>
        <Tooltip title={typeof value !== 'object' ? `${value}` : JSON.stringify(value, null, 2)}>
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 1,
              backgroundColor: '#cee4e5',
              padding: 0,
              height: '16px',
              width: width,
              overflow: 'hidden'
            }}
            className='flex-start-center'
          >
            {getImage()}
          </span>
        </Tooltip>
        {display}
      </strong>
    </span>
  )
}

Mention.propTypes = {
  onAdd: PropTypes.func,
  renderSuggestion: PropTypes.func,
  trigger: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]),
  markup: PropTypes.string,
  displayTransform: PropTypes.func,
  isLoading: PropTypes.bool
}

Mention.defaultProps = {
  trigger: '@',
  markup: '@[__display__](__id__)',
  displayTransform: function (id, display) {
    return display || id
  },
  onAdd: () => null,

  renderSuggestion: null,
  isLoading: false
}

export default React.memo(addUrlDataHoc(React.memo(Mention), [ParamsEnums.scriptId]))
