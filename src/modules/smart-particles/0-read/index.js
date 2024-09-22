// --------------------------------------传感器数据处理 start------------------------------
function getData(portValue, rate) {
  port = new SerialPort({
    path: portValue,
    baudRate: rate,
  });

  //65, 100, 99, 12, 10, 6, 14, 3, 15, 9, 4, 10, 13, 3, 15, 12, 7, 6, 15, 3, 13,
  //84, 109, 112, 1, 14, 13, 11, 0, 5,
  //73, 115, 109, 14, 8, 8, 8, 7, 15, 14, 0, 7, 15, 14, 0, 0, 1, 6, 3, 15, 15, 11, 3, 15, 14, 4, 10,

  let srcData = [];

  port.on("data", function (data) {
    let tmp = 0;
    let adcX = 0;
    let adcY = 0;
    let adcZ = 0;
    let accX = 0;
    let accY = 0;
    let accZ = 0;
    let magX = 0;
    let magY = 0;
    let magZ = 0;

    if (data[0] === 65) {
      handleData();
      srcData = [];
    }
    srcData.push(data[0]);

    //一个一个数据流往里塞,从65开始统计，到下一个65结束，同时里面的数据流处理逻辑应该是不变的，这样的话每次都是一个完整的buffer处理
  });

  const handleData = (srcData) => {
    const str_tmp = "84,109,112"; //54,6d,70
    const str_adc = "65,100,99"; //41 64 63
    const str_lsm = "73,115,109"; //49,73,6d

    //65, 100, 99, 12, 10, 6, 14, 3, 15, 9, 4, 10, 13, 3, 15, 12, 7, 6, 15, 3, 13, ------21
    //84, 109, 112, 1, 14, 13, 11, 0, 5, ----6
    //73, 115, 109, 14, 8, 8, 8, 7, 15, 14, 0, 7, 15, 14, 0, 0, 1, 6, 3, 15, 15, 11, 3, 15, 14, 4, 10,  ------27

    if (
      !srcData.join(",").includes(str_tmp) &&
      !srcData.join(",").includes(str_adc) &&
      !srcData.join(",").includes(str_lsm)
    ) {
      return;
    } else {
      // 开始处理数据
      console.log("开始处理数据");

      //name:公共函数的定义部分
      //function:处理温度和加速度数据的函数，处理磁力压力的函数
      //数据数组，标识符（tmp or adc）
      function processHex(hexArray) {
        let q1 =
          Math.pow(16, 5) * parseInt(hexArray[4], 16) +
          Math.pow(16, 4) * parseInt(hexArray[5], 16) +
          Math.pow(16, 3) * parseInt(hexArray[2], 16) +
          Math.pow(16, 2) * parseInt(hexArray[3], 16) +
          16 * parseInt(hexArray[0], 16) +
          parseInt(hexArray[1], 16);
        let AIN1 =
          q1 *
          ((2 * 210 * Math.pow(10, -4) * 10 * Math.pow(10, 3)) /
            Math.pow(2, 24));
        let r1 = (AIN1 / 210) * Math.pow(10, 3);
        let F1 = 351.92 / (r1 - 0.9994);

        if (F1 < 0) F1 = -F1;

        return F1;
      }

      // 处理加速度值的函数
      function processAcceleration(hexArray) {
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
      }

      function processMagnetism(hexArray) {
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
      }

      //---------------------------------------------------name:数据处理部分
      //----处理温度
      tmp = function () {
        let tmp = [
          srcData[24].toString(16),
          srcData[25].toString(16),
          srcData[26].toString(16),
          srcData[27].toString(16),
          srcData[28].toString(16),
          srcData[29].toString(16),
        ];
        let result = processHex(tmp);
        return result;
      };

      //----处理加速度和磁力
      let accX = function () {
        let tmp = [
          srcData[30].toString(16),
          srcData[31].toString(16),
          srcData[32].toString(16),
          srcData[33].toString(16),
        ];
        let result = processAcceleration(tmp);
        return result;
      };
      accY = function () {
        let tmp = [
          srcData[34].toString(16),
          srcData[35].toString(16),
          srcData[36].toString(16),
          srcData[37].toString(16),
        ];
        let result = processAcceleration(tmp);
        return result;
      };
      accZ = function () {
        let tmp = [
          srcData[38].toString(16),
          srcData[39].toString(16),
          srcData[40].toString(16),
          srcData[41].toString(16),
        ];
        let result = processAcceleration(tmp);
        return result;
      };
      // mag
      magX = function () {
        let tmp = [
          srcData[42].toString(16),
          srcData[43].toString(16),
          srcData[44].toString(16),
          srcData[45].toString(16),
        ];
        let result = processMagnetism(tmp);
        return result;
      };
      magY = function () {
        let tmp = [
          srcData[46].toString(16),
          srcData[47].toString(16),
          srcData[48].toString(16),
          srcData[49].toString(16),
        ];
        let result = processMagnetism(tmp);
        return result;
      };
      magZ = function () {
        let tmp = [
          srcData[50].toString(16),
          srcData[51].toString(16),
          srcData[52].toString(16),
          srcData[53].toString(16),
        ];
        let result = processMagnetism(tmp);
        return result;
      };

      //----处理压力
      adcX = function () {
        let tmp = [
          srcData[3].toString(16),
          srcData[4].toString(16),
          srcData[5].toString(16),
          srcData[6].toString(16),
          srcData[7].toString(16),
          srcData[8].toString(16),
        ];
        let result = processHex(tmp);
        return result;
      };
      adcY = function () {
        let tmp = [
          srcData[9].toString(16),
          srcData[10].toString(16),
          srcData[11].toString(16),
          srcData[12].toString(16),
          srcData[13].toString(16),
          srcData[14].toString(16),
        ];
        let result = processHex(tmp);
        return result;
      };
      adcZ = function () {
        let tmp = [
          srcData[15].toString(16),
          srcData[16].toString(16),
          srcData[17].toString(16),
          srcData[18].toString(16),
          srcData[19].toString(16),
          srcData[20].toString(16),
        ];
        let result = processHex(tmp);
        return result;
      };
    }
  };
}
