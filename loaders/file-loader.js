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
    // 生成输出路径
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

    if (options.outputPath) {
        if (typeof options.outputPath === 'function') {
            outputPath = options.outputPath(url, this.resourcePath, context);
        } else {
            outputPath = path.posix.join(options.outputPath, url);
        }
    }

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

    const esModule =
        typeof options.esModule !== 'undefined' ? options.esModule : true;

    return `${esModule ? 'export default' : 'module.exports ='} ${publicPath};`;
}

export const raw = true;