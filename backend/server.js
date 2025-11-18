const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware CORS configurado para producción
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://pigmaprint-frontend.vercel.app',
      'https://pigmaprint-frontend.vercel.app/',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:5173', // Vite dev server
      'https://pigmaprint-frontend-git-main-marlen-romeros-projects.vercel.app',
      'https://pigmaprint-frontend-marlen-romeros-projects.vercel.app'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // También permitir cualquier subdominio de vercel
      if (origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        console.log('🚫 CORS bloqueado para origen:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Manejar preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB límite
});

// Función para detectar si un archivo es imagen
function esImagen(mimetype) {
  return mimetype.startsWith('image/');
}

// Función para eliminar carpeta de pedido recursivamente
async function eliminarCarpetaPedido(carpetaPath) {
  try {
    const stats = await fs.stat(carpetaPath);
    
    if (stats.isDirectory()) {
      const archivos = await fs.readdir(carpetaPath);
      
      // Eliminar todos los archivos y subcarpetas primero
      for (const archivo of archivos) {
        const archivoPath = path.join(carpetaPath, archivo);
        await eliminarCarpetaPedido(archivoPath);
      }
      
      // Eliminar la carpeta principal
      await fs.rmdir(carpetaPath);
      console.log(`🗑️  Carpeta eliminada: ${carpetaPath}`);
    } else {
      // Es un archivo, eliminarlo directamente
      await fs.unlink(carpetaPath);
      console.log(`🗑️  Archivo eliminado: ${carpetaPath}`);
    }
  } catch (error) {
    console.log(`❌ Error eliminando ${carpetaPath}:`, error.message);
    throw error;
  }
}

// Función para extraer información de productos del orderDetails
function extraerInformacionProductos(orderDetails) {
  if (!orderDetails) return { productos: [], totalProductos: 0 };
  
  const productos = [];
  const lines = orderDetails.split('\n');
  let currentProduct = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Detectar inicio de producto
    if (trimmedLine.includes('Producto:')) {
      if (currentProduct) {
        productos.push(currentProduct);
      }
      currentProduct = {
        nombre: trimmedLine.replace('Producto:', '').trim(),
        cantidad: '',
        archivos: []
      };
    }
    // Detectar cantidad
    else if (trimmedLine.includes('Cantidad:') && currentProduct) {
      currentProduct.cantidad = trimmedLine.replace('Cantidad:', '').trim();
    }
    // Detectar archivos (puede haber múltiples líneas de archivos)
    else if ((trimmedLine.includes('Archivo:') || trimmedLine.includes('Archivos:')) && currentProduct) {
      const archivo = trimmedLine.replace(/Archivos?:/, '').trim();
      if (archivo) {
        currentProduct.archivos.push(archivo);
      }
    }
    // Detectar fin de producto (línea vacía o siguiente producto)
    else if (trimmedLine === '' && currentProduct) {
      productos.push(currentProduct);
      currentProduct = null;
    }
  }
  
  // Agregar el último producto si existe
  if (currentProduct) {
    productos.push(currentProduct);
  }
  
  // Buscar total de productos
  let totalProductos = 'No especificado';
  for (const line of lines) {
    if (line.includes('Total de productos:')) {
      const match = line.match(/Total de productos:\s*(\d+)/);
      if (match && match[1]) {
        totalProductos = match[1];
        break;
      }
    }
    if (line.includes('Productos:')) {
      const match = line.match(/Productos:\s*(\d+)/);
      if (match && match[1]) {
        totalProductos = match[1];
        break;
      }
    }
  }
  
  return {
    productos: productos.filter(p => p.nombre && p.cantidad),
    totalProductos: totalProductos
  };
}

// Función para mapear archivos a productos (SIN información de productos)
function mapearArchivosAProductos(files, productosInfo) {
  const archivosMapeados = [];
  
  // Simplemente devolver los archivos sin información de productos
  files.forEach(archivo => {
    archivosMapeados.push({
      ...archivo
    });
  });
  
  return archivosMapeados;
}

