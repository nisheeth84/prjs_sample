export ECS_INSTANCE_IP_ADDRESS=$(ifconfig | grep "inet 10." | awk '{print $2}')
echo $ECS_INSTANCE_IP_ADDRESS
ifconfig
sed -e 's/redismaster/'$REDIS_MASTER'/g' -i /etc/stunnel/redis-cli.conf
sed -e 's/redisslave/'$REDIS_SLAVE'/g' -i /etc/stunnel/redis-cli.conf
nohup stunnel /etc/stunnel/redis-cli.conf
if [ "$NEWRELIC_ENABLE" == "TRUE" ]; then
	java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom -javaagent:/newrelic/newrelic.jar -jar /app/*.jar	
else
        java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom  -jar /app/*.jar
fi