<template>
  <div>
      <b-container class="ma-0 pa-0 bv-example-row">
        <b-row align-h="start" style="height:100%">
          <b-col cols="12" class="pb-7">
            <b-card-text
              class="ma-0 pb-0 text-left overflow"
              style="height:70vh;"
            >
              <slot name="terms" v-bind="slotProps"></slot>              
              <slot name="policy"></slot>

            </b-card-text>
          </b-col>
        </b-row>        
        <b-row align-h="end">

          <slot name="button" v-bind="slotProps"></slot>
          
        </b-row>

      </b-container>
  </div>
</template>
<script>
export default {
  data(){
    return{
      slotProps: {
        v12 : 'test'
      }
    }
  }
}
</script>