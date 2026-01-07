<template>
	<div class="d-flex flex-column align-center justify-center py-16 text-center">
		<!-- Custom Ticket Illustration -->
		<div class="mb-6 position-relative" style="width: 120px; height: 120px;">
			<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="20" y="30" width="80" height="60" rx="4" fill="#FFEBEE" stroke="#FFCDD2" stroke-width="2" />
				<circle cx="20" cy="60" r="10" fill="#FFFFFF" stroke="#FFCDD2" stroke-width="2" />
				<circle cx="100" cy="60" r="10" fill="#FFFFFF" stroke="#FFCDD2" stroke-width="2" />
				<path d="M40 60 L80 60" stroke="#FFCDD2" stroke-width="2" stroke-dasharray="4 4" />
				<!-- Percentage Icon -->
				<text x="60" y="65" font-family="Arial" font-size="24" fill="#EF5350" text-anchor="middle"
					font-weight="bold">%</text>
			</svg>
		</div>

		<h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-1">Belum Ada Diskon</h3>
		<p class="text-body-2 text-grey mb-6">Diskon yang anda buat akan muncul di sini</p>

		<v-btn color="primary" rounded="pill" prepend-icon="mdi-plus" class="text-capitalize px-6" height="44"
			@click="$emit('create')">
			Tambah Diskon
		</v-btn>
	</div>
</template>

<script setup>
defineEmits(['create'])
</script>
