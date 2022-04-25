#!/bin/bash

# Espera o banco de dados inicializar
sleep 15s

yarn db:deploy

yarn start
