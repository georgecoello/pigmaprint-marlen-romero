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
        <a class="text-sm font-medium hover:text-primary transition-colors cursor-pointer" @click="scrollToSection('inicio')">Inicio</a>
        <a class="text-sm font-medium hover:text-primary transition-colors cursor-pointer" @click="scrollToSection('trabajos')">Productos</a>
        <a class="text-sm font-medium hover:text-primary transition-colors cursor-pointer" @click="scrollToSection('carga-diseno')">Diseña tu prenda</a>
        <a class="text-sm font-medium hover:text-primary transition-colors cursor-pointer" @click="scrollToSection('contacto')">Contacto</a>
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
        <a 
          @click="scrollToSection('inicio')"
          class="block text-sm font-medium hover:text-primary transition-colors py-2 cursor-pointer"
        >
          Inicio
        </a>
        <a 
          @click="scrollToSection('trabajos')"
          class="block text-sm font-medium hover:text-primary transition-colors py-2 cursor-pointer"
        >
          Productos
        </a>
        <a 
          @click="scrollToSection('carga-diseno')"
          class="block text-sm font-medium hover:text-primary transition-colors py-2 cursor-pointer"
        >
          Diseña tu prenda
        </a>
        <a 
          @click="scrollToSection('contacto')"
          class="block text-sm font-medium hover:text-primary transition-colors py-2 cursor-pointer"
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
    },
    
    scrollToSection(sectionId) {
      // Cerrar menú móvil si está abierto
      this.closeMobileMenu();
      
      // Si estamos en la página de carrito, navegar al home primero
      if (this.$route.path !== '/') {
        this.$router.push('/');
        // Esperar a que la navegación se complete antes de hacer scroll
        setTimeout(() => {
          this.performScroll(sectionId);
        }, 100);
      } else {
        this.performScroll(sectionId);
      }
    },
    
    performScroll(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        // Calcular la posición considerando el header fijo
        const headerHeight = 120; // Altura del header + margen de espaciado
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  },
  mounted() {
    // Cerrar menú al cambiar el tamaño de la ventana
    window.addEventListener('resize', this.handleResize);
    
    // Cerrar menú al hacer click fuera de él
    document.addEventListener('click', (event) => {
      const header = this.$el;
      const isClickInside = header.contains(event.target);
      if (!isClickInside && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style scoped>
/* Estilos para mejorar la apariencia de los enlaces */
a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  color: #8b5cf6; /* Color purple-500 aproximado */
}

/* Asegurar que el header tenga un buen z-index */
header {
  z-index: 1000;
}

/* Mejorar la transición del menú móvil */
.bg-background-light {
  background-color: rgba(255, 255, 255, 0.95);
}

.bg-background-dark {
  background-color: rgba(17, 24, 39, 0.95);
}

.dark .bg-background-dark {
  background-color: rgba(17, 24, 39, 0.95);
}
</style>