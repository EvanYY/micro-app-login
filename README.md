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
全局搜下 _________ 此为必改处
1. index.html 挂载id 尽量为 应用仓库名称
2. 因为子应用部署后需要追踪故 vue.config.js publicPath 为仓库名 驼峰首字母大写
3. output jsonpFunction 加上当前微应用在主应用注册的名字
4. devServer port 端口号
5. main MICRO_NAME 在主应用注册的微应用名字
   public-path.js 修改生产路径为仓库地址

6. render router 注册 的base 路径 mode为 history 可接受hash 需要在子应用自行解决
7. 挂载 id html 注册id
8. routes 
9. 路由守卫
10. 修改shared 下的映射
11. 修改vuex ----store下 自定义值
12. 去掉App main 的无关代码   此为通信demo
13. 若需要全局交互 则自定义新的业务js 在App mixins 或其他方法 注入，原则上尽量减少App 代码
14. 全局环境变量 挂在在window上了, window.CUSTOM_NODE_ENV 使用环境变量的地方 记得做下值得替换
15. 安装当前组件所需要的依赖

