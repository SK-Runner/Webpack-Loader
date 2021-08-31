module.exports = function(content, map, meta){
    console.log('我是test-loader的主方法');
    console.log('test接受meta:',meta.text);
    return content;
}
module.exports.pitch = function(){
    console.log('我是test-loader的pitch方法');
}