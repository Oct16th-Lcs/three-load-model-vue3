import { defineStore } from 'pinia'
import type { ModelItem } from '@/hooks/useThree'

export const useThreeStore = defineStore('three', {
  state: () => ({
    loading: false,
    currentModel: null as ModelItem | null
  }),
  actions: {
    setLoading(value: boolean) {
      this.loading = value
    },
    setCurrentModel(model: ModelItem) {
      this.currentModel = model
    }
  }
})
