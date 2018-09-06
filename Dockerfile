FROM ubuntu:18.04

# Install things with apt
RUN apt-get update && \
  apt-get -y --no-install-recommends install \
    ca-certificates \
    curl \
    less \
    python3 \
    python3-bs4 \
    python3-pip \
    python3-requests \
    python3-setuptools \
    vim \
    wget

# RUN set -e; \
#   pip3 install \
#     wheel \
#     bs4

ENV CF_CLI_VERSION "6.38.0"
ENV CF_AUTOPILOT_VERSION="0.0.7"

# RUN set -e; \
#   curl -L "https://cli.run.pivotal.io/stable?release=linux64-binary&version=${CF_CLI_VERSION}" | tar -zx -C /usr/local/bin; \
#   cf install-plugin https://github.com/contraband/autopilot/releases/download/${CF_AUTOPILOT_VERSION}/autopilot-linux -f
