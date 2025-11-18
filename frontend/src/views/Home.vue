<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <AppHeader :cart-count="cartCount" />
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
        <section class="mt-16">
          <div class="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 id="carga-diseno" class="text-4xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Carga tu Diseño</h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">¿Tienes un diseño o necesitas ayuda para crear uno? Nosotros te ayudamos.</p>
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

            <!-- Pregunta sobre el diseño -->
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                <span class="material-symbols-outlined align-middle mr-2 text-purple-500">draw</span>
                ¿Ya tienes un diseño?
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  @click="setHasDesign(true)"
                  :class="[
                    'border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 text-center',
                    hasDesign === true 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                  ]"
                >
                  <div class="text-4xl text-purple-500 mb-3">
                    <span class="material-symbols-outlined">check_circle</span>
                  </div>
                  <h4 class="font-medium text-gray-800 dark:text-white mb-2">Sí, tengo un diseño</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Subiré mi archivo para personalizar el producto</p>
                </div>
                
                <div 
                  @click="setHasDesign(false)"
                  :class="[
                    'border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 text-center',
                    hasDesign === false 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  ]"
                >
                  <div class="text-4xl text-blue-500 mb-3">
                    <span class="material-symbols-outlined">help</span>
                  </div>
                  <h4 class="font-medium text-gray-800 dark:text-white mb-2">No, necesito ayuda</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Contactaremos contigo para crear un diseño único</p>
                </div>
              </div>
            </div>

            <!-- Área de carga de archivos (solo si tiene diseño) -->
            <div v-if="hasDesign === true">
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
                  accept=".png, .jpg, .jpeg, .svg, .pdf, .ai, .eps, .psd"
                />
                
                <div v-if="!uploadedFile" class="text-center">
                  <div class="text-6xl text-purple-400 mb-4">
                    <span class="material-symbols-outlined">cloud_upload</span>
                  </div>
                  <p class="text-lg text-gray-600 dark:text-gray-400 font-medium">Haz clic para seleccionar un archivo</p>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-500">o arrástralo aquí</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-4">
                    Formatos: PNG, JPG, SVG, PDF, AI, EPS, PSD • Máx. 10MB
                  </p>
                </div>

                <div v-else class="text-center">
                  <div class="text-5xl text-green-500 mb-3">
                    <span class="material-symbols-outlined">check_circle</span>
                  </div>
                  <p class="text-lg text-gray-700 dark:text-gray-300 font-medium">¡Archivo listo!</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ uploadedFile.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Tamaño: {{ formatFileSize(uploadedFile.size) }} • Tipo: {{ uploadedFile.type || 'No especificado' }}
                  </p>
                  <button 
                    @click.stop="triggerMainFileInput"
                    class="mt-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors"
                  >
                    Cambiar archivo
                  </button>
                </div>
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
                :placeholder="hasDesign === false ? 
                  'Ej: Me gustaría un diseño con mi nombre, colores azul y blanco, estilo minimalista...' : 
                  'Ej: Quiero el diseño en la parte trasera de la camiseta, usar colores vibrantes, tamaño mediano...'"
              ></textarea>
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
                <span class="material-symbols-outlined align-middle mr-2">add_shopping_cart</span>
                {{ hasDesign === false ? 'Solicitar Asesoría de Diseño' : 'Agregar al Carrito' }}
              </button>
              
              <p v-if="!canSubmitDesign" class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                * Selecciona un producto y responde si tienes un diseño
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
                    Tegucigalpa, Francisco Morazán<br>
                    Honduras
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
                    Sábados: 9:00 AM - 12:00 PM
                  </p>
                </div>
              </div>
            </div>

            <!-- Redes Sociales - Versión Moderna -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h4 class="text-xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Síguenos en Nuestras Redes</h4>
              
              <div class="flex justify-center space-x-8">
                <!-- Facebook con efecto glow -->
                <a
                  href="https://www.facebook.com/profile.php?id=61575574015615"
                  target="_blank"
                  class="group relative flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2"
                  title="Síguenos en Facebook"
                >
                  <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg class="w-8 h-8 text-blue-500 group-hover:text-white relative z-10 transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                <!-- Instagram con efecto gradient animado -->
                <a
                  href="https://instagram.com/pigmaprint"
                  target="_blank"
                  class="group relative flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/30 hover:-translate-y-2"
                  title="Síguenos en Instagram"
                >
                  <div class="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg class="w-8 h-8 text-pink-500 group-hover:text-white relative z-10 transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.069-1.644-.069-4.849 0-3.204.013-3.583.069-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <!-- WhatsApp con efecto pulse -->
                <a
                  href="https://wa.me/50495737387"
                  target="_blank"
                  class="group relative flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/30 hover:-translate-y-2"
                  title="Escríbenos por WhatsApp"
                >
                  <div class="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg class="w-8 h-8 text-green-500 group-hover:text-white relative z-10 transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.444"/>
                  </svg>
                </a>

                <!-- TikTok con colores característicos -->
                <a
                  href="https://tiktok.com/@pigmaprint"
                  target="_blank"
                  class="group relative flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-2"
                  title="Síguenos en TikTok"
                >
                  <div class="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg class="w-7 h-7 text-gray-800 dark:text-gray-200 group-hover:text-white relative z-10 transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
                  </svg>
                </a>
              </div>

              <!-- Texto descriptivo mejorado -->
              <div class="mt-8 text-center space-y-2">
                <p class="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  ¡Conectemos y creemos algo increíble juntos!
                </p>
                <p class="text-gray-500 dark:text-gray-400 text-xs">
                  Comparte tus ideas y descubre inspiración en nuestras redes
                </p>
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
              {{ hasDesign === false ? '¡Solicitud Enviada!' : '¡Producto Agregado!' }}
            </h3>
            <p class="text-white/90">
              {{ hasDesign === false ? 
                'Nos contactaremos contigo para crear tu diseño' : 
                '¿Quieres agregar más productos?' }}
            </p>
          </div>

          <!-- Contenido -->
          <div class="p-8">
            <div class="text-center mb-6">
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                <strong>{{ getProductTypeLabel(lastAddedProduct) }}</strong> 
                {{ hasDesign === false ? 
                  'ha sido agregado a tu lista de asesorías.' : 
                  'ha sido agregado a tu carrito.' }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ hasDesign === false ? 
                  'Te contactaremos en menos de 24 horas' : 
                  `Carrito: ${cartCount} producto${cartCount !== 1 ? 's' : ''}` }}
              </p>
              <p v-if="hasDesign && uploadedFile" class="text-sm text-green-600 dark:text-green-400 mt-2">
                <span class="material-symbols-outlined align-middle text-sm">check_circle</span>
                Archivo guardado correctamente
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
                {{ hasDesign === false ? 'Solicitar Otro Producto' : 'Agregar Otro Producto' }}
              </button>
              
              <!-- Botón "Ir al Carrito" - Ahora visible para ambos casos -->
              <button 
                @click="goToCart"
                class="px-6 py-4 border-2 border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-xl font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <span class="material-symbols-outlined mr-2">
                  shopping_cart
                </span>
                {{ hasDesign === false ? 'Ver Mis Solicitudes' : 'Ver Carrito' }} ({{ cartCount }})
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
      
      // Formulario de diseño
      uploadedFile: null,
      cartCount: 0,
      designFile: null,
      designPreview: null,
      designProductType: '',
      designNotes: '',
      hasDesign: null, // null = no seleccionado, true = tiene diseño, false = necesita ayuda
      
      // Trabajos del carrusel - TODAS LAS IMÁGENES INCLUIDAS
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
          category: "DFT",
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
        { 
          id: 19,
          title: "Taza Personalizada",
          description: "Taza con diseño personalizado.",
          image: "/27.jpeg",
          category: "DTF",
          date: "2025"
        },
        { 
          id: 20,
          title: "Taza Personalizada",
          description: "Tazas con diseño personalizado.",
          image: "/30.jpeg",
          category: "DTF",
          date: "2025"
        },
        { 
          id: 21,
          title: "Hoodie Personalizada",
          description: "Hoodie con diseño personalizado.",
          image: "/33.jpeg",
          category: "Sublimación y DTF",
          date: "2025"
        },
        { 
          id: 22,
          title: "Hoodie Personalizada",
          description: "Hoodie con diseño personalizado.",
          image: "/34.jpeg",
          category: "Sublimación y DTF",
          date: "2025"
        }
      ],

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
      // Solo requiere producto seleccionado y respuesta sobre el diseño
      return this.designProductType && this.hasDesign !== null;
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

    // Pausar/reanudar carrusel
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
    
    setHasDesign(value) {
      this.hasDesign = value;
      // Si selecciona "No tengo diseño", limpiamos el archivo subido
      if (value === false) {
        this.uploadedFile = null;
        this.designFile = null;
        // CORRECCIÓN: Verificamos si el elemento existe antes de intentar acceder a él
        const fileInput = document.getElementById('mainFileInput');
        if (fileInput) {
          fileInput.value = '';
        }
      }
    },
    
    getProductTypeLabel(type) {
      const product = this.productTypes.find(p => p.type === type);
      return product ? product.name : type;
    },
    
    triggerMainFileInput() {
      const fileInput = document.getElementById('mainFileInput');
      if (fileInput) {
        fileInput.click();
      }
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const allowedTypes = ['.png', '.jpg', '.jpeg', '.svg', '.pdf', '.ai', '.eps', '.psd'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        alert('Por favor selecciona un archivo PNG, JPG, SVG, PDF, AI, EPS o PSD.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 10MB permitido.');
        return;
      }
      
      this.uploadedFile = file;
      this.designFile = file;
      console.log('📄 Archivo seleccionado:', file.name, 'Tamaño:', this.formatFileSize(file.size));
    },

    // Formatear tamaño de archivo
    formatFileSize(bytes) {
      if (!bytes) return 'N/A';
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // Función para convertir File a Base64
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    
    async submitDesign() {
      if (!this.canSubmitDesign) {
        alert('Por favor selecciona un producto y responde si tienes un diseño.');
        return;
      }
      
      // Agregar al carrito o lista de asesorías
      this.cartCount += 1;
      this.lastAddedProduct = this.designProductType;
      
      // Preparar datos del archivo
      let fileData = null;
      if (this.hasDesign && this.uploadedFile) {
        try {
          // Convertir archivo a Base64 para guardarlo en localStorage
          const base64Data = await this.fileToBase64(this.uploadedFile);
          fileData = {
            name: this.uploadedFile.name,
            type: this.uploadedFile.type,
            size: this.uploadedFile.size,
            data: base64Data, // Guardamos el archivo como Base64
            lastModified: this.uploadedFile.lastModified
          };
          console.log('✅ Archivo convertido a Base64:', this.uploadedFile.name);
        } catch (error) {
          console.error('❌ Error convirtiendo archivo a Base64:', error);
          alert('Error al procesar el archivo. Intenta nuevamente.');
          return;
        }
      }
      
      // Crear item del carrito o solicitud de asesoría
      const cartItem = {
        id: Date.now(),
        productType: this.designProductType,
        productName: this.getProductTypeLabel(this.designProductType),
        hasDesign: this.hasDesign,
        fileName: this.hasDesign ? this.uploadedFile?.name : null,
        fileSize: this.hasDesign ? this.uploadedFile?.size : null,
        fileData: fileData, // Guardamos los datos del archivo
        notes: this.designNotes,
        date: new Date().toISOString(),
        quantity: 1
      };

      // Guardar en localStorage
      const currentCart = JSON.parse(localStorage.getItem('pigmaprint_cart') || '[]');
      currentCart.push(cartItem);
      localStorage.setItem('pigmaprint_cart', JSON.stringify(currentCart));
      
      console.log('🛒 Producto agregado al carrito:', {
        producto: cartItem.productName,
        conDiseño: cartItem.hasDesign,
        archivo: cartItem.fileName,
        notas: cartItem.notes ? 'Sí' : 'No'
      });
      
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
      this.hasDesign = null;
      // CORRECCIÓN: Verificamos si el elemento existe antes de intentar acceder a él
      const fileInput = document.getElementById('mainFileInput');
      if (fileInput) {
        fileInput.value = '';
      }
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

/* Smooth hover transitions */
.carousel-slide {
  transition: all 0.3s ease;
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