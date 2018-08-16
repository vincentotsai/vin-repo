<template>
  <div class="feedback">
      <div class="explain">
        <span class="title">问题说明</span>
        <textarea placeholder="请描述您使用过程中的问题与建议，若功能异常可以上传图片，方便我们为您快速解决问题。" 
            cols="30" rows="20" v-model.trim="questionDesc" maxlength="500"></textarea>
        <span class="limit-len">500</span>
      </div>
      <div class="updata">
        <div class="updata-title">
            <span class="title">图片凭证</span>
            <span class="warning">可上传4张图片</span>
        </div>
        <form class="img-form" enctype="multipart/form-data" id="imgForm">
          <ul>
            <li v-for="(imgItem,key) in imgList" :key="key" v-show="imgItem">
              <input v-show="false" type="file" name="files" class='inputStyle' @change="changeImg(key)" :id='"addImg-"+key'>
              <div class="img-box"><img :src="imgItem" @load="onLoad"></div>

              <i @click="deleteImg(key)" v-if="imgItem"></i>
            </li>
            <li v-if="!isHide">
              <img src="../../assets/icon_tjtp@2x.png" alt="" @click="addImg()">
            </li>
          </ul>
        </form>
      </div>
      <div class="bottom-btn">
        <div class="submit-btn" @click="submit()">立即提交</div>
      </div>
  </div>
</template>

<script>
import { TransferDom, Popup, Toast } from 'vux'
import { qiniuToken, imgUpdate } from "../../util/imgUpdate";
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup,
    Toast
  },
  data() {
      return {
          isDialog: false,
          dialogData: [], //问题类型
          questionDesc: '',
          isHide: false,
          imgList: [null, null, null, null],
          urlList: [],
          flag: false,
      }
  },
  created() {
    this.setTitle('反馈与建议')
  },
  methods: {
    addImg() {
      for (let i = 0; i < this.imgList.length; i++) {
        if (!this.imgList[i]) {
          document.getElementById("addImg-" + i).click();
          if (i >= 3) {
            this.isHide = true;
          }
          return;
        }
      }
      this.isHide = true;
    },
    deleteImg(key) {
      this.isHide = false;
      this.$set(this.imgList, key, null);
      let fileDom = document.getElementById("addImg-" + key);
      fileDom.type = "text";
      fileDom.type = "file";
    },
    changeImg(key) {
      let self = this;
      let reader = new FileReader();
      reader.readAsDataURL(
        document.getElementById("addImg-" + key).files[0]
      );
      reader.onloadend = function(e) {
        self.$set(self.imgList, key, e.target.result);
      };
    },
    //提交
    submit() {
      let self = this;
      if(this.flag) {
        return
      }
      this.flag = true;
      qiniuToken(function(res) {
        verifyPar(res);
      });
      function verifyPar(qnData) {
          console.log("questionDesc",self.questionDesc)
          if (self.questionDesc == "") { self.$vux.toast.text("请填写问题描述");  return; }

          self.updataImg(qnData, function(res) {
            self.urlList = res;
            self.$vux.loading.show({
            text: "提交中"
            });
            self.feedback()
          })
      }
    },
    updataImg(qnData,cb) {
      let files = $("#imgForm")[0].files;
      let _arr = [];
      for (let n = 0; n < files.length; n++) {
        let _f = files[n]
        if (_f.value != "") {
          _arr.push(_f.files[0]);
        }
      }
      console.log("_arr",_arr);
      if(_arr.length > 0) {
        console.log("qnData",qnData)
        imgUpdate(_arr, qnData.uploadToken, "", res => {
          console.log("res",res)
          let new_arr = res.map(element => {
            return qnData.accessPrefixUrl+'/'+ element.key
          });
          cb(new_arr)
        });
      }else {
        cb([])
      }
      return;
    },
    feedback() {
      let _self = this;
      let httpData = {
        content: this.questionDesc,
        imgList: this.urlList
      };
      this.$http.post("uc/feedback_details.do", httpData).then(res => {
        console.log('afterSale_request res->>',res)
        this.$vux.loading.hide();
        this.$vux.toast.show({
          type: 'text',
          width: '5.1rem',
          time: 500,
          text: '<div style="margin:10px 0; font-size: 14px;">发送成功</div><div style="padding-bottom: 10px;font-size: 12px;">感谢您对ola的支持<div>',
          onHide () {
            _self.$router.push({ path: '/set' })
            _self.flag = false;
          }
        })
      });
    },
    onLoad(e) {
      let w = e.srcElement.width;
      let h = e.srcElement.height;
      if (w > h) {
        e.srcElement.style.height = "81px";
        e.srcElement.style.width = 81 * w / h + "px";
      } else {
        e.srcElement.style.width = "81px";
        e.srcElement.style.height = 81 * h / w + "px";
      }
    },
  }
}
</script>
<style scoped lang="less">
@import '../../styles/index.less';
.feedback {
    width: 100%;
    height: 100%;
}
.explain {
    padding: 21px 12px 0;
    display: flex;
    background-color: #fff;
    position: relative;
    .title {
        font-size: 14px;
        color: #1b1b1b;
        font-weight: 600;
        margin-right: 20px;
    }
    textarea {
        font-size: 12px;
        line-height: 18px;
        flex: 1;
        height: 103px;
        padding-bottom: 12px;
    }
    .limit-len {
      position: absolute;
      bottom: 0;
      right: 12px;
      font-size: 12px;
      color: #CCCCCC;
    }
}
.updata {
    overflow: hidden;
    padding: 23px 12px 20px;
    background: #fff;
    .title {
        font-size: 14px;
        color: #1B1B1B;
        letter-spacing: 0;
        font-weight: 600;
    }
    .warning {
        font-size: 12px;
        color: #CCCCCC;
        letter-spacing: 0;
        line-height: 14px;
        display: inline-block;
        margin-left: 21px;
    }
    .img-form {
        margin-top: 6px;
        ul {
            overflow: hidden;
        }
        li {
            float: left;
            position: relative;
            width: 81px;
            height: 81px;
            margin: 9px 9px 0 0;
            .inputStyle {
                width: 100%;
                height: 68px;
                opacity: 0;
                filter: alpha(opacity=0);
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: 1;
            }
            > img {
                width: 81px;
                height: 81px;
            }
            .img-box {
                width: 81px;
                height: 81px;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            > i {
                position: absolute;
                top: 0;
                right: 0;
                display: block;
                background-image: url("../../assets/delete@2x.png");
                background-size: 100%;
                width: 13px;
                height: 13px;
                z-index: 10;
            }
        }
        li:nth-of-type(4n),
        li:nth-of-type(5n), {
            margin-right: 0;
        }
    }
}
.bottom-btn {
    position: absolute;
    bottom: 133px;
    left: 50%;
    margin-left: -133px;
    .submit-btn {
        width: 265px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        background-image: linear-gradient(90deg, #FF8996 0%, #FC6655 100%);
        box-shadow: 0 4px 13px 0 rgba(252,102,85,0.31);
        border-radius: 40px;
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: 0;
    }
}
.dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  text-align: center;
  z-index: 1000;
  .bg-ground {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
  }
  .content {
    width: 100%;
    position: relative;
    .text-box {
      position: absolute;
      top: 230px;
      left: 93px;
      width: 190px;
      height: 78px;
      opacity: 0.6;
      background: #000000;
      border-radius: 8px;
      text-align: center;
      color: #FFFFFF;
      .text1 {
        font-size: 14px;
        margin: 20px 0 10px 0;
      }
      .text2 {
        font-size: 12px;
      }
    }
  }
}
</style>