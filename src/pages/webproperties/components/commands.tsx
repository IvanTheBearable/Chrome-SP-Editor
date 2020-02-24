import { CommandBar, SearchBox } from 'office-ui-fabric-react'
import React from 'react'

const WebPropertiesCommands = () => {

  return (
    <>
    <CommandBar
      items={[
        {
          key: 'newItem',
          name: 'New',
          cacheKey: 'myCacheKey', // changing this key will invalidate this items cache
          iconProps: {
            iconName: 'Add',
          },
          ariaLabel: 'New',
          onClick: () => {

          },
        },
        {
          key: 'deleteRow',
          text: 'Remove',
          iconProps: { iconName: 'Delete' },
          /* disabled:  selectedItems.length < 1 , */
          onClick: () => {

          },
        },
      ]}
      overflowButtonProps={{ ariaLabel: 'More commands' }}
      ariaLabel={
        'Use left and right arrow keys to navigate between commands'
      }
    />
      <SearchBox
        placeholder='Filter'
        onFocus={() => console.log('onFocus called')}
        onBlur={() => console.log('onBlur called')}
        iconProps={{ iconName: 'Filter' }}
      />
  </>
  )
}

export default WebPropertiesCommands