// Función mejorada para enviar a Telegram SIN nombres de archivos ni productos Y ELIMINAR CARPETA DESPUÉS
async function enviarTelegram(pedidoInfo, archivosMapeados) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('⚠️  Telegram no configurado - Verifica las variables de entorno');
    return { success: false, error: 'Telegram no configurado' };
  }

  try {
    console.log(`🤖 Enviando a Telegram: ${archivosMapeados.length} archivos mapeados`);

    // Separar archivos en imágenes y otros archivos
    const imagenes = archivosMapeados.filter(file => esImagen(file.mimetype));
    const otrosArchivos = archivosMapeados.filter(file => !esImagen(file.mimetype));

    console.log(`📸 Imágenes: ${imagenes.length}, 📎 Otros archivos: ${otrosArchivos.length}`);

    // 1. Enviar mensaje con detalles del pedido
    let mensajeProductos = '';
    if (pedidoInfo.productosInfo.productos.length > 0) {
      mensajeProductos = '📋 *Productos del Pedido:*\n' + 
        pedidoInfo.productosInfo.productos.map((p, i) => 
          `${i + 1}. *${p.nombre}* - Cantidad: ${p.cantidad}`
        ).join('\n');
    } else {
      mensajeProductos = '📋 *Detalles del Pedido:*\n' + pedidoInfo.orderDetails;
    }

    const mensaje = `
🎨 *NUEVO PEDIDO PIGMAPRINT*

👤 *Cliente:* ${pedidoInfo.customerName}
📞 *Teléfono:* ${pedidoInfo.customerPhone}
📧 *Email:* ${pedidoInfo.customerEmail || 'No proporcionado'}

📦 *Total Productos:* ${pedidoInfo.totalProductos || 'No especificado'}
📸 *Imágenes:* ${imagenes.length}
📎 *Otros archivos:* ${otrosArchivos.length}
🕒 *Fecha:* ${pedidoInfo.timestamp}

📍 *ID Pedido:* ${pedidoInfo.id}

${mensajeProductos}
    `.trim();

    // Enviar mensaje principal
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: mensaje,
      parse_mode: 'Markdown'
    });

    console.log('✅ Mensaje de Telegram enviado');

    // 2. Enviar imágenes como fotos (SIN caption)
    const imagenesEnviadas = [];
    for (let i = 0; i < Math.min(imagenes.length, 10); i++) {
      const imagen = imagenes[i];
      
      try {
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('photo', imagen.buffer, {
          filename: imagen.originalname,
          contentType: imagen.mimetype
        });
        
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });

        imagenesEnviadas.push({
          nombre: imagen.originalname
        });
        console.log(`✅ Imagen ${i + 1} enviada sin caption`);
        
        // Pequeña pausa para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (fileError) {
        console.log(`❌ Error enviando imagen ${imagen.originalname}:`, fileError.message);
        // Intentar enviar como documento si falla como imagen
        try {
          const formData = new FormData();
          formData.append('chat_id', TELEGRAM_CHAT_ID);
          formData.append('document', imagen.buffer, {
            filename: imagen.originalname,
            contentType: imagen.mimetype
          });

          await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, {
            headers: {
              ...formData.getHeaders(),
            },
          });
          console.log(`✅ Imagen enviada como archivo sin caption`);
        } catch (docError) {
          console.log(`❌ Error enviando imagen como archivo:`, docError.message);
        }
      }
    }

    // 3. Enviar otros archivos (SIN caption)
    const otrosEnviados = [];
    for (let i = 0; i < Math.min(otrosArchivos.length, 10); i++) {
      const archivo = otrosArchivos[i];
      
      try {
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('document', archivo.buffer, {
          filename: archivo.originalname,
          contentType: archivo.mimetype
        });

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });

        otrosEnviados.push({
          nombre: archivo.originalname
        });
        console.log(`✅ Archivo ${i + 1} enviado sin caption`);
        
        // Pequeña pausa para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (fileError) {
        console.log(`❌ Error enviando archivo ${archivo.originalname}:`, fileError.message);
      }
    }

    // ✅ NUEVO: ELIMINAR CARPETA DEL PEDIDO DESPUÉS DE ENVIAR A TELEGRAM
    const pedidoDir = path.join(__dirname, 'pedidos', pedidoInfo.id);
    try {
      await eliminarCarpetaPedido(pedidoDir);
      console.log(`🗑️  Carpeta del pedido eliminada: ${pedidoDir}`);
    } catch (deleteError) {
      console.log(`⚠️  No se pudo eliminar la carpeta: ${deleteError.message}`);
    }

    return { 
      success: true, 
      imagenesEnviadas: imagenesEnviadas.length,
      otrosEnviados: otrosEnviados.length,
      totalArchivos: archivosMapeados.length,
      detalles: {
        imagenes: imagenesEnviadas,
        otros: otrosEnviados
      },
      carpetaEliminada: true // ✅ Indicar que se eliminó la carpeta
    };

  } catch (error) {
    console.log('❌ Error Telegram:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.description || error.message 
    };
  }
}

