# 使用官方 Node 镜像作为基础镜像
FROM ghcr.io/puppeteer/puppeteer:21

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安装应用依赖
RUN npm install

# 复制应用代码到工作目录
COPY . .

# 执行清理操作
RUN npm cache clean --force \
    && npm prune --production \
    && rm -rf /tmp/* \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /root/.npm

# 暴露应用运行的端口（如果有需要）
EXPOSE 3000

# 启动应用
CMD [ "npm", "start" ]
