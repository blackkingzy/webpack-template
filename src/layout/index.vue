<template>
  <div class="layout">
    <header>
      <select-language></select-language>
    </header>
    <section><router-view></router-view></section>
    <footer>欢迎使用</footer>
  </div>
</template>

<script>
import SelectLanguage from '@/components/SelectLanguage.vue'
export default {
  components: {
    SelectLanguage,
  },
  setup() {
    return {}
  },
}
</script>

<style lang="css" scoped>
.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
header {
  padding: 20px;
}
footer {
  text-align: center;
}
</style>
