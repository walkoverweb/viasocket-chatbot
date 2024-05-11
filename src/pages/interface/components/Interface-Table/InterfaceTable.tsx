import { DataGrid } from '@mui/x-data-grid'
import { useDispatch } from 'react-redux'
import { addInterfaceContext } from '../../../../store/interface/interfaceSlice'
import { useContext, useEffect } from 'react'
import { GridContext } from '../Grid/Grid'
import axios from '../../../../interceptor/interceptor'

function generateColumns(data: { [key: string]: any }) {
  return Object.keys(data || {}).map((key) => ({
    id: key, // Use the key as the unique ID for each column definition
    field: key,
    headerName: key.toString().toUpperCase(),
    flex: 1
  }))
}
function generateRows(data) {
  return data.map((row, index) => ({ id: index, ...row }))
}
interface InterfaceTableProps {
  props: any
}

function InterfaceTable({ props, gridId, componentId }: InterfaceTableProps) {
  const responseJson = useContext(GridContext)
  const source = props?.source
  const payload = props?.payload || JSON.parse(props?.payloaad || '{}') || {}
  console.log(payload, 123123)
  // const dispatch = useDispatch()
  console.log('source', source)
  // useEffect(() => {
  //   ; (async () => {
  //     const { data } = await axios.post('https://flow.sokt.io/scripts/scrigLUSng0K/functions/test', {
  //       code: `${source}\n return await getTableData(${JSON.stringify(payload)});`,
  //       name: 'test',
  //       type: 'function'
  //     })
  //     console.log(data, 'data')
  //   })()
  // }, [source])

  // dispatch(addInterfaceContext({ gridId: responseJson?.responseId + responseJson?.msgId, componentId, value: responseJson?.[componentId]?.props?.source }));

  // const datatosend = {
  //   type: 'plugin',
  //   code: {
  //     source: editorRef?.current?.editor?.getValue(),
  //     selectedValues: cloneDeepObj
  //   },
  //   name: 'plugin',
  //   variables: context
  // }

  // const response = await dryRunFunction({
  //   scriptId: 'devhubPluginPreview',
  //   data: datatosend
  // })
  let columns = generateColumns(props?.data?.[0]) || []
  let rows = generateRows(props?.data || [])
  return (
    <DataGrid
      rows={rows || []}
      columns={columns || []}
      hideFooterPagination={!props?.pagination || false}
      initialState={{
        pagination: props.pagination
          ? {
              paginationModel: { page: 0, pageSize: 10 }
            }
          : {
              pageSize: props?.pagination ? 5 : undefined // Sets initial page size if pagination is true
            }
      }}
      pageSizeOptions={props.pagination ? [5, 10] : []}
      disableRowSelectionOnClick
      checkboxSelection={props?.checkbox || false}
      className='bg-white'
    />
  )
}

export default InterfaceTable
