module.exports = {
    plugins: [
        require("autoprefixer")({
            overrideBrowserslist: ["last 2 versions", ">1%"]
        })
    ]
}
//兼容浏览器的最近两个版本
//兼容市场占有率大于1%的浏览器（世界的）