
package com.viettel.vps.webservice;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each
 * Java content interface and Java element interface
 * generated in the com.viettel.vps.webservice package.
 * <p>An ObjectFactory allows you to programatically
 * construct new instances of the Java representation
 * for XML content. The Java representation of XML
 * content can consist of schema derived interfaces
 * and classes representing the binding of schema
 * type definitions, element declarations and model
 * groups.  Factory methods for each of these are
 * provided in this class.
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _LockUserByStaffCodeResponse_QNAME = new QName("http://webservice.vps.viettel.com/", "lockUserByStaffCodeResponse");
    private final static QName _GetAuthorizedData_QNAME = new QName("http://webservice.vps.viettel.com/", "getAuthorizedData");
    private final static QName _LockUserByStaffCode_QNAME = new QName("http://webservice.vps.viettel.com/", "lockUserByStaffCode");
    private final static QName _UpdateDomainData_QNAME = new QName("http://webservice.vps.viettel.com/", "updateDomainData");
    private final static QName _GetAuthorizedDataResponse_QNAME = new QName("http://webservice.vps.viettel.com/", "getAuthorizedDataResponse");
    private final static QName _UpdateDomainDataResponse_QNAME = new QName("http://webservice.vps.viettel.com/", "updateDomainDataResponse");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.viettel.vps.webservice
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link GetAuthorizedData }
     */
    public GetAuthorizedData createGetAuthorizedData() {
        return new GetAuthorizedData();
    }

    /**
     * Create an instance of {@link LockUserByStaffCode }
     */
    public LockUserByStaffCode createLockUserByStaffCode() {
        return new LockUserByStaffCode();
    }

    /**
     * Create an instance of {@link LockUserByStaffCodeResponse }
     */
    public LockUserByStaffCodeResponse createLockUserByStaffCodeResponse() {
        return new LockUserByStaffCodeResponse();
    }

    /**
     * Create an instance of {@link UpdateDomainData }
     */
    public UpdateDomainData createUpdateDomainData() {
        return new UpdateDomainData();
    }

    /**
     * Create an instance of {@link UpdateDomainDataResponse }
     */
    public UpdateDomainDataResponse createUpdateDomainDataResponse() {
        return new UpdateDomainDataResponse();
    }

    /**
     * Create an instance of {@link GetAuthorizedDataResponse }
     */
    public GetAuthorizedDataResponse createGetAuthorizedDataResponse() {
        return new GetAuthorizedDataResponse();
    }

    /**
     * Create an instance of {@link LockUserResult }
     */
    public LockUserResult createLockUserResult() {
        return new LockUserResult();
    }

    /**
     * Create an instance of {@link UserPermissionBO }
     */
    public UserPermissionBO createUserPermissionBO() {
        return new UserPermissionBO();
    }

    /**
     * Create an instance of {@link SysUserBO }
     */
    public SysUserBO createSysUserBO() {
        return new SysUserBO();
    }

    /**
     * Create an instance of {@link MenuBO }
     */
    public MenuBO createMenuBO() {
        return new MenuBO();
    }

    /**
     * Create an instance of {@link SysFunctionBO }
     */
    public SysFunctionBO createSysFunctionBO() {
        return new SysFunctionBO();
    }

    /**
     * Create an instance of {@link AuthorizedData }
     */
    public AuthorizedData createAuthorizedData() {
        return new AuthorizedData();
    }

    /**
     * Create an instance of {@link VpsActor }
     */
    public VpsActor createVpsActor() {
        return new VpsActor();
    }

    /**
     * Create an instance of {@link DomainDataBO }
     */
    public DomainDataBO createDomainDataBO() {
        return new DomainDataBO();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link LockUserByStaffCodeResponse }{@code >}}
     */
    @XmlElementDecl(namespace = "http://webservice.vps.viettel.com/", name = "lockUserByStaffCodeResponse")
    public JAXBElement<LockUserByStaffCodeResponse> createLockUserByStaffCodeResponse(LockUserByStaffCodeResponse value) {
        return new JAXBElement<LockUserByStaffCodeResponse>(_LockUserByStaffCodeResponse_QNAME, LockUserByStaffCodeResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetAuthorizedData }{@code >}}
     */
    @XmlElementDecl(namespace = "http://webservice.vps.viettel.com/", name = "getAuthorizedData")
    public JAXBElement<GetAuthorizedData> createGetAuthorizedData(GetAuthorizedData value) {
        return new JAXBElement<GetAuthorizedData>(_GetAuthorizedData_QNAME, GetAuthorizedData.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link LockUserByStaffCode }{@code >}}
     */
    @XmlElementDecl(namespace = "http://webservice.vps.viettel.com/", name = "lockUserByStaffCode")
    public JAXBElement<LockUserByStaffCode> createLockUserByStaffCode(LockUserByStaffCode value) {
        return new JAXBElement<LockUserByStaffCode>(_LockUserByStaffCode_QNAME, LockUserByStaffCode.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link UpdateDomainData }{@code >}}
     */
    @XmlElementDecl(namespace = "http://webservice.vps.viettel.com/", name = "updateDomainData")
    public JAXBElement<UpdateDomainData> createUpdateDomainData(UpdateDomainData value) {
        return new JAXBElement<UpdateDomainData>(_UpdateDomainData_QNAME, UpdateDomainData.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetAuthorizedDataResponse }{@code >}}
     */
    @XmlElementDecl(namespace = "http://webservice.vps.viettel.com/", name = "getAuthorizedDataResponse")
    public JAXBElement<GetAuthorizedDataResponse> createGetAuthorizedDataResponse(GetAuthorizedDataResponse value) {
        return new JAXBElement<GetAuthorizedDataResponse>(_GetAuthorizedDataResponse_QNAME, GetAuthorizedDataResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link UpdateDomainDataResponse }{@code >}}
     */
    @XmlElementDecl(namespace = "http://webservice.vps.viettel.com/", name = "updateDomainDataResponse")
    public JAXBElement<UpdateDomainDataResponse> createUpdateDomainDataResponse(UpdateDomainDataResponse value) {
        return new JAXBElement<UpdateDomainDataResponse>(_UpdateDomainDataResponse_QNAME, UpdateDomainDataResponse.class, null, value);
    }

}
