/*
1、侧边栏处理
2、图像处理
3、port数据处理
*/

// ----------------------侧边栏逻辑处理 start --------------------

var port;

const cal_x = [];
const cal_y = [];
const cal_z = [];
const cal_tmp = [];

document.addEventListener("DOMContentLoaded", function () {
  // Get the elements
  const comSelect = document.getElementById("com");
  const numSelect = document.getElementById("num");
  //x
  const cut0Select = document.getElementById("cut0");
  const cut1Select = document.getElementById("cut1");
  const cut2Select = document.getElementById("cut2");
  const cut3Select = document.getElementById("cut3");
  const cut4Select = document.getElementById("cut4");

  //y
  const cut5Select = document.getElementById("cut5");
  const cut6Select = document.getElementById("cut6");
  const cut7Select = document.getElementById("cut7");
  const cut8Select = document.getElementById("cut8");
  const cut9Select = document.getElementById("cut9");

  //z
  const cut10Select = document.getElementById("cut10");
  const cut11Select = document.getElementById("cut11");
  const cut12Select = document.getElementById("cut12");
  const cut13Select = document.getElementById("cut13");
  const cut14Select = document.getElementById("cut14");

  //tmp
  const cut15Select = document.getElementById("cut15");
  const cut16Select = document.getElementById("cut16");
  const cut17Select = document.getElementById("cut17");
  const cut18Select = document.getElementById("cut18");
  const cut19Select = document.getElementById("cut19");

  // Get the confirm button element
  const confirmButton = document.getElementById("confirm");
  const closeButton = document.getElementById("close");

  // Add an event listener to the confirm button
  confirmButton.addEventListener("click", saveConfiguration);
  closeButton.addEventListener("click", () => {
    port.close();
    port.isOpen = false;
    port = null;
  });

  // 针对所有输入框内的数据进行保存操作，保证界面切换后的数据一致性
  function saveConfiguration() {
    // Get the selected value
    const selectedCom = comSelect.value;
    const selectedNum = numSelect.value;

    cal_x.push(
      ...[
        parseFloat(cut0Select.value),
        parseFloat(cut1Select.value),
        parseFloat(cut2Select.value),
        parseFloat(cut3Select.value),
        parseFloat(cut4Select.value),
      ]
    );
    cal_y.push(
      ...[
        parseFloat(cut5Select.value),
        parseFloat(cut6Select.value),
        parseFloat(cut7Select.value),
        parseFloat(cut8Select.value),
        parseFloat(cut9Select.value),
      ]
    );
    cal_z.push(
      ...[
        parseFloat(cut10Select.value),
        parseFloat(cut11Select.value),
        parseFloat(cut12Select.value),
        parseFloat(cut13Select.value),
        parseFloat(cut14Select.value),
      ]
    );
    cal_tmp.push(
      ...[
        parseFloat(cut15Select.value),
        parseFloat(cut16Select.value),
        parseFloat(cut17Select.value),
        parseFloat(cut18Select.value),
        parseFloat(cut19Select.value),
      ]
    );

    if (!port) {
      getData("COM" + selectedCom, Number(selectedNum));
    }
  }
});

// ----------------------侧边栏逻辑处理 end --------------------

// --------------------------------------传感器数据处理------------------------------
const { SerialPort } = require("serialport");
// 获取canvas元素
const canvas1 = document.getElementById("chart_tmp");
const ctx1 = canvas1.getContext("2d");

const canvas2 = document.getElementById("chart_tmpc");
const ctx2 = canvas2.getContext("2d");

const canvas3 = document.getElementById("chart_adc");
const ctx3 = canvas3.getContext("2d");

const canvas4 = document.getElementById("chart_adcc");
const ctx4 = canvas4.getContext("2d");

const canvas5 = document.getElementById("chart_acc");
const ctx5 = canvas5.getContext("2d");

const canvas6 = document.getElementById("chart_mag");
const ctx6 = canvas6.getContext("2d");

