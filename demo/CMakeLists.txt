
        ##########    Copyright (C) 2015 Vincenzo Pacella
        ##      ##    Distributed under MIT license, see file LICENSE
        ##      ##    or <http://opensource.org/licenses/MIT>
        ##      ##
##########      ############################################################# shaduzlabs.com #######

project (nmws-demo)


# Source files ----------------------------------------------------------------------------------- #

set(
  src_SRCS
    main.cpp
)

# Demo client (html)

set( CLIENT_DIR "${PROJECT_BINARY_DIR}/client" )
configure_file (
  "index.html.in"
  "${CLIENT_DIR}/index.html"
)
file(COPY assets DESTINATION ${CLIENT_DIR})
file(COPY "${NMWS_ROOT_DIR}/js/nmws.min.js" DESTINATION "${CLIENT_DIR}/assets/js")

# Target configuration --------------------------------------------------------------------------- #

add_executable( ${PROJECT_NAME} ${src_SRCS} )

set_target_properties(
  ${PROJECT_NAME}
  PROPERTIES
    OUTPUT_NAME           ${PROJECT_NAME}
    OUTPUT_NAME_DEBUG     ${PROJECT_NAME}${DEBUG_SUFFIX}
)

target_link_libraries( ${PROJECT_NAME} PRIVATE nmws)
