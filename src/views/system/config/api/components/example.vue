<template>
  <el-drawer
    :model-value="props.visible"
    size="45%"
    direction="rtl"
    :modal="dwField.modal"
    :lock-scroll="dwField.lockScroll"
    :show-close="dwField.showClose"
    :close-on-click-modal="dwField.closeOnClickModal"
    :close-on-press-escape="dwField.closeOnPressEscape"
    :open-delay="dwField.openDelay"
    :with-header="true"
    :destroy-on-close="dwField.destroyOnClose"
    @open="openDrawer"
    @close="closeDrawer"
  >
    <template #header>
      <div class="example-header">
        <div class="example-header-title">
          <el-tag :type="methodTagType(row.method)" effect="dark" size="small">{{ row.method }}</el-tag>
          <span class="example-header-endpoint">{{ row.endpoint }}</span>
        </div>
        <div class="example-header-sub" v-if="row.short">{{ row.short }}</div>
      </div>
    </template>

    <el-tabs v-model="tabActiveName" class="example-tabs">
      <el-tab-pane
        v-for="item in tabList"
        :key="item.id"
        :label="item.label"
        :name="item.id"
      >
        <div class="code-box">
          <div class="code-box-toolbar">
            <span class="code-lang">{{ item.label }}</span>
            <el-button link type="primary" size="small" v-copy="exampleCode">
              <el-icon><CopyDocument /></el-icon>
              <span class="copy-label">复制</span>
            </el-button>
          </div>
          <pre class="code-block"><code>{{ exampleCode }}</code></pre>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 请求路径配置 -->
    <div class="api-config">
      <span class="api-config-label">请求路径：</span>
      <el-input
        v-model.trim="baseUrl"
        placeholder="请输入API请求地址，如 https://api.example.com"
        :clearable="true"
      />
    </div>
  </el-drawer>
</template>

<script setup lang='ts'>
import { computed, ref, watch } from 'vue';
import { ApiModelList } from "@/models/systemModel";
import { methodTagType } from "@/utils/utils";
import { drawerField as dwField } from "@/utils/attrs/field";

const tabList = [
  { id: 'curl',     label: 'cURL',        lang: 'bash' },
  { id: 'python',   label: 'Python',      lang: 'python' },
  { id: 'java',     label: 'Java',        lang: 'java' },
  { id: 'go',       label: 'Go',          lang: 'go' },
  { id: 'nodejs',   label: 'Node.js',     lang: 'javascript' },
];

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  row: {
    type: Object as () => ApiModelList,
    required: true,
    default: () => ({
      md5: '', blueprint: '', apiname: '', endpoint: '', path: '', method: 'GET',
      createRtx: '', createTime: ''
    })
  }
});

const emit = defineEmits(['update:visible']);
const tabActiveName = ref('curl');

// 请求路径：默认取环境变量 VITE_VUE_API_BASEURL
const baseUrl = ref<string>(
  (import.meta.env.VITE_VUE_API_BASEURL as string) || 'https://api.example.com'
);

function closeDrawer() {
  emit('update:visible', false);
}
function openDrawer() {
  tabActiveName.value = 'curl';
}

