const firebase = require("firebase/app");
// const functions = firebase.functions().useEmulator("localhost", 5001)
const comm = require("./common");

export default function submit(self, params, type) {
    console.log("⭐⭐submit");
    self.cnt = 30;
    comm.scoreCounter(self, self.cnt, 40);
    // try {
    switch (type) {
        case "LiveKYC":
            return LiveKYC(params);
            // case 'idCheck': return idCheck(params)
            // case 'faceCheck': return faceCheck(params)
            // case 'submit': return submit(params)
        default:
            return "Not defined the check type.";
    }
    async function LiveKYC(params) {
        console.log("✔️LiveKYC")
        console.log("Input data", params);
        self.cnt = 75;
        comm.scoreCounter(self, self.cnt, 30);
        try {
            //Call API
            const submit = firebase
                .app()
                .functions("asia-northeast1")
                .httpsCallable("LiveKYC");
            self.cnt = 90;
            comm.scoreCounter(self, self.cnt, 1000);

            /*** Temporary marked ***/
            console.log("🌈 Gathering the DATASET from vuex store")
            console.log('getProjectId',params.getProjectId())
            console.log('getIdImage',params.getIdImage())
            console.log('getFaceImage', params.getFaceImage())
            console.log('getAddress', params.getAddress())
            console.log('getAddressImage', params.getAddressImage())
            /*****/
            const rs_params = await submit({
                params: {
                    ds_addressImage: params.getAddressImage(),
                    ds_userid: params.getUserid(),
                    ds_retryCounter: params.getRetryCounter(),
                    ds_projectId: params.getProjectId(),
                    ds_issuingCountry: params.getIssuingCountry(),
                    ds_idType: params.getIdType(),
                    ds_idImage: params.getIdImage(),
                    ds_faceImage: params.getFaceImage(),
                    ds_email: params.getEmail(),
                    ds_address: params.getAddress(),
                },
            });
            self.cnt = 100;
            comm.scoreCounter(self, self.cnt, 15);

            console.log("💾 rs_params.data", rs_params.data);
            return comm.extractErrorcode(comm.extractInt)(rs_params.data);

        } catch (error) {
            if (error) {
                comm.scoreCounter(self, 50, 30);
                return error;
            }
        }
    }
}
// async function idCheck(params) {
//   //::::::::::::::ID CHECK::::::::::::::
//   if (params.ds_ID_type !== "passport") {
//     try {
//       const idcheck = functions.httpsCallable('idcheck');
//       const rs_Idcheck = await idcheck({ params: params }) // data.params.ds_***

//       // output
//       if(rs_Idcheck){
//         if(rs_Idcheck.data){
//           console.log('> ID_extractErrorcode:', comm.extractErrorcode(comm.extractInt)(rs_Idcheck.data));
//           return comm.extractErrorcode(comm.extractInt)(rs_Idcheck.data)

//         } else {
//           throw new Error("No data")
//         }
//       } else {
//         throw new Error("No data")
//       }

//     } catch (error) { if(error)  return error }

//   //::::::::::::::PASSPORT CHECK::::::::::::::
//   } else if(params.ds_ID_type === "passport") {  // No issue date for passport only

//     try{
//       const mrzCheck = functions.httpsCallable("idcheck");
//       const rs_mrzCheck = await mrzCheck({params: params})
//       console.log('> rs_mrzCheck: ', rs_mrzCheck)

//       if(rs_mrzCheck.data){
//         return rs_mrzCheck.data

//       } else {
//         throw new Error("No data")
//       }

//     } catch (error) { if(error)  return error }
//   }

// }

// async function faceCheck(params) {
//   try {
//     //Call API
//     const faceCheck = functions.httpsCallable("facecheck")
//     const rs_faceCheck = await faceCheck({params: params})
//     console.log('> FACE_extractErrorcode:', comm.extractErrorcode(comm.extractInt)(rs_faceCheck.data));

//     //output
//     return comm.extractErrorcode(comm.extractInt)(rs_faceCheck.data)

//   } catch (error) { if(error)  return error }

// }

// async function submit(params) {
//   //input
//   console.log('Submit params', JSON.stringify(params, 2));

//   try {
//     //Call API
//     const submit = functions.httpsCallable("submit");
//     const rs_submit = await submit({params: params});
//     //output
//     console.log('> rs_submit',rs_submit)
//     console.log('> SUBMIT_extractErrorcode:', comm.extractErrorcode(comm.extractInt)(rs_submit.data));

//     return comm.extractErrorcode(comm.extractInt)(rs_submit.data)

//   } catch (error) { if(error) return error }

// }