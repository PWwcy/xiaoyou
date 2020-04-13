<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="设备编号" prop="deviceNumber">
        <el-input
          v-model="queryParams.deviceNumber"
          placeholder="请输入设备编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下单人" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属公司" prop="commodityName">
        <el-input
          v-model="queryParams.companyName"
          placeholder
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="购买时间" prop="buyTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.buyTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择购买时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="消费方式" prop="payType">
        <el-select v-model="queryParams.payType" placeholder="请选择" clearable size="small">
          <el-option label="会员卡" value="0" />
          <el-option label="微信" value="1" />
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
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['order:game:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['order:game:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="gameList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="订单编号" align="center" prop="orderNumber" />
      <el-table-column label="设备编号" align="center" prop="deviceNumber" />
      <el-table-column label="购买时间" align="center" prop="buyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.buyTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="得分" align="center" prop="score" />
      <el-table-column label="游玩时长" align="center" prop="gameTime" />
      <el-table-column label="获得积分" align="center" prop="getIntegral" />
      <el-table-column label="消耗卡路里" align="center" prop="burnCalories" />
      <el-table-column label="订单类型" align="center" prop="orderType">
        <template slot-scope="scope">
          <span>{{orderType(scope.row.orderType)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单人" align="center" prop="userName" />
      <el-table-column label="公司名称" align="center" prop="companyName" />
      <el-table-column label="获得游豆" align="center" prop="getBean" />
      <el-table-column label="支付金额" align="center" prop="payMoney" />
      <el-table-column label="消耗次数" align="center" prop="num" />
      <el-table-column label="消费方式" align="center" prop="payType">
        <template slot-scope="scope">
          <span>{{payType(scope.row.payType)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['order:game:remove']"
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

    <!-- 添加或修改游戏订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="760px">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单编号" prop="orderNumber">
              <el-input v-model="form.orderNumber" placeholder="请输入订单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="下单人id" prop="userId">
              <el-input v-model="form.userId" placeholder="请输入下单人id" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="消耗卡路里" prop="burnCalories">
              <el-input v-model="form.burnCalories" placeholder="请输入消耗卡路里" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备id" prop="deviceId">
              <!-- <el-input v-model="form.deviceId" placeholder="请输入设备id" /> -->
              <el-select v-model="form.deviceId" placeholder="请选择" v-el-select-loadmore="loadmore">
                <el-option
                  v-for="item in optionsType"
                  :key="item.id"
                  :label="item.deviceName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="得分" prop="score">
              <el-input-number
                v-model="form.score"
                placeholder="请输入得分"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{scoreUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="游玩时长" prop="gameTime">
              <el-input-number
                v-model="form.gameTime"
                placeholder="请输入游玩时长"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{minUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获得积分" prop="getIntegral">
              <el-input-number
                v-model="form.getIntegral"
                placeholder="请输入获得积分"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{scoreUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消耗次数" prop="num">
              <el-input-number
                v-model="form.num"
                placeholder="请输入消耗次数"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{numUnit}}</span>
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
            <el-form-item label="支付金额" prop="payMoney">
              <el-input-number
                v-model="form.payMoney"
                placeholder="请输入支付金额"
                controls-position="right"
                :min="0"
              />
              <span class="my-unit-span">{{moneyUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单类型">
              <el-radio-group v-model="form.orderType">
                <el-radio :label="0">团体</el-radio>
                <el-radio :label="1">个人</el-radio>
              </el-radio-group>
              <!-- <el-select v-model="form.orderType" placeholder="请选择0： 团体 1：个人">
                <el-option label="请选择字典生成" value="" />
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付方式">
              <!-- <el-select v-model="form.payType" placeholder="请选择0 :账户 1 微信">
                <el-option label="请选择字典生成" value="" />
              </el-select>-->
              <el-radio-group v-model="form.payType">
                <el-radio :label="0">账户</el-radio>
                <el-radio :label="1">微信</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDevice } from "@/api/device/device";
import {
  listGame,
  getGame,
  delGame,
  addGame,
  updateGame,
  exportGame
} from "@/api/order/game";

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
      // 游戏订单表格数据
      gameList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: undefined,
        deviceId: undefined,
        userId: undefined,
        buyTime: undefined,
        score: undefined,
        gameTime: undefined,
        getIntegral: undefined,
        burnCalories: undefined,
        orderType: undefined,
        getBean: undefined,
        payMoney: undefined,
        num: undefined,
        payType: undefined,
        count: undefined,
        userName: undefined,
        companyName: undefined,
        deviceNumber: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderNumber: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        deviceId: [{ required: true, message: "请选择设备", trigger: "blur" }]
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
  methods: {
    /** 查询游戏订单列表 */
    getList() {
      this.loading = true;
      listGame(this.queryParams).then(response => {
        this.gameList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    orderType(val) {
      return val == 0 ? "团队" : val == 1 ? "个人" : "";
    },
    payType(val) {
      return val == 0 ? "会员卡" : val == 1 ? "微信" : "";
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
        orderNumber: undefined,
        deviceId: undefined,
        userId: undefined,
        buyTime: undefined,
        score: undefined,
        gameTime: undefined,
        getIntegral: undefined,
        burnCalories: undefined,
        orderType: 0,
        getBean: undefined,
        payMoney: undefined,
        num: undefined,
        payType: 0,
        createTime: undefined,
        count: undefined
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
      this.title = "添加游戏订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getGame(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改游戏订单";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateGame(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addGame(this.form).then(response => {
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
        '是否确认删除游戏订单编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delGame(ids);
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
      this.$confirm("是否确认导出所有游戏订单数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportGame(queryParams);
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
