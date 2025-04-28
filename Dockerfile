FROM centos:7

RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-* && \
    sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*

RUN yum -y update && \
    yum -y install epel-release yum-utils && \
    yum -y install https://rpms.remirepo.net/enterprise/remi-release-7.rpm

RUN yum-config-manager --disable 'remi-php*' && \
    yum-config-manager --enable remi-php72 && \
    yum -y remove php* && \
    yum -y install httpd php php-cli php-mysqlnd php-pdo php-common php-xml php-mbstring php-json mod_security

RUN yum -y install python3-pip curl git sudo && \
    pip3 install supervisor

RUN yum -y install mod_proxy_html

RUN curl -o nodesource-release.rpm https://rpm.nodesource.com/pub_16.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm && \
    rpm -i nodesource-release.rpm && \
    yum -y install nodejs

RUN yum clean all

RUN sed -i 's|^short_open_tag = Off|short_open_tag = On|' /etc/php.ini
RUN sed -i 's|^;date.timezone =|date.timezone = Asia/Seoul|' /etc/php.ini
RUN sed -i 's|^DocumentRoot "/var/www/html"|DocumentRoot "/app"|' /etc/httpd/conf/httpd.conf
RUN sed -i 's|^AddDefaultCharset UTF-8|AddDefaultCharset EUC-KR|' /etc/httpd/conf/httpd.conf
RUN sed -i 's|^#ServerName www.example.com:80|ServerName sockettest:80|' /etc/httpd/conf/httpd.conf

RUN printf "ServerTokens Prod\n\
ServerSignature Off\n\
<IfModule security2_module>\n\
   SecRuleEngine on\n\
   SecServerSignature \" \"\n\
</IfModule>\n\
php_value default_charset \"EUC-KR\"\n\
<Directory \"/app\">\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>" >> /etc/httpd/conf/httpd.conf

COPY ./php.conf /etc/httpd/conf.d/php.conf
COPY ./supervisord.conf /etc/supervisord.conf
COPY ./proxy_node.conf /etc/httpd/conf.d/proxy_node.conf
COPY ./node_socket.service /etc/systemd/system/node_socket.service

WORKDIR /app
COPY ./node ./node
COPY ./ph ./ph

WORKDIR /app/node
RUN npm install

RUN chmod -R 755 /app && chown -R apache:apache /app

EXPOSE 80

ENV TZ=Asia/Seoul

CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]