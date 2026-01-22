// 包装 react-use 以支持 CommonJS 模块的命名导出
const reactUse = require('react-use');

// 导出命名导出
module.exports = reactUse;
module.exports.useLocalStorage = reactUse.useLocalStorage;
module.exports.useWindowSize = reactUse.useWindowSize;
