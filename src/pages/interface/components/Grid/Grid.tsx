import { Box } from '@mui/material'
import React, { createContext, useMemo } from 'react'
import { ParamsEnums } from '../../../../enums'
import addUrlDataHoc from '../../../../hoc/addUrlDataHoc.tsx'
import './Grid.scss'

const Editabledgrid = React.lazy(() => import('./Editabledgrid.tsx'))
const Viewonlygrid = React.lazy(() => import('./Viewonlygrid.tsx'))
export const GridContext = createContext({})

function Grid({ componentJson, msgId, ...props }) {
  const gridContextValue = useMemo(() => {
    return { ...componentJson, msgId }
  }, [componentJson, msgId])
  return (
    <GridContext.Provider value={gridContextValue}>
      <Box className='column h-100 w-100 box-sizing-border-box'>
        <React.Suspense fallback={<div>Loading...</div>}>
          {props?.projectId ? <Editabledgrid {...props} /> : <Viewonlygrid {...props} />}
        </React.Suspense>
      </Box>
    </GridContext.Provider>
  )
}

export default React.memo(addUrlDataHoc(React.memo(Grid), [ParamsEnums?.projectId]))
