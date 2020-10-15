<template>
  <div class="wrapper">
    <div class="login-bg">
      <img :src="logoBackground">
    </div>
    <div class="topmenus">
      <Menu
        mode="horizontal"
        class="menubackground"
        active-name="1">
        <MenuItem
          name="/login"
          to="/login">
          <Icon type="ios-home" />
          {{ $t('HomePage') }}
        </MenuItem>
        <MenuItem
          name="/main"
          to="/main">
          <Icon type="logo-freebsd-devil" />
          {{ $t('Product') }}
        </MenuItem>
        <Submenu
          name="/login"
          @on-open-change="jumpTo">
          <template slot="title">
            <Icon type="md-contacts" />
            {{ $t('AboutUs') }}
          </template>
          <MenuGroup title="使用">
            <MenuItem name="3-1">
              新增和启动
            </MenuItem>
            <MenuItem name="3-2">
              活跃分析
            </MenuItem>
            <MenuItem name="3-3">
              时段分析
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="留存">
            <MenuItem name="3-4">
              用户留存
            </MenuItem>
            <MenuItem name="3-5">
              流失用户
            </MenuItem>
          </MenuGroup>
        </Submenu>
        <MenuItem
          name="/home"
          to="/home">
          <Icon type="ios-contact" />
          {{ $t('Connect') }}
        </MenuItem>
      </Menu>
      <Select
        v-model="locale"
        @on-change="changeLangFn"
        class="language-change"
        placeholder="切换语言">
        <Option
          v-for="(item, index) in changeLang"
          :value="item.value"
          :key="index">
          {{ item.label }}
        </Option>
      </Select>
    </div>
    <Content class="content">
      <router-view />
    </Content>
  </div>
</template>

<script>
import logoBackground from '@/assets/login-bg.jpg';

export default {
  data() {
    return {
      isActive: false,
      logoBackground,
      loginName: '',
      passWord: '',
      locale: [],
      changeLang: [
        {
          value: "zh",
          label: "简体中文"
        },
        {
          value: "en",
          label: "English"
        },
        {
          value: "tc",
          label: "繁體中文"
        }
      ],
    };
  },
  mounted() {
    // this.$i18n.locale 要传key
    this.locale = this.$i18n.locale;
    this.changeLangFn(this.locale);
  },
  computed: {
  },
  methods: {
    //   切换多语言
    changeLangFn(val) {
      let chan = this.changeLang;
      for (let i in chan) {
        if (chan[i].value === val) {
          this.locale = this.$i18n.locale = chan[i].value;
          localStorage.setItem("language", chan[i].value);
        }
      }
    },
    jumpTo(url) {
      this.$router.push({ path: url });
    },
  },
};

</script>
<style lang='less'>
.wrapper {
  background: #eee;
  overflow: hidden;
  & > .login-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    img {
        width: 100%;
        height: 100%;
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
}
.content {
  height: calc(100% - 60px);
  margin: 60px 20px 0 20px;

}
</style>