const canvas7 = document.getElementById("chart_eulerAngles");
const ctx7 = canvas7.getContext("2d");

const canvas8 = document.getElementById("chart_four");
const ctx8 = canvas8.getContext("2d");

//环境温度（电压）
const temperatureData = [];
//环境温度
const temperatureData2 = [];
//压力（电压）
const adcx = [];
const adcy = [];
const adcz = [];
//压力
const adcx2 = [];
const adcy2 = [];
const adcz2 = [];
//加速度
const accx = [];
const accy = [];
const accz = [];
//磁力
const magx = [];
const magy = [];
const magz = [];
//欧拉角
const EulerAnglesx = [];
const EulerAnglesy = [];
const EulerAnglesz = [];
//四元数
const four1 = [];
const four2 = [];
const four3 = [];
const four4 = [];

const myChart1 = new Chart(ctx1, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "Temperature",
        data: temperatureData, // 温度数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Voltage（V）",
        },
      },
    },
  },
});

const myChart2 = new Chart(ctx2, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "Temperature",
        data: temperatureData2, // 温度数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Temperature (℃)",
        },
      },
    },
  },
});

const myChart3 = new Chart(ctx3, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "adc_x",
        data: adcx, // 压力数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "adc_y",
        data: adcy, // 压力数据数组
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "adc_z",
        data: adcz, // 压力数据数组
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Voltage(V)",
        },
        // min: 0, // 设置y轴的最小值
        // max: 40, // 设置y轴的最大值
        // stepSize: 5 // 设置y轴刻度的步长
      },
    },
  },
});

const myChart4 = new Chart(ctx4, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "adc_x",
        data: adcx2, // 压力数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "adc_y",
        data: adcy2, // 压力数据数组
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "adc_z",
        data: adcz2, // 压力数据数组
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Force(N)",
        },
        // min: 0, // 设置y轴的最小值
        // max: 40, // 设置y轴的最大值
        // stepSize: 5 // 设置y轴刻度的步长
      },
    },
  },
});

const myChart5 = new Chart(ctx5, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "acc_x",
        data: accx, // 压力数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "acc_y",
        data: accy, // 压力数据数组
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "acc_z",
        data: accz, // 压力数据数组
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Acceleration(g)",
        },
        // min: 0, // 设置y轴的最小值
        // max: 40, // 设置y轴的最大值
        // stepSize: 5 // 设置y轴刻度的步长
      },
    },
  },
});

const myChart6 = new Chart(ctx6, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "mag_x",
        data: magx, // 压力数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "mag_y",
        data: magy, // 压力数据数组
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "mag_z",
        data: magz, // 压力数据数组
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Magenetic Field Strength (mGauss)",
        },
        // min: 0, // 设置y轴的最小值
        // max: 40, // 设置y轴的最大值
        // stepSize: 5 // 设置y轴刻度的步长
      },
    },
  },
});

const myChart7 = new Chart(ctx7, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "x",
        data: EulerAnglesx,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "y",
        data: EulerAnglesy,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "z",
        data: EulerAnglesz,
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Euler Angles (degree)",
        },
      },
    },
  },
});

const myChart8 = new Chart(ctx8, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "q1",
        data: four1,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "q2",
        data: four2,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "q3",
        data: four3,
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
      {
        label: "q4",
        data: four4,
        fill: false,
        borderColor: "rgb(255, 137, 54)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Quaternion",
        },
      },
    },
  },
});

