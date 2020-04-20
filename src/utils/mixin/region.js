export default {
  data() {
    return {
      region: {
        province: undefined,
        city: undefined,
        area: undefined
      }
    }
  },
  methods: {
    // 修改时赋值
    assignRegion(data) {
      this.region.province = data.province;
      this.region.city = data.city;
      this.region.area = data.area;
      console.log(this.region);

    },
    // initForm(form) {
    //   if (isNaN(form.province * 1)) {
    //     this.form.provinceText = form.province
    //     this.form.cityText = form.city
    //     this.form.areaText = form.area
    //   } else {
    //     this.form.provinceText = form.province * 1
    //     this.form.cityText = form.city * 1
    //     this.form.areaText = form.area * 1
    //   }
    //   this.form.province = form.province
    //   this.form.city = form.city
    //   this.form.area = form.area;
    // },
    initForm(index) {
      this[index].province = this.region.province;
      this[index].city = this.region.city;
      this[index].area = this.region.area;

      if (!this.region.province || this.region.province === '省') {
        this[index].province = undefined;
      }
      if (!this.region.city || this.region.city === '市') {
        this[index].city = undefined;
      }
      if (!this.region.area || this.region.area === '区') {
        this[index].area = undefined;
      }
    },
    // 暂时没用
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
      // this.form.provinceText = undefined
      // this.form.cityText = undefined
      // this.form.areaText = undefined
    },
    // 暂时没用
    submitInitForm(index) {
      // if (!this[index].province || this[index].province === '省') {
      //   this[index].province = undefined;
      // }
      // if (!this[index].city || this[index].city === '市') {
      //   this[index].city = undefined;
      // }
      // if (!this[index].area || this[index].area === '区') {
      //   this[index].area = undefined;
      // }
      if (!this.form.province || this.form.province === '省') {
        this.form.province = undefined;
      }
      if (!this.form.city || this.form.city === '市') {
        this.form.city = undefined;
      }
      if (!this.form.area || this.form.area === '区') {
        this.form.area = undefined;
      }
    },
    // 暂时没用
    initQueryParams() {
      if (!this.queryParams.province || this.queryParams.province === '省') {
        this.queryParams.province = undefined;
      }
      if (!this.queryParams.city || this.queryParams.city === '市') {
        this.queryParams.city = undefined;
      }
      if (!this.queryParams.area || this.queryParams.area === '区') {
        this.queryParams.area = undefined;
      }
    },
    resetRegion(index) {
      // this[index].province = undefined
      // this[index].city = undefined
      // this[index].area = undefined
      // this[index].provinceText = undefined
      // this[index].cityText = undefined
      // this[index].areaText = undefined
      this.region.province = undefined;
      this.region.city = undefined;
      this.region.area = undefined;
    },
    // 选择省
    onChangeProvince(data) {
      this.region.province = data.value;
      console.log(this.region);

    },
    // 选择市
    onChangeCity(data) {
      this.region.city = data.value;
    },
    // 选择区
    onChangeArea(data) {
      this.region.area = data.value;
    }
  }
}
