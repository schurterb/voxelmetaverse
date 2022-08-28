#!/bin/bash

home=$(pwd)
cd www/js

files=$(find .)
for file in $files; do
  grep -raw "require(" $file > .tmp

  while read line; do
    line=$(echo $line | sed -e "s/\"/'/g")
    module_name=$( [[ "$line" =~ (require\(.*\)) ]] && echo ${BASH_REMATCH[1]} )
    module_name=$(echo "$module_name" | cut -d"'" -f2)

    function_name="$module_name"
    if [[ $function_name == *".js" ]]; then
      function_name=${function_name::-3}
    fi
    function_name=$(echo "$function_name" | sed -e "s/\./tmp/g")
    moddir=$(dirname $function_name)
    if [[ "$moddir" != "." ]]; then
      function_name=$(echo "$function_name" | sed -e "s#$moddir##g")
    fi
    function_name=$(echo "$function_name" | sed -e 's/-/_/g')
    if [[ $function_name == "./"* ]]; then
      function_name=${function_name:2}
    fi
    if [[ $function_name == "/"* ]]; then
      function_name=${function_name:1}
    fi
    echo "\"$module_name\": \"$function_name\","
  done < .tmp

done


# #### #### ####
#
# sed -i 's/: "/: /g' tmp.json
# sed -i 's/",/,/g' tmp.json
#
# #### #### ####
