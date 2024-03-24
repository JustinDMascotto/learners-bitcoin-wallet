# Overview

This is a proxy endpoint to accept http requests and to a tcp service (electrs). React does not have a library to perform TCP requests because its too low level so we will set up this lightweight proxy to handle TCP type requests.

## Getting Started

First time starting up the application after install
`npm init -y`
`npm i express`