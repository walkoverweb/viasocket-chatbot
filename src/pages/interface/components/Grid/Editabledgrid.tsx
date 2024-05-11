import AutoFixHigh from '@mui/icons-material/AutoFixHigh'
import { Box, Button } from '@mui/material'
import React, { useEffect } from 'react'
import RGL, { WidthProvider } from 'react-grid-layout'
import { shallowEqual, useDispatch } from 'react-redux'
import { ParamsEnums } from '../../../../enums'
import addUrlDataHoc from '../../../../hoc/addUrlDataHoc.tsx'
import {
  getInterfaceDataByIdStart,
  setConfigModalState,
  setConfigSlider,
  toggleNestedGridSliderOpen,
  updateInterfaceActionStart,
  updateInterfaceStart
} from '../../../../store/interface/interfaceSlice.ts'
import { $ReduxCoreType } from '../../../../types/reduxCore.ts'
import { useCustomSelector } from '../../../../utils/deepCheckSelector'
import { ComponentJson, DataforComponents, formInitialChildren, gridXY } from '../../utils/InterfaceUtils.ts'
import ComponentRenderer from '../ComponentRenderer.tsx'
import './Grid.scss'

const GridLayout = WidthProvider(RGL)

interface EditabledgridProps {
  dragRef: any
  ingrid?: boolean
  interfaceId: string
  gridId?: string
  loadInterface?: boolean
}
Editabledgrid.defaultProps = { ingrid: false, gridId: 'root', loadInterface: true }

