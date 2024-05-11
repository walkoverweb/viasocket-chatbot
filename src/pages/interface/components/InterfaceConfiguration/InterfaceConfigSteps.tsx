import { Button, Link, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { Box } from '@mui/system'
import React, { Dispatch, SetStateAction } from 'react'
import { useDispatch } from 'react-redux'
import InputCombo from '../../../../components/embededPageComponents/setupComponent/inputCombo/inputCombo'
import InterfaceTemplateCode, {
  InterfaceEmbedCodeUsage
} from '../../../../components/embededPageComponents/setupComponent/templateCode/templateCode'
import { ParamsEnums } from '../../../../enums'
import addUrlDataHoc from '../../../../hoc/addUrlDataHoc.tsx'
import { updateInterfaceDetailsStart } from '../../../../store/interface/interfaceSlice.ts'
import { getEmbedTokenThunk } from '../../../../store/orgs/orgsThunk'
import { $ReduxCoreType } from '../../../../types/reduxCore.ts'
import { useCustomSelector } from '../../../../utils/deepCheckSelector'

interface StepOneProps {
  orgId: string
  projectId: string
  interfaceId: string
}
function StepOne({ orgId, projectId, interfaceId }: StepOneProps) {
  const dispatch = useDispatch()
  const { embedAccessToken, interfaceAccessType } = useCustomSelector((state: $ReduxCoreType) => ({
    embedAccessToken: state?.orgs?.orgs[orgId]?.meta?.auth_token,
    interfaceAccessType: state?.Interface?.interfaceData?.[interfaceId]?.accessType
  }))
  const [accessType, setAccessType] = React.useState(interfaceAccessType)
  const handleGetAccessToken = () => {
    dispatch(getEmbedTokenThunk(orgId))
  }

  return (
    <Box className='p-3 mt-4  boxShadow'>
      <Button variant='text' onClick={() => window.history.back()}>
        {' '}
        <u> Back </u>{' '}
      </Button>
      <Typography variant='h5'>Step One</Typography>
      <AccessTypeRadioButtons accessType={accessType} setAccessType={setAccessType} dispatch={dispatch} interfaceId={interfaceId} />
      {interfaceAccessType !== 'Public' && (
        <Box className='mt-4'>
          <Box>
            <>
              {embedAccessToken ? (
                <InputCombo stepName='access key' value={embedAccessToken} copyValue={embedAccessToken} />
              ) : (
                <Button className='primary-btn p-2 mt-4 ml-2 mb-2' variant='contained' onClick={handleGetAccessToken}>
                  Get Your Key
                </Button>
              )}
              <InputCombo stepName='org_id' value={orgId} copyValue={orgId} />
              <InputCombo stepName='project_id' value={projectId} copyValue={projectId} />
              <InputCombo stepName='interface_id' value={interfaceId || ''} copyValue={interfaceId || ''} />
              <Box className='flex-col p-2'>
                <Typography className='mt-2' variant='base'>
                  Generate a JWT Token by incorporating the project_id, org_id, interface_id and user_id, and subsequently sign it with the
                  access key.
                </Typography>
                <Link className='learn-more-btn mt-2' href='https://viasocket.com/faq/create-jwt-token' target='_blank'>
                  Learn to create JWT token.
                </Link>
              </Box>
            </>
          </Box>
        </Box>
      )}
    </Box>
  )
}
export const InterfaceConfigStepOne = React.memo(
  addUrlDataHoc(React.memo(StepOne), [ParamsEnums?.orgId, ParamsEnums?.projectId, ParamsEnums?.interfaceId])
)

export function InterfaceConfigStepTwo() {
  return (
    <Box className='mt-4 p-3  boxShadow'>
      <Typography variant='h5'>Step Two</Typography>
      <Box className='p-2 mt-3 flex-col'>
        <Typography className='mt-2' variant='base'>
          Add below code in your product.
        </Typography>
        <InterfaceTemplateCode />
      </Box>
      <Box className='p-2 mt-1 flex-col'>
        <Typography variant='h5'>Usage</Typography>
        <Typography className='mt-1' variant='base'>
          Use this methods to send and receive data
        </Typography>
        <InterfaceEmbedCodeUsage />
      </Box>
      <Link className='learn-more-btn ml-2' href='https://viasocket.com/faq/integrate-viasocket' target='_blank'>
        Learn to integrate code
      </Link>
    </Box>
  )
}

function AccessTypeRadioButtons({
  accessType,
  setAccessType,
  dispatch,
  interfaceId
}: {
  accessType: string
  setAccessType: Dispatch<SetStateAction<string>>
  dispatch: any
  interfaceId: string
}) {
  const accessTypes = ['Public', 'Private']
  const changeAccessType = (event) => {
    const value = event.target.value
    setAccessType(value)
    dispatch(updateInterfaceDetailsStart({ interfaceId, accessType: value }))
  }
  return (
    <FormControl>
      <FormLabel id='demo-row-radio-buttons-group-label'>AccessType</FormLabel>
      <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label' name='row-radio-buttons-group' onChange={changeAccessType}>
        {accessTypes.map((type) => (
          <FormControlLabel key={type} value={type} control={<Radio />} label={type} checked={type === accessType} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
