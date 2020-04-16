90<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="活动名称" prop="activityName">
        <el-input
          v-model="queryParams.activityName"
          placeholder="请输入活动名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="充值金额" prop="money">
        <el-input
          v-model="queryParams.money"
          placeholder="请输入充值金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="获得游豆数量" prop="getbean">
        <el-input
          v-model="queryParams.getbean"
          placeholder="请输入获得游豆数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="赠送游豆数量" prop="givebean">
        <el-input
          v-model="queryParams.givebean"
          placeholder="请输入赠送游豆数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最后更新时间" prop="lastUpdateTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.lastUpdateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择最后更新时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="创建人" prop="createby">
        <el-input
          v-model="queryParams.createby"
          placeholder="请输入创建人"
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
          v-hasPermi="['member:RechargeActivity:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['member:RechargeActivity:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['member:RechargeActivity:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['member:RechargeActivity:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="RechargeActivityList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="活动名称" align="center" prop="activityName" />
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.picture" class="td-img" @click="showImgs(scope.row.picture)" />
        </template>
      </el-table-column>
      <el-table-column label="充值金额" align="center" prop="money" />
      <el-table-column label="获得游豆数量" align="center" prop="getbean" />
      <el-table-column label="赠送游豆数量" align="center" prop="givebean" />
      <el-table-column label="最后更新时间" align="center" prop="lastUpdateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastUpdateTime || scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['member:RechargeActivity:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['member:RechargeActivity:remove']"
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

    <!-- 添加或修改会员充值活动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="380px">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="活动名称" prop="activityName" style="padding-right: 30px;">
          <el-input v-model="form.activityName" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="充值金额" prop="money">
          <el-input-number
            v-model="form.money"
            placeholder="请输入充值金额"
            controls-position="right"
            :min="0"
          />
          <span class="my-unit-span">{{moneyUnit}}</span>
        </el-form-item>
        <el-form-item label="获得游豆数量" prop="getbean">
          <el-input-number
            v-model="form.getbean"
            placeholder="请输入获得游豆数量"
            controls-position="right"
            :min="0"
          />
          <span class="my-unit-span">{{beanUnit}}</span>
        </el-form-item>
        <el-form-item label="赠送游豆数量" prop="givebean">
          <el-input-number
            v-model="form.givebean"
            placeholder="请输入赠送游豆数量"
            controls-position="right"
            :min="0"
          />
          <span class="my-unit-span">{{beanUnit}}</span>
        </el-form-item>
        <el-form-item label="图片" prop="picture">
          <el-upload
            :action="uploadFileUrl"
            :on-preview="handlePictureCardPreview"
            :on-remove="handlePicRemove"
            :on-success="handlePicSuccess"
            :limit="1"
            :file-list="pictureList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
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
  listRechargeActivity,
  getRechargeActivity,
  delRechargeActivity,
  addRechargeActivity,
  updateRechargeActivity,
  exportRechargeActivity
} from "@/api/member/RechargeActivity";

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
      // 会员充值活动表格数据
      RechargeActivityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        activityName: undefined,
        money: undefined,
        getbean: undefined,
        givebean: undefined,
        lastUpdateTime: undefined,
        createby: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        activityName: [
          { required: true, message: "活动名称不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "充值金额不能为空", trigger: "blur" }
        ],
        getbean: [
          { required: true, message: "获得游豆数量不能为空", trigger: "blur" }
        ],
        lastUpdateTime: [
          { required: true, message: "请选择最后更新时间", trigger: "blur" }
        ],
        picture: [
          { required: true, message: "请选择上传图片", trigger: "blur" }
        ]
      },
      pictureList: [] // 回显图片
    };
  },
  created() {
    this.getList();
  },
  mixins: [mixins],
  methods: {
    /** 查询会员充值活动列表 */
    getList() {
      this.loading = true;
      listRechargeActivity(this.queryParams).then(response => {
        this.RechargeActivityList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 图片选择和删除
    handlePicRemove(file, fileList) {
      this.form.picture = null;
    },
    handlePicSuccess(response, file, fileList) {
      this.form.picture = response.data.picture;
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        activityName: undefined,
        money: 0,
        getbean: 0,
        givebean: 0,
        lastUpdateTime: undefined,
        createTime: undefined,
        createby: undefined,
        picture: undefined
      };
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
      this.title = "添加会员充值活动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRechargeActivity(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改会员充值活动";
        if (this.form) {
          this.pictureList = this.form.picture;
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.form);
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateRechargeActivity(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addRechargeActivity(this.form).then(response => {
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
        '是否确认删除会员充值活动编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delRechargeActivity(ids);
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
      this.$confirm("是否确认导出所有会员充值活动数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportRechargeActivity(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
