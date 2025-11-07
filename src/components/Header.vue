<template>
  <header class="border-b border-slate-200/80 dark:border-slate-800/80 bg-background-light/80 dark:bg-background-dark/80 sticky top-0 z-10 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
      <!-- Logo y nombre -->
      <div class="flex items-center gap-3">
        <img src="../assets/logo.png" alt="Logo" class="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain"/>
        <h2 class="text-lg sm:text-xl font-bold">PigmaPrint</h2>
      </div>

      <!-- Menú para desktop -->
      <nav class="hidden lg:flex items-center gap-6">
        <a class="text-sm font-medium hover:text-primary transition-colors" href="#inicio">Inicio</a>
        <a class="text-sm font-medium hover:text-primary transition-colors" href="#gallery">Productos</a>
        <a class="text-sm font-medium hover:text-primary transition-colors" href="#carga-diseno">Diseña tu prenda</a>
        <a class="text-sm font-medium hover:text-primary transition-colors" href="#contacto">Contacto</a>
      </nav>

      <!-- Carrito y menú hamburguesa -->
      <div class="flex items-center gap-4">
        <!-- Carrito - siempre visible -->
        <router-link 
          class="flex items-center gap-2 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 px-3 py-2 text-sm font-bold hover:bg-slate-300/80 dark:hover:bg-slate-700/80 transition-colors"
          to="/cart"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21m-7.5-2.5h9"></path>
          </svg>
          <span class="hidden sm:inline">Carrito ({{ cartCount }})</span>
          <span class="sm:hidden">({{ cartCount }})</span>
        </router-link>

        <!-- Botón menú hamburguesa para móvil -->
        <button 
          @click="toggleMobileMenu"
          class="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Menú móvil -->
    <div 
      v-if="mobileMenuOpen"
      class="lg:hidden bg-background-light dark:bg-background-dark border-t border-slate-200/80 dark:border-slate-800/80"
    >
      <div class="px-4 py-4 space-y-4">
        <router-link 
          @click="closeMobileMenu"
          class="block text-sm font-medium hover:text-primary transition-colors py-2"
          to="/"
        >
          Inicio
        </router-link>
        <a 
          @click="closeMobileMenu"
          class="block text-sm font-medium hover:text-primary transition-colors py-2"
          href="#"
        >
          Productos
        </a>
        <a 
          @click="closeMobileMenu"
          class="block text-sm font-medium hover:text-primary transition-colors py-2"
          href="#"
        >
          Diseña tu prenda
        </a>
        <a 
          @click="closeMobileMenu"
          class="block text-sm font-medium hover:text-primary transition-colors py-2"
          href="#"
        >
          Contacto
        </a>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    cartCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      mobileMenuOpen: false
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false
    },
    handleResize() {
      // Cerrar menú móvil cuando la pantalla sea mayor a lg
      if (window.innerWidth >= 1024) {
        this.mobileMenuOpen = false
      }
    }
  },
  mounted() {
    // Cerrar menú al cambiar el tamaño de la ventana
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>