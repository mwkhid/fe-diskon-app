<template>
    <v-data-table v-model=" internalSelected " :headers=" headers " :items=" items " :loading=" loading "
        item-value="_id" show-select hover class="rounded-lg table-border-bottom border" density="comfortable">
        <!-- Custom Name Column -->
        <template v-slot:item.name="{ item }">
            <div class="text-body-1 font-weight-medium">
                {{ item.name }}
                <v-chip v-if="item._id === newestItemId" size="x-small" color="light-blue-lighten-4"
                    class="text-light-blue-darken-3 ml-2 font-weight-medium" label>
                    Baru
                </v-chip>
            </div>
        </template>

        <!-- Custom Value Column -->
        <template v-slot:item.value="{ item }">
            <span class="text-body-2 text-grey-darken-1">
                {{ item.unit === '%' ? `${ item.value || 0 }%` : `Rp ${ (item.value || 0).toLocaleString('id-ID') }` }}
            </span>
        </template>

        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
            <div class="text-right">
                <v-btn icon="mdi-pencil-outline" variant="text" density="comfortable" color="grey"
                    @click="$emit('edit', item)"></v-btn>
            </div>
        </template>

        <!-- Header Customization -->
        <template
            v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort, selectAll, allSelected: isAllSelected, someSelected: isSomeSelected }">
            <tr class="bg-grey-lighten-4 border-b">
                <template v-for="column in columns" :key="column.key">
                    <!-- Selection Header -->
                    <th v-if="column.key === 'data-table-select'" style="width: 48px; padding: 8px;">
                        <v-checkbox-btn :model-value=" isAllSelected "
                            :indeterminate=" isSomeSelected && !isAllSelected " color="primary" density="compact"
                            @update:model-value="selectAll(!isAllSelected)"></v-checkbox-btn>
                    </th>

                    <!-- Standard Headers -->
                    <th v-else
                        class="text-caption font-weight-bold text-grey-darken-2 py-3 cursor-pointer user-select-none text-start"
                        @click=" () => toggleSort(column) ">
                        <div class="d-flex align-center" style="font-size: 16px; font-weight: 800;">
                            {{ column.title }}
                            <template v-if="column.sortable">
                                <v-icon v-if="isSorted(column)" :icon=" getSortIcon(column) " size="small"
                                    class="ml-1"></v-icon>
                                <v-icon v-else icon="mdi-arrow-up" size="small" class="ml-1 text-grey-lighten-2"
                                    style="opacity: 0.5"></v-icon>
                            </template>
                        </div>
                    </th>
                </template>
            </tr>
        </template>

        <!-- Custom Row Selection to ensure Primary color -->
        <template v-slot:item.data-table-select="{ internalItem, isSelected, toggleSelect }">
            <v-checkbox-btn :model-value=" isSelected(internalItem) " color="primary" density="compact"
                @update:model-value="toggleSelect(internalItem)"></v-checkbox-btn>
        </template>
    </v-data-table>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    loading: Boolean,
    selected: {
        type: Array,
        default: () => []
    },
    newestItemId: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['update:selected', 'edit'])

// Headers configuration
const headers = [
    { title: 'Nama Diskon', key: 'name', align: 'start', sortable: true },
    { title: 'Nilai Diskon', key: 'value', align: 'start', sortable: true },
    { title: '', key: 'actions', sortable: false, align: 'end' },
]

// Proxy for v-model selected
const internalSelected = computed({
    get: () => props.selected,
    set: (val) => emit('update:selected', val)
})


</script>

<style scoped>
.table-border-bottom :deep(tbody tr:not(:last-child) td) {
    border-bottom: 1px solid #EEEEEE !important;
}
</style>
