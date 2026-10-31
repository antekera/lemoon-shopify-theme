# Playwright 1.63.0 Noble, linux/amd64 manifest; includes Chrome for Testing 153.0.8010.12.
FROM mcr.microsoft.com/playwright:v1.63.0-noble@sha256:bc6ab0d6d44ff4826e4cb8c1e6d801e185bfc42bb0753f8e2a30efc70db054c7
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 PUPPETEER_SKIP_DOWNLOAD=true CI=1 SHOPIFY_CLI_TTY=0 SHOPIFY_CLI_NO_ANALYTICS=1
WORKDIR /harness
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && npm cache clean --force
COPY . ./
ENTRYPOINT ["node", "/harness/run.cjs"]
