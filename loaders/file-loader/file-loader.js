import path from 'path';

import {
    getOptions,
    interpolateName
} from 'loader-utils';
import {
    validate
} from 'schema-utils';

import schema from './options.json';
import {
    normalizePath
} from './utils';

export default function loader(content) {
    const options = getOptions(this);

    //   验证参数
    validate(schema, options, {
        name: 'File Loader',
        baseDataPath: 'options',
    });

    // context参数：指定自定义文件上下文
    // this.rootContext webpack上下文
    const context = options.context || this.rootContext;
    // 指定导出文件的名字，默认是[hash值.文件类型]
    const name = options.name || '[contenthash].[ext]';
    // interpolateName 方法，用于生成对应的文件名
    const url = interpolateName(this, name, {
        context,
        content,
        /**
         * regExp属性：正则表达式用于匹配符合规则的文件
         * 例如：import img from './customer01/file.png';
         * regExp: /\/([a-z0-9]+)\/[a-z0-9]+\.png$/i
         */
        regExp: options.regExp,
    });
    let outputPath = url;
    // options.outputPath 用户可以指定输出路径
    if (options.outputPath) {
        if (typeof options.outputPath === 'function') {
            outputPath = options.outputPath(url, this.resourcePath, context);
        } else {
            outputPath = path.posix.join(options.outputPath, url);
        }
    }

    // options.publicPath 用户指定的发布目录
    let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;
    if (options.publicPath) {
        if (typeof options.publicPath === 'function') {
            publicPath = options.publicPath(url, this.resourcePath, context);
        } else {
            publicPath = `${
        options.publicPath.endsWith('/')
            ? options.publicPath
            : `${options.publicPath}/`
        }${url}`;
        }

        publicPath = JSON.stringify(publicPath);
    }

    if (options.postTransformPublicPath) {
        publicPath = options.postTransformPublicPath(publicPath);
    }

    // options.emitFile 设置为 false 后，除了图片不会被打包出来，其他都按正常的来。
    if (typeof options.emitFile === 'undefined' || options.emitFile) {
        const assetInfo = {};

        if (typeof name === 'string') {
            let normalizedName = name;

            const idx = normalizedName.indexOf('?');

            if (idx >= 0) {
                normalizedName = normalizedName.substr(0, idx);
            }

            const isImmutable = /\[([^:\]]+:)?(hash|contenthash)(:[^\]]+)?]/gi.test(
                normalizedName
            );

            if (isImmutable === true) {
                assetInfo.immutable = true;
            }
        }

        assetInfo.sourceFilename = normalizePath(
            path.relative(this.rootContext, this.resourcePath)
        );

        this.emitFile(outputPath, content, null, assetInfo);
    }

    // 文件是否以esModule形式引入（默认为是）
    const esModule =
        typeof options.esModule !== 'undefined' ? options.esModule : true;

    return `${esModule ? 'export default' : 'module.exports ='} ${publicPath};`;
}

// webpack 会对文件内容进行 UTF8 编码，当 loader 需要处理二进制数据时，需要设置 raw 为 true。此后，webpack 用使用 raw-loader 来加载所指定的文件，而不会对文件内容进行 UTF8 编码。
// Loader 模式 -> module.exports.raw = loader.raw;
export const raw = true;