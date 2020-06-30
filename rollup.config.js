import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import svg from 'rollup-plugin-svg';
import { string } from 'rollup-plugin-string';
import image from 'rollup-plugin-img';
import cleanup from 'rollup-plugin-cleanup';

export default {
  input: './src/weather_widget.js',
  output: {
    file: process.env.NODE_ENV === 'production' ? './dist/weather_widget.min.js' : './work/scripts/weather_widget.js',
    format: 'iife'
  },
  plugins: [
    string({ include: '**/*.css' }),
    image({
      limit: 10000
    }),
    commonJS(),
    resolve(),
    svg(),
    process.env.NODE_ENV === 'production' &&
      terser({
        mangle: {
          module: true
        }
      }),
    process.env.NODE_ENV === 'production' && cleanup({ comments: 'none' })
  ]
};
