<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <AppHeader :cart-count="cartCount" />
    
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Header del Carrito -->
        <div class="text-center mb-12">
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Tu Carrito
          </h1>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Revisa y gestiona tus productos personalizados
          </p>
        </div>

        <!-- Carrito Vacío -->
        <div v-if="cartItems.length === 0" class="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
          <div class="text-6xl text-purple-400 mb-6">
            <span class="material-symbols-outlined">shopping_cart</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Tu carrito está vacío
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            Agrega algunos productos personalizados para comenzar tu pedido.
          </p>
          <button 
            @click="$router.push('/')"
            class="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span class="material-symbols-outlined align-middle mr-2">add_circle</span>
            Agregar Productos
          </button>
        </div>

        <!-- Carrito con Productos -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Lista de Productos -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Productos -->
            <div 
              v-for="item in cartItems" 
              :key="item.id"
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
            >
              <div class="flex flex-col sm:flex-row gap-6">
                <!-- Icono del Producto -->
                <div class="flex-shrink-0 w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <span class="material-symbols-outlined text-3xl text-purple-600 dark:text-purple-400">
                    {{ getProductIcon(item.productType) }}
                  </span>
                </div>

                <!-- Información del Producto -->
                <div class="flex-grow">
                  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {{ item.productName }}
                      </h3>
                      <p class="text-gray-600 dark:text-gray-300 text-sm">
                        Archivo: {{ item.fileName }}
                      </p>
                      <p v-if="item.notes" class="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        Notas: {{ item.notes }}
                      </p>
                    </div>
                    
                    <!-- Precio (placeholder) -->
                    <div class="mt-2 sm:mt-0 text-right">
                      <p class="text-lg font-bold text-purple-600 dark:text-purple-400">
                        Por cotizar
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        Referencia: {{ item.reference }}
                      </p>
                    </div>
                  </div>

                  <!-- Acciones -->
                  <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      Agregado: {{ formatDate(item.date) }}
                    </span>
                    
                    <button 
                      @click="removeItem(item.id)"
                      class="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200 flex items-center"
                    >
                      <span class="material-symbols-outlined text-lg mr-1">delete</span>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen del Pedido -->
          <div class="lg:col-span-1">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Resumen del Pedido
              </h3>

              <!-- Detalles -->
              <div class="space-y-4 mb-6">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">Productos:</span>
                  <span class="font-semibold text-gray-800 dark:text-white">
                    {{ cartItems.length }}
                  </span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">Estado:</span>
                  <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium">
                    Por cotizar
                  </span>
                </div>
              </div>

              <!-- Total -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div class="flex justify-between items-center text-lg font-bold">
                  <span class="text-gray-800 dark:text-white">Total estimado:</span>
                  <span class="text-purple-600 dark:text-purple-400">
                    Por cotizar
                  </span>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  * Los precios finales serán confirmados por nuestro equipo
                </p>
              </div>

              <!-- Botones de Acción -->
              <div class="space-y-4">
                <button 
                  @click="showContactModal = true"
                  :disabled="cartItems.length === 0"
                  :class="[
                    'w-full px-6 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center',
                    cartItems.length > 0
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  ]"
                >
                  <span class="material-symbols-outlined mr-2">whatsapp</span>
                  Solicitar Cotización
                </button>
                
                <button 
                  @click="$router.push('/')"
                  class="w-full px-6 py-4 border-2 border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-xl font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 flex items-center justify-center"
                >
                  <span class="material-symbols-outlined mr-2">add_circle</span>
                  Agregar Más Productos
                </button>
                
                <button 
                  @click="clearCart"
                  class="w-full px-6 py-4 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200 flex items-center justify-center"
                >
                  <span class="material-symbols-outlined mr-2">delete_sweep</span>
                  Vaciar Carrito
                </button>
              </div>

              <!-- Información Adicional -->
              <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div class="flex items-start space-x-3">
                  <span class="material-symbols-outlined text-blue-500 text-lg mt-0.5">info</span>
                  <div>
                    <p class="text-sm text-blue-700 dark:text-blue-300">
                      Te contactaremos para confirmar precios y detalles de tu pedido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Información de Contacto -->
    <transition name="modal-fade">
      <div 
        v-if="showContactModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
        @click.self="showContactModal = false"
      >
        <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-500 scale-95 hover:scale-100">
          <!-- Header -->
          <div class="bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-3xl p-8 text-center">
            <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <span class="material-symbols-outlined text-4xl text-white">
                person
              </span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">
              Información de Contacto
            </h3>
            <p class="text-white/90">
              Completa tus datos para la cotización
            </p>
          </div>

          <!-- Formulario -->
          <div class="p-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tu Nombre Completo *
                </label>
                <input 
                  v-model="customerInfo.name"
                  type="text"
                  class="w-full rounded-xl p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Ej: María González"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tu Número de WhatsApp *
                </label>
                <input 
                  v-model="customerInfo.phone"
                  type="tel"
                  class="w-full rounded-xl p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Ej: 50412345678"
                  required
                >
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Usaremos este número para contactarte
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tu Email (Opcional)
                </label>
                <input 
                  v-model="customerInfo.email"
                  type="email"
                  class="w-full rounded-xl p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Ej: tu@email.com"
                >
              </div>
            </div>

            <!-- Botones -->
            <div class="flex gap-3 mt-6">
              <button 
                @click="showContactModal = false"
                class="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Cancelar
              </button>
              
              <button 
                @click="openWhatsAppDirectly"
                :disabled="!canSubmitQuote"
                :class="[
                  'flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center',
                  canSubmitQuote
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                ]"
              >
                <span class="material-symbols-outlined mr-2">send</span>
                Abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AppHeader from '@/components/Header.vue'

