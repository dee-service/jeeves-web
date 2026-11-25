FROM nginx:1.27-alpine

COPY site/ /usr/share/nginx/html/
COPY docker/nginx.conf /etc/nginx/nginx.conf
