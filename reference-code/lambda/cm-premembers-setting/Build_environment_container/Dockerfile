FROM amazonlinux
MAINTAINER CM-Kajiwara
RUN yum -y groupinstall "Development Tools" && yum -y install openssl-devel jq && yum clean all
RUN curl -O https://www.python.org/ftp/python/3.6.1/Python-3.6.1.tgz 
RUN tar xzf Python-3.6.1.tgz
RUN cd Python-3.6.1 && ./configure &&  make && make altinstall && make clean
RUN curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py" && python3.6 get-pip.py && pip3.6 install awscli
RUN mkdir /node/
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash - && curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo && yum -y install nodejs yarn
COPY frontend-package.json ./package.json
RUN yarn install 
COPY backend-package.json ./package.json
RUN yarn install
