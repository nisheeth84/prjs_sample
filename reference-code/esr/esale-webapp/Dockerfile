FROM amazonlinux:latest
RUN \
	amazon-linux-extras install -y epel &&\
	yum -y install httpd  awscli iputils net-tools &&\
	yum -y update &&\
	yum clean all &&\
	rm -rf /var/cache/yum/*
COPY target/classes/static/ /var/www/html/
COPY config/htaccess /var/www/html/.htaccess
COPY config/httpd.conf /etc/httpd/conf/
COPY config/start.sh /
CMD bash /start.sh