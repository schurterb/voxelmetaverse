#!/bin/bash

home=$(pwd)
cd www
rm -f js/*

re='^[0-9]+$'
counter=0
filename="js/$counter.js"
module_names="["

output=""
name="0"
new_file=1
marker_set=0
file=builtgame.js
while read line; do

  # line=$(echo "$line" | sed -e 's#//#////#g' | tr -d '[:space:]')
  line=$(echo "$line" | sed -e 's#\\#\\\\#g')
  marker3='},{'
  if [[ $line == *"function(require,"* ]] || [[ $line == *":["* ]] || [[ $line == *"$marker3"* ]]; then
    line=$(echo "$line" | tr -d '[:space:]')
    output="$output$line"
  else
    output="$output\n$line"
  fi

  if [[ $output == *":[function(require,"* ]]; then
    counter=$(($counter +1))

    # "escape" existing hashtags
    output=$(echo "$output" | sed -e 's/#/<hashtag>/g')

    output=$(echo "$output" | sed -e 's/:\[function(require,/#:\[function(require,/g')
    #separate out new function beginning
    content=$(echo "$output" | cut -d'#' -f1)
    newfunc=$(echo "$output" | cut -d'#' -f2)
    newfunc=${newfunc:2}

    #separate out new function number
    content=$(echo "$content" | sed -e 's/}\],/}\],#/g')
    name=$(echo "$content" | cut -d'#' -f2)
    re='^[0-9]+$'
    if ! [[ $name =~ $re ]] ; then
      name=$counter
    else if [[ $name == *"./" ]] ; then
      name=$counter
    fi; fi
    content=$(echo "$content" | cut -d'#' -f1)
    content=${content::-2}

    #separate out import links
    if [[ $content == *"$marker3"* ]]; then
      content=$(echo "$content" | sed -e 's/},{/},#{/g')
      module_names="$module_names,$(echo "$content" | cut -d'#' -f2)"
      module_names=$(echo -e "$module_names" | tr -d '[:space:]' | tr -d '\\' | tr -d ']' | sed -e 's/,,/,/g')
      content=$(echo "$content" | cut -d'#' -f1)
      content=${content::-1}
    fi

    # "unescape" existing hashtags
    output=$(echo "$output" | sed -e 's/<hashtag>/#/g')
    # escape escape chars for printing
    output=$(echo "$output" | sed -e 's#\\#\\\\#g')

    echo "Creating $filename"
    echo -e "$content" > $filename # create current file
    js-beautify -r $filename # beautify current file

    #Start the new file
    filename="js/$name.js"
    output=$(echo "$newfunc" | sed -e "s/function(require,/function $name (require,/g")
    echo "Loading data for $filename"
    # if [[ $counter -gt 2 ]]; then
    #   break
    # fi
  fi
done < $file

module_names="$module_names,{}]"
module_names=$(echo $module_names | sed -e 's/\[,{/\[{/g' | sed -e 's/}}/}/g')
echo "$module_names" > .module_names.json
# module_names=$(cat .module_names.json | jq -c 'add | to_entries')
module_names=$(cat .module_names.json | jq -c 'map(to_entries) | flatten')
echo "c module names :: "$module_names
num_modules=$(echo "$module_names" | jq 'length - 1')

for x in $(seq 0 $num_modules); do
  value=$(echo "$module_names" | jq -r ".[$x].value")
  key=$(echo "$module_names" | jq -r ".[$x].key")
  src="js/$value.js"

  if [[ -f $src ]]; then
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

    sed -i "s/function $value (require,/function $name (require,/g" $src
    sed -i "s/function $value(require,/function $name (require,/g" $src

    mkdir -p $(dirname $dest)
    echo "mv -f $src $dest"
    mv -f $src $dest
  fi
done

# create index.html
files=$(find js)
cat index-prefix.txt > index.html
for file in $files; do
  echo "  <script type=\"text/javascript\" src=\"./$file\"></script>" >> index.html
done
cat index-postfix.txt >> index.html

# fix require function
cd js
echo "" > table.json
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
      moddir=$(echo -e "$moddir" | tr -d '[:space:]')
      function_name=$(echo "$function_name" | sed -e "s#$moddir##g")
    fi
    function_name=$(echo "$function_name" | sed -e 's/-/_/g')
    if [[ $function_name == "./"* ]]; then
      function_name=${function_name:2}
    fi
    if [[ $function_name == "/"* ]]; then
      function_name=${function_name:1}
    fi
    echo "\"$module_name\": \"$function_name\"," >> table.json
  done < .tmp

done

cd $home

# #### #### ####
#
# voxel_hello_world(require, module, exports) ->
#
# var createGame = require('voxel-hello-world') -> voxel_hello_world(null, module_object, exports_object); var createGame = module_object.exports;
#
#
# #### #### ####
