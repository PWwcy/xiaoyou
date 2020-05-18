<template>
  <div class="_map" v-if="show">
    <div class="amap-page-container" :style="style_">
      <el-amap-search-box
        class="search-box"
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      ></el-amap-search-box>
      <!-- :plugin="plugin" -->
      <el-amap
        ref="map"
        :vid="'amapDemo'+vid"
        class="amap-demo"
        :zoom="zoom"
        :center="center"
        :events="events"
      >
        <el-amap-marker
          vid="component-marker"
          :position="makerConf.position"
          :content="makerConf.content"
        ></el-amap-marker>
      </el-amap>
    </div>
    <div class="adrs" v-if="showLocal">
      <ul>
        <li
          class
          v-for="(item,index) in list"
          :key="index"
          :class="currIndex == index ? 'active':''"
          @click="select(item,index)"
        >
          <p class="address">{{item.address}}</p>
          <p class="nm">{{item.name}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "amap-page",
  components: {},
  props: {
    showLocal: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 500
    },
    vid: {
      type: String,
      default: ""
    }
  },
  data() {
    var me = this;
    me.city = me.city || "成都";
    return {
      show: false,
      list: [],
      currIndex: 0,
      zoom: 16,
      center: [],
      events: {
        init: o => {},

        click: e => {
          let { lng, lat } = e.lnglat;
          me.getList([lng, lat]);
        },
        dragend: function(e) {
          //console.log("dragging",e,this.getCenter());
          var point = this.getCenter();
          var pos = [point.lng, point.lat];
          me.makerConf.position = [point.lng, point.lat];
          me.getList(pos);
        }
      },
      makerConf: {
        position: [],
        content: ""
      },
      searchOption: {
        city: me.city,
        citylimit: true
      }
      // plugin: [
      //   "ToolBar",
      //   "Scale",
      //   {
      //     pName: "Geolocation",
      //     events: {
      //       init(o) {
      //         console.log(o);
      //       },
      //       complete: function(result) {
      //         //定位成功
      //         var address = result.formattedAddress;
      //         var point = result.position;
      //         var obj = {
      //           address: address,
      //           name: "",
      //           location: point
      //         };
      //         me.list = [obj];
      //         console.log(obj);
      //         me.makerConf.position = [point.lng, point.lat];
      //       },
      //       error: function() {}
      //     }
      //   }
      // ]
    };
  },
  created() {
    var me = this;
  },
  mounted() {},
  computed: {
    style_() {
      return {
        height: this.height + "px"
      };
    }
  },
  methods: {
    // 设置中心点
    setCenter(arr, location, list = false) {
      if (typeof arr[0] === "string") {
        arr[0] = arr[0] * 1;
        arr[1] = arr[1] * 1;
      }
      this.city = location;
      this.makerConf.position = arr;
      this.center = arr;
      if (list) {
        this.getList(arr);
      }
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    // 获取选中的地点
    getCenter() {
      // console.log('----------------',this.list)
      return this.list[this.currIndex];
    },

    select: function(item, index) {
      var me = this;
      me.currIndex = index;
      var point = item.location;
      me.makerConf.position = [point.lng, point.lat];
      me.center = [point.lng, point.lat];
    },
    //this.$refs.map.$$getCenter()
    getList: function(result) {
      //获取列表
      var me = this;
      this.center = result;
      me.$Geocoder({
        lnglatXY: result,
        success: function(res) {
          if (res.regeocode && res.regeocode.pois) {
            me.list = res.regeocode.pois;
          } else {
            me.list = [];
          }
        },
        error: function(res) {
          me.list = [];
        }
      });
    },
    onSearchResult(pois) {
      //搜索
      let latSum = 0;
      let lngSum = 0;
      var me = this;

      var mymap = me.$refs.map.$$getInstance();

      if (pois && pois.length > 0) {
        //如果长度为1则无需转化
        var poi = pois[0];
        var lng = poi["lng"];
        var lat = poi["lat"];
        me.center = [lng, lat];
        me.makerConf.position = [lng, lat];
        //me.makerConf.content = poi.name;
        me.list = pois;
      } else {
        me.list = [];
      }
    },

    $Geocoder(options) {
      //将坐标点转化为，详细地址
      options = options || {};
      if (AMap) {
        AMap.plugin(["AMap.Geocoder"], () => {
          const geocoder = new AMap.Geocoder({
            radius: options.radius || 1000,
            extensions: options.extensions || "all"
          });
          var lnglatXY = options.lnglatXY || [114.397169, 30.50576]; //已知点坐标
          geocoder.getAddress(lnglatXY, function(status, result) {
            if (status === "complete" && result.info === "OK") {
              options.success && options.success(result);
            } else {
              options.error && options.error(status, result);
            }
          });
        });
      }
    }
  },
  watch: {
    list: function(val, val2) {
      if (val.length == 0) return;
      this.currIndex = 0;
      this.makerConf.position = [val[0].location.lng, val[0].location.lat];
      val.forEach((item, index) => {
        if (item.location.lng == this.center[0]) {
          this.currIndex = index;
        }
      });
    }
  }
};

/*
      me.$Geocoder({
                    lnglatXY:[center.lng, center.lat],
                    success:function(res){
                        console.log(res);
                    }
        });
     *
     * */
</script>

<style>
.amap-page-container {
  height: 500px;
  position: relative;
}
.search-box {
  position: absolute !important;
  top: 25px;
  left: 20px;
  z-index: 200 !important;
}
.amap-demo {
  height: 500px;
}
.amap-logo {
  display: none;
}
.amap-copyright {
  bottom: -100px;
  display: none;
}
.amap-scalecontrol {
  bottom: 4px !important;
}
.amap-geolocation-con {
  bottom: 30px !important;
  z-index: 199 !important;
}
ul li.active {
  color: deeppink;
}
.adrs {
  height: calc(100vh - 6vh - 300px - 70px - 60px - 6vh);
  overflow: auto;
}
</style>
