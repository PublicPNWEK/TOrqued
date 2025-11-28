import create from 'zustand'
import { persist } from 'zustand/middleware'

type UIState = {
  darkMode: boolean
  setDarkMode: (v: boolean) => void
  filters: Record<string, any>
  setFilters: (f: Record<string, any>) => void
}

export const useUIStore = create<UIState>(persist((set) => ({
  darkMode: true,
  setDarkMode: (v) => set({ darkMode: v }),
  filters: {},
  setFilters: (f) => set({ filters: f })
}), { name: 'torqued_ui' }))
