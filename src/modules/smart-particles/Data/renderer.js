/*
1、侧边栏处理
2、图像处理
3、port数据处理
*/

// ----------------------侧边栏逻辑处理 start --------------------
const cal_x = [];
const cal_y = [];
const cal_z = [];
const cal_tmp = [];

var port;

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
  closeButton.addEventListener("click",  () => port.close());

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
    if(!port){
      getData("COM" + selectedCom, Number(selectedNum));
    }
  }
});

// --------------------------------------传感器数据处理------------------------------
const { SerialPort } = require("serialport");
//--------------------------表格处理 start------------------------
function updateTable({
  tmp,
  tmpc,

  adcx,
  adcy,
  adcz,

  adcxc,
  adcyc,
  adczc,

  accx,
  accy,
  accz,

  magx,
  magy,
  magz,

  oularx,
  oulary,
  oularz,

  q0,
  q1,
  q2,
  q3,
}) {
  console.log(tmp);
  // Get the table cells by their IDs
  function updateTime() {
    const now = new Date(); // 获取当前时间
    const formattedTime = now.toLocaleTimeString(); // 格式化为当地时间字符串
    document.getElementById("0-cell2").textContent = formattedTime; // 更新单元格内容
  }
  setInterval(updateTime, 1000); // 每秒更新一次
  updateTime(); // 初始化显示时间

  var cell1 = document.getElementById("1-cell2");
  var cell2 = document.getElementById("2-cell2");

  var cell7 = document.getElementById("3-cell2");
  var cell8 = document.getElementById("3-cell3");
  var cell9 = document.getElementById("3-cell4");

  var cell10 = document.getElementById("4-cell2");
  var cell11 = document.getElementById("4-cell3");
  var cell12 = document.getElementById("4-cell4");

  var cell13 = document.getElementById("5-cell2");
  var cell14 = document.getElementById("5-cell3");
  var cell15 = document.getElementById("5-cell4");

  var cell16 = document.getElementById("6-cell2");
  var cell17 = document.getElementById("6-cell3");
  var cell18 = document.getElementById("6-cell4");

  var cell19 = document.getElementById("7-cell2");
  var cell20 = document.getElementById("7-cell3");
  var cell21 = document.getElementById("7-cell4");

  var cell22 = document.getElementById("8-cell2");
  var cell23 = document.getElementById("8-cell3");
  var cell24 = document.getElementById("8-cell4");
  var cell25 = document.getElementById("8-cell5");

  // Update the cell contents
  cell1.textContent = tmp + "V";
  cell2.textContent = tmpc + "℃";

  cell7.textContent = "X:" + adcx + "V";
  cell8.textContent = "Y:" + adcy + "V";
  cell9.textContent = "Z:" + adcz + "V";

  cell10.textContent = "X:" + adcxc + "N";
  cell11.textContent = "Y:" + adcyc + "N";
  cell12.textContent = "Z:" + adczc + "N";

  cell13.textContent = "X:" + accx;
  cell14.textContent = "Y:" + accy;
  cell15.textContent = "Z:" + accz;

  cell16.textContent = "X:" + magx;
  cell17.textContent = "Y:" + magy;
  cell18.textContent = "Z:" + magz;

  cell19.textContent = "X:" + oularx;
  cell20.textContent = "Y:" + oulary;
  cell21.textContent = "Z:" + oularz;

  cell22.textContent = "q0:" + q0;
  cell23.textContent = "q1:" + q1;
  cell24.textContent = "q2:" + q2;
  cell25.textContent = "q3:" + q3;
}

// 示例数据更新
const newData = ["更新内容1", "更新内容2", "更新内容3", "更新内容4"];
updateTable(newData);

//--------------------------表格处理 end------------------------

// ------------------------以下为port数据处理 start------------------------

// 以下为核心数据处理代码
function throttle(func, limit) {
  let lastFunc;
  let lastRan;

  return function (...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

const throttledProcessData = throttle(function (data) {
  for (let key in obj) {
    if (typeof obj[key] === 'number') {
      obj[key] = parseFloat(obj[key].toFixed(4));
    }
  }  
  updateTable(obj);
}, 800); // 每秒处理一次
// --------------------------------------传感器数据处理 start------------------------------
let obj = {
  tmp: -1,
  tmpc: -1,

  adcx: -1,
  adcy: -1,
  adcz: -1,

  adcxc: -1,
  adcyc: -1,
  adczc: -1,

  accx: -1,
  accy: -1,
  accz: -1,

  magx: -1,
  magy: -1,
  magz: -1,

  oularx: -1,
  oulary: -1,
  oularz: -1,

  q0: -1,
  q1: -1,
  q2: -1,
  q3: -1,
};

function getData(portValue, rate) {
  port = new SerialPort({
    path: portValue,
    baudRate: rate,
  });
  let srcData = [];

  port.on("data", function (data) {
    if (data[0] === 65) {
      console.log(data[0]);
      console.log(srcData);
      handleData();
      throttledProcessData();
      srcData = [];
    }
    srcData.push(data[0]);

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

      obj.adcx = temp_adcX;
      obj.adcy = temp_adcY;
      obj.adcz = temp_adcZ;

      obj.adcxc=
        temp_adcX >= cal_x[0]
          ? cal_x[1] * temp_adcX + cal_x[2]
          : cal_x[3] * temp_adcX + cal_x[4]
      ;
      obj.adcyc=
        temp_adcY >= cal_y[0]
          ? cal_y[1] * temp_adcY + cal_y[2]
          : cal_y[3] * temp_adcY + cal_y[4]
      ;
      obj.adczc=
        temp_adcZ >= cal_z[0]
          ? cal_z[1] * temp_adcZ + cal_z[2]
          : cal_z[3] * temp_adcZ + cal_z[4]
      ;

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
      obj.accx = temp_accX / 1000;
      obj.accy = temp_accY / 1000;
      obj.accz = temp_accZ / 1000;

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
        return result;
      })();
      obj.tmp = temp_tmp;
      obj.tmpc = temp_tmp >= cal_tmp[0]? cal_tmp[1] * temp_tmp + cal_tmp[2] : cal_tmp[3] * temp_tmp + cal_tmp[4];
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

      obj.magx = temp_magX;
      obj.magy = temp_magY;
      obj.magz = temp_magZ;

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
        obj.oularx = roll * (180 / Math.PI);
        obj.oulary = pitch * (180 / Math.PI);
        obj.oularz = yaw * (180 / Math.PI);
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
      obj.q0=tmp[0];
      obj.q1=tmp[1];
      obj.q2=tmp[2];
      obj.q3=tmp[3];
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
