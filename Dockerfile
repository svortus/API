# Imagen de Node
FROM node:18

# Crear un directorio de trabajo
WORKDIR /app

# Copiar todos los archivos del repo
COPY . .

# Entrar a tu carpeta donde está tu API
WORKDIR /app/supabase_service_js

# Instalar dependencias
RUN npm install

# Exponer el puerto (Railway asigna PORT, pero esto ayuda localmente)
EXPOSE 3000

# Comando para iniciar la API
CMD ["node", "server.js"]
