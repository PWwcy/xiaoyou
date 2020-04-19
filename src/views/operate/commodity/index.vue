<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="地区">
        <v-distpicker
          size="small"
          :province="queryParams.provinceText"
          :city="queryParams.cityText"
          :area="queryParams.areaText"
          @province="onChangeProvince('queryParams',$event)"
          @city="onChangeCity('queryParams',$event)"
          @area="onChangeArea('queryParams',$event)"
        />
      </el-form-item>

      <el-form-item label="商家名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入商家名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="commodityName">
        <el-input
          v-model="queryParams.commodityName"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="在售" :value="0" />
          <el-option label="售完" :value="1" />
          <el-option label="下架" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="限会员可购买" prop="onlyMembers" label-width="100px">
        <el-select v-model="queryParams.onlyMembers" placeholder="是否限会员可购买 " clearable size="small">
          <el-option label="是" :value="0" />
          <el-option label="否" :value="1" />
        </el-select>
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
          v-hasPermi="['operate:commodity:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['operate:commodity:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['operate:commodity:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['operate:commodity:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="commodityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品id" align="center" prop="id" />
      <el-table-column label="商品名称" align="center" prop="commodityName" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="游豆" align="center" prop="gameBean" />
      <el-table-column label="商品主图" align="center" prop="img">
        <template slot-scope="scope">
          <img class="td-img" :src="scope.row.img" @click="showImg(scope.row.img)" />
        </template>
      </el-table-column>
      <!--      <el-table-column label="商品图片" align="center" prop="commodityPicture">-->
      <!--        <template slot-scope="scope">-->
      <!--          <img-->
      <!--            class="td-img"-->
      <!--            :src="scope.row.commodityPicture"-->
      <!--            @click="showImg(scope.row.commodityPicture)"-->
      <!--          />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="商家名称" align="center" prop="storeName" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{formatStatus(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="限会员可购买" align="center" prop="onlyMembers">
        <template slot-scope="scope">
          <span>{{onlyMembersFormat(scope.row.onlyMembers)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="销量" align="center" prop="salesVolume" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['operate:commodity:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['operate:commodity:remove']"
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

    <!-- 添加或修改商品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="商品名称" prop="commodityName">
          <el-input v-model="form.commodityName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number
                v-model="form.price"
                placeholder="请输入价格"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{moneyUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="游豆" prop="gameBean">
              <el-input-number
                v-model="form.gameBean"
                placeholder="请输入游豆"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{beanUnit}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地区">
          <v-distpicker
            size="small"
            :province="form.provinceText"
            :city="form.cityText"
            :area="form.areaText"
            @province="onChangeProvince('form',$event)"
            @city="onChangeCity('form',$event)"
            @area="onChangeArea('form',$event)"
          />
        </el-form-item>

        <el-form-item label="商家" prop="storeId">
          <!-- <el-input v-model="form.storeId" placeholder="请输入商店id" /> -->
          <el-select
            v-model="form.storeId"
            placeholder="请选择商家"
            v-el-select-loadmore="loadmoreStore"
            @change="storeChange"
          >
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.storename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="formStatus">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">在售</el-radio>
            <el-radio :label="1">售完</el-radio>
            <el-radio :label="2">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="限会员可购买" prop="onlymembers">
          <el-radio-group v-model="form.onlyMembers">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品介绍" prop="commodityIntroduce">
          <Editor v-model="form.commodityIntroduce" />
        </el-form-item>
        <!-- <el-form-item label="商品介绍" prop="commodityIntroduce">
          <el-input v-model="form.commodityIntroduce" placeholder="请输入商品介绍" />
        </el-form-item>-->
        <el-form-item label="商品主图" prop="img" style="margin-top: 90px;">
          <el-upload
            :action="uploadFileUrl"
            :on-remove="handleImgRemove"
            :on-success="handleImgSuccess"
            :on-preview="handlePictureCardPreview"
            :limit="2"
            :file-list="imgList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
        <el-form-item label="商品图片" prop="commodityPicture">
          <!-- <el-upload
            class="upload-demo"
            :action="uploadFileUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            accept="image/*"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :file-list="fileList"
          >
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

    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[bigImg]" />
  </div>
</template>

<script>
import {
  listCommodity,
  getCommodity,
  delCommodity,
  addCommodity,
  updateCommodity,
  exportCommodity
} from "@/api/operate/commodity";
import { listStore } from "@/api/operate/store";
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
      // 商品表格数据
      commodityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        commodityName: undefined,
        price: undefined,
        gameBean: undefined,
        commodityPicture: undefined,
        commodityIntroduce: undefined,
        storeId: undefined,
        status: undefined,
        onlyMembers: undefined,
        salesVolume: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        storeName: undefined,
        appointmentNotice: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        /*onlymembers: [
          { required: true, message: "请选择是否限会员购买", trigger: "blur" }
        ],*/
        commodityName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        gameBean: [
          { required: true, message: "游豆不能为空", trigger: "blur" }
        ],
        price: [{ required: true, message: "价格不能为空", trigger: "blur" }],
        storeId: [{ required: true, message: "请选择商家", trigger: "blur" }]
        /* formStatus: [{ required: true, message: "请选择状态", trigger: "blur" }]*/
      },

      fileList: [],
      showViewer: false,
      bigImg: "",

      // 商家列表
      storeList: [],
      sPage: 1,
      sPageSize: 10,
      sTotal: 0,
      // 商品主图
      imgList: []
    };
  },
  created() {
    this.getList();
    this.getStoreList();
  },

  mixins: [mixins, region],
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      listCommodity(this.queryParams).then(response => {
        this.commodityList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 监听主图*/
    handleImgRemove(file, fileList) {
      this.form.img = null;
    },
    handleImgSuccess(response, file, fileList) {
      this.form.img = response.data.picture;
      this.imgList = [];
      let obj = {
        url: response.data.picture,
        name: file.name,
        uid: file.uid
      };
      this.imgList.push(obj);
    },
    // 查询商家列表   新增商品时用
    getStoreList() {
      let para = {
        pageNum: this.sPage,
        pageSize: this.sPageSize
      };
      listStore(para).then(response => {
        this.storeList = response.rows;
        this.sTotal = response.total;
      });
    },
    // 更多商家
    loadmoreStore() {
      if (this.sTotal <= this.sPage * this.sPageSize) {
        return;
      }
      this.sPage++;
      this.getStoreList();
    },
    // 切换商家
    storeChange() {
      console.log(this.form.storeId);
    },
    // 图片查看器
    showImg(data) {
      this.bigImg = data;
      this.showViewer = true;
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },

    // 搜索条件的地市切换
    onSelected(data) {
      this.queryParams.province = data.province.value;
      this.queryParams.city = data.city.value;
      this.queryParams.area = data.area.value;
    },
    // 新增或修改时 地市切换
    onformSelected(data) {
      this.form.province = data.province.value;
      this.form.city = data.city.value;
      this.form.area = data.area.value;
    },
    formatStatus(val) {
      return val == 0 ? "在售" : val == 1 ? "售完" : val == 2 ? "下架" : "";
    },
    onlyMembersFormat(val) {
      return val == 0 ? "是" : val == 1 ? "否" : "";
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
        commodityName: undefined,
        price: 0,
        gameBean: 0,
        commodityPicture: undefined,
        commodityIntroduce: undefined,
        storeId: undefined,
        status: 0,
        onlyMembers: 0,
        createTime: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        salesVolume: undefined
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
      this.reset();
      this.open = true;
      this.title = "添加商品";
      // if()
      // this.getStoreList();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.imgList = [];
      const id = row.id || this.ids;
      getCommodity(id).then(response => {
        this.form = response.data;
        this.initForm(this.form);
        this.open = true;
        this.title = "修改商品";
        this.echoImg(this.form.commodityPicture);
        if (this.form.img != null && this.form.img != "") {
          var obj = {};
          obj.url = this.form.img;
          obj.name = this.form.img.split("-").pop();
          var pictures = [];
          pictures.push(obj);
          this.imgList = pictures;
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // this.form.commodityPicture = this.initFile();
          this.form.commodityPicture = this.urlArrs.join();
          if (this.form.id != undefined) {
            this.testForm();
            updateCommodity(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCommodity(this.form).then(response => {
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
      this.$confirm('是否确认删除商品编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delCommodity(ids);
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
      this.$confirm("是否确认导出所有商品数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportCommodity(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  },
  directives: {
    // 底部加载更多
    "el-select-loadmore": {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
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
<style scoped>
</style>
