import React from 'react'

export const Skeleton = ({ height=20, width='100%' }: { height?: number; width?: string | number }) => (
  <div style={{ background: '#eee', height, width, borderRadius: 4, marginBottom: 8 }} />
)
