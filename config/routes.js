exports.routes = function (map) {
    map.get('/:user/:repo', 'doc#make');
    map.get('/:user/:repo/*', 'doc#make');
};
