FROM amazonlinux:2
ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    JAVA_OPTS="" \
    SPRING_PROFILES_ACTIVE=prod
COPY adoptopenjdk.repo /etc/yum.repos.d/
RUN yum -y update && \
    yum -y install adoptopenjdk-11-hotspot-jre net-tools stunnel && \
    mkdir /app && \
	yum clean all && \
	rm -rf /var/cache/yum
COPY target/*.jar /app/
COPY redis-cli.conf /etc/stunnel/
ADD start.sh /
CMD bash /start.sh