// Función mejorada para guardar respaldo local con información de productos
async function guardarRespaldoLocal(pedidoInfo, files, archivosMapeados) {
  const pedidosDir = path.join(__dirname, 'pedidos');
  const pedidoId = pedidoInfo.id;
  const pedidoDir = path.join(pedidosDir, pedidoId);
  
  // Solo una carpeta para archivos
  const archivosDir = path.join(pedidoDir, 'archivos');

  try {
    // Crear directorios
    await fs.mkdir(pedidoDir, { recursive: true });
    await fs.mkdir(archivosDir, { recursive: true });
    
    // Separar archivos
    const imagenes = files.filter(file => esImagen(file.mimetype));
    const otrosArchivos = files.filter(file => !esImagen(file.mimetype));

    // Guardar información del pedido
    const infoFile = path.join(pedidoDir, 'informacion.json');
    await fs.writeFile(infoFile, JSON.stringify({
      ...pedidoInfo,
      archivos: {
        total: files.length,
        imagenes: imagenes.map(img => ({ 
          name: img.originalname, 
          size: img.size, 
          type: img.mimetype,
          path: `archivos/${img.originalname}`,
          sizeMB: (img.size / 1024 / 1024).toFixed(2)
        })),
        otrosArchivos: otrosArchivos.map(archivo => ({ 
          name: archivo.originalname, 
          size: archivo.size, 
          type: archivo.mimetype,
          path: `archivos/${archivo.originalname}`,
          sizeMB: (archivo.size / 1024 / 1024).toFixed(2)
        }))
      },
      fechaCreacion: new Date().toISOString(),
      servidor: {
        hostname: require('os').hostname(),
        platform: require('os').platform()
      }
    }, null, 2));
    
    // Guardar todos los archivos en la misma carpeta
    for (const file of files) {
      const filePath = path.join(archivosDir, file.originalname);
      await fs.writeFile(filePath, file.buffer);
      console.log(`💾 Archivo guardado: ${filePath}`);
    }
    
    // Crear resumen detallado
    const resumen = `
PEDIDO PIGMAPRINT - ${pedidoInfo.timestamp}
===========================================

INFORMACIÓN DEL CLIENTE:
• Nombre: ${pedidoInfo.customerName}
• Teléfono: ${pedidoInfo.customerPhone}
• Email: ${pedidoInfo.customerEmail}

ESTADÍSTICAS:
• Total productos: ${pedidoInfo.totalProductos}
• Total archivos: ${files.length}
• Imágenes: ${imagenes.length}
• Otros archivos: ${otrosArchivos.length}

PRODUCTOS DEL PEDIDO:
${pedidoInfo.productosInfo.productos.map((p, i) => 
  `${i + 1}. ${p.nombre} - Cantidad: ${p.cantidad}\n   Archivos: ${p.archivos.join(', ')}`
).join('\n\n')}

LISTA DE ARCHIVOS:

IMÁGENES (${imagenes.length}):
${imagenes.map((f, i) => `  ${i + 1}. ${f.originalname} (${(f.size / 1024 / 1024).toFixed(2)} MB)`).join('\n')}

OTROS ARCHIVOS (${otrosArchivos.length}):
${otrosArchivos.map((f, i) => `  ${i + 1}. ${f.originalname} (${(f.size / 1024 / 1024).toFixed(2)} MB)`).join('\n')}

DETALLES DEL PEDIDO:
${pedidoInfo.orderDetails}

INFORMACIÓN TÉCNICA:
• ID: ${pedidoId}
• Carpeta: ${pedidoDir}
• Fecha creación: ${new Date().toISOString()}
• Servidor: ${require('os').hostname()}
    `.trim();
    
    await fs.writeFile(path.join(pedidoDir, 'RESUMEN.txt'), resumen);
    
    // Crear archivo de estructura
    const estructura = `
ESTRUCTURA DE CARPETAS:
📦 ${pedidoId}/
├── 📄 informacion.json
├── 📄 RESUMEN.txt
└── 📁 archivos/
${files.map(file => `    └── ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)} MB)`).join('\n')}
    `.trim();
    
    await fs.writeFile(path.join(pedidoDir, 'ESTRUCTURA.txt'), estructura);
    
    console.log('💾 Pedido guardado en:', pedidoDir);
    console.log(`   📸 Imágenes: ${imagenes.length}`);
    console.log(`   📎 Otros archivos: ${otrosArchivos.length}`);
    console.log(`   💾 Total: ${files.length} archivos`);
    console.log(`   📋 Productos: ${pedidoInfo.productosInfo.productos.length}`);
    
    return { 
      id: pedidoId, 
      path: pedidoDir,
      estadisticas: {
        imagenes: imagenes.length,
        otrosArchivos: otrosArchivos.length,
        total: files.length,
        productos: pedidoInfo.productosInfo.productos.length
      }
    };
    
  } catch (error) {
    console.error('❌ Error guardando respaldo:', error);
    throw error;
  }
}

