/*
1、excel表头定义
2、按钮逻辑天机
3、port数据处理
 */

const { SerialPort } = require("serialport");
const Clock = require("./clock");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// 创建一个 Clock 实例
const myClock = new Clock();
var port;
let cnt = 0;

//------------------------------------------------excel表格 start------------------------------------------------

var outputData = [
  [
    "时间",
    "压力adc_x",
    "adc_y",
    "adc_z",
    "加速度acc_x",
    "acc_y",
    "acc_z",
    "温度",
    "mag_x",
    "mag_y",
    "mag_z",
    "欧拉角1",
    "欧拉角2",
    "欧拉角3",
    "四元数1",
    "四元数2",
    "四元数3",
    "四元数4",
  ],
  [
    "年/月/日 时/分/秒:分秒",
    "Voltage(V)",
    "Voltage(V)",
    "Voltage(V)",
    "Acceleration(g)",
    "Acceleration(g)",
    "Acceleration(g)",
    "Voltage(V)",
    "Magnetic Field Strength (mGauss)",
    "Magnetic Field Strength (mGauss)",
    "Magnetic Field Strength (mGauss)",
    "Euler Angle(°)",
    "Euler Angle(°)",
    "Euler Angle(°)",
    "单位",
    "单位",
    "单位",
    "单位",
  ],
];

function createExcel(time) {
  // 创建data文件夹，如果不存在
  const dataFolder = path.join(__dirname, '..', '..', '..', '..', '..', "data");

  console.log(dataFolder);

  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
  }

  //工作表创建处理
  var workbook = XLSX.utils.book_new();

  // 创建一个新的工作表
  var worksheet = XLSX.utils.aoa_to_sheet(outputData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 将工作簿保存为 Excel 文件，在data文件夹里面
  const fileName = path.join(
    dataFolder,
    time.replace(/[^a-zA-Z0-9]/g, "_") + "-output.xlsx"
  );
  XLSX.writeFile(workbook, fileName);

  console.log("Excel file created successfully!");
}
//------------------------------------------------excel表格 end------------------------------------------------

//----------------------------------按钮逻辑处理 start--------------------------------

// 获取开始和结束按钮
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

var formattedStartTime;

startBtn.addEventListener("click", () => {
  const comInput = document.getElementById("port").value;

  const startTime = new Date();
  const milliseconds = startTime.getMilliseconds();
  formattedStartTime = `${startTime.toLocaleString()}:${milliseconds}`;
  document.getElementById("start-time").textContent = formattedStartTime;

  myClock.start();
  console.log(comInput);

  // 生产环境
  getData(comInput, 9600);

});

// 点击结束按钮时停止计时，并显示总共经过的时间
stopBtn.addEventListener("click", () => {
  port.close(function (err) {
    if (err) {
      console.log("Error closing port: ", err.message);
    } else {
      console.log("Port closed");
    }
  });

  const totalTime = myClock.stop();
  document.getElementById("duration").textContent = ` ${totalTime} seconds`;

  const endTime = new Date();
  const milliseconds = endTime.getMilliseconds();
  const formattedTime = `${endTime.toLocaleString()}:${milliseconds}`;
  document.getElementById("end-time").textContent = formattedTime;

  document.getElementById("size").textContent = cnt;

  cnt = 0;

  //处理excel输出

  createExcel(formattedStartTime);
});

//----------------------------------按钮逻辑处理 end--------------------------------

