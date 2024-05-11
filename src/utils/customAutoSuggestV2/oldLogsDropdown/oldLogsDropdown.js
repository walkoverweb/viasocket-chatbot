import React, { useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useDispatch } from 'react-redux'
import cloneDeep from 'lodash.clonedeep'
import { setInvocationDataV2 } from '../../../store/invocationV2/invocationSliceV2.ts'
import { useCustomSelector } from '../../deepCheckSelector'

function OldLogsDropdown() {
  const dispatch = useDispatch()

  const [newField, setNewField] = useState({})

  const { oldLogData, defaultValue } = useCustomSelector((state) => ({
    oldLogData: state.logs.oldLogs.data,
    defaultValue: state.invocationV2.invocationData?.requestTimestamp
  }))
  useEffect(() => {
    const newjson = {}
    for (let i = 0; i < oldLogData.length; i++) {
      newjson[oldLogData[i].requestTimestamp] = oldLogData[i]
    }
    setNewField(newjson)
  }, [])

  const Fields = Object.keys(newField)

  const handleSelectChange = (e) => {
    const response = cloneDeep(newField[e.target.value])
    dispatch(setInvocationDataV2(response))
  }

  return (
    <FormControl className='oldLogDataDropDownMainContainer'>
      <Select defaultValue={defaultValue} onChange={handleSelectChange} inputProps={{ 'aria-label': 'Without label' }}>
        {Fields.map((key) => (
          <MenuItem key={key} value={key}>
            {' '}
            {key}{' '}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default OldLogsDropdown
