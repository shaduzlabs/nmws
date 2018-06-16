/*
        ##########    Copyright (C) 2017 Vincenzo Pacella
        ##      ##    Distributed under MIT license, see file LICENSE
        ##      ##    or <http://opensource.org/licenses/MIT>
        ##      ##
##########      ############################################################# shaduzlabs.com #####*/

#pragma once

#include <nmws/Exception.hpp>

#include <nanomsg/nn.h>
#include <nanomsg/pair.h>
#include <nanomsg/ws.h>

#include <assert.h>

#include <atomic>
#include <functional>
#include <mutex>
#include <string>
#include <thread>

// -------------------------------------------------------------------------------------------------

namespace sl
{
namespace nmws
{

// -------------------------------------------------------------------------------------------------

class WebSocketServer
{
public:
  using MessageCallback = std::function<void(std::string)>;

  WebSocketServer() : m_socket(nn_socket(AF_SP, NN_PAIR)), m_running(false)
  {
  }

  ~WebSocketServer()
  {
    nn_term();
    m_running.store(false);
    nn_close(m_socket);
    if (m_receiveThread.joinable())
    {
      m_receiveThread.join();
    }
  }

  WebSocketServer(const WebSocketServer&) = delete;
  WebSocketServer& operator=(const WebSocketServer&) = delete;

  WebSocketServer(WebSocketServer&&) = default;
  WebSocketServer& operator=(WebSocketServer&&) = default;

  int bind(const std::string& address_)
  {
    auto result = nn_bind(m_socket, address_.c_str());
    if (result < 0)
    {
      throw Exception();
    }
    return result;
  }

  inline void unbind(int id)
  {
    int result = nn_shutdown(m_socket, id);
    if (result < 0)
    {
      throw Exception();
    }
  }

  void start()
  {
    m_receiveThread = std::thread([this]() {
      m_running.store(true);
      while (receive())
      {
      }
    });
  }

  inline int send(const std::string& message_)
  {
    int result = -1;

    {
      std::lock_guard<std::mutex> lock(m_socketMutex);
      result = nn_send(m_socket, message_.c_str(), message_.size(), 0);
    }

    const auto nnError = nn_errno();
    if (nnError != ETERM && nnError != EBADF)
    {
      throw Exception();
    }
    return result;
  }

  void setMessageCallback(MessageCallback messageCallback_)
  {
    m_messageCallback = messageCallback_;
  }

private:
  bool receive() const
  {
    int result = -1;
    char* buffer = nullptr;

    {
      std::lock_guard<std::mutex> lock(m_socketMutex);
      result = nn_recv(m_socket, &buffer, NN_MSG, 0);
    }

    const auto nnError = nn_errno();
    if (result < 0)
    {
      if (nnError != ETERM && nnError != EBADF)
      {
        throw Exception();
      }
      return false;
    }

    if (m_messageCallback && buffer != nullptr)
    {
      m_messageCallback(std::string(buffer, result));
    }

    return true;
  }

  int m_socket;
  mutable std::mutex m_socketMutex;
  MessageCallback m_messageCallback;

  std::atomic_bool m_running;
  std::thread m_receiveThread;
};

// -------------------------------------------------------------------------------------------------

} // namespace nmws
} // namespace sl
