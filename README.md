> ## 项目架构

基于VUE3语言研发，基于Fc-admin脚手架开发的平台前端项目，备具登录与退出、权限管理、路由管理功能等功能，技术栈列表：

|    环境    |   版本    | 描述                                                               |
|:--------:|:-------:|:-----------------------------------------------------------------|
| Node.js  | 21.7.3  | 运行环境，MacOS可以用n进行多版本管理                                            |
|   npm    | 10.5.0  | Node.js包管理器                                                      |
|   VUE    |    3    | 开发语言                                                             |
| Fc-admin | 开源的最新版本 | Web脚手架框架，github、gitee都可以搜到，非常好用，推荐                               |

Fc-admin相关的技术栈：

|    技术栈     |   版本    | 描述                                                               |
|:----------:|:-------:|:-----------------------------------------------------------------|
| Element-UI |  2.7.5  | Vue桌面端UI组件库（https://element.eleme.io/2.3/#/zh-CN/component/tree） |
| vue-router |  4.3.2  | 路由管理                                                             |
|   axios    |  1.6.8  | HTTP请求                                                           |
|    vite    |  5.2.11  | 构建工具                                                             |
|    pinia    |  2.1.7  | 状态管理                                                             |

Fc-admin项目请参考开源项目：https://github.com/lfcleo/fc-admin

> ## 运维

### 开发环境搭建
- 电脑一台，Windows、MacOS都可以
- 安装Node.js开发环境，官网：https://nodejs.org/zh-cn，根据开发环境进行不同版本的安装，本项目推荐21.7.3 
- npm install
- npm run dev：根据package.json中的scripts配置，启动项目

### 打包
- npm run build:dev

### 配置说明
- package.json：项目信息、包管理等配置
- .env：环境变量配置
  - .env.development：开发环境变量配置
  - .env.production：生产环境变量配置
- vite.config.ts：Vite配置文件
- tsconfig.json：TypeScript配置文件


> ## 开发特定点

### 1、标准化API请求  
- fetchTableData：Table数据请求API方法，用于fcTable封装组件的数据初始化获取
- reFetchTableData：Table数据刷新API方法，isReloadwei是否重新加载数据，默认为False

### 2、个性化组件
- fcBatchDelete：批量删除数据
- fcBatchDownload：批量下载数据

### 3、图标拓展
#### 3.1、新增
扩展了Element Plus图标库，在@/assets/icons中新增SVG图标组件，需要在@/assets/icons/index.js中引入。
```vue
<template>
    复制SVG代码，直接进行粘贴
</template>
```
注意点：需要去掉width="32" height="32"属性，使用默认大小。  
阿里矢量图标库：https://www.iconfont.cn/   
#### 3.2、使用
```vue
import { UploadPlus } from "@/assets/icons/index.ts";

<el-icon>
  <UploadPlus />
</el-icon>
```


> ## 自制组件

### 1、批量删除

### 2、文件下载

### 3、文件上传


> ## 联系方式

* ***Github:*** https://github.com/GIS90
* ***Email:*** gaoming971366@163.com
* ***Blog:*** http://pygo.space
* ***OPENTOOL-Z:*** http://2l.pygo.space
* ***WeChat:*** PyGo90


Enjoy the good life every day！！！




