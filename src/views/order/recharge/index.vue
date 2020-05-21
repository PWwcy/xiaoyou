<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="会员活动名称" prop="activityName" label-width="100px">
        <el-input
          v-model="queryParams.activityName"
          placeholder="请输入会员活动名称"
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
            :value="item.dictLabel"
            :label="item.dictLabel"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="下单人" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入下单人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="购买时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['order:recharge:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['order:recharge:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="rechargeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="订单编号" align="center" prop="orderNumber" />
      <el-table-column label="充值金额" align="center" prop="rechargeAmount" />
      <el-table-column label="会员活动名称" align="center" prop="activityName" />
      <el-table-column label="充值前次数" align="center" prop="beforeFrequency" />
      <el-table-column label="充值后次数" align="center" prop="afterFrequency" />
      <el-table-column label="充值前游豆数量" align="center" prop="beforeBean" />
      <el-table-column label="充值后游豆数量" align="center" prop="afterBean" />
      <el-table-column label="下单人id" align="center" prop="userId" />
      <el-table-column label="下单人名称" align="center" prop="userName" />
      <el-table-column label="购买时间" align="center" prop="buyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.buyTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员卡类型" align="center" prop="memberCardType" />

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改充值订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="114px">
        <el-form-item label="订单编号" prop="orderNumber">
          <el-input v-model="form.orderNumber" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="充值金额" prop="rechargeAmount">
          <el-input-number
            v-model="form.rechargeAmount"
            placeholder="请输入充值金额"
            controls-position="right"
            :min="0"
          />
          <span class="my-unit-span">{{moneyUnit}}</span>
        </el-form-item>
        <el-form-item label="会员活动名称" prop="activityName">
          <el-input v-model="form.activityName" placeholder="请输入会员活动名称" />
        </el-form-item>
        <el-form-item label="充值前次数" prop="beforeFrequency">
          <el-input-number
            v-model="form.beforeFrequency"
            placeholder="请输入充值前次数"
            controls-position="right"
            :min="0"
          />
          <span class="my-unit-span">{{numUnit}}</span>
        </el-form-item>
        <el-form-item label="充值后次数" prop="afterFrequency">
          <el-input-number
            v-model="form.afterFrequency"
            placeholder="请输入充值后次数"
            controls-position="right"
            :min="0"
          />
          <span class="my-unit-span">{{numUnit}}</span>
        </el-form-item>
        <el-form-item label="充值前游豆数量" prop="beforeBean">
          <el-input-number
            v-model="form.beforeBean"
            placeholder="请输入充值前游豆数量"
            controls-position="right"
            :min="0"
          />
          <span class="my-unit-span">{{beanUnit}}</span>
        </el-form-item>
        <el-form-item label="充值后游豆数量" prop="afterBean">
          <el-input-number
            v-model="form.afterBean"
            placeholder="请输入充值后游豆数量"
            controls-position="right"
            :min="0"
          />
          <span class="my-unit-span">{{beanUnit}}</span>
        </el-form-item>
        <el-form-item label="下单人id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入下单人id" />
        </el-form-item>
        <el-form-item label="购买时间" prop="buyTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.buyTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择购买时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="会员卡类型" prop="memberCardType">
          <el-select v-model="form.memberCardType" placeholder="请选择会员卡类型">
            <!-- <el-option label="请选择字典生成" value /> -->
            <el-option
              v-for="item in cardList"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRecharge,
  getRecharge,
  delRecharge,
  addRecharge,
  updateRecharge,
  exportRecharge
} from "@/api/order/recharge";
import { listData } from "@/api/system/dict/data";

export default {
  data() {
    return {
      // 日期范围
      dateRange: "",
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
      // 充值订单表格数据
      rechargeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: undefined,
        rechargeAmount: undefined,
        activityName: undefined,
        beforeFrequency: undefined,
        afterFrequency: undefined,
        beforeBean: undefined,
        afterBean: undefined,
        userId: undefined,
        buyTime: undefined,
        memberCardType: undefined,
        userName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderNumber: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        rechargeAmount: [
          { required: true, message: "充值金额不能为空", trigger: "blur" }
        ],
        memberCardType: [
          { required: true, message: "请选择会员卡类型", trigger: "blur" }
        ]
      },

      cardList: [],
      cTotal: 0,
      cPage: 1,
      cPageSize: 10,
      typeList: [],
    };
  },
  created() {
    this.getList();
    this.getMCardType();
  },
  methods: {
    /** 查询充值订单列表 */
    getList() {
      this.loading = true;
      listRecharge(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.rechargeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 查询会员卡类型
    getMCradList() {
      if (this.cardList.length > 0) return;
      let para = {
        pageNum: this.cPage,
        pageSize: this.cPageSize,
        dictType: "sys_membercard_type"
      };
      listData(para).then(res => {
        if (res.code == 200) {
          this.cardList = res.rows;
          this.cTotal = res.total;
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        orderNumber: undefined,
        rechargeAmount: undefined,
        activityName: undefined,
        beforeFrequency: undefined,
        afterFrequency: undefined,
        beforeBean: undefined,
        afterBean: undefined,
        userId: undefined,
        buyTime: undefined,
        memberCardType: undefined
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
      this.dateRange = [];
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
      this.title = "添加充值订单";
      this.getMCradList();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      console.log(id);
      getRecharge(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改充值订单";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateRecharge(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addRecharge(this.form).then(response => {
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
        '是否确认删除充值订单编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delRecharge(ids);
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
      this.$confirm("是否确认导出所有充值订单数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportRecharge(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
