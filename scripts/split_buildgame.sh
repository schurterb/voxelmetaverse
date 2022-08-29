#!/bin/bash

home=$(pwd)
cd www

re='^[0-9]+$'
counter=0
filename="js/$counter.js"
module_names="["

name="0"
new_file=1
marker_set=0
file=builtgame.js
while read line; do
  line=$(echo "$line" | sed -e 's#//#////#g')
  trimmed_line=$(echo "$line" | tr -d '[:space:]')

  if [[ $trimmed_line == *":[function("* ]]; then

  else

  fi

  if [[ $trimmed_line == *"//marker"* ]]; then
    if [[ $trimmed_line == "},"* ]]; then
      marker_set=1
      echo "}" >> $filename
    else if [[ $trimmed_line == "],"* ]]; then
      marker_set=0
    fi; fi;
  else if [[ $marker_set -eq 1 ]]; then
    module_names="$module_names$line,"
  else if [[ "$trimmed_line" == ":[" ]]; then
    counter=$(($counter + 1))
  else if [[ $trimmed_line =~ $re ]] ; then
    filename="js/$line.js"
    name="$line"
    new_file=1
    echo "Starting file $filename"
  else
    if [[ $new_file -eq 1 ]]; then
      new_file=0
      line=$(echo "$line" | sed -e "s/function(/function $name (/g")
    fi
    echo "$line" >> $filename
  fi; fi; fi; fi;
done < $file

module_names="$module_names{}]"
module_names=$(echo "$module_names" | jq -c 'add | to_entries')
echo "module names :: "$module_names""
num_modules=$(echo "$module_names" | jq 'length - 1')

for x in $(seq 0 $num_modules); do
  value=$(echo "$module_names" | jq -r ".[$x].value")
  key=$(echo "$module_names" | jq -r ".[$x].key")
  src="js/$value.js"
  dest="js/$key"
  destdir=$(dirname "$dest")
  name=$(echo "$dest" | sed -e "s#$destdir/##g")
  dest="js/$name"
  if [[ $dest == *"/" ]]; then
    dest=${dest::-1}
  fi
  if [[ $dest != *".js" ]]; then
    dest="$dest.js"
  else
    name=${name::-3}
  fi
  # replace - and . with _
  name=$(echo "$name" | sed -e 's/-/_/g')
  name=$(echo "$name" | sed -e 's/\./_/g')

  # echo "sed -i \"s/function $value (/function $name (/g\" $src"
  sed -i "s/function $value (/function $name (/g" $src

  mkdir -p $(dirname $dest)
  echo "mv -f $src $dest"
  mv -f $src $dest
done



#### #### ####

voxel_hello_world(require, module, exports) ->

var createGame = require('voxel-hello-world') -> voxel_hello_world(null, module_object, exports_object); var createGame = module_object.exports;


#### #### ####
