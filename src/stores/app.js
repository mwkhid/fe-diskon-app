import { defineStore } from 'pinia'
import axios from 'axios'

export const useAppStore = defineStore('app', {
    state: () => ({
        // Discounts list
        discounts: [],
        // Loading state
        loading: false,
        // Snackbar state
        snackbar: {
            show: false,
            text: '',
            color: 'success',
        },
        apiId: '',
    }),

    getters: {
        apiUrl: (state) => {
            if (!state.apiId) return ''
            // Check if user entered full URL or just ID
            if (state.apiId.startsWith('http')) {
                // Remove trailing slash if present
                const cleanUrl = state.apiId.replace(/\/$/, '')
                // If endpoint already has discounts, return it
                if (cleanUrl.endsWith('discounts')) return cleanUrl
                // Append discounts resource
                return `${cleanUrl}/discounts`
            }
            return `https://crudcrud.com/api/${state.apiId}/discounts`
        },
        hasDiscounts: (state) => state.discounts.length > 0
    },

    actions: {
        showSnackbar(text, color = 'success') {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.show = true
        },

        setApiId(id) {
            this.apiId = id
            // Attempt to fetch if ID is valid
            if (id) {
                this.fetchDiscounts()
            }
        },

        async fetchDiscounts() {
            if (!this.apiUrl) return
            this.loading = true
            try {
                const response = await axios.get(this.apiUrl)
                this.discounts = response.data
            } catch (error) {
                console.error("Error fetching discounts:", error)
                this.showSnackbar('Gagal memuat diskon', 'error')
            } finally {
                this.loading = false
            }
        },

        async addDiscount(discount) {
            if (!this.apiUrl) {
                this.showSnackbar('Silakan set Outlet ID terlebih dahulu', 'warning')
                return
            }
            this.loading = true
            try {
                // Ensure types are correct
                const payload = {
                    name: discount.name,
                    value: Number(discount.value),
                    unit: discount.unit // '%' or 'Rp'
                }
                await axios.post(this.apiUrl, payload)
                this.showSnackbar('Nama Diskon berhasil disimpan')
                await this.fetchDiscounts()
            } catch (error) {
                console.error("Error adding discount:", error)
                this.showSnackbar('Gagal menyimpan diskon', 'error')
            } finally {
                this.loading = false
            }
        },

        async updateDiscount(id, discount) {
            if (!this.apiUrl) return
            this.loading = true
            try {
                // CrudCru drequires removing _id from body
                const payload = {
                    name: discount.name,
                    value: Number(discount.value),
                    unit: discount.unit
                }
                // use _id for the put request
                await axios.put(`${this.apiUrl}/${id}`, payload)

                this.showSnackbar('Diskon berhasil diubah')
                await this.fetchDiscounts()
            } catch (error) {
                console.error("Error updating discount:", error)
                this.showSnackbar('Gagal mengubah diskon', 'error')
            } finally {
                this.loading = false
            }
        },

        async deleteDiscount(id) {
            if (!this.apiUrl) return
            this.loading = true
            try {
                await axios.delete(`${this.apiUrl}/${id}`)
                this.showSnackbar('Diskon berhasil dihapus')
                await this.fetchDiscounts()
            } catch (error) {
                console.error("Error deleting discount:", error)
                this.showSnackbar('Gagal menghapus diskon', 'error')
            } finally {
                this.loading = false
            }
        },

        async deleteBulkDiscounts(ids) {
            if (!this.apiUrl || !ids.length) return
            this.loading = true
            try {
                // CrudCrud doesn't support bulk delete, so we promise.all
                const deletePromises = ids.map(id => axios.delete(`${this.apiUrl}/${id}`))
                await Promise.all(deletePromises)

                this.showSnackbar(`${ids.length} Diskon berhasil dihapus`)
                await this.fetchDiscounts()
            } catch (error) {
                console.error("Error deleting discounts:", error)
                this.showSnackbar('Gagal menghapus beberapa diskon', 'error')
            } finally {
                this.loading = false
            }
        }
    },
})
