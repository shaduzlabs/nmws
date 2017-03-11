var wsClient;

append = function(text)
{
  document.getElementById("events").insertAdjacentHTML('afterbegin', text);
}

currentTimestamp = function()
{
  var date = new Date();
  return '<div class="timestamp">' + date.toDateString() + " - " + date.toLocaleTimeString() +
    '</div>';
}

sendMessageToServer = function()
{
  var message = document.getElementById('message-to-server').value;
  if(message.length > 0)
  {
    wsClient.send(message);
  }
}

createSocket = function()
{
  wsClient = new nmws.Client("127.0.0.1", "8888");

  wsClient.onConnectionEvent(function(connected_)
  {
    var date = new Date();
    append('<div class="siimple-small siimple-alert siimple-alert--done">' + currentTimestamp() + (
      connected_ ? 'Connected' : 'Disconnected') + '</div>');
  });

  wsClient.onMessage(function(data_)
  {
    append('<div class="siimple-small siimple-alert siimple-alert--info">' + currentTimestamp() + data_ +
      '</div>');
  });

  wsClient.onError(function(errorCode_, errorDescription_)
  {
    append('<div class="siimple-small siimple-alert siimple-alert--error">' + currentTimestamp() +
      errorCode_ + ': ' + errorDescription_ + '</div>');
      setTimeout(function(){ createSocket(); }, 5000);
  })
}

window.onload = function()
{
  createSocket();
}
