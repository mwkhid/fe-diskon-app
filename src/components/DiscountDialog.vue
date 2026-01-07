<template>
  <v-dialog v-model="internalShow" max-width="500px" persistent>
    <v-card class="rounded-xl">
      <div class="d-flex justify-space-between align-center pa-4 pb-0">
        <v-card-title class="text-h6 font-weight-bold pa-0">
          {{ isEdit ? 'Ubah Diskon' : 'Tambah Diskon' }}
        </v-card-title>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="close"></v-btn>
      </div>

      <v-card-text class="pt-4 pb-6">
        <v-label class="mb-2 font-weight-medium text-body-2 text-grey-darken-2">Nama Diskon</v-label>
        <v-text-field
          v-model="form.name"
          variant="outlined"
          density="comfortable"
          placeholder="Nama Diskon"
          hide-details="auto"
          class="mb-4 rounded-lg"
          bg-color="white"
          :error-messages="errors.name"
          @input="errors.name = ''"
        ></v-text-field>

        <v-label class="mb-2 font-weight-medium text-body-2 text-grey-darken-2">Diskon</v-label>
        <div class="d-flex align-top">
          <v-text-field
            v-model="form.value"
            type="number"
            variant="outlined"
            density="comfortable"
            placeholder="0"
            hide-details="auto"
            class="flex-grow-1 mr-3 rounded-lg"
            bg-color="white"
            :error-messages="errors.value"
            @input="errors.value = ''"
            :prefix="form.unit === 'Rp' ? 'Rp' : undefined"
            :suffix="form.unit === '%' ? '%' : undefined"
          ></v-text-field>

          <!-- Custom Toggle Group -->
          <div class="d-flex" style="height: 48px">
              <div 
                class="d-flex align-center justify-center px-4 cursor-pointer transition-swing"
                :class="form.unit === '%' ? 'bg-primary text-white border-primary' : 'bg-white text-grey border-grey-lighten-1'"
                style="border: 1px solid; border-radius: 8px 0 0 8px; min-width: 60px;"
                @click="form.unit = '%'"
              >
                 <v-icon v-if="form.unit === '%'" icon="mdi-check" size="small" class="mr-1"></v-icon>
                 <span class="font-weight-medium">%</span>
              </div>
              
              <div 
                class="d-flex align-center justify-center px-4 cursor-pointer transition-swing"
                :class="form.unit === 'Rp' ? 'bg-primary text-white border-primary' : 'bg-white text-grey border-grey-lighten-1'"
                style="border: 1px solid; border-left: none; border-radius: 0 8px 8px 0; min-width: 60px;"
                 @click="form.unit = 'Rp'"
              >
                 <v-icon v-if="form.unit === 'Rp'" icon="mdi-check" size="small" class="mr-1"></v-icon>
                 <span class="font-weight-medium">Rp</span>
              </div>
          </div>
        </div>
      </v-card-text>

      <!-- <v-divider></v-divider> -->

      <v-card-actions class="pa-4">
        <div v-if="isEdit" class="d-flex justify-space-between w-100 align-center">
             <v-btn
              color="error"
              variant="text"
              class="text-capitalize px-4"
              height="40"
              rounded="pill"
              @click="$emit('delete')"
            >
              Hapus
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              @click="save"
              class="text-capitalize px-8"
              rounded="pill"
              height="40"
            >
              Simpan
            </v-btn>
        </div>
        <v-btn
          v-else
          color="primary"
          variant="flat"
          @click="save"
          class="text-capitalize"
          rounded="pill"
          height="40"
          block
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/stores/app'

const props = defineProps({
  modelValue: Boolean,
  editedItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'delete'])
const appStore = useAppStore()

const internalShow = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.editedItem)

const form = ref({
  name: '',
  value: '',
  unit: '%' // default
})

const errors = ref({
    name: '',
    value: ''
})

watch(() => props.modelValue, (val) => {
  if (val) {
    errors.value = { name: '', value: '' } // Reset errors
    if (props.editedItem) {
      form.value = { ...props.editedItem }
    } else {
      form.value = {
        name: '',
        value: '',
        unit: '%'
      }
    }
  }
})

function close() {
  internalShow.value = false
}

function save() {
  // Reset errors
  errors.value = { name: '', value: '' }
  let isValid = true

  // Validate Name Empty
  if (!form.value.name) {
      errors.value.name = 'Nama Diskon tidak boleh kosong'
      isValid = false
  }

  // Validate Value Empty
  if (!form.value.value) {
      errors.value.value = 'Diskon tidak boleh kosong'
      isValid = false
  }

  // Validate Duplicate Name
  // Check if name exists in store.discounts (case insensitive?)
  // Exclude current item if editing
  if (form.value.name) {
      const duplicate = appStore.discounts.find(d => 
          d.name.toLowerCase() === form.value.name.toLowerCase() && 
          d._id !== form.value._id // Assuming _id exists
      )
      
      if (duplicate) {
          errors.value.name = 'Nama diskon sudah digunakan, silahkan gunakan nama lain'
          isValid = false
      }
  }

  if (!isValid) return

  emit('save', { ...form.value })
  close()
}
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
:deep(.v-field__prefix),
:deep(.v-field__suffix) {
    color: #9E9E9E !important; /* Placeholder grey */
    opacity: 1;
}
</style>
