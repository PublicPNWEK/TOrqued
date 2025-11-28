import React from 'react'
import { FixedSizeList as List } from 'react-window'

export const VirtualizedTable = ({ rows }: { rows: any[] }) => {
  const Row = ({ index, style }: any) => (
    <div style={style} className='p-2 border-b'>{JSON.stringify(rows[index])}</div>
  )
  return (
    <List height={600} itemCount={rows.length} itemSize={48} width={'100%'}>
      {Row}
    </List>
  )
}
