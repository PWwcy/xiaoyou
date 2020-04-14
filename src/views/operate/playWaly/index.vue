<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="游戏类型id" prop="deviceTypeId">
        <!-- <el-input
          v-model="queryParams.deviceTypeId"
          placeholder="请输入游戏类型id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />-->
        <el-select
          v-model="queryParams.deviceTypeId"
          placeholder="请选择游戏类型"
          v-el-select-loadmore="loadmore"
        >
          <el-option
            v-for="item in optionsType"
            :key="item.id"
            :label="item.deviceName"
            :value="item.id"
          ></el-option>
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
          v-hasPermi="['palyway:playWaly:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['palyway:playWaly:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['palyway:playWaly:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['palyway:playWaly:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="playWalyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="设备类型id" align="center" prop="deviceTypeId" />
      <!-- <el-table-column label="设备名称" align="center" prop="deviceName" /> -->
      <el-table-column label="html介绍" prop="content">
        <template slot-scope="scope">
          <div v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column label="相关信息" prop="remark" />
      <el-table-column label="最后编辑时间" align="center" prop="updateTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['palyway:playWaly:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['palyway:playWaly:remove']"
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

    <!-- 添加或修改玩法管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="610px">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="价格" prop="deviceName" v-if="form.id">
          <el-input-number
            v-model="form.price"
            placeholder="请输入价格"
            controls-position="right"
            :min="0"
          />
          <span class="my-unit-span">{{moneyUnit}}</span>
        </el-form-item>
        <el-form-item label="时长" prop="deviceName" v-if="form.id">
          <el-input-number
            v-model="form.time"
            placeholder="请输入时长"
            controls-position="right"
            :min="0"
          />
          <span class="my-unit-span">{{minUnit}}</span>
        </el-form-item>
        <el-form-item label="次数" prop="deviceName" v-if="form.id">
          <el-input-number
            v-model="form.num"
            placeholder="请输入次数"
            controls-position="right"
            :min="0"
          />
          <span class="my-unit-span">{{numUnit}}</span>
        </el-form-item>
        <el-form-item label="相关信息" prop="remark" v-if="form.id">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入相关信息" />
        </el-form-item>
        <el-form-item label="游戏类型" prop="typeId">
          <!-- <el-input v-model="form.typeId" placeholder="请输入游戏类型id" /> -->
          <el-select v-model="form.typeId" placeholder="请选择" v-el-select-loadmore="loadmore">
            <el-option
              v-for="item in optionsType"
              :key="item.id"
              :label="item.deviceName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="html介绍" prop="content">
          <!-- <el-input v-model="form.content" placeholder="请输入html介绍" /> -->
          <Editor v-model="form.content" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding-top:20px">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDevice } from "@/api/device/device";
import {
  listPlayWaly,
  getPlayWaly,
  delPlayWaly,
  addPlayWaly,
  updatePlayWaly,
  exportPlayWaly
} from "@/api/operate/playWaly";
import Editor from "@/components/Editor";

import mixins from "@/utils/mixin/upload";

export default {
  components: {
    Editor
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
      // 玩法管理表格数据
      playWalyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceTypeId: undefined,
        content: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        typeId: [{ required: true, message: "请选择设备", trigger: "blur" }]
      },

      optionsType: [],
      typeTotal: 0,
      queryParamsType: {
        pageNum: 1,
        pageSize: 10,
        categoryName: undefined
      }
    };
  },
  created() {
    this.getList();
    this.getType();
  },
  mixins: [mixins],
  methods: {
    /** 查询玩法列表 */
    getList() {
      this.loading = true;
      listPlayWaly(this.queryParams).then(response => {
        this.playWalyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    loadmore() {
      if (
        this.queryParamsType.pageNum * this.queryParamsType.pageSize >=
        this.typeTotal
      ) {
        this.queryParamsType.pageNum++;
        this.getType();
      }
    },
    getType() {
      this.loading = true;
      listDevice(this.queryParamsType).then(response => {
        const list = response.rows;
        this.optionsType = [...this.optionsType, ...list];
        this.typeTotal = response.total;
        this.loading = false;
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
        deviceTypeId: undefined,
        content: undefined,
        createTime: undefined,
        updateTime: undefined
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
      this.title = "添加玩法";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getPlayWaly(id).then(response => {
        this.form = response.data;
        this.form.typeId = this.form.deviceTypeId;
        this.open = true;
        this.title = "修改玩法";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePlayWaly(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPlayWaly(this.form).then(response => {
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
      this.$confirm('是否确认删除玩法编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delPlayWaly(ids);
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
      this.$confirm("是否确认导出所有玩法数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportPlayWaly(queryParams);
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
