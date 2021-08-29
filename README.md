# webpcack-loader

## 一、Loader

### 1、 loader使用

1.loader本质上就是一个导出内容为函数的JS模块。
2.loader默认就可以接收上游传递过来的资源文件或者结果
3.compiler会拿到最后一个loader的产出结果，这个结果应该是string或者buffer 

### 2、常用的Loader

（1）file-loader

file-loader 处理图片的时候是怎么做？
\- 返回一个字符串形式的图片名称（路径）
\- 资源拷贝一份到指定目录

###  3、loader分类

对于loader，默认都是一样的，只不过在使用的时候可以放在不同的位置或者进行了不同的修饰，因此说清起来loader就有分类了
（1） 普通loader：没有做任何的配置
（2）前置loader：enforce属性配置pre
（3）后置loader：enforce属性配置post
（4）行内loader：使用 ! 进行分割

同类Loader的加载顺序：由下向上，从右向左

不同类Loader加载顺序：pre > normal > inline > post

const title = require(‘!!inline-loader!./title')  双感叹号

 配置符号
\> 为了使用方便，可以通过一些符号来设置某些的开启和关闭
\- !跳过了normal loader
\- -!跳过了normal + pre loader
\- !!跳过了normal pre post (只保留了inline)

### 4、webpack 处理流程

从入口文件出发，找到所有依赖的模块，直到所有依赖模块也都被loader 处理之后返回结果

### 5、

## 二、自定义 loader

### 1、引入自定义loader 的两种方式：

```java
// 第一种：
module:{
    rules:[
        {
            // 匹配文件类型
            test:/\.js$/,
            // 使用loader
            loader: path.resolve(__dirname,'loaders','test-loader.js'),
        }
    ]
}
```

```javascript
// 第二种：
module:{
    // 可以再module下的rules数组中规定loader配置
    rules:[
        {
            // 匹配文件类型
            test:/\.js$/,
            // 使用loader
            loader: 'test-loader.js',
        }
    ]
},
resolveLoader:{
    // 同一配置loader目录，resolveLoader中默认配置了node_modules
    modules: [
        'node_modules',
        path.resolve(__dirname,'loaders')
    ]
},
```

### 2、loader 的执行顺序

只加载一个loader

```javascript
module:{
    rules:[
        {
            // 匹配文件类型
            test:/\.js$/,
            // 使用loader
            loader: 'test-loader',
        }
    ]
}
```

加载多个loader，涉及到loader的执行顺序

```javascript
module:{
    rules:[
        {
            // 匹配文件类型
            test:/\.js$/,
            // 使用loader
            use:[
                'test-loader',
                'test2-loader',
                'test3-loader',
            ],
        }
    ]
}
```

​	loader 向外暴露的主函数，加载顺序是由下往上；loader 还会暴露出一个 pitch 函数，其加载顺序是由上往下。因此如果希望某些 loader 提前做一下处理，可以将该部分放到 pitch 中

```javascript
//'test-loader','test2-loader','test3-loader',内容
module.exports = function(content, map, meta){
    console.log('我是test-loader的主方法');
    return content;
}
module.exports.pitch = function(){
    console.log('我是test-loader的pitch方法');
}
/** 打印结果：先加载pitch方法，再加载主方法
* 我是test-loader的pitch方法
* 我是test2-loader的pitch方法
* 我是test3-loader的pitch方法
* 我是test3-loader的主方法
* 我是test2-loader的主方法
* 我是test-loader的主方法
*/
```



### 3、 同步 Loader 和异步 Loader

同步Loader：

```javascript
// 同步Loader
module.exports = function(content,map,meta){
    console.log('test2-loader是同步Loader');
    /**
     * callback:返回同步Loader，可以替代return
     * 参数：“错误信息”，“文件内容”，“可选值：map”，“可选值：meta”
     */
    this.callback(null,content)
}
```

异步Loader（推荐）：

```javascript
module.exports = function(content, map, meta){
    console.log('test2-loader是异步Loader，一秒后继续执行下一个loader');
    const callback = this.async();
    setTimeout(() => {
        // 省略了第三、四参数
        callback(null,content);
    }, 1000);
}
```

### 4、获取和验证 Loader 的 options

​	获取 loader-utils

```javascript
// 1、获取options依赖的库
const loaderUtils = require('loader-utils');
module.exports = function(content, map, meta){
    console.log('我是test3-loader的主方法');

    // 2、获取配置文件中的options
    let options = loaderUtils.getOptions(this);
    console.log('name',options.name);

    return content;
}
```

​	验证 schema-utils

```javascript
// 1、添加验证options依赖的库
const schema = require('schema-utils');
// 2、导入验证规则
const schema = require('./schema.json')
```

```json
// 3、在loaders目录中添加配置文件 schema.json ：
{
    "type":"object", options的类型
    options 中属性配置
    "properties":{
    	配置属性 name
        "name":{
    		属性 name 的类型
            "type":"string",
    		属性 name 的字段描述
            "description":"名称"
        }
    },
	是否可以添加额外的属性（默认为true），如果为false，除了property中的属性，不允许添加其他属性
    "additionalProperties":true
}
```





