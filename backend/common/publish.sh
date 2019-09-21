#!/bin/sh

echo ${NPM_REGISTRY}
npm-cli-login
npm publish --registry ${NPM_REGISTRY}