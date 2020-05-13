<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="类型名称" prop="typeName">
        <el-input
          v-model="queryParams.typeName"
          placeholder="请输入类型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="玩法介绍" prop="playIntroduce">
        <el-input
          v-model="queryParams.playIntroduce"
          placeholder="请输入设备玩法介绍"
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
          v-hasPermi="['device:type:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['device:type:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['device:type:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['device:type:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="顺序" align="center" prop="id" />
      <el-table-column label="类型名称" align="center" prop="typeName" />
      <el-table-column label="图标" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.icon" class="td-img" @click="showImgs(scope.row.icon)" />
        </template>
      </el-table-column>
      <el-table-column label="玩法介绍" align="center" prop="playIntroduce" />
      <el-table-column label="封面图片" align="center" prop="cover">
        <template slot-scope="scope">
          <img :src="scope.row.cover" class="td-img" @click="showImgs(scope.row.cover)" />
        </template>
      </el-table-column>
      <el-table-column label="城市" align="center" prop="cityId" />
      <el-table-column label="免费体验次数" align="center" prop="experienceNum" />
      <el-table-column label="顺序" align="center" prop="pos" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['device:type:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:type:remove']"
          >删除</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="showImgs(scope.row)"
            v-hasPermi="['device:type:look']"
          >查看图片</el-button>-->
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

    <!-- 添加或修改设备类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="城市" prop="cityId">
          <!-- <el-input v-model="form.cityId" placeholder="请输入城市id" /> -->
          <el-input v-model="form.cityId" controls-position="right" placeholder="请输入城市" />
        </el-form-item>

        <!-- <el-form-item label="免费体验次数" prop="experienceNum">
          <el-input v-model="form.experienceNum" placeholder="请输入免费体验次数" />
        </el-form-item>-->
        <el-form-item label="顺序" prop="pos">
          <el-input-number
            v-model="form.pos"
            placeholder="请输入顺序"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="免费体验次数" prop="experienceNum">
          <el-input-number
            v-model="form.experienceNum"
            :min="0"
            controls-position="right"
            placeholder="请输入免费体验次数"
          />
        </el-form-item>
        <el-form-item label="玩法介绍" prop="playIntroduce">
          <el-input type="textarea" v-model="form.playIntroduce" placeholder="请输入设备玩法介绍" />
        </el-form-item>
        <el-form-item label="游戏模式" prop="mode">
          <el-select
            v-model="form.modeList"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择游戏模式"
            v-el-select-loadmore="loadmore"
            style="width: 100%;"
          >
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.modeName"
              :value="item.id"
            ></el-option>
            <!-- :id="item.value" -->
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-upload
            :action="uploadFileUrl"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleIconRemove"
            :on-success="handleIconSuccess"
            :before-upload="iconUpload"
            :limit="1"
            :file-list="iconList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500KB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="封面图片" prop="cover">
          <el-upload
            :action="uploadFileUrl"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleCoverRemove"
            :on-success="handleCoverSuccess"
            :before-upload="coverUpload"
            :limit="1"
            :file-list="coverList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500KB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片" prop="pictureList">
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
    <!-- 图片查看 -->
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="imgArr" />
  </div>
</template>

<script>
import {
  listType,
  getType,
  delType,
  addType,
  updateType,
  exportType,
  getModelList
} from "@/api/device/type";
import { listMode } from "@/api/operate/mode";

import mixins from "@/utils/mixin/upload";

export default {
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
      // 设备类型表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeName: undefined,
        playIntroduce: undefined,
        picture: undefined,
        cityId: undefined,
        pos: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        picture: [{ required: true, message: "图片不能为空", trigger: "blur" }],
        cover: [{ required: true, message: "封面不能为空", trigger: "blur" }],
        icon: [{ required: true, message: "图标不能为空", trigger: "blur" }]
      },
      pictureList: [], //
      coverList: [], // 封面
      iconList: [], // 图标
      modelList: [], // 模式
      modelTotal: 0,
      modelParams: {
        pageNum: 1,
        pageSize: 10
      },

      imgTypeArr: ["jpg", "jpeg", "png"]
    };
  },
  created() {
    this.getList();
    this.getModelList();
  },
  mixins: [mixins],
  methods: {
    /** 查询设备类型列表 */
    getList() {
      this.loading = true;
      listType(this.queryParams).then(response => {
        this.typeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取游戏模式列表
    getModelList() {
      console.log(this.modelParams);
      listMode(this.modelParams).then(response => {
        let list = response.rows;
        this.modelList = [...this.modelList, ...list];
        this.modelTotal = response.total;
      });
    },
    loadmore() {
      if (
        this.modelParams.pageNum * this.modelParams.pageSize >=
        this.modelTotal
      ) {
        this.modelParams.pageNum++;
        this.getModelList();
      }
    },

    // 图标
    iconUpload(file) {
      return this.beforeUpload(file, 500 * 1024);
    },
    // 封面
    coverUpload(file) {
      return this.beforeUpload(file, 500 * 1024);
    },
    /** 监听封面图片*/
    handleCoverRemove(file, fileList) {
      this.form.cover = null;
      this.coverList = [];
    },
    handleCoverSuccess(response, file, fileList) {
      this.form.cover = response.data.picture;
      this.coverList = [];
      let obj = {
        url: response.data.picture,
        name: file.name,
        uid: file.uid
      };
      this.coverList.push(obj);
    },
    /** 监听图标*/
    handleIconRemove(file, fileList) {
      this.form.icon = null;
      this.iconList = [];
    },
    handleIconSuccess(response, file, fileList) {
      this.form.icon = response.data.picture;
      this.iconList = [];
      let obj = {
        url: response.data.picture,
        name: file.name,
        uid: file.uid
      };
      this.iconList.push(obj);
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
        typeName: undefined,
        playIntroduce: undefined,
        picture: undefined,
        cityId: undefined,
        pos: undefined,
        pictureList: undefined,
        cover: undefined,
        icon: undefined,
        modeList: undefined
      };
      this.initFileList();
      this.uploadFileList = [];
      this.coverList = [];
      this.iconList = [];
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
      this.title = "添加设备类型";
      if (this.modelList.length === 0) {
        this.getModelList();
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.coverList = [];
      const id = row.id || this.ids;
      if (this.modelList.length === 0) {
        this.getModelList();
      }
      getType(id).then(response => {
        this.form = response.data.deviceType;
        this.open = true;
        this.title = "修改设备类型";
        this.echoImg(this.form.picture);
        this.form.modeList =
          response.data.modes &&
          response.data.modes.map(item => {
            return item.id;
          });
        console.log(this.form);
        if (this.form.cover != null && this.form.cover != "") {
          var obj = {};
          obj.url = this.form.cover;
          obj.name = this.form.cover.split("-").pop();
          var pictures = [];
          pictures.push(obj);
          this.coverList = pictures;
        }
        if (this.form.icon != null && this.form.icon != "") {
          var obj = {};
          obj.url = this.form.icon;
          obj.name = this.form.icon.split("-").pop();
          var pictures = [];
          pictures.push(obj);
          this.iconList = pictures;
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.form.pictureList = this.urlArrs;
      this.form.modeList = this.form.modeList && this.form.modeList.join(",");
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addType(this.form).then(response => {
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
        '是否确认删除设备类型编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delType(ids);
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
      this.$confirm("是否确认导出所有设备类型数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportType(queryParams);
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
