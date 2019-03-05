<template>
  <div class="alioss_upload" @click.stop="">
    <div><slot></slot></div>
    <div class="alioss_file">
      <input ref="alioss_file" type="file" :id="id" @change="doUpload()"/>
      <img v-if="url&&url!=''&&fileType=='image'" :src="url" alt="" v-cloak>
      <video v-else-if="url&&url!=''&&fileType=='video'" :src="url"></video>
      <i v-else :class="uploadBool==1?'el-icon-plus':(uploadBool==2?'el-icon-loading':'')" v-text="uploadBool==3?'成功':''" v-cloak></i>
    </div>
    <a v-show="showUrl" :href="loadUrl" v-text="loadUrl" target="view_window"></a>
  </div>
</template>
 
<script>
  import axios from 'axios'
  import { ossUpload } from '@/api/ossUpload'
  export default {
    name: 'AliOSSUpload',
    props:['url','id','showUrl','uploadType'],
    data() {
      return {
        uploadBool: 1,
        loadUrl: '',
        fileType: 'image'
      }
    },
    created(){
    },
    methods: {
      uloadImg(){
        this.$refs['alioss_file'].click();
      },
      doUpload(e){
        let _this = this,file = this.$refs['alioss_file'].files[0]
        if(!file || file.length<1) return
        // 可以在此位置按照自己的需求对当前的组件进行扩展，从而支持更多文件形式，可以通过slot使组件被调用时直接支持想要回显的标签形式。
        switch(_this.uploadType){
          case 'articlePic': _this.fileType = 'image';break;
          case 'video':  _this.fileType = 'video';break;
          case 'videoPic':  _this.fileType = 'image';break;
          case 'user-head':  _this.fileType = 'image';break;
          case 'user-image':  _this.fileType = 'image';break;
          default:  _this.fileType = 'all';break;
        }
        if(file.type.indexOf(_this.fileType) != -1||_this.fileType=='all'){
        // 请求后端获取对应的签名等，由于前段的安全性问题，尽量不要直接将id和secret暴露在前端，而是通过后端请求获取签名的方式来进行上传。
          ossUpload(_this.uploadType).then(res=> {
            _this.uploadBool = 2;
            _this.upLoadOss(Object.assign({},res.result,{file:file}))
          })
        }else{
          _this.$message({
            message: "选择的文件类型错误！",
            type: "error"
          });
        }
      },
      randomString(len) {
        len = len || 32;
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
      },
      upLoadOss(data){
        var request = new FormData(),_this= this;
        var str = _this.randomString();
        let pictureUrl = _this.uploadType=='user-head'?data.dir+str+data.file.name.replace(/.+\./,".")+'?x-oss-process=style/SQUARE_PIC':data.dir+str+data.file.name.replace(/.+\./,".")
        let ossHost = data.host.replace('http:',location.protocol);//这个是为了防止出现OSS跨域问题
        request.append("OSSAccessKeyId",data.accessid);//Bucket 拥有者的Access Key Id。
        request.append("policy",data.policy);//policy规定了请求的表单域的合法性
        request.append("Signature",data.signature);//根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
        request.append("key",data.dir+str+data.file.name.replace(/.+\./,"."));//文件名字，可设置路径
        request.append("success_action_status",'200');// 让服务端返回200,不然，默认会返回204
        request.append('file', data.file);//需要上传的文件 file
        axios({
          method: 'post',
          url: ossHost,
          data: request,
        }).then(res=> {return res.data}).then(rst=>{
          _this.$emit('upLoadImgEnd',ossHost+'/'+pictureUrl);
          _this.uploadBool = 3;
          _this.loadUrl = ossHost+'/'+pictureUrl;
        })
      }
    }
  }
 
</script>
 
<style  scoped>
  .alioss_upload{
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .alioss_upload .alioss_file:hover{
    border-color: #ff5645;
    color: #ff5645;
  }
  .alioss_upload .alioss_file{
    width: 120px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    color: #d9d9d9;
    font-size: 35px;
    font-weight: 900;
    line-height: 120px;
    text-align: center;
    overflow: hidden;
  }
  .alioss_upload .alioss_file input{
    width: 120px;
    height: 120px;
    position: absolute;
    left: 0;
    opacity: 0;
    z-index: 2;
  }
  .alioss_upload .alioss_file img{
    width: 100%;
  }
  .alioss_upload .alioss_file video{
    width: 100%;
  }
</style>