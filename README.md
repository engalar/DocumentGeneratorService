```sh
docker run -p 3000:3000 -v ${PWD}:/app -w /app --rm -it ghcr.io/puppeteer/puppeteer:21 bash


docker run -p 3000:3000 --rm -it engalar/docgen
```

```sh
docker build -t engalar/docgen .
docker push engalar/docgen
```