function updateChartData() {
  //------------------------------------chart1 展示-------------------------------------
  // 添加新数据
  let startTime = new Date();
  let formattedStartTime = `${startTime.toLocaleTimeString()}:${startTime.getMilliseconds()}`;
  // 检查数据点数量是否超过阈值
  const maxDataPoint = 20; // 设置数据点的最大数量

  myChart1.data.labels.push(formattedStartTime);
  // 检查数据点数量是否超过阈值
  if (myChart1.data.labels.length > maxDataPoint ) {
    // 删除第一个数据节点的标签
    myChart1.data.labels.shift();
  }
  if (myChart1.data.datasets[0].data.length >= maxDataPoint) {
    myChart1.data.datasets[0].data.shift();
  }
  myChart1.update();

  //------------------------------------chart2 展示-------------------------------------

  function deleteData(myChart) {
    myChart.data.labels.push(formattedStartTime);

    if (myChart.data.labels.length > maxDataPoint ) {
      // 删除第一个数据节点的标签
      myChart.data.labels.shift();
    }
    if (myChart.data.datasets[0].data.length >= maxDataPoint) {
      // 删除每个数据集（datasets）中对应的第一个数据点
      myChart.data.datasets.forEach(function (dataset) {
        dataset.data.shift();
      });
    }

    myChart.update();
  }
  deleteData(myChart2);
  deleteData(myChart3);
  deleteData(myChart4);
  deleteData(myChart5);
  deleteData(myChart6);
  deleteData(myChart7);
  deleteData(myChart8);

  // myChart2.data.labels.push(formattedStartTime);

  // if (myChart2.data.labels.length > maxDataPoint + 1) {
  //   // 删除第一个数据节点的标签
  //   myChart2.data.labels.shift();
  // }
  // if(myChart2.data.datasets[0].data.length >= maxDataPoint){
  //   // 删除每个数据集（datasets）中对应的第一个数据点
  //   myChart2.data.datasets.forEach(function (dataset) {
  //     dataset.data.shift();
  //   });
  // }

  // // 更新图表
  // myChart2.update();

  //------------------------------------chart3 展示-------------------------------------
}

//----------------------------------test end----------------------------------------------

