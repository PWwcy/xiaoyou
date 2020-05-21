
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="地区">
        <v-distpicker
          size="small"
          :province="regionQuery.province"
          :city="regionQuery.city"
          :area="regionQuery.area"
          @province="onChangeProvince($event, 'regionQuery')"
          @city="onChangeCity($event, 'regionQuery')"
          @area="onChangeArea($event, 'regionQuery')"
        ></v-distpicker>
      </el-form-item>
      <el-form-item label="设备类型" prop="typeId">
        <el-select v-model="queryParams.typeId" placeholder="请选择">
          <el-option
            v-for="item in deviceType"
            :key="item.id"
            :label="item.typeName"
            :value="item.id"
          ></el-option>
        </el-select>
        <!-- <el-input
          v-model="queryParams.typeId"
          placeholder="请输入设备类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />-->
      </el-form-item>
      <el-form-item label="设备厂商" prop="enterpriseName">
        <el-input
          v-model="queryParams.enterpriseName"
          placeholder="请输入设备厂商"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="正常" value="0" />
          <el-option label="停止" value="1" />
          <el-option label="维修中" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备编号" prop="deviceNumber">
        <el-input
          v-model="queryParams.deviceNumber"
          placeholder="请输入设备编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="添加时间" prop="addTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.addTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择添加时间"
        ></el-date-picker>
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
          v-hasPermi="['device:device:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['device:device:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['device:device:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['device:device:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备id" align="center" prop="id" />
      <el-table-column label="设备编号" align="center" prop="deviceNumber" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <!--      <el-table-column label="设备图片" align="center" prop="picture">-->
      <!--        <template slot-scope="scope">-->
      <!--          <img :src="scope.row.picture" class="td-img" @click="showImg(scope.row.picture)" />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="设备类型" align="center" prop="typeName" />
     <!-- <el-table-column label="设备分类" align="center" prop="categoryName" />-->
      <el-table-column label="省" align="center" prop="province" />
      <el-table-column label="市" align="center" prop="city" />
      <el-table-column label="区" align="center" prop="area" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="设备厂商" align="center" prop="enterpriseName" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{formatStatus(scope.row.status)}}</span>
        </template>
      </el-table-column>

      <el-table-column label="普通消费金额" align="center" prop="money" />
      <el-table-column label="会员消费扣次数" align="center" prop="deductionFrequency" />
      <el-table-column label="单个小时团体消费次数" align="center" prop="groupFrequency" />
      <el-table-column label="普通团体消费金额" align="center" prop="groupMoney" />
      <el-table-column label="添加时间" align="center" prop="addTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计收益金额" align="center" prop="totalMoney" />
      <el-table-column label="累计消费次数" align="center" prop="totalNum" />
      <el-table-column label="累计服务人数" align="center" prop="totalUserNum" />
      <el-table-column label="备注" align="center" :show-overflow-tooltip="true" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['device:device:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:device:remove']"
          >删除</el-button>

          <router-link :to="'/device/duration/data/' + scope.row.id" class="link-type">
            <el-button size="mini" type="text" icon="el-icon-tickets">游戏时长</el-button>
          </router-link>
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

    <!-- 添加或修改设备管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="设备编号" prop="deviceNumber">
              <el-input v-model="form.deviceNumber" placeholder="请输入设备编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备类型" prop="typeId">
              <!-- <el-input v-model="form.typeId" placeholder="请输入设备类型" /> -->
              <el-select v-model="form.typeId" placeholder="请选择">
                <el-option
                  v-for="item in deviceType"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地区">
              <v-distpicker
                :province="regionForm.province"
                :city="regionForm.city"
                :area="regionForm.area"
                @province="onChangeProvince($event, 'regionForm')"
                @city="onChangeCity($event, 'regionForm')"
                @area="onChangeArea($event, 'regionForm')"
              ></v-distpicker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备厂商" prop="manufacturer">
              <!-- <el-input v-model="form.manufacturer" placeholder="请输入设备厂商" /> -->
              <!-- <el-select
                v-model="form.manufacturer"
                placeholder="请选择"
                filterable
                v-el-select-loadmore="loadmoreStore"
              >
                <el-option
                  v-for="item in optionsStore"
                  :key="item.id"
                  :label="item.enterpriseName"
                  :value="item.id"
              ></el-option>-->
              <el-select v-model="form.manufacturer" filterable placeholder="请选择设备厂商">
                <el-option
                  v-for="item in deviceStoreList"
                  :key="item.id"
                  :label="item.enterpriseName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio label="0">正常</el-radio>
                <el-radio label="1">停止</el-radio>
                <el-radio label="2">维护中</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="赠送游豆" prop="giveBean">-->
