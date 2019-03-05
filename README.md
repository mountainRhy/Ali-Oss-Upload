# 阿里云OSS上传文件(VUE)

本组件是专供阿里云OSS上传文件时使用，现在很多后端业务减少了这种请求第三方的转发形式，都是由前端直接请求，所以封装了一下阿里云OSS上传的组件，但是由于前端的安全问题，还是会由后端来进行id和secret的保存，通过访问后端接口的方式来取得一个有时间限制的签名来访问阿里云OSS来进行存储。


### 技术栈

- vue
- axios


### 开发步骤

1. **组件使用**

   -拉取github上的代码

   git clone https://github.com/mountainRhy/Ali-Oss-Upload.git

   -将组件引入至项目对应位置即可

   使用组件时注意将组件传参对应上。


2. **组件扩展**
   
   -组件还可支持slot扩展。可以将项目中回显的部分通过template来加入，以便应对更多的回显情况。

   


------

mountainRhy

Email：mountain_rhy@outlook.com

Date: 2019.03.05