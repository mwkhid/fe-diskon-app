<template>
  <v-container class="px-4 py-8" style="max-width: 900px;">
    
    <v-card class="rounded-xl border" flat>
        <!-- Header Section -->
        <div class="pa-5 pb-0">
            <div class="d-flex justify-space-between align-center mb-6">
                <div>
                     <h2 class="text-h5 font-weight-bold mb-1">Daftar Diskon</h2>
                     <p class="text-body-2 text-grey">Total jumlah diskon: {{ appStore.discounts.length }}</p>
                </div>
                <v-btn
                    v-if="!isSelectionMode"
                    color="primary"
                    rounded="pill"
                    prepend-icon="mdi-plus"
                    class="text-capitalize px-6"
                    height="40"
                    @click="openAddDialog"
                >
                    Tambah Diskon
                </v-btn>
                <div v-else class="d-flex align-center">
                    <v-btn
                        variant="outlined"
                        color="error"
                        rounded="pill"
                        class="text-capitalize px-6 mr-3"
                        height="40"
                        @click="clearSelection"
                        style="border-color: #EF5350 !important; color: #EF5350 !important"
                    >
                        Batalkan
                    </v-btn>
                    <v-btn
                        color="error"
                        rounded="pill"
                        class="text-capitalize px-6"
                        height="40"
                        flat
                        @click="openBulkDeleteDialog"
                    >
                        Hapus
                    </v-btn>
                </div>
            </div>

            <div class="d-flex align-top flex-wrap" style="gap: 12px">
                <!-- Search -->
                 <div style="width: 240px">
                     <v-text-field
                        v-model="search"
                        prepend-inner-icon="mdi-magnify"
                        placeholder="Cari diskon"
                        variant="outlined"
                        density="compact"
                        hide-details
                        bg-color="white"
                        rounded="pill"
                      ></v-text-field>
                </div>
                 <!-- Outlet Selector -->
                 <div style="width: auto">
                    <v-menu v-model="menuOpen" :close-on-content-click="false" location="bottom start">
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                variant="outlined"
                                color="grey-darken-2"
                                rounded="lg"
                                class="text-capitalize pl-4 pr-3"
                                height="40"
                            >
                                <v-icon icon="mdi-store-outline" start></v-icon>
                                <span class="mr-2">{{ appStore.apiId ? 'Outlet Active' : 'Pilih Outlet' }}</span>
                                <v-icon icon="mdi-chevron-down" end></v-icon>
                            </v-btn>
                        </template>

                        <v-card min-width="400" class="mt-2 rounded-lg elevation-3 pa-4">
                            <v-label class="text-caption font-weight-bold mb-2">API URL crudcrud.com</v-label>
                            <v-text-field
                                v-model="tempApiId"
                                variant="outlined"
                                density="compact"
                                placeholder="https://crudcrud.com/api/..."
                                hide-details="auto"
                                class="mb-4 rounded-lg"
                                bg-color="white"
                            ></v-text-field>
                            
                            <v-btn
                                color="primary"
                                rounded="pill"
                                block
                                height="40"
                                class="text-capitalize"
                                @click="applyApiId"
                            >
                                Terapkan
                            </v-btn>
                        </v-card>
                    </v-menu>
                 </div>
                 


            </div>
        </div>

        <!-- Content -->
        <div class="px-5 pb-5 pt-5">
             <!-- Loading -->
            <div v-if="appStore.loading" class="d-flex justify-center my-12">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>

            <!-- Empty State -->
            <EmptyState v-else-if="filteredDiscounts.length === 0" @create="openAddDialog" />

            <!-- List / Table -->
             <div v-else>
                 <DiscountDataTable
                    :items="filteredDiscounts"
                    :loading="appStore.loading"
                    :newest-item-id="newestItemId"
                    v-model:selected="selected"
                    @edit="openEditDialog"
                 />
             </div>
        </div>
    </v-card>

    <!-- Dialogs -->
    <DiscountDialog 
      v-model="showDialog" 
      :edited-item="selectedItem" 
      @save="handleSave"
    />

    <DeleteDialog 
      v-model="showDelete" 
      :item-name="selectedItem ? selectedItem.name : ''"
      :is-bulk="!selectedItem"
      @confirm="handleConfirmDelete"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import DiscountDialog from './DiscountDialog.vue'
import DeleteDialog from './DeleteDialog.vue'
import EmptyState from './EmptyState.vue'
import DiscountDataTable from './DiscountDataTable.vue'

const appStore = useAppStore()

const search = ref('')
const tempApiId = ref('')
const menuOpen = ref(false)
const showDialog = ref(false)
const showDelete = ref(false)
const selectedItem = ref(null)
const selected = ref([])

const isSelectionMode = computed(() => selected.value.length > 0)

const filteredDiscounts = computed(() => {
  const query = search.value.toLowerCase()
  return appStore.discounts.filter(item => 
    (item.name || '').toLowerCase().includes(query)
  )
})

const newestItemId = computed(() => {
    if (!appStore.discounts.length) return null
    // Assuming the last item in the list is the newest (insertion order)
    return appStore.discounts[appStore.discounts.length - 1]._id
})

function applyApiId() {
    if (tempApiId.value) {
        appStore.setApiId(tempApiId.value)
        appStore.showSnackbar('Outlet diatur. Memuat data...')
        menuOpen.value = false
    }
}

function openAddDialog() {
  selectedItem.value = null
  showDialog.value = true
}

function openEditDialog(item) {
  selectedItem.value = { ...item } // Clone to avoid direct mutation
  showDialog.value = true
}

function openDeleteDialog(item) {
  selectedItem.value = item
  showDelete.value = true
}

async function handleSave(formData) {
  if (selectedItem.value && selectedItem.value._id) {
    await appStore.updateDiscount(selectedItem.value._id, formData)
  } else {
    await appStore.addDiscount(formData)
  }
}

async function handleDelete() {
  if (selectedItem.value && selectedItem.value._id) {
    await appStore.deleteDiscount(selectedItem.value._id)
  }
}

function clearSelection() {
    selected.value = []
}

function openBulkDeleteDialog() {
    selectedItem.value = null // Ensure no single item is selected
    showDelete.value = true
}

async function handleConfirmDelete() {
    if (selectedItem.value) {
        // Single delete
        await handleDelete()
    } else {
        // Bulk delete
        await appStore.deleteBulkDiscounts(selected.value)
        clearSelection()
    }
}
</script>
