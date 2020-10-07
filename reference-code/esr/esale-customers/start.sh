export ECS_INSTANCE_IP_ADDRESS=$(ifconfig | grep "inet 10." | awk '{print $2}')
export EUREKA_INSTANCE_IP_ADDRESS=$(ifconfig | grep "inet 10." | awk '{print $2}')
ifconfig
sed -e 's/redismaster/'$REDIS_MASTER'/g' -i /etc/stunnel/redis-cli.conf
sed -e 's/redisslave/'$REDIS_SLAVE'/g' -i /etc/stunnel/redis-cli.conf
sed -i -e s*"'<%= license_key %>'"*$NEWRELICLICENSE*g /newrelic/newrelic.yml
nohup stunnel /etc/stunnel/redis-cli.conf
java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom -javaagent:/newrelic/newrelic.jar -jar /app/*.jar