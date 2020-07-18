#!/usr/bin/env bash

docker images -a | grep -e "_auth" -e wordlists -e "_youtube" -e "_quizzes" |  awk '{print $3}' | uniq | xargs docker rmi -f