<!--              <el-input-number-->
<!--                v-model="form.giveBean"-->
<!--                placeholder="请输入赠送游豆"-->
<!--                controls-position="right"-->
<!--                :min="0"-->
<!--              />-->
<!--              <span class="my-unit-span">{{beanUnit}}</span>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="普通消费金额" prop="money">
              <el-input-number
                v-model="form.money"
                placeholder="请输入普通消费金额"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{moneyUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员消费扣次数" prop="deductionFrequency">
              <el-input-number
                v-model="form.deductionFrequency"
                placeholder="请输入会员消费扣次数"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{numUnit}}</span>
            </el-form-item>
          </el-col>
     <!--     <el-col :span="12">
            <el-form-item label="时长" prop="duration">
              <el-input-number
                v-model="form.duration"
                placeholder="请输入时长"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{minUnit}}</span>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="单个小时团体消费次数" prop="groupFrequency">
              <el-input-number
                v-model="form.groupFrequency"
                placeholder="请输入单个小时团体消费次数"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{numUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="普通团体消费金额" prop="groupMoney">
              <el-input-number
                v-model="form.groupMoney"
                placeholder="请输入普通团体消费金额"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{moneyUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否支持多人模式" prop="multiplayer">
              <!-- <el-input v-model="form.multiplayer" placeholder="请输入是否支持多人模式" /> -->
              <el-radio-group v-model="form.multiplayer">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.remarks" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="24">-->
<!--            <el-form-item label="游戏分类" prop="categoryId">-->
<!--              <el-select-->
<!--                v-model="form.categoryId"-->
<!--                placeholder="请选择"-->
<!--                filterable-->
<!--                v-el-select-loadmore="loadmore"-->
<!--              >-->
<!--                <el-option-->
<!--                  v-for="item in optionsType"-->
<!--                  :key="item.id"-->
<!--                  :label="item.categoryName"-->
<!--                  :value="item.id"-->
<!--                ></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="24">
            <el-form-item label="描述" prop="describe">
              <el-input v-model="form.describe" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
          <!--          <el-col :span="24">-->
          <!--            <el-form-item label="玩法介绍" prop="playIntroduce">-->
          <!--              <Editor v-model="form.playIntroduce" />-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="24">
            <el-form-item label="设备图片" prop="picture">
              <!-- <el-upload
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
              </el-upload>-->
              <el-upload
                :action="uploadFileUrl"
                list-type="picture-card"
                multiple
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUploadM"
                :file-list="uploadFileList"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: 20px;">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 图片查看 -->
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[bigImg]" />
  </div>
</template>

<script>
import {
  listDevice,
  getDevice,
  delDevice,
  addDevice,
  updateDevice,
  exportDevice,
  listDeviceStore
} from "@/api/device/device";

// import { listDeviceStore } from "@/api/deviceStore/deviceStore";
import { listCategory } from "@/api/device/category";
import Editor from "@/components/Editor";
import VDistpicker from "v-distpicker";

import mixins from "@/utils/mixin/upload";
import region from "@/utils/mixin/region";
export default {
  components: {
    Editor,
    VDistpicker
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
      // 设备管理表格数据
      deviceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 设备商列表
      deviceStoreList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceNumber: undefined,
        deviceName: undefined,
        picture: undefined,
        longitudeAndLatitude: undefined,
        typeId: undefined,
        cityid: undefined,
        address: undefined,
        manufacturer: undefined,
        status: undefined,
        giveBean: undefined,
        money: undefined,
        deductionFrequency: undefined,
        duration: undefined,
        groupFrequency: undefined,
        groupMoney: undefined,
        multiplayer: undefined,
        addTime: undefined,
        remarks: undefined,
        playIntroduce: undefined,
        categoryId: undefined,
        describe: undefined,
        province: undefined,
        city: undefined,
        area: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deviceNumber: [
          { required: true, message: "设备编号不能为空", trigger: "blur" }
        ],
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        typeId: [
          { required: true, message: "请选择设备类型", trigger: "blur" }
        ],
        manufacturer: [
          { required: true, message: "请选择设备厂商", trigger: "blur" }
        ]
      },
      optionsType: [],
      typeTotal: 0,
      queryParamsType: {
        pageNum: 1,
        pageSize: 10,
        categoryName: undefined
      },
      optionsStore: [],
      storeTotal: 0,
      queryParamsStore: {
        pageNum: 1,
        pageSize: 10,
        enterpriseName: ""
      },
      fileList: [],
      showViewer: false,
      bigImg: "",
      deviceType: []
    };
  },
  created() {
    this.getList();
    this.getType();
    // this.getStoreList();
    this.getGameType();
    this.listDeviceStore();
  },
  mixins: [mixins, region],
  methods: {
    formatStatus(val) {
      return val == 0 ? "正常" : val == 1 ? "停止" : val == 2 ? "维修中" : "";
    },
    /** 查询设备管理列表 */
    getList() {
      this.loading = true;
      this.initForm("queryParams");
      listDevice(this.queryParams).then(response => {
        this.deviceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    listDeviceStore() {
      listDeviceStore(null).then(response => {
        this.deviceStoreList = response.rows;
      });
    },
    showImg(data) {
      this.bigImg = data;
      this.showViewer = true;
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },
    // 加载更多
    loadmore() {
      if (
        this.queryParamsType.pageNum * this.queryParamsType.pageSize <
        this.typeTotal
      ) {
        this.queryParamsType.pageNum++;
        this.getType();
      }
    },
    // 获取游戏分类列表
    getType() {
      listCategory(this.queryParamsType).then(response => {
        const list = response.rows;
        this.optionsType = [...this.optionsType, ...list];
      });
    },
    getGameType() {
      getDevice().then(response => {
        this.deviceType = response.deviceType;
      });
    },
    // 加载更多 设备商
    loadmoreStore() {
      if (
        this.queryParamsStore.pageNum * this.queryParamsStore.pageSize <
        this.storeTotal
      ) {
        this.queryParamsStore.pageNum++;
        this.getStoreList();
      }
    },
    // 获取设备上列表
    getStoreList() {
      listDeviceStore(this.queryParamsStore).then(response => {
        const list = response.rows;
        this.optionsStore = [...this.optionsStore, ...list];
        this.storeTotal = response.total;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        deviceNumber: undefined,
        deviceName: undefined,
        picture: undefined,
        longitudeAndLatitude: undefined,
        typeId: undefined,
        cityid: undefined,
        address: undefined,
        manufacturer: undefined,
        status: "0",
        giveBean: undefined,
        money: undefined,
        deductionFrequency: undefined,
        duration: undefined,
        groupFrequency: undefined,
        groupMoney: undefined,
        multiplayer: undefined,
        addTime: undefined,
        remarks: undefined,
        playIntroduce: undefined,
        categoryId: undefined,
        describe: undefined
      };
      this.initFileList();
      this.resetRegion("form");
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetRegion("queryParams");
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
      getDevice().then(response => {
        this.deviceType = response.deviceType;
        this.reset();
        this.open = true;
        this.title = "添加设备";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getDevice(id).then(response => {
        // this.deviceType = response.deviceType;
        this.form = response.data;
        this.open = true;
        this.title = "修改设备";
        this.assignRegion(this.form);
        this.echoImg(this.form.picture);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // this.form.picture = this.initFile();
          this.form.picture = this.urlArrs.join();
          this.initForm("form");
          if (this.form.id != undefined) {
            updateDevice(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDevice(this.form).then(response => {
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
      this.$confirm(
        '是否确认删除设备管理编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delDevice(ids);
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
      this.$confirm("是否确认导出所有设备管理数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportDevice(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  },
  directives: {
    "el-select-loadmore": {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        if (!SELECTWRAP_DOM) return;
        SELECTWRAP_DOM.addEventListener("scroll", function() {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;

          if (condition) {
            binding.value();
          }
        });
      }
    }
  }
};
</script>
