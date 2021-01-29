export function Dataset(addrObj) {
  this.city = addrObj.City;
  this.country = addrObj.Country;
  this.state = addrObj.State;
  this.street = addrObj.Street;
  this.street2 = addrObj.Street2;
  this.zipcode = addrObj.Zipcode;
}
export function DatasetParams(obj) {
  // console.log("DatasetParams", obj);
  // return {
    this.getUserid = () => obj.userid;
    this.getRetryCounter =  () => obj.getRetryCounter
    this.getProjectId = () => obj.projectId;
    this.getIssuingCountry = () => obj.issuingCountry;
    this.getIdType = () => obj.idType;
    this.getIdImage = () => obj.idImage;
    this.getFaceImage = () => obj.faceImage;
    this.getEmail = () => obj.email;
    this.getAddress = () => {
      return {
        city: obj.city,
        country: obj.country,
        state: obj.state,
        street: obj.street,
        street2: obj.street2,
        zipcode: obj.zipcode,
      }
    };
    this.getAddressImage = () => obj.addressImage;
  // };
}
