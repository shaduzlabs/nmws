/*
        ##########    Copyright (C) 2015 Vincenzo Pacella
        ##      ##    Distributed under MIT license, see file LICENSE
        ##      ##    or <http://opensource.org/licenses/MIT>
        ##      ##
##########      ############################################################# shaduzlabs.com #####*/

#pragma once

#include <nanomsg/nn.h>

#include <exception>

// -------------------------------------------------------------------------------------------------

namespace sl
{
namespace nmws
{

// -------------------------------------------------------------------------------------------------

class Exception : public std::exception
{
public:
  Exception() : m_error(nn_errno())
  {
  }

  virtual const char* what() const throw()
  {
    return nn_strerror(m_error);
  }

  int errorNumber() const
  {
    return m_error;
  }

private:
  int m_error;
};

// -------------------------------------------------------------------------------------------------

} // namespace nmws
} // namespace sl
