exports.routes = function (map) {
    map.get('/my-own-projects', 'projects#whoami');
    map.get('/:user', 'projects#index');
    map.post('/:user/:repo/update.:format?', 'doc#update');
    map.get('/:user/:repo', 'doc#make');
    map.get('/:user/:repo/*', 'doc#make');
};

