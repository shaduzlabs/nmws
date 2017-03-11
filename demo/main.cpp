/*
        ##########    Copyright (C) 2017 Vincenzo Pacella
        ##      ##    Distributed under MIT license, see file LICENSE
        ##      ##    or <http://opensource.org/licenses/MIT>
        ##      ##
##########      ############################################################# shaduzlabs.com #####*/

#include <nmws/WebSocketServer.hpp>

#include <iostream>

// -------------------------------------------------------------------------------------------------

using namespace sl;

// -------------------------------------------------------------------------------------------------

int main(int argc_, char* argv_[])
{
  using namespace std::placeholders;
  try
  {

    nmws::WebSocketServer s;

    std::cout << "nanomsg websocket wrapper" << std::endl;

    s.bind("ws://127.0.0.1:8888");

    s.setMessageCallback([&s](std::string message) {
      std::cout << "Received " << message.size() << " bytes: " << message << std::endl;
      s.send(message);
    });

    s.start();
    while (true)
    {
      std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }
  }
  catch (const nmws::Exception& e_)
  {
    std::cerr << "An error occurred: " << e_.what() << std::endl;
  }

  return 0;
}
