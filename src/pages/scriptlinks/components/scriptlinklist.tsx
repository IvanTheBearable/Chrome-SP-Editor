import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  MarqueeSelection,
  SelectionMode } from 'office-ui-fabric-react'
import {
  Selection,
} from 'office-ui-fabric-react/lib/utilities/selection'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from '../../../store'
import {
  setEditPanel,
  setSelectedItem,
  setSelectedItems,
} from '../../../store/scriptlinks/actions'
import { getAllScriptLinks } from '../../../store/scriptlinks/async-actions'
import { IScriptLink } from '../../../store/scriptlinks/types'

const ScriptLinkList = () => {

  const dispatch = useDispatch()
  const { scriptlinks, selectedItems } = useSelector((state: IRootState) => state.scriptLinks)

  // set selected items to store
  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {
        const newSelection = selection.getSelection() as typeof selectedItems
        dispatch(setSelectedItems(newSelection))
      },
    }),
  )

  // load initial data
  useEffect(() => {
    getAllScriptLinks(dispatch)
  }, [])

  // clear selection after every update on scriptlinks
  useEffect(() => {
    selection.setAllSelected(false)
  }, [scriptlinks])

  const detailsListColumns: IColumn[] = [
    {
      data: 'number',
      fieldName: 'Sequence',
      isPadded: true,
      isResizable: true,
      isRowHeader: true,
      isSorted: false,
      isSortedDescending: false,
      key: 'column2',
      maxWidth: 100,
      minWidth: 100,
      name: 'Sequence',
    },
    {
      data: 'string',
      fieldName: 'Url',
      isPadded: true,
      isResizable: true,
      isRowHeader: true,
      isSorted: false,
      isSortedDescending: false,
      key: 'column1',
      maxWidth: 350,
      minWidth: 210,
      name: 'ScriptSrc',
    },
    {
      data: 'string',
      fieldName: 'ScopeName',
      isPadded: true,
      isResizable: true,
      isRowHeader: true,
      isSorted: false,
      isSortedDescending: false,
      key: 'column3',
      maxWidth: 350,
      minWidth: 210,
      name: 'Scope',
    },
  ]

  return (
        <MarqueeSelection selection={selection} isEnabled={true}>
            <DetailsList
                onShouldVirtualize={() => false}
                selection={selection}
                items={scriptlinks}
                selectionPreservedOnEmptyClick={true}
                columns={detailsListColumns}
                selectionMode={SelectionMode.multiple}
                setKey='set'
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                enterModalSelectionOnTouch={true}
                onItemInvoked={(item: IScriptLink) => {
                  dispatch(setSelectedItem(item))
                  dispatch(setEditPanel(true))
                }}
            />
      </MarqueeSelection>
  )
}

export default ScriptLinkList