// 以下为核心数据处理代码
// --------------------------------------传感器数据处理 start------------------------------
function getData(portValue, rate) {
  port = new SerialPort({
    path: portValue,
    baudRate: rate,
  });
  console.log("port: " + port);
  let srcData = [];
  port.on("data", function (data) {
    const index = data.indexOf(65);
    if (index > 0) {
      srcData = [65, ...srcData, ...data.slice(0, index)];
      console.log(srcData);

      handleData();
      updateChartData();
      srcData = [...data.slice(index, data.length - 1)];
    } else if (index === 0) {
      srcData = [65, ...srcData];
      console.log(srcData);
      handleData();
      updateChartData();
      srcData = [...data.slice(index, data.length - 1)];
    } else {
      srcData = [...srcData, ...data];
    }

    //一个一个数据流往里塞,从65开始统计，到下一个65结束，同时里面的数据流处理逻辑应该是不变的，这样的话每次都是一个完整的buffer处理
  });

  const handleData = () => {
    const str_tmp = "84,109,112"; //54,6d,70
    const str_adc = "65,100,99"; //41 64 63
    const str_lsm = "73,115,109"; //49,73,6d

    //65, 100, 99, 12, 10, 6, 14, 3, 15, 9, 4, 10, 13, 3, 15, 12, 7, 6, 15, 3, 13, ------21
    //84, 109, 112, 1, 14, 13, 11, 0, 5, ----6
    //73, 115, 109, 14, 8, 8, 8, 7, 15, 14, 0, 7, 15, 14, 0, 0, 1, 6, 3, 15, 15, 11, 3, 15, 14, 4, 10,  ------27

    if (
      srcData &&
      srcData.join(",").includes(str_tmp) &&
      // srcData.join(",").includes(str_adc) &&
      srcData.join(",").includes(str_lsm)
    ) {
      //-----------------------------------handle adc events--------------------------------

      // adc_x

      //----处理压力

      let temp_adcX = (function () {
        let tmp = [
          (srcData[3] || 0).toString(16),
          (srcData[4] || 0).toString(16),
          (srcData[5] || 0).toString(16),
          (srcData[6] || 0).toString(16),
          (srcData[7] || 0).toString(16),
          (srcData[8] || 0).toString(16),
        ];
        return processHex(tmp);
      })();
      let temp_adcY = (function () {
        let tmp = [
          (srcData[9] || 0).toString(16),
          (srcData[10] || 0).toString(16),
          (srcData[11] || 0).toString(16),
          (srcData[12] || 0).toString(16),
          (srcData[13] || 0).toString(16),
          (srcData[14] || 0).toString(16),
        ];
        return processHex(tmp);
      })();
      let temp_adcZ = (function () {
        let tmp = [
          (srcData[15] || 0).toString(16),
          (srcData[16] || 0).toString(16),
          (srcData[17] || 0).toString(16),
          (srcData[18] || 0).toString(16),
          (srcData[19] || 0).toString(16),
          (srcData[20] || 0).toString(16),
        ];
        return processHex(tmp);
      })();

      adcx.push(temp_adcX);
      adcy.push(temp_adcY);
      adcz.push(temp_adcZ);

      adcx2.push(
        temp_adcX >= cal_x[0]
          ? cal_x[1] * temp_adcX + cal_x[2]
          : cal_x[3] * temp_adcX + cal_x[4]
      );
      adcy2.push(
        temp_adcY >= cal_y[0]
          ? cal_y[1] * temp_adcY + cal_y[2]
          : cal_y[3] * temp_adcY + cal_y[4]
      );
      adcz2.push(
        temp_adcZ >= cal_z[0]
          ? cal_z[1] * temp_adcZ + cal_z[2]
          : cal_z[3] * temp_adcZ + cal_z[4]
      );

      //-----------------------------------handle acc events--------------------------------

      let acc_index = srcData.indexOf(115);
      // 处理加速度值的函数
      let temp_accX = (function () {
        let tmp = [
          (srcData[acc_index + 2] || 0).toString(16),
          (srcData[acc_index + 3] || 0).toString(16),
          (srcData[acc_index + 4] || 0).toString(16),
          (srcData[acc_index + 5] || 0).toString(16),
        ];
        return processAcceleration(tmp);
      })();

      let temp_accY = (function () {
        let tmp = [
          (srcData[acc_index + 6] || 0).toString(16),
          (srcData[acc_index + 7] || 0).toString(16),
          (srcData[acc_index + 8] || 0).toString(16),
          (srcData[acc_index + 9] || 0).toString(16),
        ];
        return processAcceleration(tmp);
      })();

      let temp_accZ = (function () {
        let tmp = [
          (srcData[acc_index + 10] || 0).toString(16),
          (srcData[acc_index + 11] || 0).toString(16),
          (srcData[acc_index + 12] || 0).toString(16),
          (srcData[acc_index + 13] || 0).toString(16),
        ];
        return processAcceleration(tmp);
      })();
      accx.push(temp_accX / 1000);
      accy.push(temp_accY / 1000);
      accz.push(temp_accZ / 1000);

      //-----------------------------------handle tmp events--------------------------------

      let tmp_index = srcData.indexOf(112);

      // 处理温度Tmp 54 6d 70
      let temp_tmp = (function () {
        let tmp = [
          (srcData[tmp_index + 1] || 0).toString(16),
          (srcData[tmp_index + 2] || 0).toString(16),
          (srcData[tmp_index + 3] || 0).toString(16),
          (srcData[tmp_index + 4] || 0).toString(16),
          (srcData[tmp_index + 5] || 0).toString(16),
          (srcData[tmp_index + 6] || 0).toString(16),
        ];
        return processHex(tmp);
      })();
      console.log("温度", temp_tmp);
      temperatureData.push(temp_tmp);
      temperatureData2.push(
        temp_tmp >= cal_tmp[0]
          ? cal_tmp[1] * temp_tmp + cal_tmp[2]
          : cal_tmp[3] * temp_tmp + cal_tmp[4]
      );

      //-----------------------------------handle mag events--------------------------------

      let temp_magX = (function () {
        let tmp = [
          (srcData[acc_index + 14] || 0).toString(16),
          (srcData[acc_index + 15] || 0).toString(16),
          (srcData[acc_index + 16] || 0).toString(16),
          (srcData[acc_index + 17] || 0).toString(16),
        ];
        return processMagnetism(tmp);
      })();
      let temp_magY = (function () {
        let tmp = [
          (srcData[acc_index + 18] || 0).toString(16),
          (srcData[acc_index + 19] || 0).toString(16),
          (srcData[acc_index + 20] || 0).toString(16),
          (srcData[acc_index + 21] || 0).toString(16),
        ];
        return processMagnetism(tmp);
      })();
      let temp_magZ = (function () {
        let tmp = [
          (srcData[acc_index + 22] || 0).toString(16),
          (srcData[acc_index + 23] || 0).toString(16),
          (srcData[acc_index + 24] || 0).toString(16),
          (srcData[acc_index + 25] || 0).toString(16),
        ];
        return processMagnetism(tmp);
      })();

      magx.push(temp_magX);
      magy.push(temp_magY);
      magz.push(temp_magZ);

      //计算欧拉角
      // 保存先前的滤波数据
      let prevFilteredAcc = [0, 0, 0];
      let prevFilteredMag = [0, 0, 0];

      // 指定EMA参数
      const alpha = 0.2;

      function KGetQuat(ax, ay, az, mx, my, mz) {
        // 函数：返回符号与y相同的x值
        function copysign(x, y) {
          return y < 0 ? -Math.abs(x) : Math.abs(x);
        }

        // 先前滤波数据为空时初始化
        if (!prevFilteredAcc) prevFilteredAcc = [ax, ay, az];
        if (!prevFilteredMag) prevFilteredMag = [mx, my, mz];

        // 对加速度和磁力计数据进行EMA滤波
        ax = alpha * ax + (1 - alpha) * prevFilteredAcc[0];
        ay = alpha * ay + (1 - alpha) * prevFilteredAcc[1];
        az = alpha * az + (1 - alpha) * prevFilteredAcc[2];
        prevFilteredAcc = [ax, ay, az];

        mx = alpha * mx + (1 - alpha) * prevFilteredMag[0];
        my = alpha * my + (1 - alpha) * prevFilteredMag[1];
        mz = alpha * mz + (1 - alpha) * prevFilteredMag[2];
        prevFilteredMag = [mx, my, mz];

        // 数据归一化
        const accNorm = Math.sqrt(ax * ax + ay * ay + az * az);
        ax /= accNorm;
        ay /= accNorm;
        az /= accNorm;

        const magNorm = Math.sqrt(mx * mx + my * my + mz * mz);
        mx /= magNorm;
        my /= magNorm;
        mz /= magNorm;

        // 计算改进的四元数
        const gx = 2 * ax;
        const gy = 2 * ay;
        const gz = 2 * (az - 0.5);

        const hx = mx * Math.sqrt(1.0 - az * az) - mz * ay;
        const hy = my * Math.sqrt(1.0 - az * az) - mz * ax;
        const hz = mx * ay - my * ax;

        let qw = Math.sqrt(Math.max(0, 1 + gx + hy + hz)) / 2;
        let qx = Math.sqrt(Math.max(0, 1 + gx - hy - hz)) / 2;
        let qy = Math.sqrt(Math.max(0, 1 - gx + hy - hz)) / 2;
        let qz = Math.sqrt(Math.max(0, 1 - gx - hy + hz)) / 2;
        qx = copysign(qx, gy - hz);
        qy = copysign(qy, hx - gz);
        qz = copysign(qz, hx + gy);

        // 四元数归一化
        const qNorm = Math.sqrt(qw * qw + qx * qx + qy * qy + qz * qz);
        qw /= qNorm;
        qx /= qNorm;
        qy /= qNorm;
        qz /= qNorm;

        return [qw, qx, qy, qz];
      }

      function quaternionToEuler(qw, qx, qy, qz) {
        const ysqr = qy * qy;

        // roll (x-axis rotation)
        const t0 = 2 * (qw * qx + qy * qz);
        const t1 = 1 - 2 * (qx * qx + ysqr);
        const roll = Math.atan2(t0, t1);

        // pitch (y-axis rotation)
        let t2 = 2 * (qw * qy - qz * qx);
        t2 = t2 > 1 ? 1 : t2;
        t2 = t2 < -1 ? -1 : t2;
        const pitch = Math.asin(t2);

        // yaw (z-axis rotation)
        const t3 = 2 * (qw * qz + qx * qy);
        const t4 = 1 - 2 * (ysqr + qz * qz);
        const yaw = Math.atan2(t3, t4);
        EulerAnglesx.push(roll * (180 / Math.PI));
        EulerAnglesy.push(pitch * (180 / Math.PI));
        EulerAnglesz.push(yaw * (180 / Math.PI));
      }
      let tmp = KGetQuat(
        temp_accX,
        temp_accY,
        temp_accZ,
        temp_magX,
        temp_magY,
        temp_magZ
      );
      quaternionToEuler(tmp[0], tmp[1], tmp[2], tmp[3]);
      four1.push(tmp[0]);
      four2.push(tmp[1]);
      four3.push(tmp[2]);
      four4.push(tmp[3]);
    }
  };
  //name:公共函数的定义部分
  //function:处理温度和加速度数据的函数，处理磁力压力的函数
  //数据数组，标识符（tmp or adc）
  const processHex = (hexArray) => {
    let q1 =
      Math.pow(16, 5) * parseInt(hexArray[4], 16) +
      Math.pow(16, 4) * parseInt(hexArray[5], 16) +
      Math.pow(16, 3) * parseInt(hexArray[2], 16) +
      Math.pow(16, 2) * parseInt(hexArray[3], 16) +
      16 * parseInt(hexArray[0], 16) +
      parseInt(hexArray[1], 16);
    let AIN1 =
      q1 *
      ((2 * 210 * Math.pow(10, -4) * 10 * Math.pow(10, 3)) / Math.pow(2, 24));
    let r1 = (AIN1 / 210) * Math.pow(10, 3);
    let F1 = 351.92 / (r1 - 0.9994);

    if (F1 < 0) F1 = -F1;

    return F1;
  };

  // 处理加速度值的函数
  const processAcceleration = (hexArray) => {
    let acc_x_decimal =
      parseInt(hexArray[0], 16) * Math.pow(16, 3) +
      parseInt(hexArray[1], 16) * Math.pow(16, 2) +
      parseInt(hexArray[2], 16) * 16 +
      parseInt(hexArray[3], 16);

    let acc_x_binary = acc_x_decimal.toString(2).padStart(16, "0");

    let ACC_X;
    if (acc_x_binary[0] === "0") {
      ACC_X = 0.061 * acc_x_decimal;
    } else {
      let acc_x_binary_tmp = "1";
      for (let i = 1; i < acc_x_binary.length; i++) {
        if (acc_x_binary[i] === "0") acc_x_binary_tmp += "1";
        else acc_x_binary_tmp += "0";
      }
      ACC_X = -0.061 * (parseInt(acc_x_binary_tmp.slice(1), 2) + 1);
    }

    return ACC_X;
  };

  const processMagnetism = (hexArray) => {
    let mag_decimal =
      parseInt(hexArray[0], 16) * Math.pow(16, 3) +
      parseInt(hexArray[1], 16) * Math.pow(16, 2) +
      parseInt(hexArray[2], 16) * 16 +
      parseInt(hexArray[3], 16);

    let mag_binary = mag_decimal.toString(2).padStart(16, "0");

    let Mag;
    if (mag_binary[0] === "0") {
      Mag = 1.5 * mag_decimal;
    } else {
      let mag_binary_tmp = "1";
      for (let i = 1; i < mag_binary.length; i++) {
        if (mag_binary[i] === "0") mag_binary_tmp += "1";
        else mag_binary_tmp += "0";
      }
      Mag = -1.5 * parseInt(parseInt(mag_binary_tmp.slice(1), 2) + 1);
    }
    return Mag;
  };
}

// --------------------------------------传感器数据处理 end------------------------------
