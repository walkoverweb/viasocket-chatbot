import React from 'react'
import { Box, Checkbox, CheckboxProps, FormControlLabel } from '@mui/material'
import { useDispatch } from 'react-redux'
import debounce from 'lodash.debounce'
import { addInterfaceContext } from '../../../../store/interface/interfaceSlice.ts'

interface InterfaceCheckboxProps {
  props: CheckboxProps
  gridId: string
  componentId: string
}

function InterfaceCheckbox({ props, gridId, componentId }: InterfaceCheckboxProps) {
  const dispatch = useDispatch()

  const debouncedDispatch = debounce((value: boolean) => {
    dispatch(addInterfaceContext({ gridId, componentId, value }))
  }, 400)

  const handleChange = (e: any) => {
    const { checked } = e.target
    debouncedDispatch(checked)
  }
  return (
    <Box className='w-100 h-100 flex-start-center'>
      <FormControlLabel
        control={<Checkbox {...props} onMouseDown={(e) => e.stopPropagation()} onChange={handleChange} />}
        label={props?.label || 'Checkbox'}
        labelPlacement='end'
      />
    </Box>
  )
}

export default InterfaceCheckbox