watch(() => props.visible, (v) => {
  if (v) tabActiveName.value = 'curl';
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                         语言请求示例生成
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 把 baseUrl 与 path 正确拼接（处理末尾/开头的斜杠）
const fullUrl = computed(() => {
  const base = baseUrl.value.trim().replace(/\/+$/, '');
  const path = props.row.path || props.row.endpoint || '';
  if (!base) return path;
  if (path.startsWith('http')) return path;
  return base + (path.startsWith('/') ? path : '/' + path);
});

const method = computed(() => (props.row.method || 'GET').toUpperCase());
const hasBody = computed(() => ['POST', 'PUT', 'PATCH'].includes(method.value));

const jsonBody = `{
  "key": "value"
}`;

const queryExample = `page=1&limit=15&content=keyword`;

const exampleCode = computed<string>(() => {
  const m = tabActiveName.value;
  switch (m) {
    case 'curl':   return genCurl();
    case 'python': return genPython();
    case 'java':   return genJava();
    case 'go':     return genGo();
    case 'nodejs': return genNode();
    default:       return '';
  }
});

function genCurl(): string {
  let s = `curl -X ${method.value} '${fullUrl.value}' \\\n`;
  s += `  -H 'Authorization: Bearer {your_token}' \\\n`;
  if (hasBody.value) {
    s += `  -H 'Content-Type: application/json' \\\n`;
    s += `  -d '${jsonBody}'`;
  } else {
    s += `  -H 'Content-Type: application/json'`;
  }
  return s;
}

function genPython(): string {
  const u = method.value === 'GET' ? `${fullUrl.value}?${queryExample}` : fullUrl.value;
  if (hasBody.value) {
    return `import requests

url = '${fullUrl.value}'
headers = {
    'Authorization': 'Bearer {your_token}',
    'Content-Type': 'application/json'
}
payload = ${jsonBody}

response = requests.${method.value.toLowerCase()}(url, headers=headers, json=payload)
print(response.status_code)
print(response.json())`;
  }
  return `import requests

url = '${u}'
headers = {
    'Authorization': 'Bearer {your_token}'
}

response = requests.request('${method.value}', url, headers=headers)
print(response.status_code)
print(response.json())`;
}

function genJava(): string {
  if (hasBody.value) {
    return `import okhttp3.*;

public class ApiExample {
    public static void main(String[] args) throws Exception {
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, "${jsonBody.replace(/\n/g, ' ')}");
        Request request = new Request.Builder()
            .url("${fullUrl.value}")
            .method("${method.value}", body)
            .addHeader("Authorization", "Bearer {your_token}")
            .addHeader("Content-Type", "application/json")
            .build();

        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
}`;
  }
  return `import okhttp3.*;

public class ApiExample {
    public static void main(String[] args) throws Exception {
        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
            .url("${fullUrl.value}")
            .method("${method.value}", null)
            .addHeader("Authorization", "Bearer {your_token}")
            .build();

        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
}`;
}

function genGo(): string {
  if (hasBody.value) {
    return `package main

import (
    "bytes"
    "fmt"
    "io"
    "net/http"
)

func main() {
    url := "${fullUrl.value}"
    payload := bytes.NewBufferString(\`${jsonBody}\`)

    req, _ := http.NewRequest("${method.value}", url, payload)
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
}`;
  }
  return `package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    url := "${fullUrl.value}"
    req, _ := http.NewRequest("${method.value}", url, nil)
    req.Header.Set("Authorization", "Bearer {your_token}")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`;
}

function genNode(): string {
  if (hasBody.value) {
    return `import axios from 'axios';

const url = '${fullUrl.value}';
const data = ${jsonBody};

axios.${method.value.toLowerCase()}(url, data, {
  headers: {
    'Authorization': 'Bearer {your_token}',
    'Content-Type': 'application/json'
  }
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});`;
  }
  return `import axios from 'axios';

const url = '${fullUrl.value}';

axios.request({
  method: '${method.value}',
  url: url,
  headers: {
    'Authorization': 'Bearer {your_token}'
  }
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});`;
}
</script>

<style scoped>
.example-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.example-header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.example-header-endpoint {
  font-weight: 500;
  font-size: 15px;
  color: var(--el-text-color-primary);
  font-family: Consolas, Monaco, Menlo, monospace;
}
.example-header-sub {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  padding-left: 4px;
}
.example-tabs {
  margin-top: 8px;
}
.code-box {
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  overflow: hidden;
  background: var(--el-fill-color-light);
}
.code-box-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--el-fill-color);
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.code-lang {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.copy-label {
  margin-left: 4px;
}
.code-block {
  margin: 0;
  padding: 14px 16px;
  font-family: Consolas, Monaco, Menlo, monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre;
  overflow-x: auto;
  color: var(--el-text-color-primary);
}
.api-config {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding: 10px 12px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}
.api-config-label {
  flex-shrink: 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}
.api-config :deep(.el-input) {
  flex: 1;
}
</style>
