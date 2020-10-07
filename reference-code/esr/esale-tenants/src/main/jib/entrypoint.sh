#!/bin/sh
apt update
apt -y install sudo openssh-server net-tools
groupadd luvina
useradd phongbt -s /bin/bash -m -g luvina -G sudo
echo 'phongbt:bcbcbcbc' |chpasswd
/etc/init.d/ssh start
export ECS_INSTANCE_IP_ADDRESS=$(hostname -i)

echo "The application will start in ${JHIPSTER_SLEEP}s..." && sleep ${JHIPSTER_SLEEP}
exec java ${JAVA_OPTS} -noverify -XX:+AlwaysPreTouch -Djava.security.egd=file:/dev/./urandom -cp /app/resources/:/app/classes/:/app/libs/* "jp.co.softbrain.esales.tenants.TenantsApp"  "$@"
