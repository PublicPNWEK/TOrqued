import React from 'react'
import { ReactQueryProvider } from './queryClient'
import { useUIStore } from './store'
import { VirtualizedTable } from './components/VirtualizedTable'
import { OnboardingTour } from './components/OnboardingTour'
import { Skeleton } from './components/Skeleton'

export default function App() {
  const dark = useUIStore((s) => s.darkMode)
  const rows = Array.from({length: 10000}).map((_,i)=>({id:i, name:`User ${i}`}))
  return (
    <ReactQueryProvider>
      <div className={dark ? 'dark' : ''}>
        <header className='torqued-header p-4'>TORQUED</header>
        <OnboardingTour />
        <section className='kpi-section p-4'><Skeleton height={32} width='50%' /></section>
        <main className='p-4'><VirtualizedTable rows={rows} /></main>
      </div>
    </ReactQueryProvider>
  )
}
