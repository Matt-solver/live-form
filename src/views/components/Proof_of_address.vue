<template>
  <div class="wrap fadein" v-resize="onResize">    
        <canvas ref="canvas" class="off" ></canvas>
    <Header :dataOfChild="input0" v-on:update="backBtn"></Header>

    <FormulateForm
        class="form-wrapper"
        v-model="formdata"
        @submit="submit"
        style="height: 85vh;overflow-y: auto;"
    >
      <FormulateInput
        :label=this.addressString
        type="group"
        validation="address"
        :validation-rules="{ address: addressRule }"
        :validation-messages="{ address: addressMessage }"
      >
        <FormulateInput
          id="Street"
          class="text-left"
          :name=input7
          validation="required"
          :placeholder=this.input1
          :onkeypress="test('Street')"
        />
        <FormulateInput
          class="text-left"
          name="Street2"
          :placeholder=this.input2
        />
        <div class="triple mb-4">
          <FormulateInput
            id="City"
            class="text-left"
            :name=input8
            validation="required"
            :placeholder=this.input3
            :onkeypress="test('City')"
          />
          <FormulateInput
            id="State"
            class="text-left"
            :name=input9
            validation="required"
            :placeholder=this.input5
            :onkeypress="test('State')"
          />
          <FormulateInput
            id="Country"
            class="text-left"
            :name=input10
            validation="required"
            :placeholder=this.input4
            :value="this.countryValue"
            :onkeypress="test('Country')"
          />
          <FormulateInput
            id="Zipcode"
            class="text-left"
            :name=input11
            validation="required"
            :placeholder=this.input6
            :onkeypress="test('Zipcode')"
          />
        </div>
        <FormulateInput
          type="file"
          capture="camera"
          class="text-left"
          :name=input12
          :label=input12
          accept="image/*"
          validation="required"
          :onkeypress="test('image')"
        />
      </FormulateInput>
      
      <FormulateInput
          type="submit"
          :value=this.submitBtn
      />
    </FormulateForm>
  </div>
</template>
<script>
import {Proof_of_address} from '@/mixin/Proof_of_address'
import Header from './childComponent/Header'
require('../../css/snow.css')

export default {
  mixins: [Proof_of_address],
  components:{
    Header,
  },
}
</script>
<style scoped>
.form-wrapper {
  padding: 2em;
  /* border: 3px solid #ececec; */
  border-radius: .5em;
  box-sizing: border-box;
  max-width: 600px;
}
.form-wrapper::v-deep .formulate-input-element {
  max-width: none;
  text-align: center;
}
@media (min-width: 600px) {
  .triple {
    display: flex;
  }
  .wrap {
    min-width: 600px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .triple .formulate-input {
    margin-bottom: .25em;
    margin-right: 1em;
    flex-grow: 1;
  }
  .triple .formulate-input[data-classification="select"] {
    flex: 0 0 5em;
  }
  .triple .formulate-input:last-child {
    margin-right: 0;
  }
}
@media (min-width: 720px) {
  .triple {
    display: block;
  }
  .triple .formulate-input {
    margin-bottom: 1.5em;
    margin-right: 0;
  }
}
@media (min-width: 850px) {
  .triple {
    display: flex;
  }
  .triple .formulate-input {
    margin-bottom: .25em;
    margin-right: 1em;
  }
  .triple .formulate-input:last-child {
    margin-right: 0;
  }
}

</style>