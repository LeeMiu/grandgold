<template>
  <router-view />
</template>

<script>

export default {
  name: 'app',
  provide() {
    return {
      app: this
    }
  },
}
</script>

<style lang='less'>
body {
  overflow: hidden;
}
.common-icon {
  width: 25px;
  height: 25px;
  border: 1px solid #b6bfcd;
  border-radius: 2px;
  cursor: pointer;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #fff;
}
</style>
