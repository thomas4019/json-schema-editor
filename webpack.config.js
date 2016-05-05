module.exports = {
    entry: './src/index.jsx',
    output: {
        path: 'dist',
        filename: 'jsonschemaeditor.js',
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: "babel",
            query: {
                presets: ['es2015', 'react']
            }
        }, ],
    }
};