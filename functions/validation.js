const countryList = require('./countryList');
const e = require('./common');

module.exports = {

	// (Common) To validate Personal number
	checkIdentity : (personalNum, idType, nationCode) => {
		const checkKOR_ID = () => {
			const reg_ID = /[0-9]{6}-[0-9]{7}/g
			const reg_DL = /[0-9]{2}-[0-9]{2}-[0-9]{6}-[0-9]{2}/g
			if(idType === "ID" && reg_ID.test(personalNum)) {
				const num1 = personalNum.substr(0, 6);
				let p = personalNum.substr(7);
					if (!p || p == "-" || p == " " || p == "") p = personalNumber.substr(8);
					
				const num2 = p;
				const arrNum1 = num1.split('');
				const arrNum2 = num2.split('');
		
				let tempSum = 0;
		
				//for문 reduce로 대체  acc:누적,cur:현재      
				tempSum = arrNum1.reduce( (acc, cur, i) => ( acc + parseInt(cur) * (2 + i)), 0 );
				tempSum += arrNum2.reduce( (acc, cur, i) => ( i < num2.length-1 
																				? i >= 2 
																					? acc + parseInt(cur) * i 
																					: acc + parseInt(cur) * (8 + i) 
																				: acc ), 0);		
																				
				if ((11 - (tempSum % 11)) % 10 != arrNum2[6])
					return false        
				else
					return true

			}else if(idType === "DL") {
				return reg_DL.test(personalNum) ? true : false

			}else{
				return false
			}
		}
		const checkIDN_ID = () => {
			const reg_ID = /[0-9]{16}/g
			const reg_DL = /[0-9]{12}/g
			if(idType === "ID")
					return typeof(parseInt(personalNum)) === "number" && reg_ID.test(personalNum) ? true : false
			else if(idType === "DL")
					return typeof(parseInt(personalNum)) === "number" && reg_DL.test(personalNum) ? true : false
			else
				return false
		}
		const checkMYS_ID = () => {
			const reg_ID = /[0-9]{6}-[0-9]{2}-[0-9]{4}/g
			const reg_DL_v1 = /[0-9]{6}[0-9]{6}/g
			const reg_DL_v2 = /[0-9]{6}[0-9]{6}/g
			const reg_DL_v3 = /[A-Z]{2}[0-9]{7}[A-Z]{3}/g
			const reg_DL_v4 = /[0-9]{12}/g
			if(idType === "ID")
					return typeof(parseInt(personalNum)) === "number" && reg_ID.test(personalNum) ? true : false
			else if(idType === "DL-v1")
					return typeof(parseInt(personalNum)) === "number" && reg_DL_v1.test(personalNum) ? true : false
			else if(idType === "DL-v2")
					return typeof(parseInt(personalNum)) === "number" && reg_DL_v2.test(personalNum) ? true : false
			else if(idType === "DL-v3")
					return typeof(parseInt(personalNum)) === "number" && reg_DL_v3.test(personalNum) ? true : false
			else if(idType === "DL-v4")
					return typeof(parseInt(personalNum)) === "number" && reg_DL_v4.test(personalNum) ? true : false
			else
				return false
		}
		const checkVNM_ID = () => {	
			const reg_ID_12digits = /[0]{1}[[0-9]{1}[0-6]{1}[0-1]{1}[0-9]{2}[0-9]{6}/g
			const reg_DL_v1 = /[A-Z]{2}[0-9]{6}/g
			const reg_DL_v2 = /[0-9]{12}/g
			const reg_old_ID = /[0-9]{9}/g
			if(idType === "ID")
					return typeof(parseInt(personalNum)) === "number" && reg_ID_12digits.test(personalNum) ? true : false
			else if(idType === "DL-v1")
					return typeof(parseInt(personalNum)) === "number" && reg_DL_v1.test(personalNum) ? true : false
			else if(idType === "DL-v2")
				return typeof(parseInt(personalNum)) === "number" && reg_DL_v2.test(personalNum) ? true : false
			else if(idType === "OLD-ID")
				return typeof(parseInt(personalNum)) === "number" && reg_old_ID.test(personalNum) ? true : false
			else
				return false
		}
		const checkPHL_ID = () => {
			const reg_paper = /[0-9]{5}-[A-Z]{1}/g;
			const reg_v2 = /[0-4]{4}-[0-9]{7}-[0-9]{1}/g;
			const reg_6digits = /[A-Z]{1}[0-9]{6}/g;
			const reg_9digits = /[0-9]{9}/g;
			const reg_DL = /[A-Z]{1}[0-9]{2}-[0-9]{2}-[0-9]{6}/g;
			if(idType === "ID-paper"){
				const arrID = personalNum.split(":")
				return reg_paper.test(arrID[1])
			}else if(idType === "ID-v2" || idType === "ID-v3"){
				return reg_v2.test(personalNum)	// 신분증ID 2개 모두 동일
			}else if(idType === "ID-6digits-back"){
				return reg_6digits.test(personalNum)
			}else if(idType === "ID-9digits-back"){
				return reg_9digits.test(personalNum)
			}else if(idType === "DL"){	//운전면허ID 3개 모두 동일한 형식
				return reg_DL.test(personalNum)
			}else{
				return false
			}
		}
		const checkTHA_ID = () => {
			const reg_ID = /[0-9]{13}/g
			const reg_DL = /[0-9]{8}/g
			if(idType === "ID")
				return reg_ID.test(personalNum) ? true : false
			if(idType === "DL")
				return reg_DL.test(personalNum) ? true : false
			else
				return false
		}
		const checkSGP_ID = () => {
			const reg_ID = /[A-Z]{1}[0-9]{7}[A-Z]{1}/g
			const reg_DL =/[A-Z]{1}[0-9]{7}[A-Z]{1}/g
			if(idType === "ID")
				return reg_ID.test(personalNum) ? true : false
			if(idType === "DL")
				return reg_DL.test(personalNum) ? true : false
			else
				return false
		}

		switch (nationCode) {
			case "KOR":
				return checkKOR_ID()
			case "IDN":
				return checkIDN_ID()
			case "MYS":
				return checkMYS_ID()
			case "VNM":
				return checkVNM_ID()	
			case "PHL":
				return checkPHL_ID()
			case "THA":
				return checkTHA_ID()
			case "SGP":
				return checkSGP_ID()
			default :
				return false
		}
	},
	// console.log( 'checkIdentity', checkIdentity(personalNum) )

	//Nationality 한국인지 확인(주민번호 유효성검사 통과후 체크하세요)
	isKorea : (personalNumber) => personalNumber.substr(7, 1) <= 4 ? true : false,

	// if(checkIdentity(personalNum))
	//   console.log('isKorea', isKorea(personalNum))

	//(Common) Gender 추출(주민번호 유효성검사 통과후 체크하세요)
	checkGender : (value, nationCode) => {
			let gender = '';
			let FromExtractID = (value, code) => {	//베트남,한국인 경우만 실행
				if (code === "KOR")
					return value.substr(7, 1) % 2 === 1 ? "male" : "female";  
				
				else if(code === "VNM")
					return value.substr(3, 1) % 2 === 0 ? "male" : "female";
				else
					return false
			}
			switch(nationCode){
				case 'KOR':   
						return FromExtractID(value, "KOR")
				case 'VNM':   
						return FromExtractID(value, "VNM")
				case 'IDN':
						return value === "PRIA" ? "male" : "female"        
				case 'MYS':
						return value === "LELAKI" ? "male" : value === "PEREMPUAN" ? "female" : undefined
				default :					
					if (value === "M")
					gender = "male"
					else if (value === "F")
					gender = "female"
					else if (value === "FEMALE")
					gender = value.toLowerCase()
					else if (value === "MALE")
					gender = value.toLowerCase()
					else
					gender = undefined
					
					return gender

			}

	},
	// if(checkIdentity(personalNum))
	// 	console.log('checkGender', checkGender("8702", "VNM"))  
		
		
	// 문자형 Date를 숫자로 전환하여 배열로 반환
	literalMonth_Formatter : (inputDate) => {
		const monthArr1 = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
		const monthArr2 = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
		const monthArr3 = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"]
			inputDate = e.regExp(inputDate).toUpperCase().split(" "|| "/");    

			return inputDate.map(mon=> {
				if(mon)
					if(monthArr1.indexOf(mon) > -1)
						return monthArr1.indexOf(mon) + 1
					else
						if(monthArr2.indexOf(mon) > -1)
							return monthArr2.indexOf(mon) + 1
						else
							if(monthArr3.indexOf(mon) > -1)
								return monthArr3.indexOf(mon) + 1
							else
								return parseInt(mon)
				else
					return 0
			})    
	},
	// if(checkIdentity(personalNum)) {	// Month가 문자로 표기된 Date 형식을 Date object로 가공하는 과정
	// 	let dateArr = literalMonth_Formatter('27 FEB. 2024');
	//  	console.log('dateArr', dateArr)
	// 	console.log('monthFormatter', dateArr = new Date(dateArr[2], dateArr[1], dateArr[0]))
	//   console.log(dateArr.toString())	
	// }

	// let resVal = ": 360213 10019 300 02";
	// console.log( e.extractInt(e.regExp(resVal)))
	// console.log(extractHangul("a ㄴa a 강 "))
	/* var reg = /[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])/; */

	// let docmunetArr = "19-01-603924-12".split('-')

	// // 진위확인용 운전면허번호 데이터 추출(Array)
	// const checkDriverLicense = (doc) => 
	// 	doc[0].length === 2
	// 		? doc[1].length === 2
	// 			? doc[2].length === 6
	// 				? doc[3].length === 2
	// 					? doc
	// 					: "Invalid License"	
	// 				: "Invalid License"	
	// 			: "Invalid License"	
	// 		: "Invalid License"	


	// console.log('>>>>>>>', checkDriverLicense(docmunetArr))

	// Extract Date of birth from Local ID (Let use incase of Nationality is KOR)
	getDoB_fromID : (pid) => pid ? pid.substr(0,6).length === 6
																				? (pid.substr(0,6))
																				: 'An error occurred during extracting Date of birth.'
																			: "No exist ID" ,

	// (Common)주민번호에서 추출한 생년월일을 Date 형식으로 변경
	changeDobToDate : (dob) => {	//Date 생성자에 유효한 날짜형식을 넣지 않으면 false가 반환된다
		if(typeof(dob) === 'object') {
			if(dob[2]>dob[0]) {	// 연도가 마지막 배열 방에 있으면 자리교체
				let tmp = dob[0]
				dob[0] = dob[2]
				dob[2] = tmp
				return new Date(dob)
			}else{			
				return new Date(dob)
			}
		}else{
			return new Date(dob)
		}
	},
	//특이한 필리핀 생년월일 표기 잡기
	changeDobToDate_PHL_ID : (dob) => {
			if(dob[2]>dob[0]) {	
				// MM/DD/YYYY 형식인 경우 연도를 배열방 첫번째 자리로 교체해준다
				dob.unshift(dob[2])
				return new Date(dob)
			} else {
				return new Date(dob)
			}
	},
	// 주민번호에서 추출한 생년월일을 YY/MM/DD 형식으로 변경(한국)
	changeDobType1 : (dob) => {
		let DoB = dob.split('')
		if(dob.length === 6)
			return DoB.reduce((acc, cur, i) => {
				return i%2 !== 0 && i < DoB.length-1 
							? acc+cur+'/'
							: acc+cur
			})		
		else if(dob.length === 8)
			return DoB.reduce((acc, cur, i) => {
				return i%2 !== 0 && i < DoB.length-1 && i< 4
							? acc+cur+'/'
							: acc+cur
			})	
		else
			return 'Invalid Date of birth type'	
	},

	// Check Date of Birth
	checkDateofBirth : (dob) => { // input: Date object
		const date = new Date()
		// 생후 13세 이상(임의로 정함)
		if(date.getFullYear() > dob.getFullYear() + 13)	
			return true
		else
			return false
	},

	// create object of Date of birth 
	newDoB : (DoB) => {
		return DoB ? new Date(DoB) : 'Invalid type Date of Birth'
	},
	// console.log('newDoB', newDoB( changeDobType( getDoB_fromID( personalNum ) ) ).getFullYear().toString())

	// 날짜 형식 YYYYMMDD 포맷으로 변경(한국신분증 진위확인용도)
	setDateofBirth : (DoB) => {  
		const regDate = /^[1-9]{1}$/g  
		const year = DoB.getFullYear().toString()
		let month = (DoB.getMonth()+1).toString()
		let day = DoB.getDate().toString();
		
		if(regDate.test(month))
			month = '0'+ month
		if(regDate.test(day))
			day = '0'+ day
		
		return `${year}${month}${day}`
	},
	// console.log('setDateofBirth', setDateofBirth( newDoB( changeDobType1( getDoB_fromID( '870226-1652419' ) ) ) ) ) 

	// (Common) Expiry date Formatter: Automatic correction of Date of Expiry
	fixDate : (DoE) => {
			const checkYear = /^(19|20)\d{2}$/g
			const checkMonth = /^[1-9]{1}$|^[0][1-9]{1}$|^[01]{1}[012]{1}$/g
			const checkDay = /^[1-9]{1}$|^[1-3]{1}[0-9]{1}$/g
			let expArr=[], fixDate = null;    
			let flag = false;
			
			//무기한인 경우 true를 반환한다.(일부 국가 해당)
			if(DoE.indexOf('SEUMUR') !== -1 
				||DoE.indexOf('HIDUP') !== -1 
				||DoE.indexOf('LIFELONG') !== -1 
				||DoE.indexOf('Khong thoi han') !== -1 
				||DoE.indexOf('Khong thoi') !== -1)
				return true
			
			if(DoE)	//To modify the order of the interger array (in case of Malaysia driver license)
				if(DoE.indexOf('/') > -1 && DoE.indexOf('-') > -1 ){
					fixDate = DoE.split(new RegExp('[-]', 'g'))[1]
					fixDate = fixDate.split(new RegExp('[-+():?.// ]', 'g')).filter((el) => el !== '')     
				}else{
					fixDate = DoE.split(new RegExp('[-+():?.// ]', 'g'))
					fixDate = fixDate.filter((el) => el !== '')
				}      
			fixDate.map((el,i) => {return fixDate[i] = parseInt(e.regExp(el))})

			if(checkYear.test(fixDate[0])){
				expArr[2] = fixDate[0]
				flag = checkDay.test(fixDate[2])      
				expArr[0] = flag ? fixDate[2] : "Data error: year"      
			}else{
				expArr[2] = fixDate[2] 
				flag = checkDay.test(fixDate[0])      
				expArr[0] = flag ?  fixDate[0] : "Date error: day"    
			}
			flag = checkMonth.test(fixDate[1])
			expArr[1] = flag ?  fixDate[1] : "Data error: month"      
			
			return expArr
	},
	// console.log('fixDateofExpiry: ', fixDate('20/08/2018-31/08/2020'));


	// (Common) Date of Expiry 유효성 검사
	checkExpDate : (DoEArr) => {	// Input Array
			const thisYear = new Date().getFullYear();
			const thisMonth = new Date().getMonth() + 1;
			const thisDay = new Date().getDate();

			return DoEArr 
						? thisYear < DoEArr[2]
							? true
							: thisYear === DoEArr[2]
								? thisMonth < DoEArr[1]
									? true
									: thisMonth === DoEArr[1]
								? thisDay < DoEArr[0]
									? true
									: thisDay === DoEArr[0]
										? true
										: false
								: false
							: false
						: false
	},
	/* console.log('checkExpDate', checkExpDate( fixDate('23/10/2020') )) */

	// (Common) 스캔한 국가 이름으로 정확한 국가 이름 찾기
	findCountry : (nationChar) => {
			let countryArr = []    
			//convert object to arrayList
			for(country in countryList){
					countryArr.push(e.regExp(country))
			}		
			return countryArr.filter(el => el.indexOf(e.regExp(nationChar)) !== -1)
	},
	// searching country on ID
	findCountry_onIDcard : (nationChar) => {
		for(country in countryList) {
			// console.log(countryList[country].name.toUpperCase())
			if(nationChar.toUpperCase().indexOf(countryList[country].name.toUpperCase()) > -1)
				return countryList[country].name
			// console.log(nationChar.filter(el=>el.indexOf(countryList[country].name)!==-1))
			// console.log(nationChar.filter(el=>el.indexOf(countryList[country].name)!==-1))
		}
		return false
	},
	// (Common) 국가 이름으로 국가 코드 찾기
	findCountryCode : (nationChar) => {
			let countryArr = []    
			//convert object to arrayList
			for(country in countryList) {
					countryArr.push(countryList[country])
			}
			if(nationChar.length > 0){
				const name = countryArr.filter( el => el.name.toUpperCase().indexOf(nationChar.toUpperCase()) !== -1 )			
				return name[0].value  
			}else{
				return nationChar
			}
	},
	// (Common) 국가 이름으로 국가 코드 찾기
	findCountryFullname : (nationChar) => {
		let countryArr = []    
		//convert object to arrayList
		for(country in countryList) {
				countryArr.push(countryList[country])
		}
		if(nationChar.length > 0) {
			const name = countryArr.filter( el => el.name.toUpperCase().indexOf(nationChar.toUpperCase()) !== -1 )
			return name[0].name		
		}else{
			return 'Invalid keyword'
		}
			
	},
	// (Common) 국가 코드로 국가 이름 찾기
	findCountryName : (nationCode) => {
			let countryArr = []    
			//convert object to arrayList
			for(country in countryList) {
					countryArr.push(countryList[country])
			}
			const code = countryArr.filter(el => el.value.toUpperCase().indexOf(e.rmBlank(nationCode).toUpperCase()) !== -1)
			
			return code[0].name   
	},

	// "국가명, 국가코드" 세팅
	nationality_formatter : (name, type) => {    
			return `${name.toString()}, ${type.toString().toUpperCase()}`  
	},
	// console.log(nationality_formatter('adfasdg', 'sadg'))

}


	// // 테스트 데이타
	// let idn_expDate = ":	28/10/2020"
	// let mys_expDate = "~	28/10/2020"
	// let PHL_expDate = "28/10/2020"
	// let vnm_expDate = "28/10/2020"
	// let tha_ID_expDate = '28 Sep. 2021'
	// let tha_DL_expDate = '28 October. 2020'
	// let kor_expDate = "~	28. 10. 2020."
	// let idn_dob = ": 17-10-2005"
	// let vnm_dob = " 12/ 11/ 1988"
	// let phl_ID_dob_v1 = "Sept.19.1951"
	// let phl_ID_dob_v2 = "1990/10/08"
	// let phl_ID_dob_v3 = "1990/10/08"
	// let phl_ID_dob_v4 = "05281974"
	// let phl_ID_dob_v5 = "5/19/1953"
	// let phl_DL_dob_v1 = "1961-02-24"
	// let phl_DL_dob_v2 = "1961-02-24"
	// let phl_DL_dob_v3 = "1973/11/10"
	// let tha_ID_dob = '28 Sep. 1987'
	// let tha_DL_dob = '28 September 1987'
	// let sgp_ID_dob = "09-10-1991" //Dd-MM-YYYY
	// let sgp_DL_dob_v1 = "09-10-1991"
	// let sgp_DL_dob_v2 = "22 Jan 2005"
	// let idn_ID = "NIK : 2171182202770000"
	// let idn_DL = "950518151196"
	// let mys_ID = "860110-66-5888"
	// let mys_DL_v1 = "498101752902"
	// let mys_DL_v2 = "761022135444"
	// let mys_DL_v3 = "BJ3222741PAK"
	// let mys_DL_v4 = "761022135444"
	// let vnm_ID = "030188003049"
	// let vnm_DL_v1 = "AC 044999"
	// let vnm_DL_v2 = "030188003049"
	// let vnm_ID_old = "205515341"
	// let phl_paperID = "	CONTROL NO: 33999 -B"
	// let phl_IDv1 = "1234-1234567-1"
	// let phl_6digits = "T 324343"
	// let phl_9digits = "123456789"
	// let phl_DL = "N06-12-123456"
	// let tha_ID = "3 1233 00144 13 1"
	// let tha_DL = "42004477"
	// let sgp_ID = "S7777777D"
	// let sgp_DL = "S2707707B"
	// let KOR_ID = "870226-1652419"
	// let KOR_DL = "13-02-079300-31"
	// let country_idn = "INDONESIA"
	// let country_mys1 = "KAD PENGENALAN MALAYSIA"
	// let country_mys2 = "Malaysia"
	// let country_mys3 = "MYS"
	// let country_phl = "PHL"
	// let country_tha = "Thai"
	// let country_tha2 = "Thailand"
	// let country_sgp = "SINGAPORE"
	// let country_vnm1 = "VIET NAM"
	// let country_vnm2 = "Viet Nam"
	// let country_phl1 = "PHILIP"
	// let country_phl2 = "PHL"
	// let gender_idn_male = "PRIA"
	// let gender_idn2_femle = "WANITA"
	// let gender_mys_male = "PEREMPUAN"
	// let gender_mys_femle = "LELAKI"
	// let gender_M = "M"
	// let gender_F = "F"
	// let gender_MALE = "MALE"
	// let gender_FEMALE = "FEMALE"
	// let gender_vnm1 = "Nur"
	// let gender_vnm2 = " My An,"
	// let gender_vnm3 = "Nam"
	// console.info('----------------IDN - ID - front--------------------')
	// console.log("checkIdentity_idn1::", checkIdentity(extractInt(idn_ID), "ID", "IDN"))
	// console.log("checkExpDate::", checkExpDate( fixDate( rmBlank(idn_expDate).replace(':',''))))
	// console.log("checkDateofBirth::",checkDateofBirth(changeDobToDate(fixDate(rmBlank(idn_dob).replace(':','')))))	
	// console.info('----------------IDN - ID - back--------------------')
	// 	// console.log('findCountry::', findCountry("Afg"))
	// 	// console.log('findCountryName::', findCountryName("KOR"))
	// 	// console.log('-> findCountryCode::', findCountryCode(findCountry("Afg")))
	// 	// console.log(nationality_formatter(findCountry("Kor"), findCountryCode(findCountry("Kor"))))
	// console.log("nationality_formatter", nationality_formatter(findCountry_onIDcard(country_idn), findCountryCode(findCountry_onIDcard(country_idn))))
	// console.info('----------------IDN - DL--------------------')
	// console.log("checkIdentity_idn2::", checkIdentity(extractInt(idn_DL), "DL", "IDN"))
	// console.log("checkExpDate::", checkExpDate( fixDate( rmBlank(idn_expDate).replace(':',''))))
	// console.log("nationality_formatter::", nationality_formatter(findCountry_onIDcard(country_idn), findCountryCode(findCountry_onIDcard(country_idn))))
	// console.log("checkGender1::", checkGender(gender_idn_male, "IDN"))
	// console.log("checkGender2::", checkGender(gender_idn2_femle, "IDN"))
	// console.info('----------------MYS - ID--------------------')
	// console.log("checkIdentity_mys1::", checkIdentity(rmBlank(mys_ID), "ID", "MYS"))
	// console.log("checkDateofBirth", checkDateofBirth(changeDobToDate(changeDobType1(getDoB_fromID(mys_ID)))))	
	// console.log("nationality_formatter1::", nationality_formatter(findCountry_onIDcard(country_mys1), findCountryCode(findCountry_onIDcard(country_mys1))))
	// console.log("checkGender1::", checkGender(gender_mys_male, "MYS"))
	// console.log("checkGender2::", checkGender(gender_mys_femle, "MYS"))
	// console.info('----------------MYS - DL--------------------')
	// console.log("checkIdentity_mys2::", checkIdentity(extractInt(mys_DL_v1), "DL-v1", "MYS"))
	// console.log("checkIdentity_mys3::", checkIdentity(extractInt(mys_DL_v2), "DL-v2", "MYS"))
	// console.log("checkIdentity_mys4::", checkIdentity(rmBlank(mys_DL_v3), "DL-v3", "MYS"))
	// console.log("checkIdentity_mys5::", checkIdentity(extractInt(mys_DL_v4), "DL-v4", "MYS"))
	// console.log("checkExpDate::", checkExpDate(fixDate( rmBlank(mys_expDate))))
	// console.log("checkDateofBirth1", checkDateofBirth(changeDobToDate(changeDobType1(getDoB_fromID(mys_DL_v2)))))
	// console.log("checkDateofBirth2", checkDateofBirth(changeDobToDate(changeDobType1(getDoB_fromID(mys_DL_v4)))))	
	// 	console.log("checkGender1::", checkGender(gender_mys_male, "MYS"))
	// 	console.log("checkGender2::", checkGender(gender_mys_femle, "MYS"))
	// 	console.log("nationality_formatter2::", nationality_formatter(findCountryFullname(country_mys2), findCountryCode(findCountryFullname(country_mys2))))
	// 	console.log("nationality_formatter3::",nationality_formatter(findCountryName(country_mys3), findCountryCode(findCountryName(country_mys3))))
	// console.info('----------------VNM - ID--------------------')
	// console.log("checkIdentity_vnm1::", checkIdentity(extractInt(vnm_ID), "ID", "VNM"))
	// console.log("checkIdentity_vnm2::", checkIdentity(rmBlank(vnm_ID_old), "OLD-ID", "VNM"))
	// console.log("checkExpDate::", checkExpDate( fixDate( rmBlank(vnm_expDate))))
	// console.log("checkDateofBirth",checkDateofBirth(changeDobToDate(fixDate(rmBlank(vnm_dob)))))
	// console.log("nationality_formatter1::", nationality_formatter(findCountryFullname(country_vnm1), findCountryCode(findCountryFullname(country_vnm1))))
	// console.log("nationality_formatter2::", nationality_formatter(findCountryFullname(country_vnm2), findCountryCode(findCountryFullname(country_vnm2))))
	// 	console.log("checkGender1::", checkGender(vnm_ID, "VNM"))
	// console.info('----------------VNM - DL--------------------')
	// console.log("checkIdentity_vnm3::", checkIdentity(rmBlank(vnm_DL_v1), "DL-v1", "VNM"))
	// console.log("checkIdentity_vnm4::", checkIdentity(rmBlank(vnm_DL_v2), "DL-v2", "VNM"))
	// console.log("checkDateofBirth",checkDateofBirth(changeDobToDate(fixDate(rmBlank(vnm_dob)))))
	// console.log("checkExpDate::", checkExpDate( fixDate( rmBlank(vnm_expDate))))
	// console.log("nationality_formatter3::", nationality_formatter(findCountryFullname(country_vnm1), findCountryCode(findCountryFullname(country_vnm1))))
	// console.info('----------------PHL - ID--------------------')
	// console.log("checkIdentity_phl1::", checkIdentity(rmBlank(phl_paperID), "ID-paper", "PHL"))
	// console.log("checkIdentity_phl2::", checkIdentity(rmBlank(phl_IDv1), "ID-v2", "PHL"))
	// console.log("checkIdentity_phl3::", checkIdentity(rmBlank(phl_IDv1), "ID-v3", "PHL"))
	// console.log("checkIdentity_phl4::", checkIdentity(rmBlank(phl_6digits), "ID-6digits-back", "PHL"))
	// console.log("checkIdentity_phl5::", checkIdentity(rmBlank(phl_9digits), "ID-9digits-back", "PHL"))
	// console.log("checkExpDate::", checkExpDate( fixDate( rmBlank(PHL_expDate))))
	// console.log("checkDateofBirth1",checkDateofBirth(changeDobToDate(fixDate(rmBlank(phl_ID_dob_v1)))))
	// console.log("checkDateofBirth2",checkDateofBirth(changeDobToDate(fixDate(rmBlank(phl_ID_dob_v2)))))
	// console.log("checkDateofBirth3",checkDateofBirth(changeDobToDate(fixDate(rmBlank(phl_ID_dob_v3)))))
	// console.log("checkDateofBirth4",checkDateofBirth(changeDobToDate_PHL_ID(changeDobType1(rmBlank(phl_ID_dob_v4)))))
	// console.log("checkDateofBirth5",checkDateofBirth(changeDobToDate_PHL_ID(rmBlank(phl_ID_dob_v5))))
	// console.log("nationality_formatter1::", nationality_formatter(findCountryFullname(country_phl1), findCountryCode(findCountryFullname(country_phl1))))
	// 	console.log("checkGender1::", checkGender(gender_F))
	// 	console.log("checkGender2::", checkGender(gender_M))
	// 	console.log("checkGender3::", checkGender(gender_FEMALE))
	// 	console.log("checkGender4::", checkGender(gender_MALE))
	// console.info('----------------PHL - DL--------------------')
	// console.log("checkIdentity_phl6::", checkIdentity(rmBlank(phl_DL), "DL", "PHL")) // 3IDs on the driver license are same type
	// console.log("checkExpDate::", checkExpDate( fixDate( rmBlank(PHL_expDate))))
	// console.log("checkDateofBirth6",checkDateofBirth(changeDobToDate(fixDate(rmBlank(phl_DL_dob_v1)))))
	// console.log("checkDateofBirth7",checkDateofBirth(changeDobToDate(fixDate(rmBlank(phl_DL_dob_v2)))))
	// console.log("checkDateofBirth8",checkDateofBirth(changeDobToDate(fixDate(rmBlank(phl_DL_dob_v3)))))
	// console.log("nationality_formatter2::", nationality_formatter(findCountryFullname(country_phl1), findCountryCode(findCountryFullname(country_phl1))))
	// console.log("nationality_formatter3::", nationality_formatter(findCountryName(country_phl2), findCountryCode(findCountryName(country_phl2))))
	// 	console.log("checkGender1::", checkGender(gender_F))
	// 	console.log("checkGender2::", checkGender(gender_M))
	// console.info('----------------THA - ID--------------------')
	// console.log("checkIdentity_THA1::", checkIdentity(extractInt(tha_ID), "ID", "THA"))
	// console.log('checkExpDate', checkExpDate(literalMonth_Formatter(tha_ID_expDate)))	 
	// console.log('checkDateofBirth', checkDateofBirth(changeDobToDate(literalMonth_Formatter(tha_ID_dob))))
	// console.log("nationality_formatter::",nationality_formatter(findCountryFullname(country_tha), findCountryCode(country_tha)))
	// console.info('----------------THA - DL--------------------')
	// console.log("checkIdentity_THA2::", checkIdentity(extractInt(tha_DL), "DL", "THA"))
	// console.log('checkExpDate', checkExpDate(literalMonth_Formatter(tha_DL_expDate)))	 
	// console.log('checkDateofBirth', checkDateofBirth(changeDobToDate(literalMonth_Formatter(tha_DL_dob))))
	// console.log("nationality_formatter::", nationality_formatter(findCountryFullname(country_tha2), findCountryCode(country_tha2)))
	// console.info('----------------SGP - ID--------------------')
	// console.log("checkIdentity_SGP1::", checkIdentity(rmBlank(sgp_ID), "ID", "SGP"))
	// console.log("checkDateofBirth1",checkDateofBirth(changeDobToDate(fixDate(rmBlank(sgp_ID_dob)))))
	// console.log("nationality_formatter::", nationality_formatter(findCountryFullname(country_tha2), findCountryCode(country_tha2)))
	// 	console.log("checkGender1::", checkGender(gender_F))
	// 	console.log("checkGender2::", checkGender(gender_M))
	// console.info('----------------SGP - DL--------------------')
	// console.log("checkIdentity_SGP2::", checkIdentity(rmBlank(sgp_DL), "DL", "SGP"))
	// console.log("checkDateofBirth2",checkDateofBirth(changeDobToDate(fixDate(rmBlank(sgp_DL_dob_v1)))))
	// console.log("checkDateofBirth3",checkDateofBirth(changeDobToDate(literalMonth_Formatter(sgp_DL_dob_v2))))
	// console.log("nationality_formatter::", nationality_formatter(findCountryFullname(country_sgp), findCountryCode(country_sgp)))
	// console.info('----------------KOR - ID--------------------')
	// console.log("checkIdentity_KOR1::", checkIdentity(rmBlank(KOR_ID), "ID", "KOR"))
	// console.log("checkDateofBirth1", checkDateofBirth(changeDobToDate(changeDobType1(getDoB_fromID(KOR_ID)))))	
	// console.info('----------------KOR - DL--------------------')
	// console.log("checkIdentity_KOR2::", checkIdentity(rmBlank(KOR_DL), "DL", "KOR"))
	// console.log("checkExpDate::",  checkExpDate(fixDate( rmBlank(kor_expDate.replace(/~|:|\//gi, '')))))
	// console.log("checkDateofBirth2::", checkDateofBirth(changeDobToDate(changeDobType1(getDoB_fromID(KOR_ID)))))
	// 	console.log('checkGender::', checkGender(KOR_ID, "KOR"))
	// 	const nation_kor = isKorea(KOR_ID) ? "South Korea" : false
	// 	console.log('nationality_formatter::',nationality_formatter(nation_kor, findCountryCode(nation_kor)))