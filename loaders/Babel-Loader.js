// const loaderUtils = require('loader-utils');
// const schemaUtils = require('schema-utils');
// const babel = require('@babel-core');
// const util = require('util');

// const babelValid = require('./babel-loader.json');

// // babel.transform 的作用：编译代码为普通异步方法
// // util.promisify 的作用：将普通异步方法转化为基于 promise 的异步方法
// const transform = util.promisify(babel.transform);

// module.exports = function(content,map,meta){
//     const options = loaderUtils.getOptions(this) || {};
//     schemaUtils.validate(babelValid,options,{
//         name:'Babel Loader'
//     });
//     const callback = this.async();
//     transform(content,options)
//     .then((code,map)=>{
//         callback(null,code,map,meta)
//     })
//     .catch((e)=>{
//         callback(e)
//     })

// }
