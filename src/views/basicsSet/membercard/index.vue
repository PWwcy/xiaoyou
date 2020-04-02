<template>
  <div class="app-container">
    <!-- label-width="80px" -->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="会员卡名称" prop="memberCardName">
        <el-input
          v-model="queryParams.memberCardName"
          placeholder="请输入会员卡名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="memberCardType">
        <el-select v-model="queryParams.memberCardType" placeholder="请选择类型" clearable size="small">
          <!-- <el-option label="请选择字典生成" value /> -->
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :value="item.dictCode"
            :label="item.dictLabel"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="充值金额" prop="rechargeAmount">
        <el-input
          v-model="queryParams.rechargeAmount"
          placeholder="请输入充值金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="获得游豆" prop="getBean">
        <el-input
          v-model="queryParams.getBean"
          placeholder="请输入获得游豆"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活得次数" prop="getFrequency">
        <el-input
          v-model="queryParams.getFrequency"
          placeholder="请输入活得次数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="有效期" prop="termOfValidity">
        <el-input
          v-model="queryParams.termOfValidity"
          placeholder="请输入有效期"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="会员卡内容描述" prop="content">
        <el-input
          v-model="queryParams.content"
          placeholder="请输入会员卡内容描述"
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
          v-hasPermi="['basicsSet:membercard:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basicsSet:membercard:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basicsSet:membercard:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basicsSet:membercard:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="membercardList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="会员卡内容描述" align="center" prop="id" />
      <el-table-column label="会员卡名称" align="center" prop="memberCardName" />
      <el-table-column label="类型" align="center" prop="memberCardType" />
      <el-table-column label="充值金额" align="center" prop="rechargeAmount" />
      <el-table-column label="获得游豆" align="center" prop="getBean" />
      <el-table-column label="活得次数" align="center" prop="getFrequency" />
      <el-table-column label="有效期" align="center" prop="termOfValidity" />
      <el-table-column label="会员卡内容描述" align="center" prop="content">
        <template slot-scope="scope">
          <span v-html="scope.row.content"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basicsSet:membercard:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basicsSet:membercard:remove']"
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

    <!-- 添加或修改会员卡对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="740px">
      <el-form ref="form" :model="form" :rules="rules" label-width="114px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="会员卡名称" prop="memberCardName">
              <el-input v-model="form.memberCardName" placeholder="请输入会员卡名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类型" prop="memberCardType">
              <el-select v-model="form.memberCardType" placeholder="请选择类型">
                <!-- <el-option label="请选择字典生成" value /> -->
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :value="item.dictCode"
                  :label="item.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="充值金额" prop="rechargeAmount">
              <!-- <el-input-number v-model="form.rechargeAmount" placeholder="请输入充值金额" /> -->
              <el-input-number
                v-model="form.rechargeAmount"
                placeholder="请输入充值金额"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{moneyUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获得游豆" prop="getBean">
              <el-input-number
                v-model="form.getBean"
                placeholder="请输入获得游豆"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{beanUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活得次数" prop="getFrequency">
              <el-input-number
                v-model="form.getFrequency"
                placeholder="请输入活得次数"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{numUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期" prop="termOfValidity">
              <el-input-number
                v-model="form.termOfValidity"
                placeholder="请输入有效期"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{dayUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会员卡内容描述" prop="content">
              <Editor v-model="form.content" />
            </el-form-item>
          </el-col>
          <!-- <el-form-item label="会员卡内容描述" prop="content">
            <el-input v-model="form.content" placeholder="请输入会员卡内容描述" />
          </el-form-item>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: 30px;">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  listMembercard,
  getMembercard,
  delMembercard,
  addMembercard,
  updateMembercard,
  exportMembercard
} from "@/api/basicsSet/membercard";
import { listData } from "@/api/system/dict/data";

import Editor from "@/components/Editor";

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
      // 会员卡表格数据
      membercardList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        memberCardName: undefined,
        memberCardType: undefined,
        rechargeAmount: undefined,
        getBean: undefined,
        getFrequency: undefined,
        termOfValidity: undefined,
        content: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        memberCardName: [
          { required: true, message: "会员卡名称不能为空", trigger: "blur" }
        ],
        memberCardType: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        rechargeAmount: [
          { required: true, message: "充值金额不能为空", trigger: "blur" }
        ],
        getBean: [
          { required: true, message: "获得游豆不能为空", trigger: "blur" }
        ],
        getFrequency: [
          { required: true, message: "获得次数不能为空", trigger: "blur" }
        ],
        termOfValidity: [
          { required: true, message: "有效期不能为空", trigger: "blur" }
        ]
      },

      typeList: [],
      tTotal: 0,
      tPage: 1,
      tPagesize: 10
    };
  },
  created() {
    this.getList();
    this.getMCardType();
  },
  methods: {
    /** 查询会员卡列表 */
    getList() {
      this.loading = true;
      listMembercard(this.queryParams).then(response => {
        this.membercardList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取会员卡类型
    getMCardType() {
      let para = {
        pageNum: this.tPage,
        pageSize: this.tPagesize,
        dictType: "sys_membercard_type"
      };
      listData(para).then(res => {
        if (res.code === 200) {
          this.typeList = res.rows;
          this.tTotal = res.total;
        }
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
        memberCardName: undefined,
        memberCardType: undefined,
        rechargeAmount: 0,
        getBean: 0,
        getFrequency: 0,
        termOfValidity: 0,
        content: undefined
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
      this.title = "添加会员卡";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getMembercard(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改会员卡";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMembercard(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addMembercard(this.form).then(response => {
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
      this.$confirm('是否确认删除会员卡编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delMembercard(ids);
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
      this.$confirm("是否确认导出所有会员卡数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportMembercard(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
