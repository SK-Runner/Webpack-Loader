import loaderUtils from 'loader-utils';

export default function normalizeFallback(fallback, originalOptions) {
    let loader = 'file-loader';
    let options = {};

    // 获取处理器名字（例如 'responsive-loader'）
    if (typeof fallback === 'string') {
        loader = fallback;

        const index = fallback.indexOf('?');

        if (index >= 0) {
            loader = fallback.substr(0, index);
            options = loaderUtils.parseQuery(fallback.substr(index));
        }
    }

    // 如果用户没有设置fallback，默认为 'file-loader'
    if (fallback !== null && typeof fallback === 'object') {
        ({
            loader,
            options
        } = fallback);
    }

    options = Object.assign({}, originalOptions, options);

    delete options.fallback;

    return {
        loader,
        options
    };
}