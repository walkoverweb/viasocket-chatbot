import CodeIcon from '@mui/icons-material/Code'
import DataObjectIcon from '@mui/icons-material/DataObject'
import ApiSharpIcon from '@mui/icons-material/ApiSharp'
import { JavascriptOutlined } from '@mui/icons-material'
import { BlockTypes } from '../../enums'

export const getIconForBlockType = (block, insideChipIcon) => {
  let iconComponent
  switch (block?.type) {
    case BlockTypes.API:
      iconComponent = block?.url ? (
        <img className={`suggestion-box__icon ${insideChipIcon && 'suggestion-box__icon-insidechip'} `} src={block.url} alt='' />
      ) : (
        <ApiSharpIcon className={`suggestion-box__icon ${insideChipIcon && 'suggestion-box__icon-insidechip'} `} />
      )
      break
    case BlockTypes.FUNCTION:
      iconComponent = <JavascriptOutlined className={`suggestion-box__icon ${insideChipIcon && 'suggestion-box__icon-insidechip'} `} />
      break
    case 'function':
      iconComponent = <JavascriptOutlined className={`suggestion-box__icon ${insideChipIcon && 'suggestion-box__icon-insidechip'} `} />
      break
    case BlockTypes.VARIABLE:
      iconComponent = <CodeIcon className={`suggestion-box__icon ${insideChipIcon && 'suggestion-box__icon-insidechip'} `} />
      break
    default:
      iconComponent = <DataObjectIcon className={`suggestion-box__icon ${insideChipIcon && 'suggestion-box__icon-insidechip'} `} />
  }

  return iconComponent
}
