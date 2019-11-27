<template>
  <div class="home">
    <h2>服务监视情况</h2>
    <div class="home-bg">
      <img :src="homeBackground">
    </div>
  </div>
</template>

<script>
import homeBackground from '@/assets/img/HMI.png';
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
  position: absolute;
  z-index: 1;
  .home-bg {
    img {
      width: 100%;
      height: 100%;
    }
  }
}

</style>
