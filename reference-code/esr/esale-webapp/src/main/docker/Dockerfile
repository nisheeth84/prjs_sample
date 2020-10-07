FROM node:lts-alpine as build
WORKDIR /src
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN HUSKY_SKIP_INSTALL=1 npm install

COPY . .
RUN npm run webpack:prod:main

FROM amazonlinux:latest as final
ENV LOGSTASH_HOST=logstash.esale LOGSTASH_PORT=5000
RUN yum install -y httpd curl && yum -y update && yum update sqlite
COPY --from=build /src/target/classes/static/ /var/www/html/
COPY .htaccess /var/www/html/
COPY httpd.conf /etc/httpd/conf/
CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]