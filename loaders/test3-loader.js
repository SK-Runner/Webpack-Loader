// 获取options依赖的库
const loaderUtils = require('loader-utils');

// 验证options依赖的库
const schemaUtils = require('schema-utils');
// 导入验证规则
const schema = require('./schema.json')

module.exports = function(content, map, meta){
    console.log('我是test3-loader的主方法');
    console.log(meta);
    // 获取配置文件中的options
    let options = loaderUtils.getOptions(this);
    console.log('name',options.name);

    /**
     * 功能：验证配置的 options 是否合法,如果不合法，webpack则不会继续向下执行（之前的Loader已经被执行）
     * 参数：
     * schema:配置的验证json
     * options：配置项
     * Object：指定当前Loader名称，用于出错时显示该Loader名称
     */
    schemaUtils.validate(schema,options,{
        name:'test3-loader'
    })

    return content;
}
module.exports.pitch = function(){
    console.log('我是test3-loader的pitch方法');
}