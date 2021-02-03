const functions = require("firebase-functions");
// const admin = require('firebase-admin');
const axios = require("axios");
var qs = require("qs");
const FormData = require("form-data");
const config = require("./firebaseConfig.json");
const mailConfig = require("./mailConfig.json");
const fs = require("fs");
const { v1: uuidv1 } = require("uuid");
const nodemailer = require("nodemailer");
// function blobToFile (blob, fileName) {
//     //A Blob() is almost a File() - it's just missing the two properties below which we will add
//     blob.lastModifiedDate = new Date();
//     blob.name = fileName;
//     return blob;
// }
// function getBlobImg (data) {
//   return new Promise((resolve) =>{
//     data.toBlob(async function(blob){
//       resolve(blob)
//     },'image/png',1)

//   })
// }

exports.LiveKYC = functions
    .region("asia-northeast1")
    .https.onCall((data, context) => {
        console.log("::::::::::: Start LiveKYC :::::::::::2222");

        const fileName = uuidv1() + ".png";
        const form = new FormData();

        console.log("> data.params", data.params);
        if (data.params) {
            let L2Flag = "false";
            //Dataset
            // form.append('retryCounter', data.params.ds_retryCounter);
            form.append("projectId", data.params.ds_projectId);
            form.append("issuingCountry", data.params.ds_issuingCountry);
            form.append("idType", data.params.ds_idType);
            form.append("email", data.params.ds_email);
            if (data.params.userid) form.append("userid", data.params.userid);

            let addrObj = data.params.ds_address;
            //L2 일 경우 주소지 정보 입력
            if (data.params.ds_address.city) {
                L2Flag = "true";
                form.append("address_city", addrObj.city);
                form.append("address_country", addrObj.country);
                form.append("address_state", addrObj.state);
                form.append("address_street", addrObj.street);
                form.append("address_street2", addrObj.street2);
                form.append("address_zipcode", addrObj.zipcode);
                form.append(
                    "address_res",
                    "https://s3-ap-northeast-2.amazonaws.com/argos-applicant-images/billsample.png"
                );
            }
            form.append("l2Flag", L2Flag);
            // let frontImg = data.params.ds_idImage.img_front
            // // let backImag = data.params.ds_idImage.img_back
            // let faceImg = data.params.ds_faceImage

            // // const frontImgBlob = new Promise(resolve => frontImg.toBlob(resolve, 'image/png'))
            // // const faceImgBlob = new Promise(resolve => faceImg.toBlob(resolve, 'image/png'))

            // // Promise.all([frontImgBlob, faceImgBlob]).then((values) => {
            //     form.append('idImage',Buffer.from(frontImg),"front_"+fileName)
            //     // form.append('idImageBack',backImgBlob, "back_" +fileName)
            //     form.append('faceImage',Buffer.from(faceImg),"face_"+fileName)

            //Remove base64 header
            if (data.params.ds_idImage) {
                if (data.params.ds_idImage.img_front) {
                    let tmpArr_front = data.params.ds_idImage.img_front.split(",");
                    let _front_arr = tmpArr_front[0].split("/");
                    let front_type = _front_arr[1].split(";");
                    // console.log('front_type: ',front_type)
                    //construct file(***firebase에서 지정한 경로:/tmp/)
                    fs.writeFileSync(
                        "/tmp/front_" + fileName + "." + front_type[0],
                        tmpArr_front[1],
                        "base64"
                    );

                    //create file stream
                    const getFrontimg = fs.createReadStream(
                        "/tmp/front_" + fileName + "." + front_type[0]
                    );
                    form.append("idImage", getFrontimg ? getFrontimg : "");
                }
                if (data.params.ds_idImage.img_back) {
                    let tmpArr_back = data.params.ds_idImage.img_back.split(",");
                    let _back_arr = tmpArr_back[0].split("/");
                    let back_type = _back_arr[1].split(";");
                    // console.log('back_type: ',back_type)
                    //construct file(***firebase에서 지정한 경로:/tmp/)
                    fs.writeFileSync(
                        "/tmp/back_" + fileName + "." + back_type[0],
                        tmpArr_back[1],
                        "base64"
                    );

                    //create file stream
                    const getBackimg = fs.createReadStream(
                        "/tmp/back_" + fileName + "." + back_type[0]
                    );
                    form.append("idImage_back", getBackimg ? getBackimg : "");
                }
            }
            if (data.params.ds_faceImage) {
                let tmpArr_face = data.params.ds_faceImage.split(",");
                let _face_arr = tmpArr_face[0].split("/");
                let face_type = _face_arr[1].split(";");
                //construct file(***firebase에서 지정한 경로:/tmp/)
                fs.writeFileSync(
                    "/tmp/face_" + fileName + "." + face_type[0],
                    tmpArr_face[1],
                    "base64"
                );

                //create file stream
                const getFaceImage = fs.createReadStream(
                    "/tmp/face_" + fileName + "." + face_type[0]
                );
                form.append("faceImage", getFaceImage ? getFaceImage : "");
            }
            if (data.params.ds_addressImage) {
                let tmpArr_addr = data.params.ds_addressImage.split(",");
                let _addr_arr = tmpArr_addr[0].split("/");
                let addr_type = _addr_arr[1].split(";");
                //construct file(***firebase에서 지정한 경로:/tmp/)
                fs.writeFileSync(
                    "/tmp/addr_" + fileName + "." + addr_type[0],
                    tmpArr_addr[1],
                    "base64"
                );

                //create file stream
                const getAddrImage = fs.createReadStream(
                    "/tmp/addr_" + fileName + "." + addr_type[0]
                );
                form.append("addressImage", getAddrImage ? getAddrImage : "");
            }

            const axiosConfig = {
                method: "post",
                url: "https://api2.argos-solutions.io/f2/livekyc",
                headers: {
                    "x-api-key": config.apiKey,
                    "Content-Type": "multipart/form-data; boundary=" + form.getBoundary(),
                },
                data: form,
            };

            // Call API
            return axios(axiosConfig)
                .then((response) => {
                    console.log("> ID Response: " + response.status);
                    for (output in response) {
                        console.debug(">> response", JSON.stringify(output));
                    }

                    const resultSet = {
                        status: response.status ? response.status : 0,
                        data: response.data ? response.data : "",
                    };
                    const result = response.status === 200 ? resultSet : response.status;
                    for (output in result) {
                        console.debug(">> result", JSON.stringify(output));
                    }
                    return result;
                })
                .catch((errObj) => {
                    console.error("> ERROR:\n", errObj);
                    return errObj.toString();
                })
                .finally(function() {
                    console.log("::::::::::: End idcheck :::::::::::");
                });
            // })
        } else {
            return {
                errorcode: 204,
                message: "no data params",
            };
        }
    });