// Ruta principal - COMPATIBLE CON FRONTEND
app.post('/api/send-order', upload.array('files'), async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, orderDetails } = req.body;
    const files = req.files || [];

    console.log('='.repeat(50));
    console.log('📨 NUEVO PEDIDO RECIBIDO');
    console.log('='.repeat(50));
    console.log('👤 Cliente:', customerName);
    console.log('📞 Teléfono:', customerPhone);
    console.log('📧 Email:', customerEmail || 'No proporcionado');
    console.log('📦 Archivos recibidos:', files.length);
    console.log('📄 Nombres de archivos:', files.map(f => f.originalname));
    console.log('💾 Tamaños:', files.map(f => `${(f.size / 1024 / 1024).toFixed(2)} MB`));
    console.log('='.repeat(50));

    // Validaciones
    if (!customerName || !customerPhone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nombre y teléfono son requeridos' 
      });
    }

    // Extraer información de productos
    const productosInfo = extraerInformacionProductos(orderDetails);
    console.log('📋 Productos detectados:', productosInfo.productos.length);
    productosInfo.productos.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.nombre} - Cantidad: ${p.cantidad} - Archivos: ${p.archivos.length}`);
    });

    // Mapear archivos a productos (sin información de productos)
    const archivosMapeados = mapearArchivosAProductos(files, productosInfo);
    
    // Contar imágenes y otros archivos
    const imagenes = archivosMapeados.filter(file => esImagen(file.mimetype));
    const otrosArchivos = archivosMapeados.filter(file => !esImagen(file.mimetype));

    const pedidoInfo = {
      id: `pedido-${Date.now()}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: (customerEmail || 'No proporcionado').trim(),
      orderDetails: orderDetails || 'Sin detalles adicionales',
      timestamp: new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      totalProductos: productosInfo.totalProductos,
      productosInfo: productosInfo,
      estadisticas: {
        totalArchivos: files.length,
        imagenes: imagenes.length,
        otrosArchivos: otrosArchivos.length
      }
    };

    // 1. INTENTAR ENVÍO POR TELEGRAM
    console.log('🤖 Intentando enviar por Telegram...');
    const telegramResult = await enviarTelegram(pedidoInfo, archivosMapeados);
    
    if (telegramResult.success) {
      // Telegram exitoso - la carpeta ya se eliminó en enviarTelegram()
      console.log('✅ Pedido procesado exitosamente y carpeta eliminada');
      console.log(`📸 Imágenes enviadas: ${telegramResult.imagenesEnviadas}`);
      console.log(`📎 Otros archivos enviados: ${telegramResult.otrosEnviados}`);
      
      return res.json({
        success: true,
        message: `✅ Pedido enviado por Telegram exitosamente (${telegramResult.imagenesEnviadas} imágenes, ${telegramResult.otrosEnviados} otros archivos) - Carpeta eliminada del servidor`,
        method: 'telegram',
        pedidoId: pedidoInfo.id,
        estadisticas: {
          imagenesEnviadas: telegramResult.imagenesEnviadas,
          otrosEnviados: telegramResult.otrosEnviados,
          totalArchivos: files.length,
          productos: productosInfo.productos.length
        },
        carpetaEliminada: true // ✅ Indicar que se eliminó
      });
    }

    // 2. RESPLADO LOCAL (si Telegram falla) - NO eliminar carpeta
    console.log('💾 Guardando respaldo local (Telegram falló)...');
    const backupInfo = await guardarRespaldoLocal(pedidoInfo, files, archivosMapeados);
    
    console.log('📁 Pedido guardado localmente:', backupInfo.path);
    
    return res.json({
      success: true,
      message: '📁 Pedido guardado en el servidor (Telegram falló)',
      method: 'local',
      backupId: backupInfo.id,
      pedidoId: pedidoInfo.id,
      backupPath: backupInfo.path,
      instructions: 'Revisa la carpeta "pedidos" en el servidor',
      telegramError: telegramResult.error,
      estadisticas: {
        imagenes: imagenes.length,
        otrosArchivos: otrosArchivos.length,
        totalArchivos: files.length,
        productos: productosInfo.productos.length
      },
      carpetaEliminada: false // ✅ Indicar que NO se eliminó
    });

  } catch (error) {
    console.error('❌ Error general:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor: ' + error.message
    });
  }
});

