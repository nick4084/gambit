#!/bin/bash
#this script simplify kill process to free up port
lsof -i tcp:3000

echo enter pid number to kill or  'wq'  to exit:

read pid

if [ $pid != "wq" ]
then
kill -9 $pid
fi