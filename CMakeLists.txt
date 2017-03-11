
        ##########    Copyright (C) 2017 Vincenzo Pacella
        ##      ##    Distributed under MIT license, see file LICENSE
        ##      ##    or <http://opensource.org/licenses/MIT>
        ##      ##
##########      ############################################################# shaduzlabs.com #######

cmake_minimum_required (VERSION 3.0.0)

project (nmws)

set (CMAKE_CXX_STANDARD 11)

set(NMWS_ROOT_DIR ${CMAKE_CURRENT_LIST_DIR})
set(NMWS_BUILD_DIR ${CMAKE_BINARY_DIR})
set(NMWS_MODULES_DIR ${CMAKE_CURRENT_LIST_DIR}/modules)

if(${CMAKE_PROJECT_NAME} STREQUAL ${PROJECT_NAME})
  set(IS_NMWS ON)
else()
  set(IS_NMWS OFF)
endif()

list(APPEND CMAKE_MODULE_PATH "${NMWS_ROOT_DIR}/cmake")

set(DEBUG_SUFFIX "_d")


# Version ---------------------------------------------------------------------------------------- #

string(TIMESTAMP NMWS_BUILD_DATE "%Y-%m-%d")

set (NMWS_VERSION_MAJOR 0)
set (NMWS_VERSION_MINOR 0)
set (NMWS_VERSION_MICRO 1)
set (NMWS_VERSION_STRING "${NMWS_VERSION_MAJOR}.${NMWS_VERSION_MINOR}.${NMWS_VERSION_MICRO}")

if($ENV{APPVEYOR})
  set (NMWS_BUILD_HOST "Appveyor")
  set (NMWS_BUILD_NUMBER ".$ENV{APPVEYOR_BUILD_NUMBER}")
  set (NMWS_GIT_BRANCH $ENV{APPVEYOR_REPO_BRANCH})
  execute_process(COMMAND appveyor UpdateBuild -Version ${NMWS_VERSION_STRING})
elseif($ENV{TRAVIS})
  set (NMWS_BUILD_HOST "Travis-CI")
  set (NMWS_BUILD_NUMBER ".$ENV{TRAVIS_BUILD_NUMBER}")
  set (NMWS_GIT_BRANCH $ENV{TRAVIS_BRANCH})
else()
  set (NMWS_BUILD_HOST "a local machine")
  set (NMWS_BUILD_NUMBER "")
  execute_process(
    COMMAND git rev-parse --abbrev-ref HEAD
    WORKING_DIRECTORY ${NMWS_ROOT_DIR}
    OUTPUT_VARIABLE NMWS_GIT_BRANCH
    OUTPUT_STRIP_TRAILING_WHITESPACE
  )
endif()

if(${NMWS_GIT_BRANCH} STREQUAL "master")
  set(NMWS_BUILD_TYPE "release version")
  set (NMWS_VERSION_STRING "${NMWS_VERSION_STRING}${NMWS_BUILD_NUMBER}")
elseif(${NMWS_GIT_BRANCH} STREQUAL "develop")
  set(NMWS_BUILD_TYPE "development version")
  set (NMWS_VERSION_STRING "${NMWS_VERSION_STRING}${NMWS_BUILD_NUMBER}-dev")
else()
  set(NMWS_BUILD_TYPE "development version from feature branch: ${GIT_BRANCH}")
  set (NMWS_VERSION_STRING "${NMWS_VERSION_STRING}${NMWS_BUILD_NUMBER}-fb")
endif()

configure_file (
  "${NMWS_ROOT_DIR}/support/config.h.in"
  "${PROJECT_BINARY_DIR}/config.h"
)

if($ENV{APPVEYOR})
  execute_process(COMMAND appveyor UpdateBuild -Version ${NMWS_VERSION_STRING})
  set(ENV{APPVEYOR_BUILD_VERSION} "${NMWS_VERSION_STRING}")
elseif($ENV{TRAVIS})
  set(NMWS_DEPLOY_TARGET $ENV{NMWS_DEPLOY_TARGET})
  if(NMWS_DEPLOY_TARGET)
    message("Package ${NMWS_DEPLOY_TARGET} will be deployed")
    configure_file (
      "${NMWS_ROOT_DIR}/support/travis/deploy-bintray.json.in"
      "${PROJECT_BINARY_DIR}/deploy-bintray.json"
    )
  endif()

  set(COVERAGE_BUILD $ENV{COVERAGE_BUILD})
  if(COVERAGE_BUILD)
    set(COVERALLS ${COVERAGE_BUILD})
  endif()
endif()

set(NMWS_BUILD_DESCRIPTION "nmws v. ${NMWS_VERSION_STRING} - ${NMWS_BUILD_TYPE} built on ${NMWS_BUILD_HOST}")

if(${IS_NMWS})
  MESSAGE( "${BoldYellow}NMWS${ColourReset}")
  MESSAGE( "v. ${NMWS_VERSION_STRING}")
endif()
message( "[${NMWS_BUILD_DATE}] ${NMWS_BUILD_DESCRIPTION} ")

# Dependencies ----------------------------------------------------------------------------------- #

find_package(nanomsg REQUIRED)


# Includes --------------------------------------------------------------------------------------- #

include_directories("${PROJECT_BINARY_DIR}")


# Target configuration --------------------------------------------------------------------------- #

add_library(nmws INTERFACE )
target_link_libraries( nmws INTERFACE ${NANOMSG_LIBRARIES})
target_include_directories( nmws INTERFACE inc ${NANOMSG_INCLUDE_DIRS})

if(${IS_NMWS})
  add_subdirectory(demo)
endif()
