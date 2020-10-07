#!/bin/bash
export DNS_SERVER=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}' |  awk 'NR == 1')
if [ "$NEWRELIC_ENABLE" == "TRUE" ]; then
                sed -i '/start-newrelic/d'      /var/www/html/index.html
                sed -i '/end-newrelic/d' /var/www/html/index.html
else
        echo "Newrelic for webapp is disabled"
fi
		sed -e 's#ENDPOINT_ACTIVITIES#'$ENDPOINT_ACTIVITIES'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_ANALYSIS#'$ENDPOINT_ANALYSIS'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_BUSINESSCARDS#'$ENDPOINT_BUSINESSCARDS'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_CHATS#'$ENDPOINT_CHATS'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_COMMONS#'$ENDPOINT_COMMONS'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_CUSTOMERS#'$ENDPOINT_CUSTOMERS'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_EMPLOYEES#'$ENDPOINT_EMPLOYEES'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_EXTERNALS#'$ENDPOINT_EXTERNALS'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_MAILS#'$ENDPOINT_MAILS'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_TENANTS#'$ENDPOINT_TENANTS'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_OCRS#'$ENDPOINT_OCRS'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_PRODUCTS#'$ENDPOINT_PRODUCTS'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_SALES#'$ENDPOINT_SALES'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_SCHEDULES#'$ENDPOINT_SCHEDULES'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_TIMELINES#'$ENDPOINT_TIMELINES'#g' -i /etc/httpd/conf/httpd.conf
        sed -e 's#ENDPOINT_TUTORIALS#'$ENDPOINT_TUTORIALS'#g' -i /etc/httpd/conf/httpd.conf
/usr/sbin/httpd -D FOREGROUND
