<template>

  <div
    v-if="show"
    class="modal-overlay"
  >

    <div class="modal-content">

      <button
        class="close-btn"
        @click="$emit('close')"
      >
        X
      </button>

      <slot />

    </div>

  </div>

</template>

<script setup>

defineProps({
  show: Boolean
})

defineEmits([
  'close'
])

</script>

<style scoped>

.modal-overlay {

  position: fixed;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background: rgba(0,0,0,0.5);

  display: flex;

  justify-content: center;
  align-items: center;
}

.modal-content {

  background: white;

  padding: 20px;

  border-radius: 10px;

  min-width: 500px;
}

.close-btn {

  float: right;
}

</style>