# 🔍 Sistema de Debugging de Autenticación

## 📋 Descripción
Este documento describe el sistema de debugging implementado para resolver los problemas de autenticación donde `name` y `token` estaban dando `NULL`.

## 🚨 Problemas Identificados y Corregidos

### 1. **Inconsistencia en manejo de respuestas**
- ❌ **Antes**: `loginUser` retornaba `{success, message}` pero el componente usaba try/catch
- ✅ **Después**: `loginUser` siempre retorna objeto consistente, componente verifica `response.success`

### 2. **Falta de logging detallado**
- ❌ **Antes**: No había console.logs para debugging
- ✅ **Después**: Logging detallado en todos los puntos críticos del flujo

### 3. **Interceptors no funcionando correctamente**
- ❌ **Antes**: Token no se enviaba en peticiones subsecuentes
- ✅ **Después**: Logging detallado en interceptors, timeout configurado, mejor manejo de errores

### 4. **Estado de Redux no persistía**
- ❌ **Antes**: Usuario perdía sesión al recargar
- ✅ **Después**: Middleware de debugging, verificación de hidratación, logging de persist

## 🛠️ Herramientas de Debugging Implementadas

### 1. **Componente AuthDebugger**
- Ubicación: `components/AuthDebugger.tsx`
- Solo visible en development
- Muestra estado actual: `isAuthenticated`, `name`, `token`
- Botones para logging detallado

### 2. **Utilidades de Debug Centralizadas**
- Ubicación: `lib/utils/debug.ts`
- Funciones para verificar localStorage, sessionStorage
- Dump completo del estado de autenticación
- Logging categorizado por tipo

### 3. **Logging Detallado en Redux**
- Middleware personalizado para debugging
- Logging de todas las acciones de auth
- Verificación de cambios de estado

### 4. **Logging en API Service**
- Request interceptor con logging de token
- Response interceptor con logging de errores
- Timeout configurado (30 segundos)

## 🔍 Cómo Usar el Sistema de Debugging

### 1. **Ver Estado Actual**
El componente `AuthDebugger` se muestra automáticamente en la esquina inferior derecha en development.

### 2. **Logging Automático**
Los siguientes logs se generan automáticamente:

```
🔐 [LOGIN] Iniciando login con credenciales
🔐 [LOGIN] Respuesta de la API
🔐 [LOGIN] Datos extraídos
🔐 [LOGIN] Dispatching loginSuccess a Redux
🔄 [AUTH_SLICE] loginSuccess reducer llamado
🔄 [REDUX] Action dispatched
🔄 [REDUX] Auth state changed
💾 [REDUX-PERSIST] Store hidratado desde localStorage
```

### 3. **Verificar localStorage**
```javascript
// En la consola del navegador
localStorage.getItem('persist:auth')
```

### 4. **Dump Completo del Estado**
Usar el botón "Dump Completo" en el AuthDebugger o ejecutar:
```javascript
// En la consola del navegador
dumpAuthState()
```

## 🎯 Flujo de Autenticación Corregido

### 1. **Login**
```
Usuario envía credenciales → loginUser() → API → Verificación de datos → Dispatch a Redux → Persistencia
```

### 2. **Verificación de Estado**
```
Redux Store → Redux Persist → localStorage → Hidratación al recargar → Componentes actualizados
```

### 3. **Peticiones Autenticadas**
```
Interceptor de request → Obtiene token del store → Agrega Authorization header → Envía petición
```

## 🚀 Comandos de Debugging Útiles

### **Ver Estado de Redux**
```javascript
// En consola del navegador
console.log(store.getState().auth)
```

### **Ver localStorage**
```javascript
// En consola del navegador
JSON.parse(localStorage.getItem('persist:auth'))
```

### **Ver sessionStorage**
```javascript
// En consola del navegador
sessionStorage.getItem('redirectAfterLogin')
```

### **Ver Cookies**
```javascript
// En consola del navegador
document.cookie
```

## ⚠️ Notas Importantes

1. **Solo en Development**: El debugging solo está activo en `NODE_ENV === 'development'`
2. **Performance**: Los logs pueden afectar ligeramente el performance en development
3. **Sensibilidad**: Los logs incluyen información sensible (tokens parciales) - solo usar en development
4. **Persistencia**: Redux Persist se encarga automáticamente de localStorage

## 🔧 Troubleshooting Común

### **Problema**: Token sigue siendo NULL
**Solución**: Verificar logs de `[LOGIN]` y `[AUTH_SLICE]` para ver si el dispatch funciona

### **Problema**: Estado no persiste al recargar
**Solución**: Verificar logs de `[REDUX-PERSIST]` y localStorage

### **Problema**: Interceptors no funcionan
**Solución**: Verificar logs de `[API]` para ver si el token se obtiene del store

### **Problema**: Login exitoso pero no redirige
**Solución**: Verificar logs de `[FORM]` para ver si `response.success` es true

## 📝 Archivos Modificados

1. `service/auth/authService.tsx` - Logging y manejo consistente de errores
2. `components/LoginForm/form.tsx` - Manejo de respuesta como objeto
3. `service/api.ts` - Logging en interceptors y timeout
4. `store/store.ts` - Middleware de debugging y logging de persist
5. `hooks/useAuth.tsx` - Logging del estado
6. `store/slices/authSlice.ts` - Logging en reducers
7. `components/Navbar/index.tsx` - Logging del estado
8. `components/AuthDebugger.tsx` - Componente de debugging
9. `lib/utils/debug.ts` - Utilidades centralizadas de debug
10. `app/layout.tsx` - Integración del AuthDebugger

## 🎉 Resultado Esperado

Después de las correcciones:
- ✅ Login funciona y mantiene estado persistente
- ✅ Peticiones subsecuentes incluyen automáticamente el token
- ✅ Errores son específicos e informativos
- ✅ Estado persiste entre recargas de página
- ✅ Logout limpia completamente el estado
- ✅ Logging detallado para debugging
- ✅ Componente de debugging para monitoreo en tiempo real
