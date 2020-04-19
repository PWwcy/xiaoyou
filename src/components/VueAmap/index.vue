<template>
  <div class="_map">
    <div class="amap-page-container" v-if="center.length > 0" :style="style_">
      <el-amap-search-box
        class="search-box"
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      ></el-amap-search-box>
      <!-- :plugin="plugin" -->
      <el-amap
        ref="map"
        vid="amapDemo"
        :zoom="zoom"
        :center="center"
        class="amap-demo"
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
    }
  },
  data() {
    var me = this;
    me.city = me.city || "成都";
    return {
      list: [],
      currIndex: 0,
      zoom: 20,
      center: [],
      events: {
        init: o => {
          console.log(o);
          o.setCity(me.city, result => {
            // console.log("----------setCity", result);
            if (result && result.length > 0) {
              me.zoom = 16;
              me.makerConf.position = result;
              me.getList(result);
            }
          });
          //去掉logo
          if (document.getElementsByClassName("amap-logo")[0])
            document.getElementsByClassName("amap-logo")[0].style.display =
              "none";
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
      },
      plugin: [
        "ToolBar",
        "Scale",
        {
          pName: "Geolocation",
          events: {
            init(o) {},
            complete: function(result) {
              //定位成功
              var address = result.formattedAddress;
              var point = result.position;
              var obj = {
                address: address,
                name: "",
                location: point
              };
              me.list = [obj];
              console.log(obj);
              me.makerConf.position = [point.lng, point.lat];
            },
            error: function() {}
          }
        }
      ]
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
    setCenter(arr) {
      this.makerConf.position = arr;
      this.center = arr;
      this.getList(arr);
    },
    // 获取选中的地点
    getCenter() {
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
    list: function() {
      this.currIndex = 0;
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