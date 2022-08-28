#!/bin/bash

home=$(pwd)
cd ./www

include_script_file="include_script.html"
files=$(find . -name "*.js" -type f)
replacements="[]"
for f in $files
do
  echo "Updating $f for modular static hosting"
  d=$(dirname "$f")
  name=$(echo $f | sed -e "s#$d/##g" | cut -d'.' -f1)

  # replace module.exports references
  sed -i 's/module.exports = function/export function/g' $f
  sed -i 's/module.exports./export /g' $f
  sed -i "s/export function (/export function $name (/" $f

  # prep require statements replacements
  

  # create include script tag
  echo "<script type=\"text/javascript\" src=\"$f\"></script>" >> $include_script_file

done

cd $home
