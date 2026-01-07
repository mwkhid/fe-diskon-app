<template>
  <v-dialog v-model="internalShow" max-width="400px">
    <v-card class="rounded-xl pt-6 pb-4">
      <v-card-title class="text-h6 font-weight-bold text-center">
        Hapus Diskon
      </v-card-title>
      
      <v-card-text class="text-center px-6">
        <p v-if="isBulk" class="mb-4 text-body-2">
            Apakah Anda yakin ingin menghapus diskon yang dipilih?
        </p>
        <p v-else class="mb-4 text-body-2">
            Apakah anda yakin ingin menghapus diskon <strong>{{ itemName }}</strong>?
        </p>
        <div class="d-flex align-center justify-center bg-red-lighten-5 py-2 px-3 rounded text-caption text-error">
             <span class="mr-2">●</span> Diskon yang dihapus tidak bisa dikembalikan lagi
        </div>
      </v-card-text>

      <v-card-actions class="justify-center pt-2">
        <v-btn
          color="error"
          variant="outlined"
          @click="close"
          class="text-capitalize px-8"
          rounded="pill"
        >
          Batalkan
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="confirm"
          class="text-capitalize px-8 ml-2"
          rounded="pill"
        >
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  itemName: String,
  isBulk: Boolean
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const internalShow = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function close() {
  internalShow.value = false
}

function confirm() {
  emit('confirm')
  close()
}
</script>
