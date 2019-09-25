const vfilter = {
    cutStrByLength: function (value, length) {
        value = value.substr(0, length);
        return value
    },
    toFixed: function () {

    },
    sex: function (str) {
        if (str == '2') {
            console.log(str)
            return '女'
        } else if (str == '1') {
            return '男'
        }
    }
}

export default vfilter
