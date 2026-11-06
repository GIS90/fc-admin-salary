import{d as se,r as D,a as f,w as ue,o as F,c as oe,b as a,e as u,t as $,f as l,g as R,D as e,j as ne,W as me,T as be,E as ie,h as O,i as re,k as ae,u as Se,X as Pe,S as $e,G as De,H as Be,_ as qe,l as Ae,P as Fe}from"./index.D5ZN_qnZ.js";/* empty css                  */import{a as Le,E as Ue,b as Re}from"./el-main.Brf3qOmq.js";import{S as Oe,a as He,b as Me,c as je,d as Ie,_ as Ne}from"./index.BqUaDvG1.js";import{_ as We}from"./index.Btd1xvZ7.js";import{E as Ge}from"./el-popconfirm.9Q4Uq5wg.js";import{E as fe}from"./el-popper.BhtWDBIy.js";import"./el-loading.CPNsnkiA.js";/* empty css                  */import"./el-tooltip.l0sNRNKZ.js";import{E as he}from"./el-tag.C7HX4S7O.js";import"./el-input.CPtWgD1B.js";import{d as _e,f as J,i as p,s as X,a as _,t as U,b as G,c as Ke,P as Je,e as L}from"./field.D-9h9p-W.js";import{T as Xe}from"./common.AseaEH5b.js";import{E as ge}from"./el-dialog.CKugKyVy.js";import{E as ve,a as we}from"./el-form-item.DOb0i2K_.js";import{E as ye}from"./el-radio.Vy6bQpPU.js";import{E as xe,a as Ce}from"./el-select.Ces-SmCO.js";import"./el-scrollbar.DW9Xgry_.js";import{p as ze,a as Ve}from"./place.Dnymiuas.js";import{E as de}from"./index.CG24EB2P.js";import{E as ce}from"./index.mFUZAc6f.js";import{E as Qe}from"./el-drawer.o8XoZal2.js";import{a as Ye,E as Ze}from"./el-tab-pane.cL8goOxV.js";import{m as ke}from"./utils.Dbc4myJn.js";import"./systemMain.CoyN3dP7.js";import"./index.bivXtXuq.js";import"./index.BaPrDhLr.js";import"./index.DtuIr-6s.js";import"./vnode.B2Hz8rMv.js";import"./sortable.esm.7jqJT7E5.js";import"./isEqual.BUqfukBr.js";import"./_Uint8Array.B7Ai6TPp.js";import"./dropdown.CGO8zo62.js";import"./variable.DW_uluDi.js";import"./use-form-common-props.C2G-729X.js";import"./el-radio-group.DCfy3Wmi.js";/* empty css                    */import"./index.DJQPQn9H.js";import"./index.Brn73gXt.js";import"./_baseClone.CSlm5JDQ.js";import"./index.ung4doBq.js";const el={class:"my-dialog-header"},ll={class:"my-dialog-header-title"},ol={class:"my-dialog-header-icon"},tl={class:"my-dialog-body"},al=u("div",{class:"el-form-item-msg"},"endpoint为接口唯一标识，不允许修改",-1),nl={class:"el-form-item-msg"},il={class:"my-dialog-footer"},sl=se({__name:"edit",props:{visible:{type:Boolean,required:!0,default:!1},md5:{type:String,required:!0,default:""}},emits:["update:visible","reFetchTableData"],setup(y,{emit:H}){const C=[{label:"GET",value:"GET"},{label:"POST",value:"POST"},{label:"PUT",value:"PUT"},{label:"PATCH",value:"PATCH"},{label:"DELETE",value:"DELETE"}],n=ze.systemApiModel,m=Ve.systemApiModel,T=D({title:"编辑",width:"50%"}),B=f({minRows:3,maxRows:4}),r={..._e,...T},x=f(r.fullScreen),h=f("全屏"),b=H,d=f(!1),V=f(!1),P=y;ue(x,s=>{h.value=s?"取消全屏":"全屏"},{immediate:!0});function z(){b("update:visible",!1)}function M(){x.value=!x.value}function E(){var s;(s=S.value)==null||s.clearValidate(),j(P.md5)}const S=f(),t=D({}),g=D({blueprint:[{required:!0,message:"Blueprint不允许为空",trigger:"blur"},{min:1,max:n.blueprint,message:"最大长度支持"+n.blueprint+"位",trigger:"blur"}],apiname:[{required:!0,message:"方法名称不允许为空",trigger:"blur"},{min:1,max:n.apiname,message:"最大长度支持"+n.apiname+"位",trigger:"blur"}],endpoint:[{required:!0,message:"Endpoint不允许为空",trigger:"blur"},{min:1,max:n.endpoint,message:"最大长度支持"+n.endpoint+"位",trigger:"blur"}],path:[{required:!0,message:"Path不允许为空",trigger:"blur"},{min:1,max:n.path,message:"最大长度支持"+n.path+"位",trigger:"blur"}],method:[{required:!0,message:"请求方式不允许为空",trigger:"change"}]}),j=async s=>{const o=await Oe({md5:s});o.data&&Object.assign(t,o.data)},I=async s=>{s&&await s.validate(o=>{o&&(d.value=!0,V.value=!0,He(t).then(()=>{ie({title:"提示",message:"编辑成功",type:"success"}),z(),b("reFetchTableData",!0)}).finally(()=>{d.value=!1,V.value=!1}))})};return(s,o)=>{const k=O("FullScreen"),q=re,A=fe,N=O("Close"),v=de,c=ve,K=Ce,Q=xe,Y=ye,Z=we,W=ce,ee=ge;return F(),oe(ee,{"model-value":P.visible,width:r.width,fullscreen:x.value,top:r.top,modal:r.modal,"lock-scroll":r.lockScroll,"open-delay":r.openDelay,"close-delay":r.closeDelay,"close-on-click-modal":r.closeOnClickModal,"close-on-press-escape":r.closeOnPressEscape,"show-close":r.showClose,draggable:r.draggable,overflow:r.overflow,center:r.center,"align-center":r.alignCenter,onOpen:E,onClose:z},{header:a(()=>[u("div",el,[u("div",ll,$(r.title),1),u("div",ol,[l(A,{effect:"dark",content:h.value,placement:"top"},{default:a(()=>[l(q,{onClick:M,class:"margin-right-15px"},{default:a(()=>[l(k)]),_:1})]),_:1},8,["content"]),l(A,{effect:"dark",content:"关闭",placement:"top"},{default:a(()=>[l(q,{onClick:z},{default:a(()=>[l(N)]),_:1})]),_:1})])])]),footer:a(()=>[u("div",il,[l(W,{disabled:d.value,onClick:z},{default:a(()=>[R("取 消")]),_:1},8,["disabled"]),l(W,{disabled:d.value,loading:V.value,type:"primary",onClick:o[8]||(o[8]=i=>I(S.value))},{default:a(()=>[R("确 定")]),_:1},8,["disabled","loading"])])]),default:a(()=>[u("div",tl,[l(Z,{ref_key:"ruleFormRef",ref:S,model:t,rules:g,"label-position":e(J).labelPosition,"label-width":e(J).labelWidth,size:e(J).size,style:{width:"100%"}},{default:a(()=>[l(c,{label:"Blueprint",prop:"blueprint"},{default:a(()=>[l(v,{modelValue:t.blueprint,"onUpdate:modelValue":o[0]||(o[0]=i=>t.blueprint=i),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(n).blueprint,placeholder:e(m).blueprint,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(c,{label:"方法名称",prop:"apiname"},{default:a(()=>[l(v,{modelValue:t.apiname,"onUpdate:modelValue":o[1]||(o[1]=i=>t.apiname=i),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(n).apiname,placeholder:e(m).apiname,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(c,{label:"Endpoint",prop:"endpoint"},{default:a(()=>[l(v,{modelValue:t.endpoint,"onUpdate:modelValue":o[2]||(o[2]=i=>t.endpoint=i),modelModifiers:{trim:!0},size:e(p).size,disabled:""},null,8,["modelValue","size"]),al]),_:1}),l(c,{label:"Path",prop:"path"},{default:a(()=>[l(v,{modelValue:t.path,"onUpdate:modelValue":o[3]||(o[3]=i=>t.path=i),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(n).path,placeholder:e(m).path,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(c,{label:"请求方式",prop:"method"},{default:a(()=>[l(Q,{modelValue:t.method,"onUpdate:modelValue":o[4]||(o[4]=i=>t.method=i),size:e(X).size,clearable:e(X).clearable,filterable:e(X).filterable,placeholder:e(m).method,style:{width:"100%"},disabled:d.value},{default:a(()=>[(F(),ne(be,null,me(C,i=>l(K,{key:i.value,label:i.label,value:i.value},null,8,["label","value"])),64))]),_:1},8,["modelValue","size","clearable","filterable","placeholder","disabled"])]),_:1}),l(c,{label:"简述",prop:"short"},{default:a(()=>[l(v,{modelValue:t.short,"onUpdate:modelValue":o[5]||(o[5]=i=>t.short=i),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(n).short,placeholder:e(m).short,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(c,{label:"排序编号",prop:"orderId"},{default:a(()=>[l(Y,{modelValue:t.orderId,"onUpdate:modelValue":o[6]||(o[6]=i=>t.orderId=i),style:{width:"100%"},min:e(_).min,max:e(_).max,step:e(_).step,"step-strictly":e(_).stepStrictly,precision:e(_).precision,size:e(_).size,controls:e(_).controls,"controls-position":e(_).controlsPosition,disabled:d.value},null,8,["modelValue","min","max","step","step-strictly","precision","size","controls","controls-position","disabled"]),u("div",nl," 数值越小排序越靠前，默认 1，最大值为"+$(e(_).max.toLocaleString()),1)]),_:1}),l(c,{label:"详细描述",prop:"long"},{default:a(()=>[l(v,{modelValue:t.long,"onUpdate:modelValue":o[7]||(o[7]=i=>t.long=i),type:e(U).type,size:e(U).size,"show-word-limit":e(U).showWordLimit,clearable:e(U).clearable,autosize:B.value,maxlength:e(n).long,placeholder:e(m).long,disabled:d.value},null,8,["modelValue","type","size","show-word-limit","clearable","autosize","maxlength","placeholder","disabled"])]),_:1})]),_:1},8,["model","rules","label-position","label-width","size"])])]),_:1},8,["model-value","width","fullscreen","top","modal","lock-scroll","open-delay","close-delay","close-on-click-modal","close-on-press-escape","show-close","draggable","overflow","center","align-center"])}}}),rl={class:"my-dialog-header"},dl={class:"my-dialog-header-title"},cl={class:"my-dialog-header-icon"},pl={class:"my-dialog-body"},ul=u("div",{class:"el-form-item-msg"},"endpoint需全局唯一，重复将无法新增",-1),ml={class:"el-form-item-msg"},bl={class:"my-dialog-footer"},fl=se({__name:"add",props:{visible:{type:Boolean,required:!0,default:!1}},emits:["update:visible","reFetchTableData"],setup(y,{emit:H}){const C=[{label:"GET",value:"GET"},{label:"POST",value:"POST"},{label:"PUT",value:"PUT"},{label:"PATCH",value:"PATCH"},{label:"DELETE",value:"DELETE"}],n=ze.systemApiModel,m=Ve.systemApiModel,T=D({title:"新增",width:"50%"}),B=f({minRows:3,maxRows:4}),r={..._e,...T},x=f(r.fullScreen),h=f("全屏"),b=H,d=f(!1),V=f(!1),P=y;ue(x,s=>{h.value=s?"取消全屏":"全屏"},{immediate:!0});function z(){b("update:visible",!1),j()}function M(){x.value=!x.value}function E(){var s;(s=S.value)==null||s.clearValidate()}const S=f(),t=D({blueprint:"",apiname:"",endpoint:"",path:"",method:"GET",short:"",long:"",orderId:1}),g=D({blueprint:[{required:!0,message:"Blueprint不允许为空",trigger:"blur"},{min:1,max:n.blueprint,message:"最大长度支持"+n.blueprint+"位",trigger:"blur"}],apiname:[{required:!0,message:"方法名称不允许为空",trigger:"blur"},{min:1,max:n.apiname,message:"最大长度支持"+n.apiname+"位",trigger:"blur"}],endpoint:[{required:!0,message:"Endpoint不允许为空",trigger:"blur"},{min:1,max:n.endpoint,message:"最大长度支持"+n.endpoint+"位",trigger:"blur"}],path:[{required:!0,message:"Path不允许为空",trigger:"blur"},{min:1,max:n.path,message:"最大长度支持"+n.path+"位",trigger:"blur"}],method:[{required:!0,message:"请求方式不允许为空",trigger:"change"}]}),j=()=>{t.blueprint="",t.apiname="",t.endpoint="",t.path="",t.method="GET",t.short="",t.long="",t.orderId=1},I=async s=>{s&&await s.validate(o=>{o&&(d.value=!0,V.value=!0,Me(t).then(()=>{ie({title:"提示",message:"新增成功",type:"success"}),z(),b("reFetchTableData",!0)}).finally(()=>{d.value=!1,V.value=!1}))})};return(s,o)=>{const k=O("FullScreen"),q=re,A=fe,N=O("Close"),v=de,c=ve,K=Ce,Q=xe,Y=ye,Z=we,W=ce,ee=ge;return F(),oe(ee,{"model-value":P.visible,width:r.width,fullscreen:x.value,top:r.top,modal:r.modal,"lock-scroll":r.lockScroll,"open-delay":r.openDelay,"close-delay":r.closeDelay,"close-on-click-modal":r.closeOnClickModal,"close-on-press-escape":r.closeOnPressEscape,"show-close":r.showClose,draggable:r.draggable,overflow:r.overflow,center:r.center,"align-center":r.alignCenter,onOpen:E,onClose:z},{header:a(()=>[u("div",rl,[u("div",dl,$(r.title),1),u("div",cl,[l(A,{effect:"dark",content:h.value,placement:"top"},{default:a(()=>[l(q,{onClick:M,class:"margin-right-15px"},{default:a(()=>[l(k)]),_:1})]),_:1},8,["content"]),l(A,{effect:"dark",content:"关闭",placement:"top"},{default:a(()=>[l(q,{onClick:z},{default:a(()=>[l(N)]),_:1})]),_:1})])])]),footer:a(()=>[u("div",bl,[l(W,{disabled:d.value,onClick:z},{default:a(()=>[R("取 消")]),_:1},8,["disabled"]),l(W,{disabled:d.value,loading:V.value,type:"primary",onClick:o[8]||(o[8]=i=>I(S.value))},{default:a(()=>[R("确 定")]),_:1},8,["disabled","loading"])])]),default:a(()=>[u("div",pl,[l(Z,{ref_key:"ruleFormRef",ref:S,model:t,rules:g,"label-position":e(J).labelPosition,"label-width":e(J).labelWidth,size:e(J).size,style:{width:"100%"}},{default:a(()=>[l(c,{label:"Blueprint",prop:"blueprint"},{default:a(()=>[l(v,{modelValue:t.blueprint,"onUpdate:modelValue":o[0]||(o[0]=i=>t.blueprint=i),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(n).blueprint,placeholder:e(m).blueprint,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(c,{label:"方法名称",prop:"apiname"},{default:a(()=>[l(v,{modelValue:t.apiname,"onUpdate:modelValue":o[1]||(o[1]=i=>t.apiname=i),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(n).apiname,placeholder:e(m).apiname,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(c,{label:"Endpoint",prop:"endpoint"},{default:a(()=>[l(v,{modelValue:t.endpoint,"onUpdate:modelValue":o[2]||(o[2]=i=>t.endpoint=i),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(n).endpoint,placeholder:e(m).endpoint,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"]),ul]),_:1}),l(c,{label:"Path",prop:"path"},{default:a(()=>[l(v,{modelValue:t.path,"onUpdate:modelValue":o[3]||(o[3]=i=>t.path=i),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(n).path,placeholder:e(m).path,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(c,{label:"请求方式",prop:"method"},{default:a(()=>[l(Q,{modelValue:t.method,"onUpdate:modelValue":o[4]||(o[4]=i=>t.method=i),size:e(X).size,clearable:e(X).clearable,filterable:e(X).filterable,placeholder:e(m).method,style:{width:"100%"},disabled:d.value},{default:a(()=>[(F(),ne(be,null,me(C,i=>l(K,{key:i.value,label:i.label,value:i.value},null,8,["label","value"])),64))]),_:1},8,["modelValue","size","clearable","filterable","placeholder","disabled"])]),_:1}),l(c,{label:"简述",prop:"short"},{default:a(()=>[l(v,{modelValue:t.short,"onUpdate:modelValue":o[5]||(o[5]=i=>t.short=i),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(n).short,placeholder:e(m).short,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(c,{label:"排序编号",prop:"orderId"},{default:a(()=>[l(Y,{modelValue:t.orderId,"onUpdate:modelValue":o[6]||(o[6]=i=>t.orderId=i),style:{width:"100%"},min:e(_).min,max:e(_).max,step:e(_).step,"step-strictly":e(_).stepStrictly,precision:e(_).precision,size:e(_).size,controls:e(_).controls,"controls-position":e(_).controlsPosition,disabled:d.value},null,8,["modelValue","min","max","step","step-strictly","precision","size","controls","controls-position","disabled"]),u("div",ml," 数值越小排序越靠前，默认 1，最大值为"+$(e(_).max.toLocaleString()),1)]),_:1}),l(c,{label:"详细描述",prop:"long"},{default:a(()=>[l(v,{modelValue:t.long,"onUpdate:modelValue":o[7]||(o[7]=i=>t.long=i),type:e(U).type,size:e(U).size,"show-word-limit":e(U).showWordLimit,clearable:e(U).clearable,autosize:B.value,maxlength:e(n).long,placeholder:e(m).long,disabled:d.value},null,8,["modelValue","type","size","show-word-limit","clearable","autosize","maxlength","placeholder","disabled"])]),_:1})]),_:1},8,["model","rules","label-position","label-width","size"])])]),_:1},8,["model-value","width","fullscreen","top","modal","lock-scroll","open-delay","close-delay","close-on-click-modal","close-on-press-escape","show-close","draggable","overflow","center","align-center"])}}}),Te=y=>(De("data-v-9ab74bbf"),y=y(),Be(),y),hl={class:"example-header"},_l={class:"example-header-title"},gl={class:"example-header-endpoint"},vl={key:0,class:"example-header-sub"},wl={class:"code-box"},yl={class:"code-box-toolbar"},xl={class:"code-lang"},Cl=Te(()=>u("span",{class:"copy-label"},"复制",-1)),zl={class:"code-block"},Vl={class:"api-config"},kl=Te(()=>u("span",{class:"api-config-label"},"请求路径：",-1)),le=`{
  "key": "value"
}`,Tl="page=1&limit=15&content=keyword",El=se({__name:"example",props:{visible:{type:Boolean,required:!0,default:!1},row:{type:Object,required:!0,default:()=>({md5:"",blueprint:"",apiname:"",endpoint:"",path:"",method:"GET",createRtx:"",createTime:""})}},emits:["update:visible"],setup(y,{emit:H}){const C=[{id:"curl",label:"cURL",lang:"bash"},{id:"python",label:"Python",lang:"python"},{id:"java",label:"Java",lang:"java"},{id:"go",label:"Go",lang:"go"},{id:"nodejs",label:"Node.js",lang:"javascript"}],n=y,m=H,T=f("curl"),B=f("http://127.0.0.1:8000/");function r(){m("update:visible",!1)}function x(){T.value="curl"}ue(()=>n.visible,t=>{t&&(T.value="curl")});const h=ae(()=>{const t=B.value.trim().replace(/\/+$/,""),g=n.row.path||n.row.endpoint||"";return!t||g.startsWith("http")?g:t+(g.startsWith("/")?g:"/"+g)}),b=ae(()=>(n.row.method||"GET").toUpperCase()),d=ae(()=>["POST","PUT","PATCH"].includes(b.value)),V=ae(()=>{switch(T.value){case"curl":return P();case"python":return z();case"java":return M();case"go":return E();case"nodejs":return S();default:return""}});function P(){let t=`curl -X ${b.value} '${h.value}' \\
`;return t+=`  -H 'Authorization: Bearer {your_token}' \\
`,d.value?(t+=`  -H 'Content-Type: application/json' \\
`,t+=`  -d '${le}'`):t+="  -H 'Content-Type: application/json'",t}function z(){const t=b.value==="GET"?`${h.value}?${Tl}`:h.value;return d.value?`import requests

url = '${h.value}'
headers = {
    'Authorization': 'Bearer {your_token}',
    'Content-Type': 'application/json'
}
payload = ${le}

response = requests.${b.value.toLowerCase()}(url, headers=headers, json=payload)
print(response.status_code)
print(response.json())`:`import requests

url = '${t}'
headers = {
    'Authorization': 'Bearer {your_token}'
}

response = requests.request('${b.value}', url, headers=headers)
print(response.status_code)
print(response.json())`}function M(){return d.value?`import okhttp3.*;

public class ApiExample {
    public static void main(String[] args) throws Exception {
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, "${le.replace(/\n/g," ")}");
        Request request = new Request.Builder()
            .url("${h.value}")
            .method("${b.value}", body)
            .addHeader("Authorization", "Bearer {your_token}")
            .addHeader("Content-Type", "application/json")
            .build();

        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
}`:`import okhttp3.*;

public class ApiExample {
    public static void main(String[] args) throws Exception {
        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
            .url("${h.value}")
            .method("${b.value}", null)
            .addHeader("Authorization", "Bearer {your_token}")
            .build();

        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
}`}function E(){return d.value?`package main

import (
    "bytes"
    "fmt"
    "io"
    "net/http"
)

func main() {
    url := "${h.value}"
    payload := bytes.NewBufferString(\`${le}\`)

    req, _ := http.NewRequest("${b.value}", url, payload)
    req.Header.Set("Authorization", "Bearer {your_token}")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`:`package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    url := "${h.value}"
    req, _ := http.NewRequest("${b.value}", url, nil)
    req.Header.Set("Authorization", "Bearer {your_token}")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`}function S(){return d.value?`import axios from 'axios';

const url = '${h.value}';
const data = ${le};

axios.${b.value.toLowerCase()}(url, data, {
  headers: {
    'Authorization': 'Bearer {your_token}',
    'Content-Type': 'application/json'
  }
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});`:`import axios from 'axios';

const url = '${h.value}';

axios.request({
  method: '${b.value}',
  url: url,
  headers: {
    'Authorization': 'Bearer {your_token}'
  }
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});`}return(t,g)=>{const j=he,I=O("CopyDocument"),s=re,o=ce,k=Ze,q=Ye,A=de,N=Qe,v=Pe("copy");return F(),oe(N,{"model-value":n.visible,size:"45%",direction:"rtl",modal:e(G).modal,"lock-scroll":e(G).lockScroll,"show-close":e(G).showClose,"close-on-click-modal":e(G).closeOnClickModal,"close-on-press-escape":e(G).closeOnPressEscape,"open-delay":e(G).openDelay,"with-header":!0,"destroy-on-close":e(G).destroyOnClose,onOpen:x,onClose:r},{header:a(()=>[u("div",hl,[u("div",_l,[l(j,{type:e(ke)(y.row.method),effect:"dark",size:"small"},{default:a(()=>[R($(y.row.method),1)]),_:1},8,["type"]),u("span",gl,$(y.row.endpoint),1)]),y.row.short?(F(),ne("div",vl,$(y.row.short),1)):Se("",!0)])]),default:a(()=>[l(q,{modelValue:T.value,"onUpdate:modelValue":g[0]||(g[0]=c=>T.value=c),class:"example-tabs"},{default:a(()=>[(F(),ne(be,null,me(C,c=>l(k,{key:c.id,label:c.label,name:c.id},{default:a(()=>[u("div",wl,[u("div",yl,[u("span",xl,$(c.label),1),$e((F(),oe(o,{link:"",type:"primary",size:"small"},{default:a(()=>[l(s,null,{default:a(()=>[l(I)]),_:1}),Cl]),_:1})),[[v,V.value]])]),u("pre",zl,[u("code",null,$(V.value),1)])])]),_:2},1032,["label","name"])),64))]),_:1},8,["modelValue"]),u("div",Vl,[kl,l(A,{modelValue:B.value,"onUpdate:modelValue":g[1]||(g[1]=c=>B.value=c),modelModifiers:{trim:!0},placeholder:"请输入API请求地址，如 https://api.example.com",clearable:!0},null,8,["modelValue"])])]),_:1},8,["model-value","modal","lock-scroll","show-close","close-on-click-modal","close-on-press-escape","open-delay","destroy-on-close"])}}}),Sl=qe(El,[["__scopeId","data-v-9ab74bbf"]]),Pl={class:"left-panel"},$l={class:"right-panel"},pe="SystemConfigApi",yo=se({__name:"index",setup(y){const H=D({rowKey:"md5"}),C={...Ke,...H},n={...Je},m=f(),T=f([]);Ae(()=>{B()});const B=async()=>{const s=await Xe({xtbb:pe});s.code===100&&s.data?T.value=s.data:ie({title:"提示",message:"报表未配置表头，请联系平台管理员！",type:"warning"})},r=f(!1),x=f(!1),h=f(!1),b=f(!1),d=f("");let V=D([]);const P=D({content:""}),z=D({}),M=async s=>{let o=JSON.parse(JSON.stringify(s));return await je(o)},E=(s=!1)=>{var o,k;s&&((o=m.value)==null||o.clearSelection(),(k=m.value)==null||k.getTableList())},S=()=>{r.value=!0},t=s=>{d.value=s.md5,x.value=!0},g=s=>{Object.assign(z,s),b.value=!0},j=s=>{Ie({md5:s}).then(()=>{ie({title:"提示",message:"删除成功",type:"success"}),E(!0)})},I=()=>{var s,o;if(!((s=m.value)!=null&&s.isSelected)){Fe.warning("请选择需要删除的数据");return}V=(o=m.value)==null?void 0:o.selectedListKeys,h.value=!0};return(s,o)=>{const k=ce,q=de,A=Le,N=he,v=O("EditPen"),c=re,K=fe,Q=O("Document"),Y=O("Delete"),Z=Ge,W=We,ee=Ue,i=Ne,Ee=Re;return F(),oe(Ee,null,{default:a(()=>[l(A,null,{default:a(()=>{var w;return[u("div",Pl,[l(k,{id:"btn-add",class:"table-handle-button",type:e(L).type,plain:e(L).plain,size:e(L).size,icon:"Plus",onClick:S},{default:a(()=>[R(" 新增 ")]),_:1},8,["type","plain","size"]),l(k,{id:"btn-batch-delete",type:"danger",icon:"Delete",plain:e(L).plain,size:e(L).size,onClick:I,disabled:!((w=m.value)!=null&&w.isSelected)},{default:a(()=>[R(" 批量删除 ")]),_:1},8,["plain","size","disabled"])]),u("div",$l,[l(q,{modelValue:P.content,"onUpdate:modelValue":o[0]||(o[0]=te=>P.content=te),modelModifiers:{trim:!0},placeholder:"支持模糊查询，输入后点击查询",clearable:"",style:{width:"250px"}},null,8,["modelValue"]),l(k,{id:"btn-search",type:e(L).type,plain:e(L).plain,size:e(L).size,icon:"Search",onClick:E},null,8,["type","plain","size"])])]}),_:1}),l(ee,{class:"nopadding"},{default:a(()=>[l(W,{ref_key:"fcTableRef",ref:m,tableName:pe,requestApi:M,initParam:P,columns:T.value,rowKey:C.rowKey,stripe:C.stripe,border:C.border,pagination:C.pagination,showBottomView:C.showBottomView,showRefreshBtn:C.showRefreshBtn,showColumnBtn:C.showColumnBtn,showDownloadBtn:C.showDownloadBtn},{method:a(w=>[l(N,{type:e(ke)(w.row.method),effect:"dark"},{default:a(()=>[R($(w.row.method),1)]),_:2},1032,["type"])]),options:a(w=>[l(K,{effect:"dark",content:"编辑",placement:"top"},{default:a(()=>[l(c,{class:"table-handle-icon",onClick:te=>t(w.row)},{default:a(()=>[l(v)]),_:2},1032,["onClick"])]),_:2},1024),l(K,{effect:"dark",content:"请求示例",placement:"top"},{default:a(()=>[l(c,{class:"table-handle-icon margin-left-30px",onClick:te=>g(w.row)},{default:a(()=>[l(Q)]),_:2},1032,["onClick"])]),_:2},1024),l(Z,{title:n.title,"confirm-button-text":n.confirmText,"cancel-button-text":n.cancelText,"confirm-button-type":n.confirmType,"cancel-button-type":n.cancelType,icon:n.icon,"icon-color":n.iconColor,width:n.width,onConfirm:te=>j(w.row.md5)},{reference:a(()=>[l(c,{class:"table-handle-icon margin-left-30px"},{default:a(()=>[l(Y)]),_:1})]),_:2},1032,["title","confirm-button-text","cancel-button-text","confirm-button-type","cancel-button-type","icon","icon-color","width","onConfirm"])]),_:1},8,["initParam","columns","rowKey","stripe","border","pagination","showBottomView","showRefreshBtn","showColumnBtn","showDownloadBtn"])]),_:1}),l(fl,{visible:r.value,"onUpdate:visible":o[1]||(o[1]=w=>r.value=w),onReFetchTableData:E},null,8,["visible"]),l(sl,{visible:x.value,"onUpdate:visible":o[2]||(o[2]=w=>x.value=w),md5:d.value,onReFetchTableData:E},null,8,["visible","md5"]),l(i,{visible:h.value,"onUpdate:visible":o[3]||(o[3]=w=>h.value=w),api:pe,md5List:e(V),onReFetchTableData:E},null,8,["visible","md5List"]),l(Sl,{visible:b.value,"onUpdate:visible":o[4]||(o[4]=w=>b.value=w),row:z},null,8,["visible","row"])]),_:1})}}});export{yo as default};
