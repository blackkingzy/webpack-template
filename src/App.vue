<template>
  {{ message }}
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: process.env.CURRENT_ENV,
    }
  },
}
</script>
