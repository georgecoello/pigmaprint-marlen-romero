<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader :cart-count="0" />
    <main class="flex-grow container mx-auto px-6 py-12">
      <div class="max-w-2xl mx-auto bg-white dark:bg-background-dark/80 rounded-xl shadow-lg p-8">
        <!-- Contenido de confirmación (igual al HTML original) -->
        <div class="text-center">
          <span class="material-symbols-outlined text-7xl text-green-500">check_circle</span>
          <h2 class="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">¡Pedido Confirmado!</h2>
          <p class="mt-2 text-gray-600 dark:text-gray-300">Gracias por tu compra. Tu pedido ha sido procesado con éxito.</p>
        </div>

        <!-- Resto del contenido de confirmación... -->
        
        <div class="mt-10 flex justify-center">
          <button 
            @click="goToHome"
            class="bg-primary text-white font-bold text-sm px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span class="material-symbols-outlined text-base">storefront</span>
            <span>Volver a la Tienda</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import AppHeader from '@/components/Header.vue'

export default {
  name: 'ConfirmationView',
  components: {
    AppHeader
  },
  methods: {
    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>