// 以下为核心数据处理代码
let lastTmp;
// --------------------------------------传感器数据处理 start------------------------------
function getData(portValue, rate) {
  port = new SerialPort({
    path: portValue,
    baudRate: rate,
  });
  let srcData = [];
  port.on("data", function (data) {
    const index = data.indexOf(65);
    if (index > 0) {
      srcData = [65, ...srcData, ...data.slice(0, index)];
      console.log(srcData);

      handleData();
      srcData = [...data.slice(index, data.length - 1)];
    } else if (index === 0) {
      srcData = [65, ...srcData];
      console.log(srcData);
      handleData();
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
      srcData.join(",").includes(str_adc) &&
      srcData.join(",").includes(str_lsm)
    ) {
      // 开始处理数据
      let test = [];

      //表格填入当前时间
      let time = new Date();
      const milliseconds = time.getMilliseconds();
      const formattedTime = `${time.toLocaleString()}:${milliseconds}`;

      test.push(formattedTime);

      cnt++;

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
        let result = processHex(tmp);
        return result;
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
        let result = processHex(tmp);
        return result;
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
        let result = processHex(tmp);
        return result;
      })();

      test.push(temp_adcX);
      test.push(temp_adcY);
      test.push(temp_adcZ);

      //-----------------------------------handle acc events--------------------------------

      let acc_index = srcData.indexOf(115);
      console.log("下表数据：" + acc_index);
      // 处理加速度值的函数
      let temp_accX = (function () {
        let tmp = [
          (srcData[acc_index + 2] || 0).toString(16),
          (srcData[acc_index + 3] || 0).toString(16),
          (srcData[acc_index + 4] || 0).toString(16),
          (srcData[acc_index + 5] || 0).toString(16),
        ];
        let result = processAcceleration(tmp);
        return result;
      })();

      let temp_accY = (function () {
        let tmp = [
          (srcData[acc_index + 6] || 0).toString(16),
          (srcData[acc_index + 7] || 0).toString(16),
          (srcData[acc_index + 8] || 0).toString(16),
          (srcData[acc_index + 9] || 0).toString(16),
        ];
        let result = processAcceleration(tmp);
        return result;
      })();

      let temp_accZ = (function () {
        let tmp = [
          (srcData[acc_index + 10] || 0).toString(16),
          (srcData[acc_index + 11] || 0).toString(16),
          (srcData[acc_index + 12] || 0).toString(16),
          (srcData[acc_index + 13] || 0).toString(16),
        ];
        let result = processAcceleration(tmp);
        return result;
      })();
      test.push(temp_accX / 1000);
      test.push(temp_accY / 1000);
      test.push(temp_accZ / 1000);

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

        let result = processHex(tmp);
        console.log(Math.abs(result - lastTmp), lastTmp);
        if (!lastTmp || Math.abs(result - lastTmp) < 1) {
          lastTmp = result;
        }
        console.log(lastTmp);
        return lastTmp;
      })();
      test.push(temp_tmp);
      //-----------------------------------handle mag events--------------------------------

      let temp_magX = (function () {
        let tmp = [
          (srcData[acc_index + 14] || 0).toString(16),
          (srcData[acc_index + 15] || 0).toString(16),
          (srcData[acc_index + 16] || 0).toString(16),
          (srcData[acc_index + 17] || 0).toString(16),
        ];
        let result = processMagnetism(tmp);
        return result;
      })();
      let temp_magY = (function () {
        let tmp = [
          (srcData[acc_index + 18] || 0).toString(16),
          (srcData[acc_index + 19] || 0).toString(16),
          (srcData[acc_index + 20] || 0).toString(16),
          (srcData[acc_index + 21] || 0).toString(16),
        ];
        let result = processMagnetism(tmp);
        return result;
      })();
      let temp_magZ = (function () {
        let tmp = [
          (srcData[acc_index + 22] || 0).toString(16),
          (srcData[acc_index + 23] || 0).toString(16),
          (srcData[acc_index + 24] || 0).toString(16),
          (srcData[acc_index + 25] || 0).toString(16),
        ];
        let result = processMagnetism(tmp);
        return result;
      })();

      test.push(temp_magX);
      test.push(temp_magY);
      test.push(temp_magZ);

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
        test.push(roll * (180 / Math.PI));
        test.push(pitch * (180 / Math.PI));
        test.push(yaw * (180 / Math.PI));
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
      test.push(tmp[0]);
      test.push(tmp[1]);
      test.push(tmp[2]);
      test.push(tmp[3]);
      outputData.push(test);
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