exports.objToQs = function (obj) {
    var qs = [];
    for (var key in obj) {
        qs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return qs.join('&');
};

exports.extend = function (dest, source) {
    if(!source){ return dest; }

    for(var key in source){
        if(source.hasOwnProperty(key)){
            dest[key] = source[key];
        }
    }

    return dest;
}