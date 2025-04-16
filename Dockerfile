# Usa a imagem oficial do Nginx com Alpine para leveza
FROM nginx:alpine

# Define o diretório de trabalho
WORKDIR /usr/share/nginx/html

# Copia todos os arquivos do projeto para o diretório do Nginx
COPY . .

# Expõe a porta 80 para acesso ao servidor web
EXPOSE 80