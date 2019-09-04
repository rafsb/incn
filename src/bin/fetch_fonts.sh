#!/bin/bash -e

set -e

SRC=$(pwd)"/../../var/rss/"
FILE=$SRC"/"$1
TMP=$SRC"/tmp/"$1

rm -rf $TMP
mkdir -p $TMP

x=0

for i in $(cat $FILE | grep -v "#" | grep -v '^$'); do wget -O $TMP"/"$x $i; x=$(( $x+1 )); done;