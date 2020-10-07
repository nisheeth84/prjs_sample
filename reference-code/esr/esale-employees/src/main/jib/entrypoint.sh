#!/bin/sh

export ECS_INSTANCE_IP_ADDRESS=$(hostname -i)

echo "The application will start in ${JHIPSTER_SLEEP}s..." && sleep ${JHIPSTER_SLEEP}
exec java ${JAVA_OPTS} -noverify -XX:+AlwaysPreTouch -Djava.security.egd=file:/dev/./urandom -cp /app/resources/:/app/classes/:/app/libs/* "jp.co.softbrain.esales.employees.EmployeesApp"  "$@"
