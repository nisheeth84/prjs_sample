create table vtpgw_account (id varchar(255) not null, createdBy varchar(255), email varchar(255), fullname varchar(255), password varchar(255), phone varchar(255), salt varchar(255), status integer, updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_app (id varchar(255) not null, appId varchar(255), contact varchar(255), createdBy varchar(255), status integer, token varchar(255), updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_contacts (id varchar(255) not null, address varchar(255), createdBy varchar(255), email varchar(255), fullname varchar(255), phone varchar(255), status integer, updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_log (id integer not null, appId varchar(255), executionTime datetime, nodeUrl varchar(255), requestContent varchar(255), responseContent varchar(255), responseTime integer, serviceName varchar(255), statusCode integer, primary key (id)) engine=InnoDB
create table vtpgw_nodes (id bigint not null auto_increment, createdBy varchar(255), createdDate datetime, updatedBy varchar(255), updatedDate datetime, checkUrl varchar(255), status integer, url varchar(255), serviceId varchar(255) not null, primary key (id)) engine=InnoDB
create table vtpgw_permission (id varchar(255) not null, activated bigint, appId varchar(255), capacity bigint, debug integer, ips varchar(255), methods varchar(255), noContent integer, period bigint, sandBox integer, serviceId varchar(255), updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_service (id bigint not null auto_increment, createdBy varchar(255), createdDate datetime, updatedBy varchar(255), updatedDate datetime, capacity bigint, connectTimeout bigint, contact varchar(255), description varchar(255), idleTimeout bigint, module varchar(255), name varchar(255), period bigint, reportInterval integer, sandboxEndpoint varchar(255), serviceId varchar(255), standardDuration bigint, status integer, primary key (id)) engine=InnoDB
alter table vtpgw_service add constraint UK_n9nq8vbgrvgwgh30kv27r2ldt unique (serviceId)
alter table vtpgw_nodes add constraint FK_serviceId foreign key (serviceId) references vtpgw_service (serviceId)
create table vtpgw_account (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, accountId varchar(255), email varchar(255), fullname varchar(255), password varchar(255), phone varchar(255), salt varchar(255), status integer, primary key (id)) engine=InnoDB
create table vtpgw_app (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, appId varchar(255), applicationId varchar(255), contact varchar(255), status integer, token varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_contacts (id varchar(255) not null, address varchar(255), createdBy varchar(255), email varchar(255), fullname varchar(255), phone varchar(255), status integer, updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_log (id integer not null, appId varchar(255), executionTime datetime, nodeUrl varchar(255), requestContent varchar(255), responseContent varchar(255), responseTime integer, serviceName varchar(255), statusCode integer, primary key (id)) engine=InnoDB
create table vtpgw_nodes (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, checkUrl varchar(255), status integer, url varchar(255), serviceId bigint not null, primary key (id)) engine=InnoDB
create table vtpgw_permission (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, activated bigint, appId varchar(255), capacity bigint, debug integer, ips varchar(255), methods varchar(255), noContent integer, period bigint, permissionId varchar(255), sandBox integer, serviceId varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_service (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, capacity bigint, connectTimeout bigint, contact varchar(255), description varchar(255), idleTimeout bigint, module varchar(255), name varchar(255), period bigint, reportInterval integer, sandboxEndpoint varchar(255), serviceId varchar(255), standardDuration bigint, status integer, primary key (id)) engine=InnoDB
alter table vtpgw_account add constraint UK_acc_accountId unique (accountId)
alter table vtpgw_account add constraint UK_acc_email unique (email)
alter table vtpgw_app add constraint UK_a_appId unique (appId)
alter table vtpgw_app add constraint UK_a_applicationId unique (applicationId)
alter table vtpgw_permission add constraint UK_p_appId-serviceId unique (appId, serviceId)
alter table vtpgw_permission add constraint UK_p_permissionId unique (permissionId)
alter table vtpgw_service add constraint UK_s_serviceId unique (serviceId)
alter table vtpgw_service add constraint UK_s_name unique (name)
alter table vtpgw_nodes add constraint FK_serviceId foreign key (serviceId) references vtpgw_service (id)
create table vtpgw_account (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, accountId varchar(255), email varchar(255), fullname varchar(255), password varchar(255), phone varchar(255), salt varchar(255), status integer, primary key (id)) engine=InnoDB
create table vtpgw_app (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, appId varchar(255), applicationId varchar(255), contact varchar(255), status integer, token varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_contacts (id varchar(255) not null, address varchar(255), createdBy varchar(255), email varchar(255), fullname varchar(255), phone varchar(255), status integer, updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_log (id integer not null, appId varchar(255), executionTime datetime, nodeUrl varchar(255), requestContent varchar(255), responseContent varchar(255), responseTime integer, serviceName varchar(255), statusCode integer, primary key (id)) engine=InnoDB
create table vtpgw_nodes (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, checkUrl varchar(255), status integer, url varchar(255), serviceId bigint not null, primary key (id)) engine=InnoDB
create table vtpgw_permission (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, activated bigint, appId varchar(255), capacity bigint, debug integer, ips varchar(255), methods varchar(255), noContent integer, period bigint, permissionId varchar(255), sandBox integer, serviceId varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_service (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, capacity bigint, connectTimeout bigint, contact varchar(255), description varchar(255), idleTimeout bigint, module varchar(255), name varchar(255), period bigint, reportInterval integer, sandboxEndpoint varchar(255), serviceId varchar(255), standardDuration bigint, status integer, primary key (id)) engine=InnoDB
alter table vtpgw_account add constraint UK_acc_accountId unique (accountId)
alter table vtpgw_account add constraint UK_acc_email unique (email)
alter table vtpgw_app add constraint UK_a_appId unique (appId)
alter table vtpgw_app add constraint UK_a_applicationId unique (applicationId)
alter table vtpgw_permission add constraint UK_p_appId-serviceId unique (appId, serviceId)
alter table vtpgw_permission add constraint UK_p_permissionId unique (permissionId)
alter table vtpgw_service add constraint UK_s_serviceId unique (serviceId)
alter table vtpgw_service add constraint UK_s_name unique (name)
alter table vtpgw_nodes add constraint FK_serviceId foreign key (serviceId) references vtpgw_service (id)
create table vtpgw_account (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, accountId varchar(255), email varchar(255), fullname varchar(255), password varchar(255), phone varchar(255), salt varchar(255), status integer, primary key (id)) engine=InnoDB
create table vtpgw_app (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, appId varchar(255), applicationId varchar(255), contact varchar(255), status integer, token varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_contacts (id varchar(255) not null, address varchar(255), createdBy varchar(255), email varchar(255), fullname varchar(255), phone varchar(255), status integer, updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_log (id integer not null, appId varchar(255), executionTime datetime, nodeUrl varchar(255), requestContent varchar(255), responseContent varchar(255), responseTime integer, serviceName varchar(255), statusCode integer, primary key (id)) engine=InnoDB
create table vtpgw_nodes (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, checkUrl varchar(255), status integer, url varchar(255), serviceId bigint not null, primary key (id)) engine=InnoDB
create table vtpgw_permission (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, activated bigint, appId varchar(255), capacity bigint, debug integer, ips varchar(255), methods varchar(255), noContent integer, period bigint, permissionId varchar(255), sandBox integer, serviceId varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_service (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, capacity bigint, connectTimeout bigint, contact varchar(255), description varchar(255), idleTimeout bigint, module varchar(255), name varchar(255), period bigint, reportInterval integer, sandboxEndpoint varchar(255), serviceId varchar(255), standardDuration bigint, status integer, primary key (id)) engine=InnoDB
alter table vtpgw_account add constraint UK_acc_accountId unique (accountId)
alter table vtpgw_account add constraint UK_acc_email unique (email)
alter table vtpgw_app add constraint UK_a_appId unique (appId)
alter table vtpgw_app add constraint UK_a_applicationId unique (applicationId)
alter table vtpgw_permission add constraint UK_p_appId-serviceId unique (appId, serviceId)
alter table vtpgw_permission add constraint UK_p_permissionId unique (permissionId)
alter table vtpgw_service add constraint UK_s_serviceId unique (serviceId)
alter table vtpgw_service add constraint UK_s_name unique (name)
alter table vtpgw_nodes add constraint FK_serviceId foreign key (serviceId) references vtpgw_service (id)
create table vtpgw_account (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, accountId varchar(255), email varchar(255), fullname varchar(255), password varchar(255), phone varchar(255), salt varchar(255), status integer, primary key (id)) engine=InnoDB
create table vtpgw_app (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, appId varchar(255), applicationId varchar(255), contact varchar(255), status integer, token varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_contacts (id varchar(255) not null, address varchar(255), createdBy varchar(255), email varchar(255), fullname varchar(255), phone varchar(255), status integer, updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_log (id integer not null, appId varchar(255), executionTime datetime, nodeUrl varchar(255), requestContent varchar(255), responseContent varchar(255), responseTime integer, serviceName varchar(255), statusCode integer, primary key (id)) engine=InnoDB
create table vtpgw_nodes (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, checkUrl varchar(255), status integer, url varchar(255), serviceId bigint not null, primary key (id)) engine=InnoDB
create table vtpgw_permission (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, activated bigint, appId varchar(255), capacity bigint, debug integer, ips varchar(255), methods varchar(255), noContent integer, period bigint, permissionId varchar(255), sandBox integer, serviceId varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_service (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, capacity bigint, connectTimeout bigint, contact varchar(255), description varchar(255), idleTimeout bigint, module varchar(255), name varchar(255), period bigint, reportInterval integer, sandboxEndpoint varchar(255), serviceId varchar(255), standardDuration bigint, status integer, primary key (id)) engine=InnoDB
alter table vtpgw_account add constraint UK_acc_accountId unique (accountId)
alter table vtpgw_account add constraint UK_acc_email unique (email)
alter table vtpgw_app add constraint UK_a_appId unique (appId)
alter table vtpgw_app add constraint UK_a_applicationId unique (applicationId)
alter table vtpgw_permission add constraint UK_p_appId-serviceId unique (appId, serviceId)
alter table vtpgw_permission add constraint UK_p_permissionId unique (permissionId)
alter table vtpgw_service add constraint UK_s_serviceId unique (serviceId)
alter table vtpgw_service add constraint UK_s_name unique (name)
alter table vtpgw_nodes add constraint FK_serviceId foreign key (serviceId) references vtpgw_service (id)
create table vtpgw_account (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, accountId varchar(255), email varchar(255), fullname varchar(255), password varchar(255), phone varchar(255), salt varchar(255), status integer, primary key (id)) engine=InnoDB
create table vtpgw_app (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, appId varchar(255), applicationId varchar(255), contact varchar(255), status integer, token varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_contacts (id varchar(255) not null, address varchar(255), createdBy varchar(255), email varchar(255), fullname varchar(255), phone varchar(255), status integer, updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_log (id integer not null, appId varchar(255), executionTime datetime, nodeUrl varchar(255), requestContent varchar(255), responseContent varchar(255), responseTime integer, serviceName varchar(255), statusCode integer, primary key (id)) engine=InnoDB
create table vtpgw_nodes (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, checkUrl varchar(255), status integer, url varchar(255), serviceId bigint not null, primary key (id)) engine=InnoDB
create table vtpgw_permission (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, activated bigint, appId varchar(255), capacity bigint, debug integer, ips varchar(255), methods varchar(255), noContent integer, period bigint, permissionId varchar(255), sandBox integer, serviceId varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_service (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, capacity bigint, connectTimeout bigint, contact varchar(255), description varchar(255), idleTimeout bigint, module varchar(255), name varchar(255), period bigint, reportInterval integer, sandboxEndpoint varchar(255), serviceId varchar(255), standardDuration bigint, status integer, primary key (id)) engine=InnoDB
alter table vtpgw_account add constraint UK_acc_accountId unique (accountId)
alter table vtpgw_account add constraint UK_acc_email unique (email)
alter table vtpgw_app add constraint UK_a_appId unique (appId)
alter table vtpgw_app add constraint UK_a_applicationId unique (applicationId)
alter table vtpgw_permission add constraint UK_p_appId-serviceId unique (appId, serviceId)
alter table vtpgw_permission add constraint UK_p_permissionId unique (permissionId)
alter table vtpgw_service add constraint UK_s_serviceId unique (serviceId)
alter table vtpgw_service add constraint UK_s_name unique (name)
alter table vtpgw_nodes add constraint FK_serviceId foreign key (serviceId) references vtpgw_service (id)
create table vtpgw_account (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, accountId varchar(255), email varchar(255), fullname varchar(255), password varchar(255), phone varchar(255), salt varchar(255), status integer, primary key (id)) engine=InnoDB
create table vtpgw_app (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, appId varchar(255), applicationId varchar(255), contact varchar(255), status integer, token varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_contacts (id varchar(255) not null, address varchar(255), createdBy varchar(255), email varchar(255), fullname varchar(255), phone varchar(255), status integer, updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_log (id integer not null, appId varchar(255), executionTime datetime, nodeUrl varchar(255), requestContent varchar(255), responseContent varchar(255), responseTime integer, serviceName varchar(255), statusCode integer, primary key (id)) engine=InnoDB
create table vtpgw_nodes (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, checkUrl varchar(255), status integer, url varchar(255), serviceId bigint not null, primary key (id)) engine=InnoDB
create table vtpgw_permission (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, activated bigint, appId varchar(255), capacity bigint, debug integer, ips varchar(255), methods varchar(255), noContent integer, period bigint, permissionId varchar(255), sandBox integer, serviceId varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_service (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, capacity bigint, connectTimeout bigint, contact varchar(255), description varchar(255), idleTimeout bigint, module varchar(255), name varchar(255), period bigint, reportInterval integer, sandboxEndpoint varchar(255), serviceId varchar(255), standardDuration bigint, status integer, primary key (id)) engine=InnoDB
alter table vtpgw_account add constraint UK_acc_accountId unique (accountId)
alter table vtpgw_account add constraint UK_acc_email unique (email)
alter table vtpgw_app add constraint UK_a_appId unique (appId)
alter table vtpgw_app add constraint UK_a_applicationId unique (applicationId)
alter table vtpgw_permission add constraint UK_p_appId-serviceId unique (appId, serviceId)
alter table vtpgw_permission add constraint UK_p_permissionId unique (permissionId)
alter table vtpgw_service add constraint UK_s_serviceId unique (serviceId)
alter table vtpgw_service add constraint UK_s_name unique (name)
alter table vtpgw_nodes add constraint FK_serviceId foreign key (serviceId) references vtpgw_service (id)
create table vtpgw_account (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, accountId varchar(255), email varchar(255), fullname varchar(255), password varchar(255), phone varchar(255), salt varchar(255), status integer, primary key (id)) engine=InnoDB
create table vtpgw_app (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, appId varchar(255), applicationId varchar(255), contact varchar(255), status integer, token varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_contacts (id varchar(255) not null, address varchar(255), createdBy varchar(255), email varchar(255), fullname varchar(255), phone varchar(255), status integer, updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_log (id integer not null, appId varchar(255), executionTime datetime, nodeUrl varchar(255), requestContent varchar(255), responseContent varchar(255), responseTime integer, serviceName varchar(255), statusCode integer, primary key (id)) engine=InnoDB
create table vtpgw_nodes (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, checkUrl varchar(255), status integer, url varchar(255), serviceId bigint not null, primary key (id)) engine=InnoDB
create table vtpgw_permission (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, activated bigint, appId varchar(255), capacity bigint, debug integer, ips varchar(255), methods varchar(255), noContent integer, period bigint, permissionId varchar(255), sandBox integer, serviceId varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_service (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, capacity bigint, connectTimeout bigint, contact varchar(255), description varchar(255), idleTimeout bigint, module varchar(255), name varchar(255), period bigint, reportInterval integer, sandboxEndpoint varchar(255), serviceId varchar(255), standardDuration bigint, status integer, primary key (id)) engine=InnoDB
alter table vtpgw_account add constraint UK_acc_accountId unique (accountId)
alter table vtpgw_account add constraint UK_acc_email unique (email)
alter table vtpgw_app add constraint UK_a_appId unique (appId)
alter table vtpgw_app add constraint UK_a_applicationId unique (applicationId)
alter table vtpgw_permission add constraint UK_p_appId-serviceId unique (appId, serviceId)
alter table vtpgw_permission add constraint UK_p_permissionId unique (permissionId)
alter table vtpgw_service add constraint UK_s_serviceId unique (serviceId)
alter table vtpgw_service add constraint UK_s_name unique (name)
alter table vtpgw_nodes add constraint FK_serviceId foreign key (serviceId) references vtpgw_service (id)
create table vtpgw_account (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, accountId varchar(255), email varchar(255), fullname varchar(255), password varchar(255), phone varchar(255), salt varchar(255), status integer, primary key (id)) engine=InnoDB
create table vtpgw_app (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, appId varchar(255), applicationId varchar(255), contact varchar(255), status integer, token varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_contacts (id varchar(255) not null, address varchar(255), createdBy varchar(255), email varchar(255), fullname varchar(255), phone varchar(255), status integer, updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_log (id integer not null, appId varchar(255), executionTime datetime, nodeUrl varchar(255), requestContent varchar(255), responseContent varchar(255), responseTime integer, serviceName varchar(255), statusCode integer, primary key (id)) engine=InnoDB
create table vtpgw_nodes (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, checkUrl varchar(255), status integer, url varchar(255), serviceId bigint not null, primary key (id)) engine=InnoDB
create table vtpgw_permission (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, activated bigint, appId varchar(255), capacity bigint, debug integer, ips varchar(255), methods varchar(255), noContent integer, period bigint, permissionId varchar(255), sandBox integer, serviceId varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_service (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, capacity bigint, connectTimeout bigint, contact varchar(255), description varchar(255), idleTimeout bigint, module varchar(255), name varchar(255), period bigint, reportInterval integer, sandboxEndpoint varchar(255), serviceId varchar(255), standardDuration bigint, status integer, primary key (id)) engine=InnoDB
alter table vtpgw_account add constraint UK_acc_accountId unique (accountId)
alter table vtpgw_account add constraint UK_acc_email unique (email)
alter table vtpgw_app add constraint UK_a_appId unique (appId)
alter table vtpgw_app add constraint UK_a_applicationId unique (applicationId)
alter table vtpgw_permission add constraint UK_p_appId-serviceId unique (appId, serviceId)
alter table vtpgw_permission add constraint UK_p_permissionId unique (permissionId)
alter table vtpgw_service add constraint UK_s_serviceId unique (serviceId)
alter table vtpgw_service add constraint UK_s_name unique (name)
alter table vtpgw_nodes add constraint FK_serviceId foreign key (serviceId) references vtpgw_service (id)
create table vtpgw_account (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, accountId varchar(255), email varchar(255), fullname varchar(255), password varchar(255), phone varchar(255), salt varchar(255), status integer, primary key (id)) engine=InnoDB
create table vtpgw_app (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, appId varchar(255), applicationId varchar(255), contact varchar(255), status integer, token varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_contacts (id varchar(255) not null, address varchar(255), createdBy varchar(255), email varchar(255), fullname varchar(255), phone varchar(255), status integer, updated bigint, updatedBy varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_log (id integer not null, appId varchar(255), executionTime datetime, nodeUrl varchar(255), requestContent varchar(255), responseContent varchar(255), responseTime integer, serviceName varchar(255), statusCode integer, primary key (id)) engine=InnoDB
create table vtpgw_nodes (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, checkUrl varchar(255), status integer, url varchar(255), serviceId bigint not null, primary key (id)) engine=InnoDB
create table vtpgw_permission (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, activated bigint, appId varchar(255), capacity bigint, debug integer, ips varchar(255), methods varchar(255), noContent integer, period bigint, permissionId varchar(255), sandBox integer, serviceId varchar(255), primary key (id)) engine=InnoDB
create table vtpgw_service (id bigint not null auto_increment, createdBy varchar(255), created datetime, updatedBy varchar(255), updated datetime, capacity bigint, connectTimeout bigint, contact varchar(255), description varchar(255), idleTimeout bigint, module varchar(255), name varchar(255), period bigint, reportInterval integer, sandboxEndpoint varchar(255), serviceId varchar(255), standardDuration bigint, status integer, primary key (id)) engine=InnoDB
alter table vtpgw_account add constraint UK_acc_accountId unique (accountId)
alter table vtpgw_account add constraint UK_acc_email unique (email)
alter table vtpgw_app add constraint UK_a_appId unique (appId)
alter table vtpgw_app add constraint UK_a_applicationId unique (applicationId)
alter table vtpgw_permission add constraint UK_p_appId-serviceId unique (appId, serviceId)
alter table vtpgw_permission add constraint UK_p_permissionId unique (permissionId)
alter table vtpgw_service add constraint UK_s_serviceId unique (serviceId)
alter table vtpgw_service add constraint UK_s_name unique (name)
alter table vtpgw_nodes add constraint FK_serviceId foreign key (serviceId) references vtpgw_service (id)