exports.idcheck = functions
    .region("asia-northeast1")
    .https.onCall((data, context) => {
        console.log("::::::::::: Start idcheck :::::::::::\n", data);

        const fileID = uuidv1(); // 동일 아이디 생성을 위한 메모리 할당
        const form = new FormData();

        if (data.params) {
            //Dataset
            form.append("projectId", data.params.ds_pid);
            form.append("idType", data.params.ds_ID_type);
            form.append("issuingCountry", data.params.ds_ocr_IssCode);

            //Remove base64 header
            if (data.params.ds_ID_file.img_front) {
                let tmpArr_front = data.params.ds_ID_file.img_front.split(",");
                let _front_arr = tmpArr_front[0].split("/");
                let front_type = _front_arr[1].split(";");
                // console.log('front_type: ',front_type)
                //construct file(***firebase에서 지정한 경로:/tmp/)
                fs.writeFileSync(
                    "/tmp/" + fileID + "_front." + front_type[0],
                    tmpArr_front[1],
                    "base64"
                );
                //create file stream
                const getFrontimg = fs.createReadStream(
                    "/tmp/" + fileID + "_front." + front_type[0]
                );
                form.append("image", getFrontimg ? getFrontimg : "");
            }
            if (data.params.ds_ID_file.img_back) {
                let tmpArr_back = data.params.ds_ID_file.img_back.split(",");
                let _back_arr = tmpArr_back[0].split("/");
                let back_type = _back_arr[1].split(";");
                //construct file(***firebase에서 지정한 경로:/tmp/)
                fs.writeFileSync(
                    "/tmp/" + fileID + "_back." + back_type[0],
                    tmpArr_back[1],
                    "base64"
                );
                //create file stream
                const getBackimg = fs.createReadStream(
                    "/tmp/" + fileID + "_back." + back_type[0]
                );
                form.append("imageBack", getBackimg ? getBackimg : "");
            }
            // console.log('>>>>>> form', form)

            const axiosConfig = {
                method: "post",
                url: "https://api2.argos-solutions.io/f2/idcheck",
                headers: {
                    "x-api-key": config.apiKey,
                    "Content-Type": "multipart/form-data; boundary=" + form.getBoundary(),
                },
                data: form,
            };

            // Call API
            return axios(axiosConfig)
                .then((response) => {
                    console.log("> ID Response: " + response.status);
                    console.log(response);

                    const resultSet = {
                        status: response.status ? response.status : 0,
                        idProcessID: response.data.idProcessID ?
                            response.data.idProcessID :
                            "",
                        idCheckResult: response.data.idCheckResult ?
                            response.data.idCheckResult :
                            "",
                    };
                    const result = response.status === 200 ? resultSet : response.status;
                    console.debug(">>>>> result", result);
                    return result;
                })
                .catch((errObj) => {
                    console.error("> ERROR:\n", errObj);
                    return errObj.toString();
                })
                .finally(function() {
                    console.log("::::::::::: End idcheck :::::::::::");
                });
        } else {
            return {
                errorcode: 204,
                message: "no data params",
            };
        }
    });

