<template>
  <div class="eluxe-input-wrapper">
    <input
      type="text"
      ref="input"
      autocomplete="off"
      spellcheck="false"
      class="eluxe-input-number"
      @input="change"
      @change="change"
      :value="currentValue"
      :disabled="disabled"
      :placeholder="placeholder">
  </div>
</template>

<script>

export default {
  name: 'eluxeInputNumber',
  data () {
    return {
      currentValue: this.value
    }
  },
  props: {
    value: {
      type: Number | String,
      default: 1
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    precision: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    formatter: {
      type: Function
    },
    parser: {
      type: Function
    },
    placeholder: {
      type: Number | String,
    }
  },
  watch: {
    value (val) {
      this.setValueFor(val)
    },
    currentValue (val) {

    },
    min () {

    },
    max () {

    }
  },

  computed: {

  },
  methods: {
    change (ev) {
      let val = ev.target.value.trim()
      const isEmptyString = val.length === 0;
      if (isEmptyString) {
        this.setValue(null);
        return;
      }

      if (event.type == 'input' && val.match(/^\-?\.?$|\.$/)) return;

      // val = Number(val);

      if (!isNaN(val) || (this.parser && !isNaN(Number(this.parser(val))))) {
        this.$emit('on-input', val);
        this.currentValue = val;
        this.frommatterValue(val)
      } else {
        event.target.value = this.currentValue;
      }

    },
    // 过滤
    frommatterValue (value) {
      let val = value
      if (this.parser) {
        val = this.parser(val)
      }

      let arr = (val + '').split('.'), currentValue
      if (/\.\d{0,}0{1,}$/ig.test(val)) {
        currentValue = val
      } else {
        val = Number(val)
        if (this.precision === 0 && arr[1]) {
          currentValue = val.toFixed(this.precision)
        } else if (this.precision && arr[1] && this.precision < arr[1].length) {
          currentValue = val.toFixed(this.precision)
        } else {
          currentValue = val;
        }
      }


      this.setValue(currentValue)
    },
    // 设置
    setValue (val) {
      const { min, max } = this;

      if (/\.\d{0,}0{1,}$/ig.test(val)) {

      } else {
        val = Number(val);
        if (val !== null) {
          if (val > max) {
            val = max;
          } else if (val < min) {
            val = min;
          }
        }
      }

      this.$nextTick(() => {
        if (this.formatter) {
          this.$refs.input.value = this.formatter(val)
        } else {
          this.$refs.input.value = val
        }
        this.$emit('input', val);
        this.$emit('on-change', val);
      });
    },
    setValueFor (val) {
      this.$nextTick(() => {
        if (this.formatter) {
          this.$refs.input.value = this.formatter(val)
          this.currentValue = this.formatter(val)
        } else {
          this.$refs.input.value = val
          this.currentValue = val
        }
        this.$emit('input', val);
        this.$emit('on-change', val);
      });
    }
  },
  mounted () {
    // console.log(this.precision)
  }
}
</script>

<style lang="less">
.eluxe-input-wrapper {
  height: 32px;
  font-size: 12px;
  color: #515a6e;
  cursor: text;
  display: inline-block;
  width: 100%;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
  margin: 0;
  padding: 0;
  height: 32px;
  line-height: 32px;
  vertical-align: middle;
  border-radius: 4px;
  overflow: hidden;
  .eluxe-input-number {
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding: 0 7px;
    text-align: left;
    outline: 0;
    -moz-appearance: textfield;
    color: #666;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    -webkit-transition: all 0.2s linear;
    transition: all 0.2s linear;
    &:disabled {
      color: #ccc;
      opacity: 0.72;
      cursor: not-allowed;
      background-color: #f3f3f3;
    }
    &:focus {
      border: 1px solid #2196F3;
    }
  }
}
</style>