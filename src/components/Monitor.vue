<template>
  <el-container>
    <el-header style="height:80px;padding:0px">
      <h1>SS Monitor</h1>
    </el-header>
    <el-main>
      <div v-if="isLogin">
        <div class="mydiv" v-for="(i, index) in data">
          <div class="mychart" :id="gernerateId(index)"></div>
        </div>
      </div>
    </el-main>
    
  </el-container>
</template>

<script>
import axios from 'axios';
import {getCookie, setCookie} from '../utils/cookieUtils';
import echarts from 'echarts';
const HOST_NAME = process.env.HOST_NAME;
export default {
  name: 'Monitor',
  data () {
    return {
      isLogin: false,
      data: [
        {
          "content": [[]],
          "name": "",
          "port": ""
        }
      ]
    }
  },
  methods: {
    checkLogin() { // 检查是否登录
      if (!getCookie('session')) {
        this.isLogin = false;
      } else {
        this.isLogin = true;
      }
    },
    getData() {
      axios.get('http://' + HOST_NAME + '/api/data')
      .then(response => {
        this.data = response.data
        // console.log(this.data)
      })
      .catch(error => {
        console.log(error)
        this.$message({
          type: 'warning',
          message: 'Network error, cannot access!'
        });
      });
    },
    gernerateId(index) {
      return 'chart' + index;
    },
    drawLine() {
      for (var i = 0, len = this.data.length; i < len; i++) {
        // console.log(document.getElementById('chart' + i))
        let myChart = echarts.init(document.getElementById('chart' + i));
        // console.log(this.data[i].content);
        myChart.setOption({
          title: {
              text: 'user: ' + this.data[i].name + '\nport: ' + this.data[i].port,
              textStyle: {
                fontWeight: 'bold',
                fontSize: 25,
                align: 'center',
                verticalAlign: 'center'
              },
              left: 'center',
              top: 'top'
          },
          tooltip: {
              trigger: 'axis',
          },
          xAxis: {
              name: 'date',
              nameTextStyle: {
                fontWeight: 'bold',
                fontSize: 20
              },
              nameGap: 50,
              type: 'time',
              splitLine: {
                  show: false
              },
              splitNumber: 24,
              boundaryGap: ['10%', '10%'],
              axisLine: {
                symbol: ['none', 'arrow'],
                symbolSize: [5, 10],
                symbolOffset: [0, 8],
                lineStyle: {
                  width: 2
                }
              },
              axisTick: {
                lineStyle: {
                  width: 2
                }
              }
          },
          yAxis: {
              type: 'value',
              name: 'speed/(KB/s)',
              nameTextStyle: {
                fontWeight: 'bold',
                fontSize: 20
              },
              nameGap: 20,
              splitLine: {
                  show: false
              },
              boundaryGap: [0, '100%'],
              axisLine: {
                symbol: ['none', 'arrow'],
                symbolSize: [5, 10],
                symbolOffset: [0, 8],
                lineStyle: {
                  width: 2
                }
              },
              axisTick: {
                lineStyle: {
                  width: 2
                }
              }
          },
          series: [{
              type: 'line',
              data: this.data[i].content
          }]
        })
      }
      
    },
  },
  created: function() {
    this.checkLogin();
    if (!this.isLogin) {
        this.$prompt('please enter password', 'Login', {
          confirmButtonText: 'Login',
          cancelButtonText: 'Cancel',
          inputPattern: /qazwsx/,
          inputType: 'password',
          inputErrorMessage: 'please enter your password'
        }).then(({ value }) => {
          this.isLogin = true;
          let expireDays = 1000 * 60 * 60 * 24 * 15;
          setCookie('session', 'supricemotherfxxk', expireDays);
          }).catch(() => {
            this.$message({
              type: 'warning',
              message: 'cancel submissions.'
            });
          });
    }
    this.getData();
  },
  updated: function() {
    this.drawLine();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../assets/common.css';
</style>
