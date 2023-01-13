import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: './src/index.js',
  output: {
    dir: 'lib',
    format: 'cjs',
    entryFileNames: '[name].cjs',
    preserveModules: true,
    exports: 'auto'
  },
  plugins: [nodeResolve(), commonjs()]
}
