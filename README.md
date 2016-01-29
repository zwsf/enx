## 基于webpack和koa的全栈js的脚手架工具

+ 基于webpack构建前端react redux rr等技术项目
+ 基于koa构建nodejs应用

## 模板
    enx-webserver-config.js -- 提供资源服务器
    enx-build-config.js -- 提供打包功能(默认打出amd包)

## enx功能
    enx init appname
        初始化项目

    enx start
        启动静态资源服务

    enx build
        1.构建最终html资源
        2.构建最终静态资源

    enx add /hello
        添加hello页
        自动生成相应的配置和业务文件

    enx 依赖webpack实现它所有的功能，但webpack需要配置，所以enx提供生成项目的脚手架功能，并生成相应的配置文件
