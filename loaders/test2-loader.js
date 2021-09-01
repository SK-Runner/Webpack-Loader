// 同步Loader
// module.exports = function(content,map,meta){
//     console.log('test2-loader是同步Loader');
//     /**
//      * callback:返回同步Loader，可以替代return
//      * 参数：“错误信息”，“文件内容”，“可选值：map”，“可选值：meta”
//      */
//     this.callback(null,content)
// }
// 异步Loader
module.exports = function(content, map, meta){
    console.log('test2-loader是异步Loader，一秒后继续执行下一个loader');
    const callback = this.async();
    setTimeout(() => {
        // 省略了第三、四参数
        console.log("loader2 末尾");
        callback(null,content);
        
    }, 5000);
    return content;
}

module.exports.pitch = function(){
    console.log('我是test2-loader的pitch方法');
}