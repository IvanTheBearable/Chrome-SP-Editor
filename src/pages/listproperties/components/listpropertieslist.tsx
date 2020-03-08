import {
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  Dialog,
  DialogFooter,
  DialogType,
  IColumn,
  MarqueeSelection,
  PrimaryButton,
  ScrollablePane,
  SelectionMode,
  Sticky,
  StickyPositionType,
} from 'office-ui-fabric-react'
import {
  Selection,
} from 'office-ui-fabric-react/lib/utilities/selection'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from '../../../store'
import { getAllLists } from '../chrome/chrome-actions'
/* import {
  setAllScriptLinks,
  setConfirmRemoveDialog,
  setEditPanel,
  setSelectedItem,
  setSelectedItems,
} from '../../../store/scriptlinks/actions' */
// import { deleteScriptLinks, getAllScriptLinks } from '../../../store/scriptlinks/async-actions'
// import { IScriptLink } from '../../../store/scriptlinks/types'

const ListPropertiesList = () => {

  const dispatch = useDispatch()
  const { listproperties, selectedList } = useSelector((state: IRootState) => state.listProperties)
  const { isDark } = useSelector((state: IRootState) => state.home)

  const [sortkey, setSortkey] = useState('Sequence')
  const [sequenceAsc, setSequenceAsc] = useState(true)
  const [scopeAsc, setScopeAsc] = useState(false)
  const [scriptSrcAsc, setScriptSrcAsc] = useState(true)

  // set selected items to store
  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {
        /* const newSelection = selection.getSelection() as typeof selectedItems
        dispatch(setSelectedItems(newSelection)) */
      },
    }),
  )

  // load initial data
  useEffect(() => {
    getAllLists(dispatch, selectedList)
    // getAllScriptLinks(dispatch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // clear selection after every update on scriptlinks
  useEffect(() => {
    selection.setAllSelected(false)
    // dispatch(setSelectedItems([]))
    // setSequenceAsc(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }/*, [scriptlinks] */)

  const onColumnClick = (_e: any, { key }: any) => {
    if (key === 'Sequence') {
      // scriptlinks.sort((a, b) => (a.Sequence < b.Sequence) ? sequenceAsc ? 1 : -1 : ((b.Sequence < a.Sequence) ? sequenceAsc ? -1 : 1 : 0))
      setSequenceAsc(!sequenceAsc)
    } else if (key === 'ScriptSrc') {
      // scriptlinks.sort((a, b) => (a.Url < b.Url) ? scriptSrcAsc ? 1 : -1 : ((b.Url < a.Url) ? scriptSrcAsc ? -1 : 1 : 0))
      setScriptSrcAsc(!scriptSrcAsc)
    } else if (key === 'Scope') {
      // scriptlinks.sort((a, b) => (a.ScopeName < b.ScopeName) ? scopeAsc ? 1 : -1 : ((b.ScopeName < a.ScopeName) ? scopeAsc ? -1 : 1 : 0))
      setScopeAsc(!scopeAsc)
    }
    setSortkey(key)
    // dispatch(setAllScriptLinks(scriptlinks))

    selection.setAllSelected(false)
    // dispatch(setSelectedItems([]))
  }

  const detailsListColumns: IColumn[] = [
    {
      data: 'string',
      fieldName: 'key',
      isPadded: true,
      isResizable: true,
      isRowHeader: true,
      isSorted: sortkey === 'key',
      isSortedDescending: sequenceAsc,
      key: 'key',
      maxWidth: 200,
      minWidth: 100,
      name: 'Key',
      onColumnClick,

    },
    {
      data: 'string',
      fieldName: 'value',
      isPadded: true,
      isResizable: true,
      isRowHeader: true,
      isSorted: sortkey === 'value',
      isSortedDescending: scriptSrcAsc,
      key: 'value',
      // maxWidth: 350,
      minWidth: 210,
      name: 'Value',
      onColumnClick,
      isMultiline: true,
      isCollapsable: false,
    },
  ]

  // make columns sticky
  const renderHeader = (headerProps: any, defaultRender: any) => {
    return (
      <Sticky
        stickyPosition={StickyPositionType.Header}
        isScrollSynced={true}
      >
        {defaultRender(headerProps)}
      </Sticky>
    )
  }

  return (
    <>
      <ScrollablePane>
        <MarqueeSelection selection={selection} isEnabled={true}>
          <DetailsList
            layoutMode={DetailsListLayoutMode.justified}
            onShouldVirtualize={() => false}
            selection={selection}
            items={listproperties}
            selectionPreservedOnEmptyClick={true}
            columns={detailsListColumns}
            selectionMode={SelectionMode.multiple}
            /* getKey={(item: IScriptLink) => {
              return item.Id
            }} */
            setKey='listpropertieslist'
            isHeaderVisible={true}
            enterModalSelectionOnTouch={true}
            /* onItemInvoked={(item: IScriptLink) => {
              dispatch(setSelectedItem(item))
              dispatch(setEditPanel(true))
            }} */
            onRenderDetailsHeader={renderHeader}
          />
        </MarqueeSelection>
      </ScrollablePane>

      <Dialog
        hidden={true} // {confirmremove}
        // onDismiss={() => dispatch(setConfirmRemoveDialog(true))}
        dialogContentProps={{
          showCloseButton: true,
          type: DialogType.normal,
          title: 'Remove web property',
          closeButtonAriaLabel: 'Cancel',
          /* subText: selectedItems.length > 1
            ? `Sure you want to remove these ${selectedItems.length} selected scriptlinks?`
            : `Sure you want to remove the selected scriptlink?`, */
        }}
        modalProps={{
          isDarkOverlay: isDark,
        }}
      >
        <DialogFooter>
          <PrimaryButton text='Remove' />
          <DefaultButton text='Cancel' />
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default ListPropertiesList