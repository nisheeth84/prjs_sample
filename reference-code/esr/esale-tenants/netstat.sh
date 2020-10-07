#!/bin/bash
for (( ; ; ))
do
   NUMBERCON=$(netstat -nat | wc -l)
   echo "So connection la : "  $NUMBERCON
   sleep 60
done