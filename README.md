# 询盘云系统管理

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Run your end-to-end tests
```
yarn test:e2e
```

### Lints and fixes files
```
yarn lint
```
## 拿到模板需要修改的地方
1. index.html 挂载id
2. 因为子应用部署后需要追踪故 vue.config.js publicPath 为仓库名
3. output jsonpFunction 加上当前微应用在主应用注册的名字 驼峰首字母大写
4. devServer port 端口号
5. main MICRO_NAME 在主应用注册的微应用名字
6. render router 注册 的base 路径 mode为 history 可接受hash 需要在子应用自行解决
7. 挂载 id html 注册id
8. routes 
9. 路由守卫
