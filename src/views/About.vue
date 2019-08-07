<template>
  <div class="about">
    <h1>This is an about page</h1>
    <b-button id="show-btn" @click="$bvModal.show('bv-modal-example')">Open Modal</b-button>

    <b-modal id="bv-modal-example" hide-header hide-footer centered>
      <template slot="modal-title">
        Using
        <code>$bvModal</code> Methods
      </template>
      <div class="d-block text-center">
        <h3>Hello From This Modal!</h3>
      </div>
      
    </b-modal>
  </div>
</template>
