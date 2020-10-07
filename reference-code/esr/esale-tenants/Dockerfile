FROM amazoncorretto:11
ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    JAVA_OPTS="" \
    SPRING_PROFILES_ACTIVE=dev \
	NEW_RELIC_APP_NAME="MY_APP_NAME"
RUN yum -y update && \
    yum -y install net-tools stunnel && \
    mkdir /app && \
	mkdir /newrelic && \
	yum clean all && \
	rm -rf /var/cache/yum
COPY target/*.jar /app/
COPY redis-cli.conf /etc/stunnel/
ADD ./newrelic/* /newrelic/
ADD start.sh /
CMD bash /start.sh