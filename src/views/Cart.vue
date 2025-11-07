<template>
  <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden">
    <AppHeader :cart-count="cartCount" />
    <main class="flex-1 py-12">
      <div class="mx-auto grid max-w-4xl grid-cols-1 gap-12 px-4 lg:grid-cols-2">
        <!-- Resumen del pedido -->
        <div class="flex flex-col gap-8">
          <div>
            <h2 class="text-2xl font-bold tracking-tight">Revisa tu pedido</h2>
            <p class="text-slate-500 dark:text-slate-400 mt-1">Confirma los detalles de tu compra.</p>
          </div>
          
          <!-- Artículos -->
          <div class="space-y-4">
            <h3 class="text-lg font-bold">Artículos</h3>
            <div class="space-y-4 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              <div v-for="(item, index) in cartItems" :key="index" class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <div class="h-16 w-16 flex-shrink-0 rounded-lg bg-cover bg-center" :style="`background-image: url('${item.image}')`"></div>
                  <div>
                    <p class="font-medium">{{ item.name }}</p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">{{ item.details }}</p>
                  </div>
                </div>
                <p class="font-medium">${{ item.price }}</p>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-slate-500 dark:text-slate-400">Subtotal</p>
              <p class="font-medium">${{ subtotal }}</p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-slate-500 dark:text-slate-400">Envío</p>
              <p class="font-medium">${{ shipping }}</p>
            </div>
            <div class="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between">
              <p class="text-lg font-bold">Total</p>
              <p class="text-lg font-bold">${{ total }}</p>
            </div>
          </div>
        </div>

        <!-- Formulario de pago -->
        <div class="flex flex-col gap-8">
          <form @submit.prevent="processPayment" class="space-y-6">
            <!-- Información de envío -->
            <div>
              <h3 class="text-lg font-bold">Información de envío</h3>
              <div class="mt-4 grid grid-cols-1 gap-4">
                <div>
                  <label class="text-sm font-medium" for="name">Nombre</label>
                  <input 
                    v-model="shippingInfo.name"
                    class="form-input mt-1 block w-full rounded-lg border-slate-300 bg-background-light dark:border-slate-700 dark:bg-background-dark focus:border-primary focus:ring-primary" 
                    id="name" 
                    placeholder="Ingresa tu nombre"
                    required
                  />
                </div>
                <div>
                  <label class="text-sm font-medium" for="address">Dirección</label>
                  <input 
                    v-model="shippingInfo.address"
                    class="form-input mt-1 block w-full rounded-lg border-slate-300 bg-background-light dark:border-slate-700 dark:bg-background-dark focus:border-primary focus:ring-primary" 
                    id="address" 
                    placeholder="Ingresa tu dirección"
                    required
                  />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium" for="city">Ciudad</label>
                    <input 
                      v-model="shippingInfo.city"
                      class="form-input mt-1 block w-full rounded-lg border-slate-300 bg-background-light dark:border-slate-700 dark:bg-background-dark focus:border-primary focus:ring-primary" 
                      id="city" 
                      placeholder="Ingresa tu ciudad"
                      required
                    />
                  </div>
                  <div>
                    <label class="text-sm font-medium" for="postal-code">Código Postal</label>
                    <input 
                      v-model="shippingInfo.postalCode"
                      class="form-input mt-1 block w-full rounded-lg border-slate-300 bg-background-light dark:border-slate-700 dark:bg-background-dark focus:border-primary focus:ring-primary" 
                      id="postal-code" 
                      placeholder="Ingresa tu código postal"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium" for="country">País</label>
                  <select 
                    v-model="shippingInfo.country"
                    class="form-select mt-1 block w-full rounded-lg border-slate-300 bg-background-light dark:border-slate-700 dark:bg-background-dark focus:border-primary focus:ring-primary" 
                    id="country"
                    required
                  >
                    <option value="">Selecciona un país</option>
                    <option value="México">México</option>
                    <option value="España">España</option>
                    <option value="Argentina">Argentina</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Método de pago -->
            <div>
              <h3 class="text-lg font-bold">Método de pago</h3>
              <div class="mt-4 grid grid-cols-1 gap-4">
                <div class="space-y-2">
                  <label class="flex cursor-pointer items-center gap-4 rounded-lg border border-slate-300 dark:border-slate-700 p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input 
                      v-model="paymentMethod"
                      value="credit"
                      class="form-radio h-5 w-5 border-slate-300 dark:border-slate-700 text-primary focus:ring-primary" 
                      name="payment" 
                      type="radio"
                    />
                    <span class="font-medium">Tarjeta de crédito</span>
                  </label>
                  <label class="flex cursor-pointer items-center gap-4 rounded-lg border border-slate-300 dark:border-slate-700 p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input 
                      v-model="paymentMethod"
                      value="paypal"
                      class="form-radio h-5 w-5 border-slate-300 dark:border-slate-700 text-primary focus:ring-primary" 
                      name="payment" 
                      type="radio"
                    />
                    <span class="font-medium">PayPal</span>
                  </label>
                </div>
                
                <div v-if="paymentMethod === 'credit'">
                  <label class="text-sm font-medium" for="card-number">Número de tarjeta</label>
                  <input 
                    v-model="paymentInfo.cardNumber"
                    class="form-input mt-1 block w-full rounded-lg border-slate-300 bg-background-light dark:border-slate-700 dark:bg-background-dark focus:border-primary focus:ring-primary" 
                    id="card-number" 
                    placeholder="•••• •••• •••• ••••"
                  />
                </div>
                <div v-if="paymentMethod === 'credit'" class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium" for="expiry-date">Fecha de expiración</label>
                    <input 
                      v-model="paymentInfo.expiryDate"
                      class="form-input mt-1 block w-full rounded-lg border-slate-300 bg-background-light dark:border-slate-700 dark:bg-background-dark focus:border-primary focus:ring-primary" 
                      id="expiry-date" 
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label class="text-sm font-medium" for="cvc">CVC</label>
                    <input 
                      v-model="paymentInfo.cvc"
                      class="form-input mt-1 block w-full rounded-lg border-slate-300 bg-background-light dark:border-slate-700 dark:bg-background-dark focus:border-primary focus:ring-primary" 
                      id="cvc" 
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              class="w-full rounded-lg bg-primary py-3 text-base font-bold text-white shadow-sm hover:bg-primary/90"
            >
              Pagar ${{ total }}
            </button>
          </form>
        </div>
      </div>
    </main>
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
      cartItems: [
        {
          name: 'Camiseta personalizada',
          details: 'Talla M',
          price: 25.00,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm74cleNlxBqRan5FfNibSUCvnxgzr_WDo3cU6X6JQhx93lYQeCx1qs6ovpGCZZ07iJNcQOEf30dk4me-gkiixyCevg9fc9ZoRc8ktdCktxK3limVK9vilwAy39DGNF7uXodAbfSrvy5gwYNesYkoGAuVErgqrJW91LIXOz7fRIwsRvMV-qfmTOV-iRB_O7HXoxFGl16CUHyd1muyxDWyNUbqiTldnXqKkbtuh2pPYraonUQ4zX0-_oaEbSuuiLsvu6G3eHdyin0BK'
        },
        {
          name: 'Taza con diseño',
          details: '11 oz',
          price: 15.00,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsw0l7cA2m93GTRD2jpiYBKJoUK6j4JEyy8up-uQAj9lBoxyqToFbEkh0ZnyBYKf0-bHm4fO9kWZurs9tw6pw3LpV8nYOTdA6GbMkg8hSVlr3HcG4cTc6rgy2o4juX1Ep3DoIpccb_ctdtLlpq-Nh3sTYb8UKi2BQDSBWRmxAKrkEVH6FLN6rIFj7JBMCGxTEAotscigswaSnLMT6FqHKxgXc6eSiIPt8Ifnm8Coh4eE97mXtaO8kTIYlxCn6JNNo6pwbFIo3_v60M'
        },
        {
          name: 'Gorra personalizada',
          details: 'Ajustable',
          price: 20.00,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9j0hnp9zByj1s4ryTRb1Ozkq6XEIBzVxy9WBx-zZuU4Ug_uhqHgyuWS286BfzmFI8YGNmDEf1X_Zx3tNX8WyHPeF8IBamKdkOH-TXcJSG5aVYX_dn6JAK6itLqeLNCm0OT9i--6mwbjFhm-sGqmTuEqeYGhfdV8_e2RWl9AzwrkFdsTlir8ro5tzj_l6FwZJTBllnRoIV9FsHwqO7DMvKDlpunECjug0wBrSdMNb0lSDUzho_SXQtNgBfwmXlG0moPdRq270n4zeA'
        }
      ],
      shipping: 5.00,
      shippingInfo: {
        name: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
      },
      paymentMethod: 'credit',
      paymentInfo: {
        cardNumber: '',
        expiryDate: '',
        cvc: ''
      }
    }
  },
  computed: {
    cartCount() {
      return this.cartItems.length
    },
    subtotal() {
      return this.cartItems.reduce((sum, item) => sum + item.price, 0)
    },
    total() {
      return this.subtotal + this.shipping
    }
  },
  methods: {
    processPayment() {
      // Aquí iría la lógica de procesamiento de pago
      console.log('Procesando pago...', {
        shippingInfo: this.shippingInfo,
        paymentMethod: this.paymentMethod,
        paymentInfo: this.paymentInfo
      })
      
      // Redirigir a confirmación
      this.$router.push('/confirmation')
    }
  }
}
</script>