exports.facecheck = functions
    .region("asia-northeast1")
    .https.onCall((data, context) => {
        console.log("::::::::::: Start Facecheck :::::::::::\n", data);
        const fileID = uuidv1(); // 동일 아이디 생성을 위한 메모리 할당
        const form = new FormData();

        if (data.params) {
            //Dataset
            form.append("projectId", data.params.ds_pid ? data.params.ds_pid : "");
            form.append(
                "idProcessID",
                data.params.ds_idProcessID ? data.params.ds_idProcessID : ""
            );

            //remove base64 header
            if (data.params.ds_file) {
                let file_arr = data.params.ds_file.split(",");
                let type_arr = file_arr[0].split("/");
                let img_type = type_arr[1].split(";");
                // console.log('img_type: ',img_type)
                //construct file
                fs.writeFileSync(
                    "/tmp/" + fileID + "." + img_type[0],
                    file_arr[1],
                    "base64"
                );
                //create file stream
                const getImg = fs.createReadStream(
                    "/tmp/" + fileID + "." + img_type[0]
                );
                console.log(">> getImg", getImg);
                form.append("image", getImg ? getImg : "");
            }
            // console.log('>>>>>> form', form)

            const headers = {
                "x-api-key": config.apiKey,
                "Content-Type": "multipart/form-data; boundary=" + form.getBoundary(),
            };
            const axiosConfig = {
                method: "post",
                url: "https://api2.argos-solutions.io/f2/facecheck",
                headers: headers,
                data: form,
            };

            // Call API
            return axios(axiosConfig)
                .then((response) => {
                    console.log("> Face Response: " + response.status);
                    console.log(response.data);

                    const resultSet = {
                        status: response.status ? response.status : 0,
                        faceProcessID: response.data.faceProcessID ?
                            response.data.faceProcessID :
                            "",
                        faceCheckResult: response.data.idFaceCompare ?
                            response.data.idFaceCompare :
                            "", //faceCheckResult -> idFaceCompare 임시변경
                    };
                    const result = response.status === 200 ? resultSet : response.status;
                    console.debug(">>>>> result", result);
                    return result;
                    // return response.data
                })
                .catch((errObj) => {
                    console.error("> ERROR:\n", errObj);
                    return errObj.toString();
                })
                .finally(function() {
                    console.log("::::::::::: End Facecheck :::::::::::");
                });
        } else {
            return {
                errorcode: 204,
                message: "no data params",
            };
        }
    });