export default {
  name: 'CartView',
  components: {
    AppHeader
  },
  data() {
    return {
      cartItems: [],
      cartCount: 0,
      showContactModal: false,
      customerInfo: {
        name: '',
        phone: '',
        email: ''
      },
      // ¡IMPORTANTE! CAMBIA ESTE NÚMERO POR EL DE PIGMAPRINT
      pigmaprintWhatsApp: '50496422659' // Solo números, sin el +
    }
  },
  computed: {
    canSubmitQuote() {
      return this.customerInfo.name.trim() !== '' && 
             this.customerInfo.phone.trim() !== '' &&
             this.cartItems.length > 0
    }
  },
  mounted() {
    this.loadCart()
  },
  methods: {
    loadCart() {
      const savedCart = localStorage.getItem('pigmaprint_cart')
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart)
        this.cartCount = this.cartItems.length
      }
    },
    
    getProductIcon(productType) {
      const icons = {
        camiseta: 'checkroom',
        taza: 'coffee',
        termo: 'water_bottle',
        gorra: 'sports_baseball',
        vaso: 'liquor',
        hoodie: 'account_circle',
        otros: 'category'
      }
      return icons[productType] || 'category'
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    
    removeItem(itemId) {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId)
      this.saveCart()
      this.cartCount = this.cartItems.length
    },
    
    clearCart() {
      if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        this.cartItems = []
        this.saveCart()
        this.cartCount = 0
      }
    },
    
    saveCart() {
      localStorage.setItem('pigmaprint_cart', JSON.stringify(this.cartItems))
    },

    openWhatsAppDirectly() {
      if (!this.canSubmitQuote) {
        alert('Por favor completa tu nombre y número de WhatsApp')
        return
      }

      try {
        // Número de Pigmaprint - ¡CAMBIA ESTE NÚMERO!
        const pigmaprintNumber = this.pigmaprintWhatsApp.replace(/\D/g, '')
        
        if (pigmaprintNumber.length < 8) {
          alert('Error: Número de WhatsApp no configurado correctamente')
          return
        }

        // Crear mensaje completo
        const reference = 'PM-' + Date.now().toString().slice(-8)
        const currentDate = new Date().toLocaleDateString('es-ES')
        
        let message = `¡Hola Pigmaprint! 👋%0A%0A`
        message += `Me gustaría solicitar una cotización para los siguientes productos:%0A%0A`

        // Información del cliente
        message += `*📋 INFORMACIÓN DEL CLIENTE:*%0A`
        message += `👤 *Nombre:* ${this.customerInfo.name}%0A`
        message += `📞 *WhatsApp:* ${this.customerInfo.phone}%0A`
        if (this.customerInfo.email) {
          message += `📧 *Email:* ${this.customerInfo.email}%0A`
        }

        message += `%0A*📦 DETALLES DEL PEDIDO:*%0A`
        message += `🔖 *Referencia:* ${reference}%0A`
        message += `📅 *Fecha:* ${currentDate}%0A`
        message += `🛒 *Total de productos:* ${this.cartItems.length}%0A%0A`

        // Productos
        message += `*🎨 PRODUCTOS SOLICITADOS:*%0A%0A`
        
        this.cartItems.forEach((item, index) => {
          message += `*${index + 1}. ${item.productName}*%0A`
          message += `   📎 *Archivo:* ${item.fileName}%0A`
          if (item.notes && item.notes.trim() !== '') {
            message += `   📝 *Notas:* ${item.notes}%0A`
          }
          message += `   🔖 *Ref. interna:* ${item.reference}%0A%0A`
        })

        message += `*💬 INFORMACIÓN ADICIONAL:*%0A`
        message += `Por favor envíenme la cotización detallada para estos productos. ¡Quedo atento(a) a su respuesta! 🙏%0A%0A`
        message += `_--- Mensaje generado desde Pigmaprint Web ---_`

        // Crear URL de WhatsApp
        const whatsappURL = `https://wa.me/${pigmaprintNumber}?text=${message}`
        
        console.log('URL de WhatsApp generada:', whatsappURL)

        // Abrir WhatsApp directamente
        window.open(whatsappURL, '_blank', 'noopener,noreferrer')
        
        // Cerrar modal
        this.showContactModal = false
        
        // Mostrar mensaje de confirmación después de un momento
        setTimeout(() => {
          alert('✅ Se ha abierto WhatsApp con tu pedido. Por favor envía el mensaje para completar tu solicitud.')
        }, 1000)

      } catch (error) {
        console.error('Error al abrir WhatsApp:', error)
        alert('Error al abrir WhatsApp. Por favor intenta nuevamente.')
      }
    },

    // ELIMINAR CUALQUIER MÉTODO QUE TENGA ESTE NOMBRE O SIMILAR
    // NO DEBE EXISTIR NINGÚN proceedToCheckout O sendWhatsAppMessage
    
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>