import{d as re,a as h,r as B,w as me,o as P,c as J,b as o,e as c,t as $,f as l,g as M,D as e,j as ie,W as be,T as fe,E as se,h as j,i as de,k as ne,u as Se,X as Pe,S as $e,G as Be,H as qe,_ as Ae,l as Fe,P as Oe}from"./index.FmW3c5cc.js";/* empty css                  */import{a as Le,E as Ue,b as Re}from"./el-main.DjQdVmd-.js";import{S as He,a as Me,b as je,c as Ie,d as Ne,_ as We}from"./index.OQCgwbKM.js";import{_ as Ge}from"./index.CkQy1PCM.js";import{E as Ke}from"./el-popconfirm.BLTtdhlC.js";import{E as he}from"./el-popper.CByUIWEh.js";/* empty css                   *//* empty css                  */import"./el-tooltip.l0sNRNKZ.js";import{E as _e}from"./el-tag.DUlk-nAk.js";/* empty css                 */import{d as ge,f as X,i as p,a as Q,g as w,t as H,e as K,b as Je,P as Xe,c as R}from"./field.CbypOBfk.js";import{D as ve,T as Qe}from"./common.CrV0P7n8.js";import{E as ye}from"./el-dialog.BN68ZNtD.js";import{E as we,a as xe}from"./el-form-item.CTd9j90a.js";import{E as Ce}from"./el-input-number.BbbYgDEu.js";import{E as ze,a as Te}from"./el-select.Dnj6eNhC.js";import"./el-scrollbar.DCvb4wUu.js";import{p as Ve,a as ke}from"./place.DeNTQQRZ.js";import{E as pe}from"./index.DYvnhzxn.js";import{E as ce}from"./index.DZKyiSgq.js";import{E as Ye}from"./el-drawer.Dv54-B-1.js";import{a as Ze,E as el}from"./el-tab-pane.BopvpNxv.js";import{m as Ee}from"./utils.DB_c4LTw.js";import"./systemMain.C-nK7fBT.js";import"./index.CLyD1d__.js";import"./index.CQwym6PG.js";import"./index.D6lc4Thp.js";import"./systemOps.DWdBc0Py.js";import"./el-loading.-Z_JKHvk.js";import"./el-radio.afYrOUlP.js";import"./el-pagination.Dy-IyUD6.js";import"./isEqual.C84JbYkJ.js";import"./_Uint8Array.C-gmSPsx.js";import"./el-switch.C2PF5DbD.js";import"./el-empty.CGMAgSOR.js";import"./el-radio-group.TffmfST3.js";/* empty css                    */import"./variable.WFqE31e3.js";import"./sortable.esm.A-HpLkYL.js";import"./dropdown.DywAtHd8.js";import"./index.vlUI0FM3.js";import"./index.s-sikCm9.js";import"./_baseClone.DrUe6G4k.js";import"./castArray.B0FdS-W6.js";import"./strings.BLpZ_pM5.js";import"./index.D_Cz4Esc.js";const ll={class:"my-dialog-header"},tl={class:"my-dialog-header-title"},ol={class:"my-dialog-header-icon"},al={class:"my-dialog-body"},nl=c("div",{class:"el-form-item-msg"},"endpoint为接口唯一标识，不允许修改",-1),il={class:"el-form-item-msg"},sl={class:"my-dialog-footer"},rl=re({__name:"edit",props:{visible:{type:Boolean,required:!0,default:!1},md5:{type:String,required:!0,default:""}},emits:["update:visible","reFetchTableData"],setup(T,{emit:I}){const V=[{label:"GET",value:"GET"},{label:"POST",value:"POST"},{label:"PUT",value:"PUT"},{label:"PATCH",value:"PATCH"},{label:"DELETE",value:"DELETE"}],u=h([]),E=async()=>{if(u.value.length>0)return;const r=await ve({name:"api-type"});r.data&&(u.value=r.data.map(a=>({label:a.label,value:a.label,disabled:a.disabled}))),u.value.length||(u.value=[...V])},s=Ve.systemApiModel,g=ke.systemApiModel,q=B({title:"编辑",width:"50%"}),A=h({minRows:3,maxRows:4}),i={...ge,...q},m=h(i.fullScreen),k=h("全屏"),S=I,d=h(!1),D=h(!1),L=T;me(m,r=>{k.value=r?"取消全屏":"全屏"},{immediate:!0});function x(){S("update:visible",!1)}function N(){m.value=!m.value}function v(){var r;(r=_.value)==null||r.clearValidate(),E(),f(L.md5)}const _=h(),n=B({}),W=B({blueprint:[{required:!0,message:"Blueprint不允许为空",trigger:"blur"},{min:1,max:s.blueprint,message:"最大长度支持"+s.blueprint+"位",trigger:"blur"}],apiname:[{required:!0,message:"方法名称不允许为空",trigger:"blur"},{min:1,max:s.apiname,message:"最大长度支持"+s.apiname+"位",trigger:"blur"}],endpoint:[{required:!0,message:"Endpoint不允许为空",trigger:"blur"},{min:1,max:s.endpoint,message:"最大长度支持"+s.endpoint+"位",trigger:"blur"}],path:[{required:!0,message:"Path不允许为空",trigger:"blur"},{min:1,max:s.path,message:"最大长度支持"+s.path+"位",trigger:"blur"}],method:[{required:!0,message:"请求方式不允许为空",trigger:"change"}]}),f=async r=>{const a=await He({md5:r});a.data&&Object.assign(n,a.data)},b=async r=>{r&&await r.validate(a=>{a&&(d.value=!0,D.value=!0,Me(n).then(()=>{se({title:"提示",message:"编辑成功",type:"success"}),x(),S("reFetchTableData",!0)}).finally(()=>{d.value=!1,D.value=!1}))})};return(r,a)=>{const U=j("FullScreen"),F=de,O=he,C=j("Close"),z=pe,y=we,Y=Te,Z=ze,ee=Ce,le=xe,G=ce,te=ye;return P(),J(te,{"model-value":L.visible,width:i.width,fullscreen:m.value,top:i.top,modal:i.modal,"lock-scroll":i.lockScroll,"open-delay":i.openDelay,"close-delay":i.closeDelay,"close-on-click-modal":i.closeOnClickModal,"close-on-press-escape":i.closeOnPressEscape,"show-close":i.showClose,draggable:i.draggable,overflow:i.overflow,center:i.center,"align-center":i.alignCenter,onOpen:v,onClose:x},{header:o(()=>[c("div",ll,[c("div",tl,$(i.title),1),c("div",ol,[l(O,{effect:"dark",content:k.value,placement:"top"},{default:o(()=>[l(F,{onClick:N,class:"margin-right-15px"},{default:o(()=>[l(U)]),_:1})]),_:1},8,["content"]),l(O,{effect:"dark",content:"关闭",placement:"top"},{default:o(()=>[l(F,{onClick:x},{default:o(()=>[l(C)]),_:1})]),_:1})])])]),footer:o(()=>[c("div",sl,[l(G,{disabled:d.value,onClick:x},{default:o(()=>[M("取 消")]),_:1},8,["disabled"]),l(G,{disabled:d.value,loading:D.value,type:"primary",onClick:a[8]||(a[8]=t=>b(_.value))},{default:o(()=>[M("确 定")]),_:1},8,["disabled","loading"])])]),default:o(()=>[c("div",al,[l(le,{ref_key:"ruleFormRef",ref:_,model:n,rules:W,"label-position":e(X).labelPosition,"label-width":e(X).labelWidth,size:e(X).size,style:{width:"100%"}},{default:o(()=>[l(y,{label:"Blueprint",prop:"blueprint"},{default:o(()=>[l(z,{modelValue:n.blueprint,"onUpdate:modelValue":a[0]||(a[0]=t=>n.blueprint=t),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(s).blueprint,placeholder:e(g).blueprint,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(y,{label:"方法名称",prop:"apiname"},{default:o(()=>[l(z,{modelValue:n.apiname,"onUpdate:modelValue":a[1]||(a[1]=t=>n.apiname=t),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(s).apiname,placeholder:e(g).apiname,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(y,{label:"Endpoint",prop:"endpoint"},{default:o(()=>[l(z,{modelValue:n.endpoint,"onUpdate:modelValue":a[2]||(a[2]=t=>n.endpoint=t),modelModifiers:{trim:!0},size:e(p).size,disabled:""},null,8,["modelValue","size"]),nl]),_:1}),l(y,{label:"Path",prop:"path"},{default:o(()=>[l(z,{modelValue:n.path,"onUpdate:modelValue":a[3]||(a[3]=t=>n.path=t),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(s).path,placeholder:e(g).path,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(y,{label:"请求方式",prop:"method"},{default:o(()=>[l(Z,{modelValue:n.method,"onUpdate:modelValue":a[4]||(a[4]=t=>n.method=t),size:e(Q).size,clearable:e(Q).clearable,filterable:e(Q).filterable,placeholder:e(g).method,style:{width:"100%"},disabled:d.value},{default:o(()=>[(P(!0),ie(fe,null,be(u.value,t=>(P(),J(Y,{key:t.value,label:t.label,value:t.value,disabled:t.disabled},null,8,["label","value","disabled"]))),128))]),_:1},8,["modelValue","size","clearable","filterable","placeholder","disabled"])]),_:1}),l(y,{label:"简述",prop:"short"},{default:o(()=>[l(z,{modelValue:n.short,"onUpdate:modelValue":a[5]||(a[5]=t=>n.short=t),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(s).short,placeholder:e(g).short,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(y,{label:"排序编号",prop:"orderId"},{default:o(()=>[l(ee,{modelValue:n.orderId,"onUpdate:modelValue":a[6]||(a[6]=t=>n.orderId=t),style:{width:"100%"},min:e(w).min,max:e(w).max,step:e(w).step,"step-strictly":e(w).stepStrictly,precision:e(w).precision,size:e(w).size,controls:e(w).controls,"controls-position":e(w).controlsPosition,disabled:d.value},null,8,["modelValue","min","max","step","step-strictly","precision","size","controls","controls-position","disabled"]),c("div",il," 数值越小排序越靠前，默认 1，最大值为"+$(e(w).max.toLocaleString()),1)]),_:1}),l(y,{label:"详细描述",prop:"long"},{default:o(()=>[l(z,{modelValue:n.long,"onUpdate:modelValue":a[7]||(a[7]=t=>n.long=t),type:e(H).type,size:e(H).size,"show-word-limit":e(H).showWordLimit,clearable:e(H).clearable,autosize:A.value,maxlength:e(s).long,placeholder:e(g).long,disabled:d.value},null,8,["modelValue","type","size","show-word-limit","clearable","autosize","maxlength","placeholder","disabled"])]),_:1})]),_:1},8,["model","rules","label-position","label-width","size"])])]),_:1},8,["model-value","width","fullscreen","top","modal","lock-scroll","open-delay","close-delay","close-on-click-modal","close-on-press-escape","show-close","draggable","overflow","center","align-center"])}}}),dl={class:"my-dialog-header"},pl={class:"my-dialog-header-title"},cl={class:"my-dialog-header-icon"},ul={class:"my-dialog-body"},ml=c("div",{class:"el-form-item-msg"},"endpoint需全局唯一，重复将无法新增",-1),bl={class:"el-form-item-msg"},fl={class:"my-dialog-footer"},hl=re({__name:"add",props:{visible:{type:Boolean,required:!0,default:!1}},emits:["update:visible","reFetchTableData"],setup(T,{emit:I}){const V=[{label:"GET",value:"GET"},{label:"POST",value:"POST"},{label:"PUT",value:"PUT"},{label:"PATCH",value:"PATCH"},{label:"DELETE",value:"DELETE"}],u=h([]),E=async()=>{if(u.value.length>0)return;const r=await ve({name:"api-type"});r.data&&(u.value=r.data.map(a=>({label:a.label,value:a.label,disabled:a.disabled}))),u.value.length||(u.value=[...V])},s=Ve.systemApiModel,g=ke.systemApiModel,q=B({title:"新增",width:"50%"}),A=h({minRows:3,maxRows:4}),i={...ge,...q},m=h(i.fullScreen),k=h("全屏"),S=I,d=h(!1),D=h(!1),L=T;me(m,r=>{k.value=r?"取消全屏":"全屏"},{immediate:!0});function x(){S("update:visible",!1),f()}function N(){m.value=!m.value}function v(){var r;(r=_.value)==null||r.clearValidate(),E()}const _=h(),n=B({blueprint:"",apiname:"",endpoint:"",path:"",method:"GET",short:"",long:"",orderId:1}),W=B({blueprint:[{required:!0,message:"Blueprint不允许为空",trigger:"blur"},{min:1,max:s.blueprint,message:"最大长度支持"+s.blueprint+"位",trigger:"blur"}],apiname:[{required:!0,message:"方法名称不允许为空",trigger:"blur"},{min:1,max:s.apiname,message:"最大长度支持"+s.apiname+"位",trigger:"blur"}],endpoint:[{required:!0,message:"Endpoint不允许为空",trigger:"blur"},{min:1,max:s.endpoint,message:"最大长度支持"+s.endpoint+"位",trigger:"blur"}],path:[{required:!0,message:"Path不允许为空",trigger:"blur"},{min:1,max:s.path,message:"最大长度支持"+s.path+"位",trigger:"blur"}],method:[{required:!0,message:"请求方式不允许为空",trigger:"change"}]}),f=()=>{n.blueprint="",n.apiname="",n.endpoint="",n.path="",n.method="GET",n.short="",n.long="",n.orderId=1},b=async r=>{r&&await r.validate(a=>{a&&(d.value=!0,D.value=!0,je(n).then(()=>{se({title:"提示",message:"新增成功",type:"success"}),x(),S("reFetchTableData",!0)}).finally(()=>{d.value=!1,D.value=!1}))})};return(r,a)=>{const U=j("FullScreen"),F=de,O=he,C=j("Close"),z=pe,y=we,Y=Te,Z=ze,ee=Ce,le=xe,G=ce,te=ye;return P(),J(te,{"model-value":L.visible,width:i.width,fullscreen:m.value,top:i.top,modal:i.modal,"lock-scroll":i.lockScroll,"open-delay":i.openDelay,"close-delay":i.closeDelay,"close-on-click-modal":i.closeOnClickModal,"close-on-press-escape":i.closeOnPressEscape,"show-close":i.showClose,draggable:i.draggable,overflow:i.overflow,center:i.center,"align-center":i.alignCenter,onOpen:v,onClose:x},{header:o(()=>[c("div",dl,[c("div",pl,$(i.title),1),c("div",cl,[l(O,{effect:"dark",content:k.value,placement:"top"},{default:o(()=>[l(F,{onClick:N,class:"margin-right-15px"},{default:o(()=>[l(U)]),_:1})]),_:1},8,["content"]),l(O,{effect:"dark",content:"关闭",placement:"top"},{default:o(()=>[l(F,{onClick:x},{default:o(()=>[l(C)]),_:1})]),_:1})])])]),footer:o(()=>[c("div",fl,[l(G,{disabled:d.value,onClick:x},{default:o(()=>[M("取 消")]),_:1},8,["disabled"]),l(G,{disabled:d.value,loading:D.value,type:"primary",onClick:a[8]||(a[8]=t=>b(_.value))},{default:o(()=>[M("确 定")]),_:1},8,["disabled","loading"])])]),default:o(()=>[c("div",ul,[l(le,{ref_key:"ruleFormRef",ref:_,model:n,rules:W,"label-position":e(X).labelPosition,"label-width":e(X).labelWidth,size:e(X).size,style:{width:"100%"}},{default:o(()=>[l(y,{label:"Blueprint",prop:"blueprint"},{default:o(()=>[l(z,{modelValue:n.blueprint,"onUpdate:modelValue":a[0]||(a[0]=t=>n.blueprint=t),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(s).blueprint,placeholder:e(g).blueprint,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(y,{label:"方法名称",prop:"apiname"},{default:o(()=>[l(z,{modelValue:n.apiname,"onUpdate:modelValue":a[1]||(a[1]=t=>n.apiname=t),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(s).apiname,placeholder:e(g).apiname,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(y,{label:"Endpoint",prop:"endpoint"},{default:o(()=>[l(z,{modelValue:n.endpoint,"onUpdate:modelValue":a[2]||(a[2]=t=>n.endpoint=t),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(s).endpoint,placeholder:e(g).endpoint,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"]),ml]),_:1}),l(y,{label:"Path",prop:"path"},{default:o(()=>[l(z,{modelValue:n.path,"onUpdate:modelValue":a[3]||(a[3]=t=>n.path=t),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(s).path,placeholder:e(g).path,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(y,{label:"请求方式",prop:"method"},{default:o(()=>[l(Z,{modelValue:n.method,"onUpdate:modelValue":a[4]||(a[4]=t=>n.method=t),size:e(Q).size,clearable:e(Q).clearable,filterable:e(Q).filterable,placeholder:e(g).method,style:{width:"100%"},disabled:d.value},{default:o(()=>[(P(!0),ie(fe,null,be(u.value,t=>(P(),J(Y,{key:t.value,label:t.label,value:t.value,disabled:t.disabled},null,8,["label","value","disabled"]))),128))]),_:1},8,["modelValue","size","clearable","filterable","placeholder","disabled"])]),_:1}),l(y,{label:"简述",prop:"short"},{default:o(()=>[l(z,{modelValue:n.short,"onUpdate:modelValue":a[5]||(a[5]=t=>n.short=t),modelModifiers:{trim:!0},size:e(p).size,"show-word-limit":e(p).showWordLimit,clearable:e(p).clearable,maxlength:e(s).short,placeholder:e(g).short,disabled:d.value},null,8,["modelValue","size","show-word-limit","clearable","maxlength","placeholder","disabled"])]),_:1}),l(y,{label:"排序编号",prop:"orderId"},{default:o(()=>[l(ee,{modelValue:n.orderId,"onUpdate:modelValue":a[6]||(a[6]=t=>n.orderId=t),style:{width:"100%"},min:e(w).min,max:e(w).max,step:e(w).step,"step-strictly":e(w).stepStrictly,precision:e(w).precision,size:e(w).size,controls:e(w).controls,"controls-position":e(w).controlsPosition,disabled:d.value},null,8,["modelValue","min","max","step","step-strictly","precision","size","controls","controls-position","disabled"]),c("div",bl," 数值越小排序越靠前，默认 1，最大值为"+$(e(w).max.toLocaleString()),1)]),_:1}),l(y,{label:"详细描述",prop:"long"},{default:o(()=>[l(z,{modelValue:n.long,"onUpdate:modelValue":a[7]||(a[7]=t=>n.long=t),type:e(H).type,size:e(H).size,"show-word-limit":e(H).showWordLimit,clearable:e(H).clearable,autosize:A.value,maxlength:e(s).long,placeholder:e(g).long,disabled:d.value},null,8,["modelValue","type","size","show-word-limit","clearable","autosize","maxlength","placeholder","disabled"])]),_:1})]),_:1},8,["model","rules","label-position","label-width","size"])])]),_:1},8,["model-value","width","fullscreen","top","modal","lock-scroll","open-delay","close-delay","close-on-click-modal","close-on-press-escape","show-close","draggable","overflow","center","align-center"])}}}),De=T=>(Be("data-v-9ab74bbf"),T=T(),qe(),T),_l={class:"example-header"},gl={class:"example-header-title"},vl={class:"example-header-endpoint"},yl={key:0,class:"example-header-sub"},wl={class:"code-box"},xl={class:"code-box-toolbar"},Cl={class:"code-lang"},zl=De(()=>c("span",{class:"copy-label"},"复制",-1)),Tl={class:"code-block"},Vl={class:"api-config"},kl=De(()=>c("span",{class:"api-config-label"},"请求路径：",-1)),oe=`{
  "key": "value"
}`,El="page=1&limit=15&content=keyword",Dl=re({__name:"example",props:{visible:{type:Boolean,required:!0,default:!1},row:{type:Object,required:!0,default:()=>({md5:"",blueprint:"",apiname:"",endpoint:"",path:"",method:"GET",createRtx:"",createTime:""})}},emits:["update:visible"],setup(T,{emit:I}){const V=[{id:"curl",label:"cURL",lang:"bash"},{id:"python",label:"Python",lang:"python"},{id:"java",label:"Java",lang:"java"},{id:"go",label:"Go",lang:"go"},{id:"nodejs",label:"Node.js",lang:"javascript"}],u=T,E=I,s=h("curl"),g=h("http://127.0.0.1:8000/");function q(){E("update:visible",!1)}function A(){s.value="curl"}me(()=>u.visible,v=>{v&&(s.value="curl")});const i=ne(()=>{const v=g.value.trim().replace(/\/+$/,""),_=u.row.path||u.row.endpoint||"";return!v||_.startsWith("http")?_:v+(_.startsWith("/")?_:"/"+_)}),m=ne(()=>(u.row.method||"GET").toUpperCase()),k=ne(()=>["POST","PUT","PATCH"].includes(m.value)),S=ne(()=>{switch(s.value){case"curl":return d();case"python":return D();case"java":return L();case"go":return x();case"nodejs":return N();default:return""}});function d(){let v=`curl -X ${m.value} '${i.value}' \\
`;return v+=`  -H 'Authorization: Bearer {your_token}' \\
`,k.value?(v+=`  -H 'Content-Type: application/json' \\
`,v+=`  -d '${oe}'`):v+="  -H 'Content-Type: application/json'",v}function D(){const v=m.value==="GET"?`${i.value}?${El}`:i.value;return k.value?`import requests

url = '${i.value}'
headers = {
    'Authorization': 'Bearer {your_token}',
    'Content-Type': 'application/json'
}
payload = ${oe}

response = requests.${m.value.toLowerCase()}(url, headers=headers, json=payload)
print(response.status_code)
print(response.json())`:`import requests

url = '${v}'
headers = {
    'Authorization': 'Bearer {your_token}'
}

response = requests.request('${m.value}', url, headers=headers)
print(response.status_code)
print(response.json())`}function L(){return k.value?`import okhttp3.*;

public class ApiExample {
    public static void main(String[] args) throws Exception {
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, "${oe.replace(/\n/g," ")}");
        Request request = new Request.Builder()
            .url("${i.value}")
            .method("${m.value}", body)
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
            .url("${i.value}")
            .method("${m.value}", null)
            .addHeader("Authorization", "Bearer {your_token}")
            .build();

        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
}`}function x(){return k.value?`package main

import (
    "bytes"
    "fmt"
    "io"
    "net/http"
)

func main() {
    url := "${i.value}"
    payload := bytes.NewBufferString(\`${oe}\`)

    req, _ := http.NewRequest("${m.value}", url, payload)
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
    url := "${i.value}"
    req, _ := http.NewRequest("${m.value}", url, nil)
    req.Header.Set("Authorization", "Bearer {your_token}")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`}function N(){return k.value?`import axios from 'axios';

const url = '${i.value}';
const data = ${oe};

axios.${m.value.toLowerCase()}(url, data, {
  headers: {
    'Authorization': 'Bearer {your_token}',
    'Content-Type': 'application/json'
  }
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});`:`import axios from 'axios';

const url = '${i.value}';

axios.request({
  method: '${m.value}',
  url: url,
  headers: {
    'Authorization': 'Bearer {your_token}'
  }
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});`}return(v,_)=>{const n=_e,W=j("CopyDocument"),f=de,b=ce,r=el,a=Ze,U=pe,F=Ye,O=Pe("copy");return P(),J(F,{"model-value":u.visible,size:"45%",direction:"rtl",modal:e(K).modal,"lock-scroll":e(K).lockScroll,"show-close":e(K).showClose,"close-on-click-modal":e(K).closeOnClickModal,"close-on-press-escape":e(K).closeOnPressEscape,"open-delay":e(K).openDelay,"with-header":!0,"destroy-on-close":e(K).destroyOnClose,onOpen:A,onClose:q},{header:o(()=>[c("div",_l,[c("div",gl,[l(n,{type:e(Ee)(T.row.method),effect:"dark",size:"small"},{default:o(()=>[M($(T.row.method),1)]),_:1},8,["type"]),c("span",vl,$(T.row.endpoint),1)]),T.row.short?(P(),ie("div",yl,$(T.row.short),1)):Se("",!0)])]),default:o(()=>[l(a,{modelValue:s.value,"onUpdate:modelValue":_[0]||(_[0]=C=>s.value=C),class:"example-tabs"},{default:o(()=>[(P(),ie(fe,null,be(V,C=>l(r,{key:C.id,label:C.label,name:C.id},{default:o(()=>[c("div",wl,[c("div",xl,[c("span",Cl,$(C.label),1),$e((P(),J(b,{link:"",type:"primary",size:"small"},{default:o(()=>[l(f,null,{default:o(()=>[l(W)]),_:1}),zl]),_:1})),[[O,S.value]])]),c("pre",Tl,[c("code",null,$(S.value),1)])])]),_:2},1032,["label","name"])),64))]),_:1},8,["modelValue"]),c("div",Vl,[kl,l(U,{modelValue:g.value,"onUpdate:modelValue":_[1]||(_[1]=C=>g.value=C),modelModifiers:{trim:!0},placeholder:"请输入API请求地址，如 https://api.example.com",clearable:!0},null,8,["modelValue"])])]),_:1},8,["model-value","modal","lock-scroll","show-close","close-on-click-modal","close-on-press-escape","open-delay","destroy-on-close"])}}}),Sl=Ae(Dl,[["__scopeId","data-v-9ab74bbf"]]),Pl={class:"left-panel"},$l={class:"right-panel"},ue="SystemConfigApi",kt=re({__name:"index",setup(T){const I=B({rowKey:"md5"}),V={...Je,...I},u={...Xe},E=h(),s=h([]);Fe(()=>{g()});const g=async()=>{const f=await Qe({xtbb:ue});f.code===100&&f.data?s.value=f.data:se({title:"提示",message:"报表未配置表头，请联系平台管理员！",type:"warning"})},q=h(!1),A=h(!1),i=h(!1),m=h(!1),k=h("");let S=B([]);const d=B({content:""}),D=B({}),L=async f=>{let b=JSON.parse(JSON.stringify(f));return await Ie(b)},x=(f=!1)=>{var b,r;f&&((b=E.value)==null||b.clearSelection(),(r=E.value)==null||r.getTableList())},N=()=>{q.value=!0},v=f=>{k.value=f.md5,A.value=!0},_=f=>{Object.assign(D,f),m.value=!0},n=f=>{Ne({md5:f}).then(()=>{se({title:"提示",message:"删除成功",type:"success"}),x(!0)})},W=()=>{var f,b;if(!((f=E.value)!=null&&f.isSelected)){Oe.warning("请选择需要删除的数据");return}S=(b=E.value)==null?void 0:b.selectedListKeys,i.value=!0};return(f,b)=>{const r=ce,a=pe,U=Le,F=_e,O=j("EditPen"),C=de,z=he,y=j("Document"),Y=j("Delete"),Z=Ke,ee=Ge,le=Ue,G=We,te=Re;return P(),J(te,null,{default:o(()=>[l(U,null,{default:o(()=>{var t;return[c("div",Pl,[l(r,{id:"btn-add",class:"table-handle-button",type:e(R).type,plain:e(R).plain,size:e(R).size,icon:"Plus",onClick:N},{default:o(()=>[M(" 新增 ")]),_:1},8,["type","plain","size"]),l(r,{id:"btn-batch-delete",type:"danger",icon:"Delete",plain:e(R).plain,size:e(R).size,onClick:W,disabled:!((t=E.value)!=null&&t.isSelected)},{default:o(()=>[M(" 批量删除 ")]),_:1},8,["plain","size","disabled"])]),c("div",$l,[l(a,{modelValue:d.content,"onUpdate:modelValue":b[0]||(b[0]=ae=>d.content=ae),modelModifiers:{trim:!0},placeholder:"支持模糊查询，输入后点击查询",clearable:"",style:{width:"250px"}},null,8,["modelValue"]),l(r,{id:"btn-search",type:e(R).type,plain:e(R).plain,size:e(R).size,icon:"Search",onClick:x},null,8,["type","plain","size"])])]}),_:1}),l(le,{class:"nopadding"},{default:o(()=>[l(ee,{ref_key:"fcTableRef",ref:E,tableName:ue,requestApi:L,initParam:d,columns:s.value,rowKey:V.rowKey,stripe:V.stripe,border:V.border,pagination:V.pagination,showBottomView:V.showBottomView,showRefreshBtn:V.showRefreshBtn,showColumnBtn:V.showColumnBtn,showDownloadBtn:V.showDownloadBtn},{method:o(t=>[l(F,{type:e(Ee)(t.row.method),effect:"dark"},{default:o(()=>[M($(t.row.method),1)]),_:2},1032,["type"])]),options:o(t=>[l(z,{effect:"dark",content:"编辑",placement:"top"},{default:o(()=>[l(C,{class:"table-handle-icon",onClick:ae=>v(t.row)},{default:o(()=>[l(O)]),_:2},1032,["onClick"])]),_:2},1024),l(z,{effect:"dark",content:"请求示例",placement:"top"},{default:o(()=>[l(C,{class:"table-handle-icon margin-left-30px",onClick:ae=>_(t.row)},{default:o(()=>[l(y)]),_:2},1032,["onClick"])]),_:2},1024),l(Z,{title:u.title,"confirm-button-text":u.confirmText,"cancel-button-text":u.cancelText,"confirm-button-type":u.confirmType,"cancel-button-type":u.cancelType,icon:u.icon,"icon-color":u.iconColor,width:u.width,onConfirm:ae=>n(t.row.md5)},{reference:o(()=>[l(C,{class:"table-handle-icon margin-left-30px"},{default:o(()=>[l(Y)]),_:1})]),_:2},1032,["title","confirm-button-text","cancel-button-text","confirm-button-type","cancel-button-type","icon","icon-color","width","onConfirm"])]),_:1},8,["initParam","columns","rowKey","stripe","border","pagination","showBottomView","showRefreshBtn","showColumnBtn","showDownloadBtn"])]),_:1}),l(hl,{visible:q.value,"onUpdate:visible":b[1]||(b[1]=t=>q.value=t),onReFetchTableData:x},null,8,["visible"]),l(rl,{visible:A.value,"onUpdate:visible":b[2]||(b[2]=t=>A.value=t),md5:k.value,onReFetchTableData:x},null,8,["visible","md5"]),l(G,{visible:i.value,"onUpdate:visible":b[3]||(b[3]=t=>i.value=t),api:ue,md5List:e(S),onReFetchTableData:x},null,8,["visible","md5List"]),l(Sl,{visible:m.value,"onUpdate:visible":b[4]||(b[4]=t=>m.value=t),row:D},null,8,["visible","row"])]),_:1})}}});export{kt as default};