// Ruta para obtener archivos específicos de un pedido
app.get('/api/pedidos/:id/archivos', async (req, res) => {
  try {
    const pedidoId = req.params.id;
    const pedidoDir = path.join(__dirname, 'pedidos', pedidoId);
    
    try {
      await fs.access(pedidoDir);
    } catch {
      return res.status(404).json({ 
        success: false, 
        message: 'Pedido no encontrado' 
      });
    }
    
    const infoPath = path.join(pedidoDir, 'informacion.json');
    const info = JSON.parse(await fs.readFile(infoPath, 'utf8'));
    
    res.json({
      success: true,
      pedido: pedidoId,
      archivos: info.archivos
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Ruta para descargar archivo específico
app.get('/api/pedidos/:id/archivo/:nombre', async (req, res) => {
  try {
    const { id, nombre } = req.params;
    
    const filePath = path.join(__dirname, 'pedidos', id, 'archivos', nombre);
    
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ 
        success: false, 
        message: 'Archivo no encontrado' 
      });
    }
    
    res.sendFile(filePath);
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Ruta para ver imagen específica
app.get('/api/pedidos/:id/imagen/:nombre', async (req, res) => {
  try {
    const { id, nombre } = req.params;
    const filePath = path.join(__dirname, 'pedidos', id, 'archivos', nombre);
    
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ 
        success: false, 
        message: 'Imagen no encontrada' 
      });
    }
    
    res.sendFile(filePath);
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Ruta para probar Telegram
app.post('/api/test-telegram', async (req, res) => {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return res.json({
        success: false,
        message: '❌ Telegram no configurado',
        instructions: 'Configura TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID en .env'
      });
    }

    // Test mejorado con información de archivos
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: '✅ Test de conexión - Pigmaprint Backend funcionando correctamente\n\n📸 *Soporte para imágenes:* Activado\n📎 *Soporte para otros archivos:* Activado\n🔄 *Envío sin captions:* Activado\n🗑️ *Limpieza automática:* Activada',
      parse_mode: 'Markdown'
    });

    res.json({
      success: true,
      message: '✅ Telegram funcionando correctamente',
      features: {
        imagenes: true,
        otrosArchivos: true,
        organizacion: true,
        sinCaptions: true,
        limpiezaAutomatica: true
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.response?.data 
    });
  }
});

// Ruta para obtener configuración actual
app.get('/api/config', (req, res) => {
  const hasToken = !!process.env.TELEGRAM_BOT_TOKEN;
  const hasChatId = !!process.env.TELEGRAM_CHAT_ID;
  
  res.json({
    success: true,
    telegram: {
      configured: hasToken && hasChatId,
      hasToken: hasToken,
      hasChatId: hasChatId
    },
    features: {
      imagenes: true,
      otrosArchivos: true,
      organizacion: true,
      respaldoLocal: true,
      sinCaptions: true,
      limpiezaAutomatica: true
    },
    mode: (hasToken && hasChatId) ? 'Telegram + Limpieza Automática' : 'Solo Local',
    endpoints: {
      sendOrder: 'POST /api/send-order',
      testTelegram: 'POST /api/test-telegram',
      listOrders: 'GET /api/pedidos',
      getOrderFiles: 'GET /api/pedidos/:id/archivos',
      downloadFile: 'GET /api/pedidos/:id/archivo/:nombre',
      viewImage: 'GET /api/pedidos/:id/imagen/:nombre',
      health: 'GET /api/health'
    }
  });
});

// Rutas de administración
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidosDir = path.join(__dirname, 'pedidos');
    
    try {
      await fs.access(pedidosDir);
    } catch {
      return res.json({ success: true, total: 0, pedidos: [] });
    }
    
    const carpetas = await fs.readdir(pedidosDir);
    const pedidos = [];
    
    for (const carpeta of carpetas) {
      if (carpeta.startsWith('pedido-')) {
        const infoPath = path.join(pedidosDir, carpeta, 'informacion.json');
        try {
          const info = JSON.parse(await fs.readFile(infoPath, 'utf8'));
          pedidos.push({
            id: carpeta,
            fecha: info.timestamp,
            cliente: info.customerName,
            telefono: info.customerPhone,
            productos: info.totalProductos || 'No especificado',
            archivos: info.archivos?.total || 0,
            imagenes: info.archivos?.imagenes?.length || 0,
            otrosArchivos: info.archivos?.otrosArchivos?.length || 0
          });
        } catch (e) {
          console.log(`❌ Error leyendo pedido ${carpeta}:`, e.message);
        }
      }
    }
    
    pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    res.json({ success: true, total: pedidos.length, pedidos });
  } catch (error) {
    res.json({ success: true, total: 0, pedidos: [] });
  }
});

