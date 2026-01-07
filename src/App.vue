<template>
  <v-app class="bg-grey-lighten-4">
    <v-main>
       <DiscountList />
    </v-main>

    <!-- Global Snackbar -->
    <v-snackbar
      v-model="appStore.snackbar.show"
      :color="appStore.snackbar.color"
      timeout="3000"
    >
      {{ appStore.snackbar.text }}
      
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="appStore.snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import DiscountList from '@/components/DiscountList.vue'

const appStore = useAppStore()
</script>

<style>
/* Global overrides if needed */
body {
    background-color: #F5F5F5;
}
</style>
