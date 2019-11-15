<template>
  <div class="home">
    <h2>服务监视情况</h2>
    <div class="home-bg">
      <img :src="homeBackground">
    </div>
  </div>
</template>

<script>
import homeBackground from '@/assets/login-bg.jpg';
export default {
  name: 'Home',
  data() {
    return {
      msg: '',
      homeBackground: homeBackground,
    }
  },
  created() {

  },
  components: {

  },
  computed: {
  },
  mounted() {

  },
  methods: {

  }
}

</script>
<style lang="less" scoped>
.home{
  position: relative;
  .home-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    img {
      width: 100%;
      height: 100%;
    }
  }
}

</style>
