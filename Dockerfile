# Usa a imagem oficial do Nginx como base
FROM nginx:alpine

# Copia todos os arquivos do projeto para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Expõe a porta 80 para acessar o servidor
EXPOSE 80