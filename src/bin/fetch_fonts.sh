#!/bin/bash -e

set -e

SRC=$(dirname $0)"/../../var/rss/"
FILE=$SRC"/"$1
TMP=$SRC"/tmp/"$1

echo "reading $FILE";
rm -rf $TMP
mkdir -p $TMP

x=0
echo "starting download process";
for i in $(cat $FILE | grep -v "#" | grep -v '^$'); do echo "downloading $TMP/$x"; wget -O $TMP"/"$x $i &> /dev/null & x=$(( $x+1 )); done;
