<template>
  <v-container class="container" style="height:100%">
    <v-dialog v-model="redlight" max-width="500px" persistent>
      <div class="mb-2 error" style="text-align:center">
        <v-icon class="pa-3" style="color:#fff" x-large dark right>
          mdi-cancel
        </v-icon>
      </div>
      <div id="layerPop" style="background:#ffffff">
        <v-row justify="center">
          <v-col
            cols="12"
            align="center"
            justify="center"
            style="min-height:100%"
          >
            <div style="max-width:60px;min-height:6%">
              <!-- <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 142.2 142.2">
								<circle class="path circle" fill="none" stroke="#D06079" stroke-width="17" stroke-miterlimit="25" cx="65.1" cy="65.1" r="62.1"/>
								<line class="path line" fill="none" stroke="#D06079" stroke-width="17" stroke-linecap="round" stroke-miterlimit="17" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
								<line class="path line" fill="none" stroke="#D06079" stroke-width="17" stroke-linecap="round" stroke-miterlimit="17" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
							</svg> -->
            </div>
            <div class="my-5 px-5">
              <span style="color:#000000">{{ message }} </span>
            </div>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col id="goOut" class="mb-5" align="center" justify="center">
            <v-btn color="primary" @click="nextBtn()">
              <span style="color:white">Confirm</span>
            </v-btn>
          </v-col>
          <v-col v-if="step" align="center" justify="center">
            <v-btn color="primary" @click="nextBtn()">
              Retry
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-dialog>
  </v-container>
</template>

<script>
import comm from "@/mixin/common";

export default {
  data: () => ({
    redlight: true,
    step: null,
    message: "An occurred error",
    failcnt: null,
    errorType: null,
  }),
  async mounted() {
    if (this.$route.params) {
      //target page name
      this.step = this.$route.params.step;
      //Error type
      this.errorType = this.$route.params.errorType;
      //Response result
      this.message = this.$route.params.message;
      //fail count
      // this.$session.set("_failCnt", this.$session.get("_failCnt") + 1);
      // this.failcnt = this.$session.get("_failCnt");
      // console.log(this.failcnt);
      this.message = "";

      if (this.errorType === 200) {
        //fail
        this.message =
          this.$route.params.message + " check fail. Please, Re-try";
      } else if (this.errorType === 204) {
        //no data
        this.message = "No contents. Please, Re-try";
      } else if (this.errorType === 403) {
        // Request server error
        if (this.$route.params.message)
          this.message = this.$route.params.message;
        else this.message = "Request Error. ";
      } else if (this.errorType === 401) {
        //Access error
        this.message = "Access Denied due to invalid request. ";
      } else if (this.errorType === 404) {
        this.message = "An occurred session error.";
      } else if (this.errorType === 500) {
        // Response Server error
        this.message = "Internal Server Error. ";
      } else {
        if (this.$route.params.message)
          this.message = this.$route.params.message;
        else {
          this.message = "Unknown Error.";
        }
      }
    }
  },
  methods: {
    nextBtn: function() {
      let project_id = this.$session.get("_projectId");
      let email = this.$session.get("_email");
      let apiKey = comm.get_localStorage_with_expiry("_apiKey");
      let oobCode = comm.get_localStorage_with_expiry("_oobCode");
      let theme = this.$store.state.isDark;

      if (project_id && email && apiKey && oobCode)
        this.$router.push(
          `/main?pid=${project_id}&email=${email}&theme=${theme}&apiKey=${apiKey}&oobCode=${oobCode}&mode=signIn`
        );
      else if (project_id)
        this.$router.push(
          `/main?pid=${project_id}&theme=${theme}`
        );
      else
        window.location.href = ''
      // else

      /*if(this.failcnt === 0) {
					this.$router.push(`/v2/pid/${this.$session.get("_projectId")}/cid/${this.$session.get("_email")}/theme/${this.store.state.isDark}`);
				
				}else if(this.failcnt === -1) {
					if(this.$store.state.connectionLink)
						window.location.href = this.$store.state.connectionLink
					else
						window.location.href = ''

				}else if(this.failcnt > 2){
			// eslint-disable-next-line no-mixed-spaces-and-tabs
					this.$router.push({
						name: "Step0",
						params:{
							failcnt: this.failcnt,						
						}
					});				
				}else{
					this.$router.push({
						name: "Step0",
						params:{
							failcnt: this.failcnt,
							message: this.message
						}
					});
				}
			}*/
    },
  },
};
</script>
<style></style>
