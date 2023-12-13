// var path = require('path');
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  // plugins: [
  //   '@babel/plugin-proposal-export-namespace-from',
  //   [
  //     'module-resolver',
  //     {
  //       root: ['.'],
  //       resolvePath(sourcePath, currentFile, opts) {
  //         if (
  //           sourcePath === 'react-native' &&
  //           currentFile.includes('node_modules') &&
  //           currentFile.includes('react-native-gesture-handler') === false &&
  //           currentFile.includes('node_modules\\react-native\\') === false
  //         ) {
  //           return path.resolve(__dirname, 'resolver/react-native');
  //         }
  //         return undefined;
  //       },
  //     },
  //   ],
  // ],
};
