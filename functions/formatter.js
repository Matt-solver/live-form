const valid = require('./validation')
const common = require('./common');


module.exports = {
	checkValidationID : (data) => {
		if(data)
			if(data.inferResult === "SUCCESS") {
				const fieldArr = data.fields
				if(data.matchedTemplate.id === 4956 || data.matchedTemplate.name === "KOR - ID v1") {
					console.info('----------------KOR - ID--------------------')
					const KOR_ID = fieldArr.filter(el => el.name === "Unique ID" ? el : null)[0].inferText;
					const nation_kor = valid.isKorea(KOR_ID) ? "South Korea" : false					
					return {
						checkIdentity_ID : valid.checkIdentity(common.rmBlank(KOR_ID), "ID", "KOR"),
						checkDateofBirth : valid.checkDateofBirth(valid.changeDobToDate(valid.changeDobType1(valid.getDoB_fromID(KOR_ID)))),
						checkGender: valid.checkGender(KOR_ID, "KOR"),
						checkNationality: valid.nationality_formatter(nation_kor, valid.findCountryCode(nation_kor))
					}					
				}			
				if(data.matchedTemplate.id === 4957 || data.matchedTemplate.name === "KOR - ID v2") {
					console.info('----------------KOR - ID v2--------------------')
					const KOR_ID = fieldArr.filter(el => el.name === "Unique ID" ? el : null)[0].inferText;
					const nation_kor = valid.isKorea(KOR_ID) ? "South Korea" : false					
					return {
						checkIdentity_ID : valid.checkIdentity(common.rmBlank(KOR_ID), "ID", "KOR"),
						checkDateofBirth : valid.checkDateofBirth(valid.changeDobToDate(valid.changeDobType1(valid.getDoB_fromID(KOR_ID)))),
						checkGender: valid.checkGender(KOR_ID, "KOR"),
						checkNationality: valid.nationality_formatter(nation_kor, valid.findCountryCode(nation_kor))
					}					
				}			
				if(data.matchedTemplate.id === 4959 || data.matchedTemplate.name === "KOR - driving licence") {
					console.info('----------------KOR - DL--------------------')
					const KOR_ID = fieldArr.filter(el => el.name === "Unique ID" ? el : null)[0].inferText;
					const KOR_DL = fieldArr.filter(el => el.name === "Document" ? el : null)[0].inferText;
					const kor_expDate = fieldArr.filter(el => el.name === "Date of Expiry" ? el : null)[0].inferText;
					const nation_kor = valid.isKorea(KOR_ID) ? "South Korea" : false;					
					return {
						checkIdentity_docID: valid.checkIdentity(common.rmBlank(KOR_DL), "DL", "KOR"),	// 운전면허 Documnet ID
						checkIdentity_DL : valid.checkIdentity(common.rmBlank(KOR_ID), "ID", "KOR"),	// 운전면허 주민등록번호
						checkExpDate: valid.checkExpDate(valid.fixDate( common.rmBlank(kor_expDate.replace(/~|:|\//gi, '')))),
						checkDateofBirth : valid.checkDateofBirth(valid.changeDobToDate(valid.changeDobType1(valid.getDoB_fromID(KOR_ID)))),
						checkGender: valid.checkGender(KOR_ID, "KOR"),
						checkNationality: valid.nationality_formatter(nation_kor, valid.findCountryCode(nation_kor))
					}					
				}

			}

	}
}

// Result var
let idn_expDate = ":	28/10/2020"
let mys_expDate = "~	28/10/2020"
let PHL_expDate = "28/10/2020"
let vnm_expDate = "28/10/2020"
let tha_ID_expDate = '28 Sep. 2021'
let tha_DL_expDate = '28 October. 2020'
let kor_expDate = "~	28. 10. 2020."
let idn_dob = ": 17-10-2005"
let vnm_dob = " 12/ 11/ 1988"
let phl_ID_dob_v1 = "Sept.19.1951"
let phl_ID_dob_v2 = "1990/10/08"
let phl_ID_dob_v3 = "1990/10/08"
let phl_ID_dob_v4 = "05281974"
let phl_ID_dob_v5 = "5/19/1953"
let phl_DL_dob_v1 = "1961-02-24"
let phl_DL_dob_v2 = "1961-02-24"
let phl_DL_dob_v3 = "1973/11/10"
let tha_ID_dob = '28 Sep. 1987'
let tha_DL_dob = '28 September 1987'
let sgp_ID_dob = "09-10-1991" //DD-MM-YYYY
let sgp_DL_dob_v1 = "09-10-1991"
let sgp_DL_dob_v2 = "22 Jan 2005"
let idn_ID = "NIK : 2171182202770000"
let idn_DL = "950518151196"
let mys_ID = "860110-66-5888"
let mys_DL_v1 = "498101752902"
let mys_DL_v2 = "761022135444"
let mys_DL_v3 = "BJ3222741PAK"
let mys_DL_v4 = "761022135444"
let vnm_ID = "030188003049"
let vnm_DL_v1 = "AC 044999"
let vnm_DL_v2 = "030188003049"
let vnm_ID_old = "205515341"
let phl_paperID = "	CONTROL NO: 33999 -B"
let phl_IDv1 = "1234-1234567-1"
let phl_6digits = "T 324343"
let phl_9digits = "123456789"
let phl_DL = "N06-12-123456"
let tha_ID = "3 1233 00144 13 1"
let tha_DL = "42004477"
let sgp_ID = "S7777777D"
let sgp_DL = "S2707707B"
let KOR_ID = "870226-1652419"
let KOR_DL = "13-02-079300-31"
let country_idn = "INDONESIA"
let country_mys1 = "KAD PENGENALAN MALAYSIA"
let country_mys2 = "Malaysia"
let country_mys3 = "MYS"
let country_phl = "PHL"
let country_tha = "Thai"
let country_tha2 = "Thailand"
let country_sgp = "SINGAPORE"
let country_vnm1 = "VIET NAM"
let country_vnm2 = "Viet Nam"
let country_phl1 = "PHILIP"
let country_phl2 = "PHL"
let gender_idn_male = "PRIA"
let gender_idn2_femle = "WANITA"
let gender_mys_male = "PEREMPUAN"
let gender_mys_femle = "LELAKI"
let gender_M = "M"
let gender_F = "F"
let gender_MALE = "MALE"
let gender_FEMALE = "FEMALE"
let gender_vnm1 = "Nur"
let gender_vnm2 = " My An,"
let gender_vnm3 = "Nam"

console.info('----------------IDN - ID - front--------------------')
console.log("checkIdentity_idn1::", valid.checkIdentity(common.extractInt(idn_ID), "ID", "IDN"))
console.log("checkExpDate::", valid.checkExpDate( valid.fixDate( common.rmBlank(idn_expDate).replace(':',''))))
console.log("checkDateofBirth::",valid.checkDateofBirth(valid.changeDobToDate(valid.fixDate(common.rmBlank(idn_dob).replace(':','')))))	
console.info('----------------IDN - ID - back--------------------')
console.log("nationality_formatter", valid.nationality_formatter(valid.findCountry_onIDcard(country_idn), valid.findCountryCode(valid.findCountryFullname(country_idn))))
console.info('----------------IDN - DL--------------------')
console.log("checkIdentity_idn2::", valid.checkIdentity(common.extractInt(idn_DL), "DL", "IDN"))
console.log("checkExpDate::", valid.checkExpDate( valid.fixDate(common.rmBlank(idn_expDate).replace(':',''))))
console.log("nationality_formatter::", valid.nationality_formatter(valid.findCountry_onIDcard(country_idn), valid.findCountryCode(valid.findCountryFullname(country_idn))))
console.log("checkGender1::", valid.checkGender(gender_idn_male, "IDN"))
console.log("checkGender2::", valid.checkGender(gender_idn2_femle, "IDN"))
console.info('----------------MYS - ID--------------------')
console.log("checkIdentity_mys1::", valid.checkIdentity(common.rmBlank(mys_ID), "ID", "MYS"))
console.log("checkDateofBirth", valid.checkDateofBirth(valid.changeDobToDate(valid.changeDobType1(valid.getDoB_fromID(mys_ID)))))	
console.log("nationality_formatter1::", valid.nationality_formatter(valid.findCountry_onIDcard(country_mys1), valid.findCountryCode(valid.findCountry_onIDcard(country_mys1))))
console.log("checkGender1::", valid.checkGender(gender_mys_male, "MYS"))
console.log("checkGender2::", valid.checkGender(gender_mys_femle, "MYS"))
console.info('----------------MYS - DL--------------------')
console.log("checkIdentity_mys2::", valid.checkIdentity(common.extractInt(mys_DL_v1), "DL-v1", "MYS"))
console.log("checkIdentity_mys3::", valid.checkIdentity(common.extractInt(mys_DL_v2), "DL-v2", "MYS"))
console.log("checkIdentity_mys4::", valid.checkIdentity(common.rmBlank(mys_DL_v3), "DL-v3", "MYS"))
console.log("checkIdentity_mys5::", valid.checkIdentity(common.extractInt(mys_DL_v4), "DL-v4", "MYS"))
console.log("checkExpDate::", valid.checkExpDate(valid.fixDate(common.rmBlank(mys_expDate))))
console.log("checkDateofBirth1", valid.checkDateofBirth(valid.changeDobToDate(valid.changeDobType1(valid.getDoB_fromID(mys_DL_v2)))))
console.log("checkDateofBirth2", valid.checkDateofBirth(valid.changeDobToDate(valid.changeDobType1(valid.getDoB_fromID(mys_DL_v4)))))	
    console.log("checkGender1::", valid.checkGender(gender_mys_male, "MYS"))
    console.log("checkGender2::", valid.checkGender(gender_mys_femle, "MYS"))
    console.log("nationality_formatter2::", valid.nationality_formatter(valid.findCountryFullname(country_mys2), valid.findCountryCode(valid.findCountryFullname(country_mys2))))
    console.log("nationality_formatter3::",valid.nationality_formatter(valid.findCountryName(country_mys3), valid.findCountryCode(valid.findCountryName(country_mys3))))
console.info('----------------VNM - ID--------------------')
console.log("checkIdentity_vnm1::", valid.checkIdentity(common.extractInt(vnm_ID), "ID", "VNM"))
console.log("checkIdentity_vnm2::", valid.checkIdentity(common.rmBlank(vnm_ID_old), "OLD-ID", "VNM"))
console.log("checkExpDate::", valid.checkExpDate( valid.fixDate(common.rmBlank(vnm_expDate))))
console.log("checkDateofBirth",valid.checkDateofBirth(valid.changeDobToDate(valid.fixDate(common.rmBlank(vnm_dob)))))
console.log("nationality_formatter1::", valid.nationality_formatter(valid.findCountryFullname(country_vnm1), valid.findCountryCode(valid.findCountryFullname(country_vnm1))))
console.log("nationality_formatter2::", valid.nationality_formatter(valid.findCountryFullname(country_vnm2), valid.findCountryCode(valid.findCountryFullname(country_vnm2))))
    console.log("checkGender1::", valid.checkGender(vnm_ID, "VNM"))
console.info('----------------VNM - DL--------------------')
console.log("checkIdentity_vnm3::", valid.checkIdentity(common.rmBlank(vnm_DL_v1), "DL-v1", "VNM"))
console.log("checkIdentity_vnm4::", valid.checkIdentity(common.rmBlank(vnm_DL_v2), "DL-v2", "VNM"))
console.log("checkDateofBirth",valid.checkDateofBirth(valid.changeDobToDate(valid.fixDate(common.rmBlank(vnm_dob)))))
console.log("checkExpDate::", valid.checkExpDate( valid.fixDate(common.rmBlank(vnm_expDate))))
console.log("nationality_formatter3::", valid.nationality_formatter(valid.findCountryFullname(country_vnm1), valid.findCountryCode(valid.findCountryFullname(country_vnm1))))
console.info('----------------PHL - ID--------------------')
console.log("checkIdentity_phl1::", valid.checkIdentity(common.rmBlank(phl_paperID), "ID-paper", "PHL"))
console.log("checkIdentity_phl2::", valid.checkIdentity(common.rmBlank(phl_IDv1), "ID-v2", "PHL"))
console.log("checkIdentity_phl3::", valid.checkIdentity(common.rmBlank(phl_IDv1), "ID-v3", "PHL"))
console.log("checkIdentity_phl4::", valid.checkIdentity(common.rmBlank(phl_6digits), "ID-6digits-back", "PHL"))
console.log("checkIdentity_phl5::", valid.checkIdentity(common.rmBlank(phl_9digits), "ID-9digits-back", "PHL"))
console.log("checkExpDate::", valid.checkExpDate( valid.fixDate(common.rmBlank(PHL_expDate))))
console.log("checkDateofBirth1",valid.checkDateofBirth(valid.changeDobToDate(valid.fixDate(common.rmBlank(phl_ID_dob_v1)))))
console.log("checkDateofBirth2",valid.checkDateofBirth(valid.changeDobToDate(valid.fixDate(common.rmBlank(phl_ID_dob_v2)))))
console.log("checkDateofBirth3",valid.checkDateofBirth(valid.changeDobToDate(valid.fixDate(common.rmBlank(phl_ID_dob_v3)))))
console.log("checkDateofBirth4",valid.checkDateofBirth(valid.changeDobToDate_PHL_ID(valid.changeDobType1(common.rmBlank(phl_ID_dob_v4)))))
console.log("checkDateofBirth5",valid.checkDateofBirth(valid.changeDobToDate_PHL_ID(common.rmBlank(phl_ID_dob_v5))))
console.log("nationality_formatter1::", valid.nationality_formatter(valid.findCountryFullname(country_phl1), valid.findCountryCode(valid.findCountryFullname(country_phl1))))
    console.log("checkGender1::", valid.checkGender(gender_F))
    console.log("checkGender2::", valid.checkGender(gender_M))
    console.log("checkGender3::", valid.checkGender(gender_FEMALE))
    console.log("checkGender4::", valid.checkGender(gender_MALE))
console.info('----------------PHL - DL--------------------')
console.log("checkIdentity_phl6::", valid.checkIdentity(common.rmBlank(phl_DL), "DL", "PHL")) // 3IDs on the driver license are same type
console.log("checkExpDate::", valid.checkExpDate( valid.fixDate(common.rmBlank(PHL_expDate))))
console.log("checkDateofBirth6",valid.checkDateofBirth(valid.changeDobToDate(valid.fixDate(common.rmBlank(phl_DL_dob_v1)))))
console.log("checkDateofBirth7",valid.checkDateofBirth(valid.changeDobToDate(valid.fixDate(common.rmBlank(phl_DL_dob_v2)))))
console.log("checkDateofBirth8",valid.checkDateofBirth(valid.changeDobToDate(valid.fixDate(common.rmBlank(phl_DL_dob_v3)))))
console.log("nationality_formatter2::", valid.nationality_formatter(valid.findCountryFullname(country_phl1), valid.findCountryCode(valid.findCountryFullname(country_phl1))))
console.log("nationality_formatter3::", valid.nationality_formatter(valid.findCountryName(country_phl2), valid.findCountryCode(valid.findCountryName(country_phl2))))
    console.log("checkGender1::", valid.checkGender(gender_F))
    console.log("checkGender2::", valid.checkGender(gender_M))
console.info('----------------THA - ID--------------------')
console.log("checkIdentity_THA1::", valid.checkIdentity(common.extractInt(tha_ID), "ID", "THA"))
console.log('checkExpDate', valid.checkExpDate(valid.literalMonth_Formatter(tha_ID_expDate)))	 
console.log('checkDateofBirth', valid.checkDateofBirth(valid.changeDobToDate(valid.literalMonth_Formatter(tha_ID_dob))))
console.log("nationality_formatter::",valid.nationality_formatter(valid.findCountryFullname(country_tha), valid.findCountryCode(country_tha)))
console.info('----------------THA - DL--------------------')
console.log("checkIdentity_THA2::", valid.checkIdentity(common.extractInt(tha_DL), "DL", "THA"))
console.log('checkExpDate', valid.checkExpDate(valid.literalMonth_Formatter(tha_DL_expDate)))	 
console.log('checkDateofBirth', valid.checkDateofBirth(valid.changeDobToDate(valid.literalMonth_Formatter(tha_DL_dob))))
console.log("nationality_formatter::", valid.nationality_formatter(valid.findCountryFullname(country_tha2), valid.findCountryCode(country_tha2)))
console.info('----------------SGP - ID--------------------')
console.log("checkIdentity_SGP1::", valid.checkIdentity(common.rmBlank(sgp_ID), "ID", "SGP"))
console.log("checkDateofBirth1",valid.checkDateofBirth(valid.changeDobToDate(valid.fixDate(common.rmBlank(sgp_ID_dob)))))
console.log("nationality_formatter::", valid.nationality_formatter(valid.findCountryFullname(country_tha2), valid.findCountryCode(country_tha2)))
    console.log("checkGender1::", valid.checkGender(gender_F))
    console.log("checkGender2::", valid.checkGender(gender_M))
console.info('----------------SGP - DL--------------------')
console.log("checkIdentity_SGP2::", valid.checkIdentity(common.rmBlank(sgp_DL), "DL", "SGP"))
console.log("checkDateofBirth2",valid.checkDateofBirth(valid.changeDobToDate(valid.fixDate(common.rmBlank(sgp_DL_dob_v1)))))
console.log("checkDateofBirth3",valid.checkDateofBirth(valid.changeDobToDate(valid.literalMonth_Formatter(sgp_DL_dob_v2))))
console.log("nationality_formatter::", valid.nationality_formatter(valid.findCountryFullname(country_sgp), valid.findCountryCode(country_sgp)))
console.info('----------------KOR - ID--------------------')
console.log("checkName::", common.extractHangul("이현석(李泫錫) "))
console.log("checkIdentity_KOR1::", valid.checkIdentity(common.rmBlank(KOR_ID), "ID", "KOR"))
console.log("checkDateofBirth1", valid.checkDateofBirth(valid.changeDobToDate(valid.changeDobType1(valid.getDoB_fromID(KOR_ID)))))	
console.info('----------------KOR - DL--------------------')
console.log("checkIdentity_DL", valid.checkIdentity(common.rmBlank(KOR_DL), "DL", "KOR"),)
console.log("checkIdentity_KOR2::", valid.checkIdentity(common.rmBlank(KOR_ID), "ID", "KOR"))
console.log("checkExpDate::",  valid.checkExpDate(valid.fixDate(common.rmBlank(kor_expDate.replace(/~|:|\//gi, '')))))
console.log("checkDateofBirth2::", valid.checkDateofBirth(valid.changeDobToDate(valid.changeDobType1(valid.getDoB_fromID(KOR_ID)))))
    console.log('checkGender::', valid.checkGender(KOR_ID, "KOR"))
    const nation_kor = valid.isKorea(KOR_ID) ? "South Korea" : false
	console.log('nationality_formatter::',valid.nationality_formatter(nation_kor, valid.findCountryCode(nation_kor)))
	


	console.log('>>>', valid.checkIdentity(common.rmBlank(KOR_ID), "ID", "KOR"))