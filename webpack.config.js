const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path'); //路径管理模块,使用它可以高效获取项目路径,避免路径错误.

console.log(path);

/**
 * 在这个对象中配置webpack的运行参数
 */
var config = {
    mode:'development',
    module:{
        // 可以再module下的rules数组中规定loader配置
        rules:[
            {
                // 匹配文件类型
                test:/\.js$/,
                // 使用规则
                use:[
                    'test-loader',
                    'test2-loader',
                    {
                        loader:'test3-loader',
                        options:{
                            name: "Jack"
                        }
                    },
                    {
                        loader:'Babel-Loader',
                        options:{
                            presets:[
                                '@babel/preset-env'
                            ]
                        }
                    }
                ],
            }
        ]
    },
    resolveLoader:{
        modules: [
            'node_modules',
            'loaders'
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'src/index.html'),
            filename:'index.html'
        })
    ],
}

/**
 * 向外暴露配置webpack的对象
 */
module.exports = config;