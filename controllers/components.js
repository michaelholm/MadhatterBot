

module.exports = function (req, res, next) {
	sendComponentsList(res);

  /**
   * Send a list of components when the user types /madhatter components
   * @param  {Object}   req   the request object
   * @param  {Object}   res   the response object
   */
  function sendComponentsList(res) {
    var components;

    fs.readdir('./assets/example_tmp/', function(err, files) {
      if (err) {
        send404(res);
      } else {
        files.forEach(function (file) {
            var name = file.replace(/\.[^/.]+$/, "") + '\n';
            if (name !== undefined && name !== 'undefined') {
              components += name;
            }
        });

        res.writeHead(200, {"Content-type" : "text/plain"});
        res.write(components);
        res.end();
      }
    });
  }
};


