#!/bin/bash
curl -H  "content-type: application/json" \
    -d '{"login":"lsimaocosta@gmail.com","password":"123","name":"lucas","country":"BR"}' http://localhost:3001/signup

curl -v -H  "content-type: application/json" -d '{"login":"lsimaocosta@gmail.com","password":"123"}' \
     http://localhost:3001/signin