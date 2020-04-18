<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="地区">
        <v-distpicker
          size="small"
          :province="queryParams.province"
          :city="queryParams.city"
          :area="queryParams.area"
          @selected="onSelected"
        ></v-distpicker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="正常" value="0" />
          <el-option label="已删除" value="1" />
          <el-option label="停止" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="商家名称" prop="storename">
        <el-input
          v-model="queryParams.storename"
          placeholder="请输入商家名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="联系人" prop="contacts">
        <el-input
          v-model="queryParams.contacts"
          placeholder="请输入联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['operate:store:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['operate:store:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['operate:store:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['operate:store:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="storeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商家id" align="center" prop="id" />
      <el-table-column label="商家名称" align="center" prop="storename" />

      <el-table-column label="商家电话" align="center" prop="storephone" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="商家介绍" align="center" prop="storeintroduce" />
      <el-table-column label="预约须知" align="center" prop="appointmentnotice" />
      <el-table-column label="联系人" align="center" prop="contacts" />
      <el-table-column label="地图信息" align="center">
        <template slot-scope="scope">
          <!-- <span @click="lookMap(scope.row)">查看地图</span> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-location"
            @click="lookMap(scope.row)"
          >查看地图</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{formatStatus(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['operate:store:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['operate:store:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改商家对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商家名称" prop="storename">
          <el-input v-model="form.storename" placeholder="请输入商家名称" />
        </el-form-item>
        <!-- <el-form-item label="商家图片" prop="storepicture">
          <el-upload
            class="upload-demo"
            action="http://47.97.180.206:8081/api/file"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            accept="image/*"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :file-list="fileList"
          >
            :limit="1"
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>-->
        <el-form-item label="商家电话" prop="storephone">
          <el-input v-model="form.storephone" placeholder="请输入商家电话" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" @change="getLngLat">
            <i slot="suffix" class="el-icon-map-location shou" @click="chooseMap"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="经纬度" prop="longitudeandlatitude">
          <el-input
            v-model="form.longitudeandlatitude"
            placeholder="请输入经纬度,如:104.066541,30.572269"
            @change="getAddress"
          >
            <i slot="suffix" class="el-icon-map-location shou" @click="chooseMap"></i>
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="经度" prop="xcoordinate">
          <el-input v-model="form.xcoordinate" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" prop="ycoordinate">
          <el-input v-model="form.ycoordinate" placeholder="请输入纬度" />
        </el-form-item>-->
        <el-form-item label="商家介绍" prop="storeintroduce">
          <el-input v-model="form.storeintroduce" placeholder="请输入商家介绍" />
        </el-form-item>
        <el-form-item label="预约须知" prop="appointmentnotice">
          <el-input v-model="form.appointmentnotice" placeholder="请输入预约须知" />
        </el-form-item>

        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">已删除</el-radio>
            <el-radio :label="2">停止</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商家图片" prop="picture">
          <el-upload
            :action="uploadFileUrl"
            list-type="picture-card"
            multiple
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="uploadFileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看地图 -->
    <el-dialog title="查看地图" :visible.sync="isShowMap" width="900px">
      <v-map ref="map" :centers="longLat"></v-map>
    </el-dialog>
    <!-- 选择地图 -->
    <el-dialog title="选择地图" :visible.sync="isChooseMap" width="900px">
      <v-map ref="cmap" :centers="longLat" :showLocal="true" :height="300"></v-map>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureLocal">确 定</el-button>
        <el-button @click="isChooseMap = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[bigImg]" />
  </div>
</template>

<script>
import {
  listStore,
  getStore,
  delStore,
  addStore,
  updateStore,
  exportStore
} from "@/api/operate/store";
import Editor from "@/components/Editor";
import VDistpicker from "v-distpicker";
import vMap from "@/components/VueAmap";

import mixins from "@/utils/mixin/upload";
export default {
  components: {
    Editor,
    VDistpicker,
    vMap
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 商家表格数据
      storeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      isShowMap: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storename: undefined,
        storepicture: undefined,
        storephone: undefined,
        address: undefined,
        longitudeandlatitude: undefined,
        storeintroduce: undefined,
        appointmentnotice: undefined,
        xcoordinate: undefined,
        ycoordinate: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        status: undefined,
        contacts: undefined,
        createTime: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        storename: [
          { required: true, message: "商家名称不能为空", trigger: "blur" }
        ],
        storephone: [
          { required: true, message: "商家电话不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        address: [{ required: true, message: "地址不能为空", trigger: "blur" }]
      },
      fileList: [],
      showViewer: false,
      bigImg: "",

      // 地图 经纬度
      longLat: [],
      isChooseMap: false
    };
  },
  created() {
    this.getList();
  },
  mixins: [mixins],
  methods: {
    /** 查询商家列表 */
    getList() {
      this.loading = true;
      listStore(this.queryParams).then(response => {
        this.storeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    showImg(data) {
      this.bigImg = data;
      this.showViewer = true;
    },
    // 获取位置的经纬度
    getLngLat() {
      let self = this;
      if (AMap) {
        let add = this.form.address;
        AMap.plugin("AMap.Geocoder", function() {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: "成都"
          });

          geocoder.getLocation(add, function(status, result) {
            if (status === "complete" && result.info === "OK") {
              // result中对应详细地理坐标信息
              self.form.longitudeandlatitude =
                result.geocodes[0].location.lng +
                "," +
                result.geocodes[0].location.lat;
              self.form.ycoordinate = result.geocodes[0].location.lng;
              self.form.xcoordinate = result.geocodes[0].location.lat;
            } else {
              self.form.longitudeandlatitude = null;
              self.form.ycoordinate = null;
              self.form.xcoordinate = null;
            }
          });
        });
      }
    },
    // 获取位置
    getAddress() {
      let self = this;
      if (AMap) {
        let lnglat = this.form.longitudeandlatitude.split(",");
        AMap.plugin(["AMap.Geocoder"], () => {
          const geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          // var lnglatXY = options.lnglatXY || [114.397169, 30.50576]; //已知点坐标
          geocoder.getAddress(lnglat, function(status, result) {
            if (status === "complete" && result.info === "OK") {
              console.log(result);
              self.form.address = result.regeocode.formattedAddress;
            } else {
            }
          });
        });
      }
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },

    // 查看地图
    lookMap(data) {
      this.longLat = [data.ycoordinate * 1, data.xcoordinate * 1];
      this.isShowMap = true;
      let a = setTimeout(() => {
        this.$refs.map.setCenter(this.longLat);
        clearTimeout(a);
      }, 300);
    },
    // 选择地图
    chooseMap() {
      this.longLat = [114.397169, 30.50576];
      this.isChooseMap = true;
      let a = setTimeout(() => {
        this.$refs.cmap.setCenter(this.longLat);
        clearTimeout(a);
      }, 300);
    },
    // 确定地点
    sureLocal() {
      let obj = this.$refs.cmap.getCenter();
      this.form.longitudeandlatitude =
        obj.location.lng + "," + obj.location.lat;
      this.form.address = obj.address;
      this.isChooseMap = false;
    },

    formatStatus(val) {
      return val == 0 ? "正常" : val == 1 ? "已删除" : val == 2 ? "停止" : "";
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    onSelected(data) {
      this.queryParams.province = data.province.value;
      this.queryParams.city = data.city.value;
      this.queryParams.area = data.area.value;
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        storename: undefined,
        storepicture: undefined,
        storephone: undefined,
        address: undefined,
        longitudeandlatitude: undefined,
        storeintroduce: undefined,
        appointmentnotice: undefined,
        xcoordinate: undefined,
        ycoordinate: undefined,
        status: 0
      };
      this.initFileList();
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商家";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getStore(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商家";
        this.echoImg(this.form.storepicture);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // this.form.storepicture = this.initFile();
          this.form.pictureList = this.urlArrs;
          if (this.form.id != undefined) {
            updateStore(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            console.log(this.form);
            addStore(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除商家编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delStore(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有商家数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportStore(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