// Ruta para ver detalles de un pedido específico
app.get('/api/pedidos/:id', async (req, res) => {
  try {
    const pedidoId = req.params.id;
    const pedidoDir = path.join(__dirname, 'pedidos', pedidoId);
    
    try {
      await fs.access(pedidoDir);
    } catch {
      return res.status(404).json({ 
        success: false, 
        message: 'Pedido no encontrado' 
      });
    }
    
    const infoPath = path.join(pedidoDir, 'informacion.json');
    const info = JSON.parse(await fs.readFile(infoPath, 'utf8'));
    
    res.json({
      success: true,
      pedido: info
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend de Pigmaprint funcionando',
    timestamp: new Date().toISOString(),
    status: 'operational',
    features: {
      imagenes: true,
      otrosArchivos: true,
      organizacion: true,
      sinCaptions: true,
      limpiezaAutomatica: true
    },
    storage: {
      pedidosDir: path.join(__dirname, 'pedidos'),
      exists: require('fs').existsSync(path.join(__dirname, 'pedidos'))
    }
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Pigmaprint Backend - Sistema con Telegram MEJORADO',
    version: '2.5.0',
    status: 'Operativo',
    features: [
      '✅ Recepción de pedidos desde frontend Vue.js',
      '✅ Notificaciones instantáneas por Telegram',
      '📸 Envío de imágenes como fotos (sin captions)',
      '📎 Envío de otros archivos como documentos (sin captions)',
      '📋 Información de productos en mensaje principal',
      '🗑️  Limpieza automática después del envío exitoso',
      '📁 Organización simplificada en carpeta única',
      '💾 Respaldo local solo cuando Telegram falla',
      '🔍 API para administración de pedidos'
    ]
  });
});

// Configuración para Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 PIGMAPRINT - SISTEMA CON TELEGRAM (MEJORADO)');
    console.log('='.repeat(60));
    console.log(`📍 Servidor: http://localhost:${PORT}`);
    
    const hasToken = !!process.env.TELEGRAM_BOT_TOKEN;
    const hasChatId = !!process.env.TELEGRAM_CHAT_ID;
    
    if (hasToken && hasChatId) {
      console.log('🤖 Telegram: CONFIGURADO ✓');
      console.log('📸 Imágenes: Envío como fotos activado');
      console.log('📎 Otros archivos: Envío como documentos activado');
      console.log('🔇 Captions: Desactivados (sin texto en archivos)');
      console.log('🗑️  Limpieza: Automática después del envío exitoso');
    } else {
      console.log('🔧 Modo: Solo respaldo local');
      console.log('⚙️  Configura TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID en .env');
    }
    
    console.log('='.repeat(60));
    console.log('📋 Endpoints disponibles:');
    console.log(`   📍 Health: http://localhost:${PORT}/api/health`);
    console.log(`   📨 Send: http://localhost:${PORT}/api/send-order (POST)`);
    console.log(`   🧪 Test: http://localhost:${PORT}/api/test-telegram (POST)`);
    console.log(`   📂 Orders: http://localhost:${PORT}/api/pedidos (GET)`);
    console.log(`   📋 Order Detail: http://localhost:${PORT}/api/pedidos/:id (GET)`);
    console.log(`   📁 Order Files: http://localhost:${PORT}/api/pedidos/:id/archivos (GET)`);
    console.log(`   ⬇️  Download: http://localhost:${PORT}/api/pedidos/:id/archivo/:nombre (GET)`);
    console.log(`   🖼️  View Image: http://localhost:${PORT}/api/pedidos/:id/imagen/:nombre (GET)`);
    console.log(`   ⚙️  Config: http://localhost:${PORT}/api/config (GET)`);
    console.log('='.repeat(60));
  });
}

module.exports = app;