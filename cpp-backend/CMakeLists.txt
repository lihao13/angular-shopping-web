cmake_minimum_required(VERSION 3.14)
project(angular_shopping_cpp_backend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  cpp-httplib
  GIT_REPOSITORY https://github.com/yhirose/cpp-httplib
  GIT_TAG        v0.14.1
)
FetchContent_MakeAvailable(cpp-httplib)

FetchContent_Declare(
  nlohmann_json
  GIT_REPOSITORY https://github.com/nlohmann/json
  GIT_TAG        v3.11.3
)
FetchContent_MakeAvailable(nlohmann_json)

add_executable(server src/main.cpp)
target_link_libraries(server PRIVATE cpp-httplib nlohmann_json)

# 编译选项
if(MSVC)
  target_compile_options(server PRIVATE /W4)
else()
  target_compile_options(server PRIVATE -Wall -Wextra -pedantic)
endif()