exports.submit = functions
    .region("asia-northeast1")
    .https.onCall((data, context) => {
        console.log("::::::::::: Start submit :::::::::::\n", data);
        const headers = {
            "x-api-key": config.apiKey,
            "Content-Type": "application/x-www-form-urlencoded",
        };
        if (data.params)
            if (
                data.params.ds_pid &&
                data.params.ds_email &&
                (data.params.ds_idProcessID || data.params.ds_faceProcessID)
            ) {
                let postdata = qs.stringify({
                    projectId: data.params.ds_pid ? data.params.ds_pid : "",
                    email: data.params.ds_email ? data.params.ds_email : "",
                    idProcessID: data.params.ds_idProcessID ?
                        data.params.ds_idProcessID :
                        "",
                    faceProcessID: data.params.ds_faceProcessID ?
                        data.params.ds_faceProcessID :
                        "",
                });

                let axiosConfig = {
                    method: "post",
                    url: "https://api2.argos-solutions.io/f2/submit",
                    headers: headers,
                    data: postdata,
                };

                return axios(axiosConfig)
                    .then((response) => {
                        console.log("> Response: " + response);
                        const result =
                            response.status === 200 ? response.data : response.status;
                        console.debug(">>>>> result", result);
                        return result;
                    })
                    .catch((errObj) => {
                        console.error("> ERROR:\n", errObj);
                        return errObj.toString();
                    })
                    .finally(function() {
                        console.log("::::::::::: End submit :::::::::::");
                    });
            } else {
                console.log("invalid input data");
                return "invalid input data";
            }
    });

exports.getCustomizationOptions = functions
    .region("asia-northeast1")
    .https.onCall((data, context) => {
        console.log("Start Firebase getCustomerID.");
        if (data) {
            if (data.params) {
                const pid = data.params.ds_pid;
                console.log("ds_pid: ", pid);

                const config = {
                    headers: {
                        "x-api-key": "GvRuc1O7FE3Uc9Tgmtq1LsgtG2u5wAC7dHqv2hch",
                        // "access-key": accessKey
                    },
                };
                return axios
                    .get(
                        "https://team-api.argos-solutions.io/v1/projects/formoptions/" +
                        pid,
                        config
                    )
                    .then((response) => {
                        if (response.data) {
                            if (response.data.options) {
                                const res = {
                                    rs_LOGO: response.data.options.logo,
                                    rs_TYPE: response.data.options.type,
                                    rs_blacklistCountries: response.data.options.blacklistCountries,
                                    rs_ageLimit: response.data.options.ageLimit,
                                    rs_connectionLink: response.data.comburl,
                                    rs_kycLevel: response.data.kycLevel,
                                    rs_termsOfUse: response.data.termsOfUse,
                                    rs_privacyPolicy: response.data.privacyPolicy,
                                    rs_emailVerification: response.data.emailVerification,
                                };
                                console.log(res);

                                return res;
                            }
                        } else {
                            console.log(">>> response", response)
                            if (!response.data) return "No response data";
                            else throw new Error("An occurred Error. ", response.status);
                        }

                        // return response.data;
                    })
                    .catch((errObj) => {
                        console.error("> ERROR:\n", errObj);
                        throw errObj.toString();
                    });
            }
        }
        return res;
    });

exports.getEmailAuthenticationCode = functions
    .region("asia-northeast1")
    .https.onCall((data, context) => {
        let emailRule = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        let isEmail = emailRule.test(data.email) || "E-mail must be valid.";

        if (isEmail) {
            let result = sendMail(data.email).catch(console.error);
            return result;
        } else {
            return "Invalid Email address.";
        }
    });
async function sendMail(email) {
    try {
        let min = 1000000000,
            max = 9999999999;
        const authentication_code = (Math.floor(Math.random() * (max - min)) + min)
            .toString()
            .substr(3, 6);
        let message = {
            from: "exorsa@argos-solutions.io",
            to: email,
            subject: "Argos liveform authentication code.",
            html: `<p> code : ${authentication_code} </p>`,
        };
        let transporter = nodemailer.createTransport(mailConfig);
        let info = await transporter.sendMail(message);

        console.log("Message sent: %s", info.messageId);

        return { code: authentication_code };
    } catch (error) {
        console.log(error);
    }
}