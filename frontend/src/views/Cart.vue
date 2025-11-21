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
            @click="$router.push('/#carga-diseno')"
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
                <!-- Vista previa -->
                <div class="flex-shrink-0 w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
                  <span v-if="!item.hasDesign" class="material-symbols-outlined text-3xl text-purple-600 dark:text-purple-400">
                    {{ getProductIcon(item.productType) }}
                  </span>
                  <img 
                    v-else-if="item.fileData && esImagen(item.fileData.type)"
                    :src="item.fileData.data"
                    :alt="item.fileName"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">
                    description
                  </span>
                </div>

                <!-- Información del Producto -->
                <div class="flex-grow">
                  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div class="flex-grow">
                      <!-- Código del producto -->
                      <div class="flex items-center mb-2">
                        <span class="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full font-mono font-bold tracking-wide">
                          {{ item.productCode }}
                        </span>
                      </div>

                      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {{ item.productName }}
                      </h3>
                      
                      <!-- Estado del diseño -->
                      <div class="flex items-center mb-2">
                        <span 
                          :class="[
                            'px-2 py-1 rounded-full text-xs font-medium',
                            item.hasDesign 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          ]"
                        >
                          <span class="material-symbols-outlined align-middle text-xs mr-1">
                            {{ item.hasDesign ? 'check_circle' : 'help' }}
                          </span>
                          {{ item.hasDesign ? 'Con diseño propio' : 'Necesita asesoría' }}
                        </span>
                      </div>

                      <p v-if="item.fileName" class="text-gray-600 dark:text-gray-300 text-sm">
                        <span class="material-symbols-outlined align-middle text-xs mr-1">attach_file</span>
                        Archivo: {{ item.fileName }}
                        <span v-if="item.fileSize" class="text-gray-500 text-xs ml-2">
                          ({{ formatFileSize(item.fileSize) }})
                        </span>
                      </p>
                      
                      <p v-if="item.notes" class="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        <span class="material-symbols-outlined align-middle text-xs mr-1">notes</span>
                        Notas: {{ item.notes }}
                      </p>
                      
                      <p class="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        <span class="material-symbols-outlined align-middle text-xs mr-1">category</span>
                        Tipo: {{ getProductTypeLabel(item.productType) }}
                      </p>
                      
                      <!-- Selector de Cantidad -->
                      <div class="flex items-center mt-4">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
                          Cantidad:
                        </label>
                        <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button 
                            @click="decreaseQuantity(item.id)"
                            :disabled="item.quantity <= 1"
                            class="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span class="material-symbols-outlined text-lg">remove</span>
                          </button>
                          <input 
                            v-model.number="item.quantity"
                            type="number"
                            min="1"
                            max="100"
                            class="w-16 py-1 text-center border-0 bg-transparent text-gray-800 dark:text-white focus:ring-0 focus:outline-none"
                            @change="validateQuantity(item)"
                          >
                          <button 
                            @click="increaseQuantity(item.id)"
                            class="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
                          >
                            <span class="material-symbols-outlined text-lg">add</span>
                          </button>
                        </div>
                        <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          {{ item.quantity }} {{ item.quantity === 1 ? 'unidad' : 'unidades' }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Precio -->
                    <div class="mt-2 sm:mt-0 text-right">
                      <p class="text-lg font-bold text-purple-600 dark:text-purple-400">
                        Por cotizar
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ formatDate(item.date) }}
                      </p>
                    </div>
                  </div>

                  <!-- Acciones -->
                  <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      @click="removeItem(item.id)"
                      class="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200 flex items-center"
                    >
                      <span class="material-symbols-outlined text-lg mr-1">delete</span>
                      Eliminar
                    </button>
                    
                    <!-- Información del archivo -->
                    <div v-if="item.hasDesign && item.fileData" class="text-xs text-gray-500 dark:text-gray-400">
                      <span class="material-symbols-outlined align-middle text-xs mr-1">
                        {{ esImagen(item.fileData.type) ? 'image' : 'description' }}
                      </span>
                      {{ esImagen(item.fileData.type) ? 'Imagen lista' : 'Documento listo' }}
                      <span class="ml-1 text-purple-500 font-mono text-xs">
                        ({{ item.productCode }})
                      </span>
                    </div>
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
                    {{ totalItems }}
                  </span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">Archivos:</span>
                  <span class="font-semibold text-gray-800 dark:text-white">
                    {{ totalFiles }}
                  </span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">Códigos únicos:</span>
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
                  :disabled="cartItems.length === 0 || sendingEmail"
                  :class="[
                    'w-full px-6 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center',
                    cartItems.length > 0 && !sendingEmail
                      ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:shadow-xl hover:from-green-600 hover:to-blue-700'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  ]"
                >
                  <span class="material-symbols-outlined mr-2" v-if="!sendingEmail">email</span>
                  <span class="material-symbols-outlined mr-2 animate-spin" v-else>progress_activity</span>
                  {{ sendingEmail ? 'Enviando...' : 'Enviar Pedido' }}
                </button>
                
                <button 
                  @click="$router.push('/')"
                  :disabled="sendingEmail"
                  class="w-full px-6 py-4 border-2 border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-xl font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 flex items-center justify-center"
                >
                  <span class="material-symbols-outlined mr-2">add_circle</span>
                  Agregar Más Productos
                </button>
                
                <button 
                  @click="clearCart"
                  :disabled="sendingEmail || cartItems.length === 0"
                  class="w-full px-6 py-4 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <p class="text-sm text-blue-700 dark:text-blue-300 mb-2">
                      <strong>Total de productos:</strong> {{ totalItems }}
                    </p>
                    <p class="text-sm text-blue-700 dark:text-blue-300 mb-2">
                      <strong>Archivos listos:</strong> {{ totalFiles }}
                    </p>
                    <p class="text-sm text-blue-700 dark:text-blue-300 mb-2">
                      <strong>Códigos únicos:</strong> {{ cartItems.length }}
                    </p>
                    <p class="text-xs text-blue-600 dark:text-blue-400">
                      Cada producto tiene un código único para mejor seguimiento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Confirmación para Vaciar Carrito -->
    <transition name="modal-fade">
      <div 
        v-if="showClearCartModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
      >
        <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-500 scale-95 hover:scale-100 overflow-hidden border border-gray-200 dark:border-gray-700">
          <!-- Header con gradiente -->
          <div class="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-center relative overflow-hidden">
            <!-- Efecto de brillo -->
            <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            
            <!-- Ícono animado -->
            <div class="relative w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
              <span class="material-symbols-outlined text-2xl text-white animate-pulse">
                delete_forever
              </span>
            </div>
            
            <h3 class="text-xl font-bold text-white relative">
              Vaciar Carrito
            </h3>
          </div>

          <!-- Contenido -->
          <div class="p-8">
            <!-- Mensaje principal -->
            <div class="text-center mb-6">
              <p class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                ¿Estás seguro de que quieres vaciar el carrito?
              </p>
              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Se eliminarán <strong class="text-red-500">{{ totalItems }} productos</strong>, <strong class="text-red-500">{{ totalFiles }} archivos</strong> y <strong class="text-red-500">{{ cartItems.length }} códigos únicos</strong> de tu carrito actual. 
                Esta acción no se puede deshacer.
              </p>
            </div>

            <!-- Resumen del carrito -->
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-red-700 dark:text-red-300 font-medium">
                  Productos a eliminar:
                </span>
                <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {{ totalItems }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-red-700 dark:text-red-300 font-medium">
                  Archivos a eliminar:
                </span>
                <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {{ totalFiles }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-red-700 dark:text-red-300 font-medium">
                  Códigos únicos:
                </span>
                <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {{ cartItems.length }}
                </span>
              </div>
              <div class="mt-2 text-xs text-red-600 dark:text-red-400">
                <span class="material-symbols-outlined align-middle text-sm mr-1">info</span>
                Incluye todos los diseños, personalizaciones y códigos únicos
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex gap-3">
              <button 
                @click="showClearCartModal = false"
                class="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
              >
                <span class="material-symbols-outlined mr-2 text-lg group-hover:animate-pulse">arrow_back</span>
                Cancelar
              </button>
              
              <button 
                @click="confirmClearCart"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
              >
                <span class="material-symbols-outlined mr-2 text-lg group-hover:animate-bounce">delete_sweep</span>
                Vaciar Todo
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de Información del Cliente -->
    <transition name="modal-fade">
      <div 
        v-if="showContactModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
        @click.self="showContactModal = false"
      >
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full mx-auto transform transition-all duration-500 scale-95 hover:scale-100">
          <!-- Header -->
          <div class="bg-gradient-to-r from-green-500 to-blue-600 rounded-t-2xl p-6 text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <span class="material-symbols-outlined text-3xl text-white">
                person
              </span>
            </div>
            <h3 class="text-xl font-bold text-white mb-1">
              Información del Cliente
            </h3>
          </div>

          <!-- Formulario -->
          <div class="p-5">
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre Completo *
                </label>
                <input 
                  v-model="customerInfo.name"
                  type="text"
                  :disabled="sendingEmail"
                  class="w-full rounded-lg p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Ej: María González"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número de Teléfono *
                </label>
                <input 
                  v-model="customerInfo.phone"
                  type="tel"
                  :disabled="sendingEmail"
                  class="w-full rounded-lg p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Ej: 9999-9999"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Correo Electrónico (opcional)
                </label>
                <input 
                  v-model="customerInfo.email"
                  type="email"
                  :disabled="sendingEmail"
                  class="w-full rounded-lg p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Ej: cliente@email.com"
                >
              </div>
            </div>

            <!-- Resumen rápido -->
            <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resumen de tu pedido:
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ totalItems }} productos • {{ totalFiles }} archivos • {{ cartItems.length }} códigos
              </p>
            </div>

            <!-- Botones -->
            <div class="flex gap-2 mt-4">
              <button 
                @click="showContactModal = false"
                :disabled="sendingEmail"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              
              <button 
                @click="sendOrderByEmail"
                :disabled="!canSubmitOrder"
                :class="[
                  'flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center text-sm',
                  canSubmitOrder && !sendingEmail
                    ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                ]"
              >
                <span class="material-symbols-outlined mr-1 text-base" v-if="!sendingEmail">send</span>
                <span class="material-symbols-outlined mr-1 text-base animate-spin" v-else>progress_activity</span>
                {{ sendingEmail ? 'Enviando...' : 'Enviar Pedido' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de Éxito -->
    <transition name="modal-fade">
      <div 
        v-if="showSuccessModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
      >
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-500 scale-95 hover:scale-100 overflow-hidden">
          <!-- Fondo decorativo -->
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
          
          <!-- Contenido -->
          <div class="p-8 text-center">
            <!-- Ícono animado -->
            <div class="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-500 hover:scale-110">
              <span class="material-symbols-outlined text-3xl text-white">
                check
              </span>
            </div>
            
            <!-- Título -->
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              ¡Pedido Enviado con Éxito!
            </h3>
            
            <!-- Mensaje -->
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Tu pedido de <strong>{{ totalItems }} productos</strong>, <strong>{{ totalFiles }} archivos</strong> y <strong>{{ cartItems.length }} códigos únicos</strong> ha sido enviado correctamente a nuestro equipo. 
              <span class="block mt-2 text-green-600 dark:text-green-400 font-semibold">
                Te contactaremos pronto para confirmar los detalles y el precio.
              </span>
            </p>

            <!-- Detalles adicionales -->
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
              <div class="flex justify-between items-center text-sm mb-2">
                <span class="text-gray-500 dark:text-gray-400">Productos totales:</span>
                <span class="font-semibold text-gray-700 dark:text-gray-300">{{ totalItems }}</span>
              </div>
              <div class="flex justify-between items-center text-sm mb-2">
                <span class="text-gray-500 dark:text-gray-400">Archivos enviados:</span>
                <span class="font-semibold text-gray-700 dark:text-gray-300">{{ totalFiles }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500 dark:text-gray-400">Códigos únicos:</span>
                <span class="font-semibold text-gray-700 dark:text-gray-300">{{ cartItems.length }}</span>
              </div>
            </div>

            <!-- Botón de cierre -->
            <button 
              @click="handleSuccessModalClose"
              class="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <span class="material-symbols-outlined mr-2">done_all</span>
              Entendido
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de Confirmación para Vaciar Carrito después del Envío -->
    <transition name="modal-fade">
      <div 
        v-if="showClearCartAfterSuccess" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
      >
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-500 scale-95 hover:scale-100 overflow-hidden">
          <!-- Fondo decorativo -->
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          
          <!-- Contenido -->
          <div class="p-8 text-center">
            <!-- Ícono animado -->
            <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-500 hover:scale-110">
              <span class="material-symbols-outlined text-3xl text-white">
                shopping_cart_checkout
              </span>
            </div>
            
            <!-- Título -->
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              ¿Vaciar Carrito?
            </h3>
            
            <!-- Mensaje -->
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Tu pedido ha sido enviado exitosamente. 
              <span class="block mt-2 font-semibold">
                ¿Deseas vaciar el carrito o mantener los productos para un próximo pedido?
              </span>
            </p>

            <!-- Resumen del carrito -->
            <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 mb-6">
              <div class="flex justify-between items-center text-sm mb-2">
                <span class="text-purple-700 dark:text-purple-300 font-medium">
                  Productos en carrito:
                </span>
                <span class="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {{ totalItems }}
                </span>
              </div>
              <div class="flex justify-between items-center text-sm mb-2">
                <span class="text-purple-700 dark:text-purple-300 font-medium">
                  Archivos en carrito:
                </span>
                <span class="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {{ totalFiles }}
                </span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-purple-700 dark:text-purple-300 font-medium">
                  Códigos únicos:
                </span>
                <span class="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {{ cartItems.length }}
                </span>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex gap-3">
              <button 
                @click="keepCartItems"
                class="flex-1 px-6 py-3 border-2 border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
              >
                <span class="material-symbols-outlined mr-2 text-lg group-hover:animate-pulse">inventory_2</span>
                Mantener
              </button>
              
              <button 
                @click="clearCartAfterSuccess"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
              >
                <span class="material-symbols-outlined mr-2 text-lg group-hover:animate-bounce">delete_sweep</span>
                Vaciar
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
      showSuccessModal: false,
      showClearCartModal: false,
      showClearCartAfterSuccess: false,
      sendingEmail: false,
      customerInfo: {
        name: '',
        phone: '',
        email: ''
      },
      backendUrl: 'https://pigmaprint-backend.vercel.app'
    }
  },
  computed: {
    canSubmitOrder() {
      return this.customerInfo.name.trim() !== '' && 
             this.customerInfo.phone.trim() !== '' &&
             this.cartItems.length > 0 &&
             !this.sendingEmail
    },
    totalItems() {
      return this.cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
    },
    totalFiles() {
      return this.cartItems.filter(item => item.hasDesign && item.fileData).length
    }
  },
  mounted() {
    this.loadCart()
  },
  methods: {
    // Detectar si un archivo es imagen
    esImagen(mimetype) {
      return mimetype && mimetype.startsWith('image/')
    },

    // Formatear tamaño de archivo
    formatFileSize(bytes) {
      if (!bytes) return 'N/A'
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    loadCart() {
      const savedCart = localStorage.getItem('pigmaprint_cart')
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart)
          this.cartItems = cartData.map(item => ({
            ...item,
            quantity: item.quantity || 1
          }))
          this.cartCount = this.cartItems.length
          console.log('🛒 Carrito cargado:', this.cartItems.length, 'productos')
          console.log('📁 Archivos en carrito:', this.totalFiles)
          console.log('🔢 Códigos únicos:', this.cartItems.map(item => item.productCode))
        } catch (error) {
          console.error('Error loading cart:', error)
          this.cartItems = []
          this.cartCount = 0
        }
      }
    },

    // Métodos para manejar cantidades
    increaseQuantity(itemId) {
      const item = this.cartItems.find(item => item.id === itemId)
      if (item) {
        item.quantity = (item.quantity || 1) + 1
        this.saveCart()
      }
    },

    decreaseQuantity(itemId) {
      const item = this.cartItems.find(item => item.id === itemId)
      if (item && item.quantity > 1) {
        item.quantity -= 1
        this.saveCart()
      }
    },

    validateQuantity(item) {
      if (!item.quantity || item.quantity < 1) {
        item.quantity = 1
      }
      if (item.quantity > 100) {
        item.quantity = 100
      }
      this.saveCart()
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

    getProductTypeLabel(productType) {
      const labels = {
        camiseta: 'Camiseta',
        taza: 'Taza',
        termo: 'Termo',
        gorra: 'Gorra',
        vaso: 'Vaso Térmico',
        hoodie: 'Hoodie',
        otros: 'Otro Producto'
      }
      return labels[productType] || 'Producto'
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Fecha no disponible'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      } catch (error) {
        return 'Fecha inválida'
      }
    },
    
    removeItem(itemId) {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId)
      this.saveCart()
      this.cartCount = this.cartItems.length
    },
    
    clearCart() {
      if (this.cartItems.length === 0) {
        console.log('El carrito ya está vacío')
        return
      }
      this.showClearCartModal = true
    },

    confirmClearCart() {
      this.cartItems = []
      this.saveCart()
      this.cartCount = 0
      this.showClearCartModal = false
    },

    // MÉTODOS PARA MANEJAR LA MODAL DESPUÉS DEL ÉXITO
    handleSuccessModalClose() {
      this.showSuccessModal = false
      // Mostrar modal para preguntar si quiere vaciar el carrito
      setTimeout(() => {
        this.showClearCartAfterSuccess = true
      }, 300)
    },

    keepCartItems() {
      // Simplemente cerrar la modal, el carrito se mantiene
      this.showClearCartAfterSuccess = false
      console.log('✅ Carrito mantenido con', this.totalItems, 'productos y', this.cartItems.length, 'códigos únicos')
    },

    clearCartAfterSuccess() {
      // Vaciar el carrito después del éxito
      this.cartItems = []
      this.saveCart()
      this.cartCount = 0
      this.showClearCartAfterSuccess = false
      console.log('🗑️ Carrito vaciado después del envío exitoso')
    },
    
    async saveCart() {
      try {
        const cartToSave = this.cartItems.map(item => ({
          id: item.id,
          productCode: item.productCode,
          productType: item.productType,
          productName: item.productName,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileData: item.fileData,
          hasDesign: item.hasDesign,
          notes: item.notes,
          date: item.date,
          quantity: item.quantity || 1
        }))
        localStorage.setItem('pigmaprint_cart', JSON.stringify(cartToSave))
      } catch (error) {
        console.error('Error saving cart:', error)
      }
    },

    // ENVIAR PEDIDO
    async sendOrderByEmail() {
      if (!this.canSubmitOrder) {
        alert('Por favor completa tu información de contacto')
        return
      }

      this.sendingEmail = true

      try {
        // Configuración del pedido
        const emailData = {
          customerName: this.customerInfo.name,
          customerPhone: this.customerInfo.phone,
          customerEmail: this.customerInfo.email || 'No proporcionado',
          orderDetails: this.createOrderDetails(),
          files: await this.getFilesFromCart()
        }

        console.log('📤 Enviando pedido al backend...', {
          customer: emailData.customerName,
          productos: this.totalItems,
          archivos: emailData.files.length,
          codigos: this.cartItems.length
        })

        // Enviar al backend
        await this.sendToBackend(emailData)
        
        // Mostrar modal de éxito
        this.showSuccessModal = true
        this.showContactModal = false
        
        // Limpiar información del cliente
        this.customerInfo = {
          name: '',
          phone: '',
          email: ''
        }
        
      } catch (error) {
        console.error('❌ Error enviando pedido:', error)
        alert('❌ Error al enviar el pedido: ' + error.message)
      } finally {
        this.sendingEmail = false
      }
    },

    // CREAR DETALLES DEL PEDIDO - CON CÓDIGOS
    createOrderDetails() {
      const currentDate = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      let details = `NUEVO PEDIDO - PIGMAPRINT\n`
      details += `Fecha: ${currentDate}\n\n`

      // Información del cliente
      details += `👤 INFORMACIÓN DEL CLIENTE\n`
      details += `• Nombre: ${this.customerInfo.name}\n`
      details += `• Teléfono: ${this.customerInfo.phone}\n`
      details += `• Email: ${this.customerInfo.email || 'No proporcionado'}\n\n`

      // Resumen del pedido
      details += `📦 RESUMEN DEL PEDIDO\n`
      details += `• Total de productos: ${this.totalItems}\n`
      details += `• Archivos adjuntos: ${this.totalFiles}\n`
      details += `• Códigos únicos: ${this.cartItems.length}\n\n`

      // Detalles de productos
      details += `🎨 DETALLES DE PRODUCTOS\n\n`
      
      this.cartItems.forEach((item, index) => {
        const quantity = item.quantity || 1
        details += `PRODUCTO ${index + 1}:\n`
        details += `• Código: ${item.productCode}\n`
        details += `• Tipo: ${this.getProductTypeLabel(item.productType)}\n`
        details += `• Nombre: ${item.productName}\n`
        details += `• Cantidad: ${quantity} ${quantity === 1 ? 'unidad' : 'unidades'}\n`
        details += `• Diseño: ${item.hasDesign ? 'Con diseño propio' : 'Necesita asesoría'}\n`
        
        if (item.fileName) {
          details += `• Archivo: ${item.fileName}\n`
          if (item.fileSize) {
            details += `• Tamaño archivo: ${this.formatFileSize(item.fileSize)}\n`
          }
        }
        
        if (item.notes && item.notes.trim() !== '') {
          details += `• Notas: ${item.notes}\n`
        }
        
        details += `• Fecha de solicitud: ${this.formatDate(item.date)}\n\n`
      })

      details += `---\n`
      details += `Este pedido fue generado automáticamente desde la web de Pigmaprint\n`
      details += `Cada producto tiene un código único para seguimiento\n`

      return details
    },

    // OBTENER ARCHIVOS DESDE EL CARRITO - CON CÓDIGOS
    async getFilesFromCart() {
      const files = []
      
      for (const item of this.cartItems) {
        if (item.hasDesign && item.fileData && item.fileData.data) {
          try {
            const originalFile = await this.base64ToFile(
              item.fileData.data,
              item.fileData.name,
              item.fileData.type
            )
            
            // Renombrar el archivo con el código del producto
            const fileExtension = originalFile.name.split('.').pop();
            const newFileName = `${item.productCode}_${item.fileData.name.split('.')[0]}.${fileExtension}`;
            
            const renamedFile = new File(
              [originalFile], 
              newFileName, 
              { type: originalFile.type, lastModified: Date.now() }
            );
            
            files.push(renamedFile);
            console.log(`✅ Archivo preparado: ${item.fileData.name} → ${newFileName}`);
          } catch (error) {
            console.error(`❌ Error convirtiendo archivo ${item.fileData?.name}:`, error);
          }
        }
      }
      
      return files;
    },

    // CONVERTIR BASE64 A FILE
    base64ToFile(base64String, filename, mimeType) {
      return new Promise((resolve, reject) => {
        try {
          // Separar el data URL del base64
          const base64Data = base64String.split(',')[1]
          
          if (!base64Data) {
            reject(new Error('Formato base64 inválido'))
            return
          }

          // Decodificar base64
          const byteCharacters = atob(base64Data)
          const byteArrays = []

          for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024)
            const byteNumbers = new Array(slice.length)
            
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i)
            }
            
            const byteArray = new Uint8Array(byteNumbers)
            byteArrays.push(byteArray)
          }

          const blob = new Blob(byteArrays, { type: mimeType })
          const file = new File([blob], filename, { type: mimeType, lastModified: Date.now() })
          
          resolve(file)
        } catch (error) {
          reject(error)
        }
      })
    },

    // ENVIAR AL BACKEND
    async sendToBackend(emailData) {
      try {
        const formData = new FormData()
        
        // Agregar datos del formulario
        formData.append('customerName', emailData.customerName)
        formData.append('customerPhone', emailData.customerPhone)
        formData.append('customerEmail', emailData.customerEmail)
        formData.append('orderDetails', emailData.orderDetails)
        
        // Agregar archivos
        if (emailData.files && emailData.files.length > 0) {
          emailData.files.forEach((file, index) => {
            if (file && file instanceof File) {
              formData.append('files', file, file.name)
              console.log(`📤 Enviando archivo ${index + 1}:`, file.name)
            }
          })
        }

        console.log(`📦 Enviando pedido con ${emailData.files.length} archivos y ${this.cartItems.length} códigos únicos...`)

        // Enviar al backend
        const response = await fetch(`${this.backendUrl}/api/send-order`, {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Error ${response.status}: ${errorText}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || 'Error en el servidor')
        }

        console.log('✅ Respuesta del backend:', result)
        return result

      } catch (error) {
        console.error('❌ Error en comunicación con backend:', error)
        throw new Error('No se pudo conectar con el servidor. Por favor intenta más tarde.')
      }
    }
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

/* Animación personalizada para el modal de éxito */
.success-modal-enter-active {
  transition: all 0.5s ease;
}

.success-modal-leave-active {
  transition: all 0.3s ease;
}

.success-modal-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.success-modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Estilos para el input de cantidad */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>