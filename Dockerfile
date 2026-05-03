FROM nginx:alpine
RUN echo "<h1>Hello from railway_gh!</h1>" > /usr/share/nginx/html/index.html
EXPOSE 80
