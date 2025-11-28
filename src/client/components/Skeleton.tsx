import React from 'react'

export const Skeleton = ({ height=20, width='100%' }: any) => (
  <div style={{ background: '#eee', height, width, borderRadius: 4, marginBottom: 8 }} />
)
