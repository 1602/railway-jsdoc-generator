exports.routes = function (map) {
    map.get('/projects', 'projects#index');
    map.get('/:user/:repo/update', 'doc#update');
    map.get('/:user/:repo', 'doc#make');
    map.get('/:user/:repo/*', 'doc#make');
};
