<template>
  <div>{{ message }}</div>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const message = ref('welcome')
    return { message }
  },
}
</script>

<style lang="css" scoped></style>
