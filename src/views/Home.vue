<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <AppHeader :cart-count="cartCount" @view-cart="goToCart" />
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Texto de bienvenida -->
        <section id="inicio" class="mb-12 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            ¡Bienvenido a Pigmaprint!
          </h1>
          <p class="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Donde tu imaginación se convierte en realidad. Creemos que cada idea merece ser única, por eso personalizamos todo lo que puedas imaginar: desde prendas hasta tazas, termos, vasos, llaveros y mucho más.
          </p>
          <div class="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Tecnologías de impresión:</h3>
            <ul class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <li class="flex items-start">
                <span class="text-purple-500 mr-2 mt-1">•</span>
                <span class="text-gray-700 dark:text-gray-300"><strong>UVDTF</strong> — acabados duraderos con relieve</span>
              </li>
              <li class="flex items-start">
                <span class="text-blue-500 mr-2 mt-1">•</span>
                <span class="text-gray-700 dark:text-gray-300"><strong>DTF textil</strong> — ideal para cualquier color o textura</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2 mt-1">•</span>
                <span class="text-gray-700 dark:text-gray-300"><strong>Sublimación</strong> — resultados vibrantes</span>
              </li>
            </ul>
          </div>
          <p class="mt-8 text-base text-gray-600 dark:text-gray-300 italic border-l-4 border-purple-500 pl-4 py-2">
            Nuestra misión es empoderarte para que transformes tus ideas en piezas únicas, llenas de estilo, emoción y personalidad.
          </p>
        </section>
        
        <!-- Carrusel Infinito de Trabajos Realizados -->
        <section id="trabajos" class="mt-16">
          <div class="text-center mb-10">
            <h3 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Nuestros Trabajos Realizados
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Galería de productos personalizados que hemos creado para nuestros clientes.
            </p>
          </div>

          <!-- Carrusel Container -->
          <div class="relative overflow-hidden">
            <div 
              class="flex space-x-6 carousel-track"
              :style="{ transform: `translateX(${carouselPosition}px)` }"
            >
              <!-- Tarjetas duplicadas para efecto infinito -->
              <div 
                v-for="(work, index) in duplicatedWorks" 
                :key="index"
                class="carousel-slide flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div class="h-48 overflow-hidden">
                  <img 
                    :src="work.image" 
                    :alt="work.title"
                    class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div class="p-6">
                  <h4 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {{ work.title }}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">
                    {{ work.description }}
                  </p>
                  <div class="mt-4 flex items-center justify-between">
                    <span class="text-purple-600 dark:text-purple-400 font-semibold">
                      {{ work.category }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ work.date }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Controles del carrusel (opcionales) -->
            <button 
              @click="pauseCarousel"
              class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300"
            >
              <span class="material-symbols-outlined text-purple-600">
                {{ isCarouselPaused ? 'play_arrow' : 'pause' }}
              </span>
            </button>
          </div>
        </section>

        <!-- Carga tu Diseño mejorado con selector de producto -->
        <section id="carga-diseno" class="mt-16">
          <div class="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 class="text-4xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Carga tu Diseño</h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">Sube tu diseño para personalizar tus productos. Aceptamos archivos PNG, JPG, SVG y PDF.</p>
          </div>

          <!-- Formulario de carga de diseño -->
          <div class="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <!-- Selección de producto -->
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                <span class="material-symbols-outlined align-middle mr-2 text-purple-500">category</span>
                ¿En qué producto quieres aplicar tu diseño?
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="product in productTypes"
                  :key="product.type"
                  @click="selectProductType(product.type)"
                  :class="[
                    'border-2 rounded-xl p-4 cursor-pointer transition-all duration-300',
                    designProductType === product.type 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                  ]"
                >
                  <div class="text-center">
                    <div class="text-3xl text-purple-500 mb-2">
                      <span class="material-symbols-outlined">{{ product.icon }}</span>
                    </div>
                    <h4 class="font-medium text-gray-800 dark:text-white">{{ product.name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ product.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Producto seleccionado -->
              <div v-if="designProductType" class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p class="text-green-700 dark:text-green-300 font-medium">
                  <span class="material-symbols-outlined align-middle mr-2">check_circle</span>
                  Producto seleccionado: <strong>{{ getProductTypeLabel(designProductType) }}</strong>
                </p>
              </div>
            </div>

            <!-- Instrucciones adicionales -->
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                <span class="material-symbols-outlined align-middle mr-2 text-purple-500">notes</span>
                Instrucciones adicionales (opcional)
              </h3>
              <textarea 
                v-model="designNotes"
                rows="3"
                class="w-full rounded-xl p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Ej: Quiero el diseño en la parte trasera de la camiseta, usar colores vibrantes, tamaño mediano..."
              ></textarea>
            </div>

            <!-- Área de carga de archivos mejorada -->
            <div>
              <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                <span class="material-symbols-outlined align-middle mr-2 text-purple-500">cloud_upload</span>
                Sube tu diseño
              </h3>
              <div 
                @click="triggerMainFileInput"
                class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl h-56 cursor-pointer transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:border-purple-400 hover:shadow-md"
              >
                <input 
                  id="mainFileInput"
                  type="file"
                  class="hidden"
                  @change="handleFileUpload"
                  accept=".png, .jpg, .jpeg, .svg, .pdf"
                />
                
                <div v-if="!uploadedFile" class="text-center">
                  <div class="text-6xl text-purple-400 mb-4">
                    <span class="material-symbols-outlined">cloud_upload</span>
                  </div>
                  <p class="text-lg text-gray-600 dark:text-gray-400 font-medium">Haz clic para seleccionar un archivo</p>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-500">o arrástralo aquí</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-4">
                    Formatos: PNG, JPG, SVG, PDF • Máx. 10MB
                  </p>
                </div>

                <div v-else class="text-center">
                  <div class="text-5xl text-green-500 mb-3">
                    <span class="material-symbols-outlined">check_circle</span>
                  </div>
                  <p class="text-lg text-gray-700 dark:text-gray-300 font-medium">¡Archivo listo!</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ uploadedFile.name }}</p>
                  <button 
                    @click.stop="triggerMainFileInput"
                    class="mt-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors"
                  >
                    Cambiar archivo
                  </button>
                </div>
              </div>
            </div>

            <!-- Botón de envío -->
            <div class="mt-8 text-center">
              <button 
                @click="submitDesign"
                :disabled="!canSubmitDesign"
                :class="[
                  'px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5',
                  canSubmitDesign
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-blue-600'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                ]"
              >
                <span class="material-symbols-outlined align-middle mr-2">send</span>
                Agregar al Carrito
              </button>
              
              <p v-if="!canSubmitDesign" class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                * Completa todos los campos requeridos
              </p>
            </div>
          </div>
        </section>

        <!-- Sección de Contacto Rediseñada -->
        <section id="contacto" class="mt-16 pb-12">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6 text-center">
              Contacto
            </h3>
            
            <!-- Información de contacto principal -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <!-- Dirección -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <span class="material-symbols-outlined text-purple-600 dark:text-purple-400">location_on</span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Dirección</h4>
                  <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Tagucigalpa; Francisco Morazán<br>
                  </p>
                </div>
              </div>

              <!-- Teléfonos -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <span class="material-symbols-outlined text-blue-600 dark:text-blue-400">call</span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Teléfonos</h4>
                  <div class="space-y-1">
                    <p class="text-gray-600 dark:text-gray-300">(+504) 9573-7387</p>
                    <p class="text-gray-600 dark:text-gray-300">(+504) 3190-0085</p>
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <span class="material-symbols-outlined text-green-600 dark:text-green-400">mail</span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Correo Electrónico</h4>
                  <p class="text-gray-600 dark:text-gray-300">pigmaprint0804@gmail.com</p>
                </div>
              </div>

              <!-- Horario -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <span class="material-symbols-outlined text-orange-600 dark:text-orange-400">schedule</span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Horario de Atención</h4>
                  <p class="text-gray-600 dark:text-gray-300">
                    Lunes a Viernes: 9:00 AM - 5:00 PM<br>
                  </p>
                </div>
              </div>
            </div>

            <!-- Redes Sociales -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h4 class="text-xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Síguenos en Nuestras Redes</h4>
              
              <div class="flex justify-center space-x-8">
                <!-- Redes sociales... (mantener igual) -->
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Modal para agregar más productos -->
    <transition name="modal-fade">
      <div 
        v-if="showAddMoreModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
        @click.self="closeAddMoreModal"
      >
        <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-500 scale-95 hover:scale-100">
          <!-- Header -->
          <div class="bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-3xl p-8 text-center">
            <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <span class="material-symbols-outlined text-4xl text-white">
                shopping_cart_checkout
              </span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">
              ¡Producto Agregado!
            </h3>
            <p class="text-white/90">
              ¿Quieres agregar más productos?
            </p>
          </div>

          <!-- Contenido -->
          <div class="p-8">
            <div class="text-center mb-6">
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                <strong>{{ getProductTypeLabel(lastAddedProduct) }}</strong> ha sido agregado a tu carrito.
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Carrito: {{ cartCount }} producto{{ cartCount !== 1 ? 's' : '' }}
              </p>
            </div>

            <!-- Botones -->
            <div class="flex flex-col gap-4">
              <button 
                @click="continueShopping"
                class="px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <span class="material-symbols-outlined mr-2">
                  add_circle
                </span>
                Agregar Otro Producto
              </button>
              
              <button 
                @click="goToCart"
                class="px-6 py-4 border-2 border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-xl font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <span class="material-symbols-outlined mr-2">
                  shopping_cart
                </span>
                Ver Carrito ({{ cartCount }})
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
  name: 'HomeView',
  components: {
    AppHeader
  },
  data() {
    return {
      // Carrusel
      carouselPosition: 0,
      carouselSpeed: 1,
      isCarouselPaused: false,
      animationId: null,
      
      // Modal
      showAddMoreModal: false,
      lastAddedProduct: '',
      
      // Trabajos del carrusel
      worksData: [
         {
          id: 1,
          title: "Taza Sublimada",
          description: "Taza de cerámica con diseño personalizado full color.",
          image: "/1.jpeg",
          category: "Sublimación",
          date: "2025"
        },
        {
          id: 2,
          title: "Termo con Diseño",
          description: "Termo plástico con diseño personalizado.",
          image: "/2.jpeg",
          category: "Sublimación",
          date: "2025"
        },
        {
          id: 3,
          title: "Camisas personalizadas",
          description: "Camisas con diseño.",
          image: "/3.jpeg",
          category: "Sublimación y DTF",
          date: "2025"
        },
        {
          id: 4,
          title: "Taza Sublimada",
          description: "Taza de cerámica con diseño personalizado full color.",
          image: "/4.jpeg",
          category: "Sublimación y DFT",
          date: "2025"
        },
        {
          id: 5,
          title: "Gorra Personalizada",
          description: "Gorra personalizada con DFT",
          image: "/6.jpeg",
          category: "DFT",
          date: "2025"
        },
        {
          id: 6,
          title: "Gorra Personalizada",
          description: "Gorra personalizada con DFT",
          image: "/7.jpeg",
          category: "DFT",
          date: "2025"
        },
        {
          id: 7,
          title: "Camisa Personalizada",
          description: "Camisa con diseño personalizado.",
          image: "/8.jpeg",
          category: "Sublimación y DFT",
          date: "2025"
        },
        {
          id: 8,
          title: "Camisa Personalizada",
          description: "Camisa con diseño personalizado.",
          image: "/10.jpeg",
          category: "DFT",
          date: "2025"
        },
        {
          id: 9,
          title: "Camisa Personalizada",
          description: "Camisa con diseño personalizado.",
          image: "/11.jpeg",
          category: "Sublimación y DFT",
          date: "2025"
        },
        {
          id: 10,
          title: "Camisa Personalizada",
          description: "Camisa con diseño personalizado.",
          image: "/12.jpeg",
          category: "Sublimación y DFT",
          date: "2025"
        },
        {
          id: 11,
          title: "Taza Sublimada",
          description: "Taza de cerámica con diseño personalizado full color.",
          image: "/13.jpeg",
          category: " DFT",
          date: "2025"
        },
        {
          id: 12,
          title: "Taza Sublimada",
          description: "Taza de cerámica con diseño personalizado full color.",
          image: "/14.jpeg",
          category: "DFT",
          date: "2025"
        },
        {
          id: 13,
          title: "Camisa Personalizada",
          description: "Camisa con diseño personalizado.",
          image: "/15.jpeg",
          category: "Sublimación y DFT",
          date: "2025"
        },
        {
          id: 14,
          title: "Termo Personalizado",
          description: "Termo con diseño personalizado.",
          image: "/21.jpeg",
          category: "Sublimación y UVDTF",
          date: "2025"
        },
        {
          id: 15,
          title: "Termo Personalizado",
          description: "Termo con diseño personalizado.",
          image: "/22.jpeg",
          category: "Sublimación y UVDTF",
          date: "2025"
        },
        {
          id: 16,
          title: "Taza Personalizada",
          description: "Taza con diseño personalizado.",
          image: "/23.jpeg",
          category: "DTF",
          date: "2025"
        },
        {
          id: 17,
          title: "Taza Personalizada",
          description: "Taza con diseño personalizado.",
          image: "/25.jpeg",
          category: "DTF",
          date: "2025"
        },
        {
          id: 18,
          title: "Taza Personalizada",
          description: "Taza con diseño personalizado.",
          image: "/26.jpeg",
          category: "DTF",
          date: "2025"
        },
        { id: 19,
          title: "Taza Personalizada",
          description: "Taza con diseño personalizado.",
          image: "/27.jpeg",
          category: "DTF",
          date: "2025"
        },
        { id: 20,
          title: "Taza Personalizada",
          description: "Tazas con diseño personalizado.",
          image: "/30.jpeg",
          category: "DTF",
          date: "2025"
        },
        { id: 21,
          title: "Hoodie Personalizada",
          description: "Hoodie con diseño personalizado.",
          image: "/33.jpeg",
          category: "Sublimación y DTF",
          date: "2025"
        },
        { id: 22,
          title: "Hoodie Personalizada",
          description: "Hoodie con diseño personalizado.",
          image: "/34.jpeg",
          category: "Sublimación y DTF",
          date: "2025"
        }
      ],

      // Formulario de diseño
      selectedProduct: '',
      quantity: 1,
      instructions: '',
      uploadedFile: null,
      cartCount: 0,
      designFile: null,
      designPreview: null,
      designProductType: '',
      designNotes: '',

      // Tipos de productos
      productTypes: [
        { type: 'camiseta', name: 'Camiseta', description: 'Algodón 100% premium', icon: 'checkroom' },
        { type: 'taza', name: 'Taza', description: 'Cerámica de alta calidad', icon: 'coffee' },
        { type: 'termo', name: 'Termo', description: 'Acero inoxidable', icon: 'water_bottle' },
        { type: 'gorra', name: 'Gorra', description: 'Ajustable con malla', icon: 'sports_baseball' },
        { type: 'vaso', name: 'Vaso Térmico', description: 'Double wall insulation', icon: 'liquor' },
        { type: 'hoodie', name: 'Hoodie', description: 'Frisa con capucha', icon: 'account_circle' },
        { type: 'otros', name: 'Otro Producto', description: 'Especifique en notas', icon: 'category' }
      ]
    }
  },
  computed: {
    duplicatedWorks() {
      return [...this.worksData, ...this.worksData];
    },
    canSubmitDesign() {
      return this.designProductType && this.uploadedFile;
    }
  },
  methods: {
    // Animación del carrusel
    animateCarousel() {
      if (this.isCarouselPaused) return;

      const move = () => {
        this.carouselPosition -= this.carouselSpeed;
        
        const slideWidth = 320;
        if (Math.abs(this.carouselPosition) >= slideWidth * this.worksData.length) {
          this.carouselPosition = 0;
        }
        
        this.animationId = requestAnimationFrame(move);
      }
      
      this.animationId = requestAnimationFrame(move);
    },

    pauseCarousel() {
      this.isCarouselPaused = !this.isCarouselPaused;
      if (!this.isCarouselPaused) {
        this.animateCarousel();
      } else {
        cancelAnimationFrame(this.animationId);
      }
    },

    // Métodos del formulario de diseño
    selectProductType(type) {
      this.designProductType = type;
    },
    
    getProductTypeLabel(type) {
      const product = this.productTypes.find(p => p.type === type);
      return product ? product.name : type;
    },
    
    triggerMainFileInput() {
      document.getElementById('mainFileInput').click();
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const allowedTypes = ['.png', '.jpg', '.jpeg', '.svg', '.pdf'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        alert('Por favor selecciona un archivo PNG, JPG, SVG o PDF.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 10MB permitido.');
        return;
      }
      
      this.uploadedFile = file;
      this.designFile = file;
    },
    
    submitDesign() {
      if (!this.canSubmitDesign) {
        alert('Por favor selecciona un producto y sube tu diseño.');
        return;
      }
      
      // Agregar al carrito
      this.cartCount += 1;
      this.lastAddedProduct = this.designProductType;
      
      // Guardar en localStorage
      this.saveToCart();
      
      // Mostrar modal
      this.showAddMoreModal = true;
    },

    // Métodos del modal
    closeAddMoreModal() {
      this.showAddMoreModal = false;
    },

    continueShopping() {
      this.showAddMoreModal = false;
      this.resetForm();
    },

    goToCart() {
      this.showAddMoreModal = false;
      this.$router.push('/cart');
    },

    resetForm() {
      this.designProductType = '';
      this.designNotes = '';
      this.uploadedFile = null;
      this.designFile = null;
      document.getElementById('mainFileInput').value = '';
    },

    saveToCart() {
      const cartItem = {
        id: Date.now(),
        productType: this.designProductType,
        productName: this.getProductTypeLabel(this.designProductType),
        file: this.uploadedFile,
        fileName: this.uploadedFile.name,
        notes: this.designNotes,
        date: new Date().toISOString(),
        reference: 'PM' + Date.now().toString().slice(-8)
      };

      const currentCart = JSON.parse(localStorage.getItem('pigmaprint_cart') || '[]');
      currentCart.push(cartItem);
      localStorage.setItem('pigmaprint_cart', JSON.stringify(currentCart));
    }
  },
  mounted() {
    // Cargar carrito existente
    const currentCart = JSON.parse(localStorage.getItem('pigmaprint_cart') || '[]');
    this.cartCount = currentCart.length;
    
    this.animateCarousel();
  },
  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
</script>

<style scoped>
.carousel-track {
  transition: transform 0.1s linear;
  width: max-content;
}

.carousel-slide {
  width: 20rem;
}

/* Animaciones para el modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .carousel-slide {
    width: 18rem;
  }
}

@media (max-width: 640px) {
  .carousel-slide {
    width: 16rem;
  }
}
</style>