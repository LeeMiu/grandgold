<template>
  <div class="homePage">
    <div class="actionPlay">
      <Carousel autoplay  loop>
        <CarouselItem>
            <div class="img-play">
              <img :src="PLC">
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="img-play">
              <img :src="UML">
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="img-play">
              <img :src="HMI">
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="img-play">
              <img :src="FBox">
            </div>
        </CarouselItem>
      </Carousel>
    </div>
  </div>
</template>
<script>
// import Cookies from 'js-cookie';
// import axios from 'axios';
import PLC from '@/assets/img/PLC.png';
import UML from '@/assets/img/UML.png';
import HMI from '@/assets/img/HMI.png';
import FBox from '@/assets/img/FBox.png';

export default {
  data() {
    return {
      PLC,
      UML,
      HMI,
      FBox,
    };
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    keySubmit($event) {
      if ($event.keyCode === 13) {
        this.loginSubmit();
      }
    },
    loginSubmit() {
      if (this.loginName === '' || this.passWord === '') {
        this.$Message.warning('请输入用户名和密码');
        return;
      }
      this.isActive = true;
    },
  },
};

</script>
<style lang="less" scoped>
.homePage {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  .img-play {
    padding: 2% 25%;
    height: 350px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.menubackground{
  background: #182b3a;
}
.topmenus{
  z-index: 5;
  width: 100%;
  position: absolute;
}
.language-change{
  z-index: 999;
  width: 100px;
  right: 10px;
  position: absolute;
  top: 10px;
  background-color: #182b3a;
}
.login-container {
  position: absolute;
  width: 400px;
  height: 450px;
  background: #fff;
  top: 18%;
  right: 10%;
  overflow: hidden;
  z-index: 1;
  border-radius: 3px;
  & > h1 {
    width: 100%;
    height: 65px;
    line-height: 65px;
    font-size: 30px;
    font-weight: 700;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
    text-align: center;
    color: #fff;
    background: linear-gradient(left, #004f71, #00192c);
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  & > form {
    padding: 35px 50px;
  }
  & > form .login-input {
    width: 100%;
    height: 42px;
    margin-bottom: 25px;
    padding: 0 15px;
    border: none;
    box-shadow: none;
    border-bottom: 1px solid #eee;
    outline: none;
    font-size: 14px;
  }
  & > form .login-input:focus {
    outline: none;
  }
  & > form .verification-wrap {
    width: 285px; //  height: 42px;
    position: relative;
    padding-top: 1px;
  }
  & > form .verification-wrap img {
    position: absolute;
    top: 26px;
    right: 0;
    z-index: 50;
    height: 42px;
    width: 100px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    cursor: pointer;
  }
  & > form label {
    font-size: 14px;
    line-height: 30px;
  }
}

.sign {
  cursor: pointer;
  width: 100%;
  height: 42px;
  margin-top: 35px;
  padding: 0;
  background: #ef4300;
  border-radius: 20px;
  background: linear-gradient(#0083d1, #075384);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 15px;
}

.sign:hover {
  box-shadow: 0 15px 30px 0 rgba(255, 255, 255, 0.15) inset,
    0 2px 7px 0 rgba(0, 0, 0, 0.2);
}

.sign:active {
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1) inset,
    0 1px 4px 0 rgba(0, 0, 0, 0.1);
  border: 0px solid #ef4300;
}
</style>
