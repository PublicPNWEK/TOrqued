import React from 'react'
export const ComparisonMode = ({ a, b }: any) => {
  const diff = (b - a)
  const pct = a ? ((diff / a) * 100).toFixed(1) : 'N/A'
  return <div>Change: ${diff} ({pct}%)</div>
}
