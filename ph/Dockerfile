FROM centos:8

RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
RUN sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*

RUN yum -y update && \
    yum -y install httpd php php-cli php-mysqlnd php-pdo php-common php-xml php-mbstring php-json && \
    yum -y install mod_security && \
    yum clean all

RUN sed -i 's|^LoadModule mpm_event_module modules/mod_mpm_event.so|#LoadModule mpm_event_module modules/mod_mpm_event.so|' /etc/httpd/conf.modules.d/00-mpm.conf
RUN sed -i 's|^#LoadModule mpm_prefork_module modules/mod_mpm_prefork.so|LoadModule mpm_prefork_module modules/mod_mpm_prefork.so|' /etc/httpd/conf.modules.d/00-mpm.conf

RUN sed -i 's|^short_open_tag = Off|short_open_tag = On|' /etc/php.ini
RUN sed -i 's|^;date.timezone =|date.timezone = Asia/Seoul|' /etc/php.ini

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

RUN sed -i 's|^DocumentRoot "/var/www/html"|DocumentRoot "/app|' /etc/httpd/conf/httpd.conf



COPY php.conf /etc/httpd/conf.d/php.conf

WORKDIR /app

COPY . .

RUN chmod -R 755 /app && \
    chown -R apache:apache /app

EXPOSE 80

ENV TZ=Asia/Seoul

CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]