function Editabledgrid({ dragRef, ingrid = false, interfaceId, gridId = 'root', loadInterface = true }: EditabledgridProps) {
  const dispatch = useDispatch()

  const { coordinates, components, currentSelectedComponentId, nestedGridSliderOpen, actionData, componentJson } = useCustomSelector(
    (state: $ReduxCoreType) => ({
      coordinates: state?.Interface?.interfaceData?.[interfaceId]?.coordinates?.[gridId] || {},
      components: state?.Interface?.interfaceData?.[interfaceId]?.components?.[gridId] || {},
      currentSelectedComponentId: state?.Interface?.currentSelectedComponent?.componentId,
      nestedGridSliderOpen: state.Interface?.nestedGridSliderOpen,
      actionData: state?.Interface?.interfaceData?.[interfaceId]?.actions?.['root']?.[state.Interface?.nestedGridSliderOpen?.componentId],
      componentJson: state?.Interface?.interfaceData?.[interfaceId]?.components
    })
  )

  useEffect(() => {
    if (interfaceId && loadInterface) {
      dispatch(getInterfaceDataByIdStart({}))
    }
  }, [interfaceId])

  const onDrop = (_, newElement) => {
    if (!ComponentJson[dragRef?.current]) return
    if (ingrid) return
    let components = {},
      coordinates = {}
    const uniqueTime = ((Date.now() / 1000) * 1000)?.toString()
    const uniqeGridId = `${dragRef?.current}${(Math.random() + uniqueTime).toString(36).slice(2, 7)}`
    newElement.i = uniqeGridId
    if (['Form', 'Box', 'ChatBot']?.includes(dragRef.current)) {
      const isChatBot = dragRef.current === 'ChatBot'
      const responseId = `Response${(Math.random() + uniqueTime).toString(36).slice(2, 7)}`
      const componentObject = { ...ComponentJson[dragRef.current], key: uniqeGridId }
      const { components: GridInitialComponents, coordinates: GridInitialCoordinates } = formInitialChildren(dragRef.current)
      dispatch(
        updateInterfaceStart({
          gridId: !isChatBot ? uniqeGridId : responseId,
          components: GridInitialComponents,
          coordinates: GridInitialCoordinates
        })
      )
      components = componentObject
      if (dragRef?.current === 'ChatBot') {
        const updatedResponseArr = [{ responseId: responseId, description: 'It is a Default Response', components: GridInitialComponents }]
        dispatch(
          updateInterfaceActionStart({
            gridId: gridId,
            componentId: uniqeGridId,
            responseId: responseId,
            actionsArr: [{ type: 'chatbot', eventType: 'onClick', title: 'Send data to bridges' }],
            responseArr: updatedResponseArr,
            actionId: actionData?._id || null
          })
        )
      }
    } else {
      components = { ...ComponentJson[dragRef.current], key: uniqeGridId }
    }

    const { h, w } = DataforComponents?.[dragRef.current]?.initialDimensions || { h: 3, w: 3 }
    coordinates = { ...newElement, h: h, w: w }
    dispatch(updateInterfaceStart({ gridId, componentId: uniqeGridId, components, coordinates }))

    if (gridId.includes('Response')) {
      const componentsInResponse = { ...componentJson[gridId], [uniqeGridId]: components }
      const updatedResponseArr = (actionData?.responseArr || []).map((response) => {
        if (response.responseId === gridId) {
          return {
            responseId: gridId,
            description: response.description,
            components: componentsInResponse
          }
        }
        return response
      })
      dispatch(
        updateInterfaceActionStart({
          gridId: gridId,
          componentId: uniqeGridId,
          responseId: gridId,
          responseArr: updatedResponseArr,
          actionId: actionData?._id || null
        })
      )
    }
    dragRef.current = ''
  }

  const onLayoutChange = (_layout, oldItem, newItem) => {
    if (ingrid) return
    if (!shallowEqual(oldItem, newItem)) {
      dispatch(updateInterfaceStart({ gridId, componentId: newItem.i, coordinates: newItem }))
    } else {
      onClickEdit(components?.[newItem?.i]?.type, newItem?.i)
    }
  }

  const stopPropagation = (e) => {
    e.stopPropagation()
  }
  const onClickEdit = (elementType: string, id: string) => {
    dispatch(setConfigSlider({ openSlider: true }))
    if (['Form', 'Box']?.includes(elementType)) {
      dispatch(toggleNestedGridSliderOpen({ id: id, gridId: gridId }))
    }

    if (currentSelectedComponentId !== id) {
      dispatch(
        setConfigModalState({
          componentType: elementType,
          componentId: id,
          gridId: gridId
        })
      )
    }
  }

  return (
    <Box className='column h-100 box-sizing-border-box '>
      <GridLayout
        className='h-100 layout'
        layout={Object.values(coordinates || {}) || []}
        compactType={null}
        // isBounded
        cols={gridXY.cols}
        preventCollision
        rowHeight={(window.innerHeight - 48) / 200}
        draggableCancel='.not_drag'
        isDroppable
        // containerPadding={[20, 20]}
        onDrop={onDrop}
        onResizeStop={onLayoutChange}
        onDragStop={onLayoutChange}
        resizeHandles={ingrid ? [] : ['se', 'nw']}
      >
        {Object.values(coordinates || {})?.map((coord) => {
          const element = components?.[coord?.i] || <div />
          return (
            <Box
              key={coord?.i}
              className={`grid-item column box-sizing-border-box p-2 ${ingrid ? 'not_drag' : ''} ${
                currentSelectedComponentId === coord?.i || nestedGridSliderOpen?.id === coord?.i ? 'selected-element' : ''
              } `}
            >
              {!ingrid && (
                <Box className='pos-abs element-header column'>
                  <Button
                    variant='text'
                    startIcon={<AutoFixHigh color='error' />}
                    onMouseDown={stopPropagation}
                    onTouchStart={stopPropagation}
                    onClick={() => onClickEdit(element?.type, coord?.i)}
                  >
                    Configure
                  </Button>
                </Box>
              )}
              <ComponentRenderer id={coord?.i} dragRef={dragRef} gridId={gridId} />
            </Box>
          )
        })}
      </GridLayout>
    </Box>
  )
}
export default React.memo(addUrlDataHoc(React.memo(Editabledgrid), [ParamsEnums?.interfaceId]))
