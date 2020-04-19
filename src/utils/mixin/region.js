export default {
  data() {
    return {

    }
  },
  methods: {
    assignRegion(index) {
      this[index].province = this.pCode;
      this[index].city = this.cCode;
      this[index].area = this.aCode;
    },
    initForm(form) {
      if (isNaN(form.province * 1)) {
        this.form.provinceText = form.province
        this.form.cityText = form.city
        this.form.areaText = form.area
      } else {
        this.form.provinceText = form.province * 1
        this.form.cityText = form.city * 1
        this.form.areaText = form.area * 1
      }
    },
    testForm() {
      if (this.form.provinceText === this.form.province) {
        this.form.province = undefined;
      }
      if (this.form.cityText === this.form.city) {
        this.form.city = undefined;
      }
      if (this.form.areaText === this.form.area) {
        this.form.area = undefined;
      }
      this.form.provinceText = undefined
      this.form.cityText = undefined
      this.form.areaText = undefined
    },
    resetRegion(index) {
      this[index].province = undefined
      this[index].city = undefined
      this[index].area = undefined
      this[index].provinceText = undefined
      this[index].cityText = undefined
      this[index].areaText = undefined
    },
    onChangeProvince(index, data) {
      this[index].province = data.code && data.code * 1;
      this[index].provinceText = data.value;
    },
    onChangeCity(index, data) {
      this[index].city = data.code && data.code * 1;
      this[index].cityText = data.value;
    },
    onChangeArea(index, data) {
      this[index].area = data.code && data.code * 1;
      this[index].areaText = data.value;
    }
  }
}