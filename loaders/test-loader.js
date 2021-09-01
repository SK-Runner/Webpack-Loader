module.exports = function(content, map, meta){
    // console.log('接受babel-loader传递的内容',content);
    return content;
}
module.exports.pitch = function(){
    console.log('我是test-loader的pitch方法');
}