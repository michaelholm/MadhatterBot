var fs = require('fs');
var components = require('./controllers/components');

/**
 * Handle request
 * @param  {Object}   req   the request object
 * @param  {Object}   res   the response object
 * @param  {Function} next  continue processing
 */
module.exports = function (req, res, next) {
  var component = req.body.component;

  switch(component) {
    case '' :
      /**  
      *     /madhatter  
      **/
      base.sendBaseResponse(res, req);
      break;
    case 'help' :
      /**  
       *    /madhatter help
       */
      sendHelpResponse(res, req);
      break;
    case 'components' :
      /**
       *    /madhatter components
       */
      sendComponentsList(res);
      break;
    default:
      /**
       *    /madhatter [component name]
       */
      sendComponentReponse(res, req);
      break;
  }
};

/**
 * Send a basic response when user types only /madhatter
 * @param  {Object}   req   the request object
 * @param  {Object}   res   the response object
 */
exports.sendBaseResponse = function(res, req) {
  var userName = req.body.user_name;
  var msg = 'Hey there, ' + userName + '.\n\nYou can ask me about any component to learn formatting and standards. ';
  msg += 'For a list of components type: \'/madhatter components.\'';
  msg += '\nTo get the complete help contents type: \'/madhatter help.\'';

  res.writeHead(200, {"Content-type" : "text/plain"});
  res.write(msg);
  res.end();
}

/**
 * Send a help response when user types /madhatter help
 * @param  {Object}   req   the request object
 * @param  {Object}   res   the response object
 */
function sendHelpResponse(res, req) {
  var msg = 'You can ask me about any component to learn formatting and standards.';
  msg += '\nAsk by typing \'/madhatter [component-name]\'';
  msg += '\n\nFor example try typing \'/madhatter actionbutton\'';
  msg += '\n\n';
  msg += 'You can get the whole list of components by typing: \'/madhatter components\'';

  res.writeHead(200, {"Content-type" : "text/plain"});
  res.write(msg);
  res.end();
}

/**
 * Send a list of components when the user types /madhatter components
 * @param  {Object}   req   the request object
 * @param  {Object}   res   the response object
 */
function sendComponentsList(res) {
  var components = '';

  fs.readdir('./assets/example_tmp/', function(err, files) {
    if (err) {
      send404(res);
    } else {
      files.forEach(function (file) {
          var name = file.replace(/\.[^/.]+$/, "");
          if (name !== (undefined || 'undefined')) {
            components += '- ' + name + '\n';
          }
      });

      res.writeHead(200, {"Content-type" : "text/plain"});
      res.write(components);
      res.end();
    }
  });
}

/**
 * Send details for the specified component
 * @param  {Object}   req   the request object
 * @param  {Object}   res   the response object
 */
function sendComponentReponse(res, req) {
  var component = req.body.component;
  var filePath = './assets/example_tmp/' + component + ".html";
  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath, function(err, data) {
        if (err) {
          send404(res);
        } else {
          res.writeHead(200, {"Content-type" : "text/plain"});
          res.write("*" + component + "*");
          res.write("\n<a href='http://style-guide.morningstar.com/components/" + component + "'>" + "http://style-guide.morningstar.com/components/" + component + "</a>\n\n");
          res.write("```" + data.toString() + "```");
          res.end();
        }
      });
    } else {
      send404(res, filePath);
    }
  });
}

/**
 * Send a 404 error response
 * @param  {Object}   req   the request object
 * @param  {Object}   res   the response object
 */
function send404(res, notes) {
  notes = '\n\n' + notes || '';
  res.writeHead(404, {"Content-type" : "text/plain"});
  res.write("Error 404: resource not found." + notes);
  res.end();
}
