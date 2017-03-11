/**
 * nmws.js Javascript websocket client
 * @version v0.0.1
 * @link https:
 * @license MIT
 **/

var nmws = {};

(function()
{
  function Client(ip, port)
  {
    this.initialize(ip, port);
  }

  Client.prototype = {
    initialize: function(ip_, port_)
    {
      var privateScope = {
        ip: ip_,
        port: port_,
        socket: null,
        connectionEventCallback: null,
        messageCallback: null,
        errorCallback: null
      };

      privateScope.socket = new WebSocket('ws://' + privateScope.ip + ':' + privateScope.port, [
        'pair.sp.nanomsg.org'
      ]);

      privateScope.socket.onmessage = function(event_)
      {
        var reader = new FileReader();
        reader.onload = function()
        {
          if (privateScope.messageCallback)
          {
            privateScope.messageCallback(reader.result);
          }
        }
        reader.readAsText(event_.data);
      }

      privateScope.socket.onopen = function()
      {
        if (privateScope.connectionEventCallback)
        {
          privateScope.connectionEventCallback(true);
        }
      }

      privateScope.socket.onclose = function(event_)
      {
        var reason;
        // See http://tools.ietf.org/html/rfc6455#section-7.4.1
        switch (event_.code)
        {
          case 1000:
            {
              if (privateScope.connectionEventCallback)
              {
                privateScope.connectionEventCallback(true);
              }
              return; // no errors
            }
          case 1001:
            {
              reason =
              "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page";
              break;
            }
          case 1002:
            {
              reason = "An endpoint is terminating the connection due to a protocol error";
              break;
            }
          case 1003:
            {
              reason =
              "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message)";
              break;
            }
          case 1004:
            {
              reason = "Reserved. The specific meaning might be defined in the future";
              break;
            }
          case 1005:
            {
              reason = "No status code was actually present";
              break;
            }
          case 1006:
            {
              reason =
              "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
              break;
            }
          case 1007:
            {
              reason =
              "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message)";
              break;
            }
          case 1008:
            {
              reason =
              "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy";
              break;
            }
          case 1009:
            {
              reason =
              "An endpoint is terminating the connection because it has received a message that is too big for it to process";
              break;
            }
          case 1010:
            {
              reason =
              "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake.<br/>The extensions that are needed are: " +
              event_.reason;
              break;
            }
          case 1011:
            {
              reason =
              "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request";
              break;
            }
          case 1015:
            {
              reason =
              "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified)";
              break;
            }
          default:
            {
              reason = "Unknown reason";
              break;
            }
        }

        if (privateScope.errorCallback)
        {
          privateScope.errorCallback(event_.code, reason);
        }
      };

      this.onConnectionEvent = function(c)
      {
        privateScope.connectionEventCallback = c;
      }

      this.onMessage = function(c)
      {
        privateScope.messageCallback = c;
      }

      this.onError = function(c)
      {
        privateScope.errorCallback = c;
      }

      this.send = function(data_)
      {
        privateScope.socket.send(data_);
      }
    }
  }
  nmws.Client = Client;
}());
